import { cleanData } from './dataCleaning.js'; // Import the cleaning function

document.addEventListener('DOMContentLoaded', function() {
    let chartData = [];  // To hold the original data for re-filtering

    async function loadData() {
        // Load and clean data
        const data = await d3.csv('../data/cars2024.csv');
        chartData = await cleanData(data); // Clean the data
        createChart(chartData);  // Create the chart with all data initially
        createButtons(); // Create filter buttons
    }

    function createButtons() {
        d3.select('#filter-zero-emissions').on('click', () => updateChart('zero'));
        d3.select('#filter-non-zero-emissions').on('click', () => updateChart('non-zero'));
        d3.select('#filter-all').on('click', () => updateChart('all'));
    }

    function createChart(data) {
        // Convert RND_ADJ_FE to numbers and filter out rows with RND_ADJ_FE > 200
        data.forEach(d => {
            d['RND_ADJ_FE'] = +d['RND_ADJ_FE']; // Convert to number
        });

        // Process the data for MPG by fuel type
        const mpgByFuelType = d3.rollups(data, v => d3.mean(v, d => +d['RND_ADJ_FE']), d => d['Test Fuel Type Description'])
            .map(([fuelType, avgMPG]) => ({ fuelType, avgMPG }))
            .sort((a, b) => d3.descending(a.avgMPG, b.avgMPG));

        // Set dimensions and margins for bar chart
        const margin = { top: 70, right: 30, bottom: 100, left: 70 };
        const container = document.getElementById('emissions-chart');
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        const width = containerWidth - margin.left - margin.right;
        const height = containerHeight - margin.top - margin.bottom;

        const barSvg = d3.select("#emissions-chart")
            .append("svg")
            .attr("width", containerWidth) // Full container width
            .attr("height", containerHeight) // Full container height
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .domain(mpgByFuelType.map(d => d.fuelType))
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(mpgByFuelType, d => d.avgMPG)])
            .nice()
            .range([height, 0]);

        // Append x and y axes
        barSvg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end');

        // Add X-axis label
        barSvg.append('text')
            .attr('class', 'x-axis-label')
            .attr('x', width / 2)
            .attr('y', height + 90)
            .attr('text-anchor', 'middle')
            .text('Fuel Type');

        barSvg.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(y));

        // Add Y-axis label
        barSvg.append('text')
            .attr('class', 'y-axis-label')
            .attr('x', -height / 2)
            .attr('y', -margin.left + 15)
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .text('Fuel Efficiency (MPG)');

        // Create bars with empty data initially
        barSvg.selectAll('.bar')
            .data([])
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.fuelType))
            .attr('y', d => y(d.avgMPG))
            .attr('width', x.bandwidth())
            .attr('height', d => height - y(d.avgMPG))
            .attr('fill', 'steelblue')
            .on('mouseover', function(event, d) {
                const [x, y] = d3.pointer(event);
                const chartRect = this.closest('svg').getBoundingClientRect();
                d3.select('#tooltip')
                    .style('left', `${chartRect.left + x + 15}px`)
                    .style('top', `${chartRect.top + y + 15}px`)
                    .style('display', 'block')
                    .html(`Fuel Type: ${d.fuelType}<br>Average MPG: ${d.avgMPG.toFixed(2)}<br>Average CO2 Emissions: ${d3.mean(data.filter(f => f['Test Fuel Type Description'] === d.fuelType), f => +f['CO2 (g/mi)']).toFixed(2)} g/mi`);
            })
            .on('mouseout', function() {
                d3.select('#tooltip').style('display', 'none');
            });

        // Return SVG and scales for later use
        return { barSvg, x, y };
    }

    function updateChart(filterType) {
        // Filter data based on the selected button
        let filteredData;
        if (filterType === 'zero') {
            filteredData = chartData.filter(d => d['Test Fuel Type Description'] === 'Electric' || d['Test Fuel Type Description'] === 'Hydrogen');
        } else if (filterType === 'non-zero') {
            filteredData = chartData.filter(d => d['Test Fuel Type Description'] !== 'Electric' && d['Test Fuel Type Description'] !== 'Hydrogen');
        } else {
            filteredData = chartData; // Show all data
        }

        // Clear previous chart
        d3.select("#emissions-chart").select("svg").remove();

        // Create the updated chart with filtered data
        const { barSvg, x, y } = createChart(filteredData);

        // Set dimensions and margins for bar chart (ensuring height is defined)
        const margin = { top: 70, right: 30, bottom: 100, left: 70 };
        const container = document.getElementById('emissions-chart');
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        const width = containerWidth - margin.left - margin.right;
        const height = containerHeight - margin.top - margin.bottom;

        // Update bars
        barSvg.selectAll('.bar')
            .data(d3.rollups(filteredData, v => d3.mean(v, d => +d['RND_ADJ_FE']), d => d['Test Fuel Type Description'])
                .map(([fuelType, avgMPG]) => ({ fuelType, avgMPG }))
                .sort((a, b) => d3.descending(a.avgMPG, b.avgMPG)))
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.fuelType))
            .attr('y', d => y(d.avgMPG))
            .attr('width', x.bandwidth())
            .attr('height', d => height - y(d.avgMPG))
            .attr('fill', 'steelblue')
            .on('mouseover', function(event, d) {
                const [x, y] = d3.pointer(event);
                const chartRect = this.closest('svg').getBoundingClientRect();
                d3.select('#tooltip')
                    .style('left', `${chartRect.left + x + 15}px`)
                    .style('top', `${chartRect.top + y + 15}px`)
                    .style('display', 'block')
                    .html(`Fuel Type: ${d.fuelType}<br>Average MPG: ${d.avgMPG.toFixed(2)}<br>Average CO2 Emissions: ${d3.mean(filteredData.filter(f => f['Test Fuel Type Description'] === d.fuelType), f => +f['CO2 (g/mi)']).toFixed(2)} g/mi`);
            })
            .on('mouseout', function() {
                d3.select('#tooltip').style('display', 'none');
            });

        // Add or update annotations
        setTimeout(() => {
            addBarAnnotations(barSvg, d3.rollups(filteredData, v => d3.mean(v, d => +d['RND_ADJ_FE']), d => d['Test Fuel Type Description'])
                .map(([fuelType, avgMPG]) => ({ fuelType, avgMPG }))
                .sort((a, b) => d3.descending(a.avgMPG, b.avgMPG)), x, y);
        }, 2000);
    }


    function addBarAnnotations(svg, data, x, y) {
        const largest = data.reduce((prev, current) => (prev.avgMPG > current.avgMPG) ? prev : current);
        const smallest = data.reduce((prev, current) => (prev.avgMPG < current.avgMPG) ? prev : current);

        // Clear previous annotations
        svg.selectAll('.annotation-group').remove();

        // Create annotations
        const annotations = [
            {
                note: { 
                    label: 'Highest MPG', 
                    title: largest.fuelType,
                    bgPadding: { top: 2, left: 5, right: 5, bottom: 2 } // Add background padding
                },
                connector: {
                    end: "dot",          // Dot at the end of the connector line
                    type: "line",        // Type of connector line
                    lineType: "vertical", // Orientation of the line
                    endScale: 8,         // Adjust size of the dot
                    strokeWidth: 2       // Make the connector line thicker
                },
                color: ["#FFFFFF"],    // Color of the annotation line and dot
                x: x(largest.fuelType) + x.bandwidth() / 2, 
                y: y(largest.avgMPG), 
                dy: 30, 
                dx: 10
            },
            {
                note: { 
                    label: 'Lowest MPG', 
                    title: smallest.fuelType,
                    bgPadding: { top: 2, left: 5, right: 5, bottom: 2 } // Add background padding
                },
                connector: {
                    end: "dot",          // Dot at the end of the connector line
                    type: "line",        // Type of connector line
                    lineType: "vertical", // Orientation of the line
                    endScale: 8,         // Adjust size of the dot
                    strokeWidth: 2       // Make the connector line thicker
                },
                color: ["#FFFFFF"],    // Color of the annotation line and dot
                x: x(smallest.fuelType) + x.bandwidth() / 2, 
                y: y(smallest.avgMPG), 
                dy: -30, 
                dx: 10
            }
        ];

        const makeAnnotations = d3.annotation()
            .annotations(annotations)
            .type(d3.annotationCallout)  // Use callout annotations
            .notePadding(10)  // Padding around the note text
            .textWrap(150);   // Wrap text to fit within width

        svg.append('g')
            .attr('class', 'annotation-group')
            .call(makeAnnotations);
    }

    loadData();
});
