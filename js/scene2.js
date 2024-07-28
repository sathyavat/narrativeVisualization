import { cleanData } from './dataCleaning.js'; // Import the cleaning function
import { colorScale } from './colorScale.js';

document.addEventListener('DOMContentLoaded', function() {
    async function loadData() {
        // Load and clean data
        const data = await d3.csv('../data/cars2024.csv');
        const cleanedData = await cleanData(data);
        createCharts(cleanedData);
    }

    function createCharts(data) {

        // Group data for bar chart
        const manufacturerData = d3.rollup(
            data,
            v => ({
                count: v.length,
                avgMPG: d3.mean(v, d => +d['RND_ADJ_FE'])
            }),
            d => d['Vehicle Manufacturer Name']
        );
        const manufacturerDataArray = Array.from(manufacturerData, ([key, value]) => ({
            key,
            count: value.count,
            avgMPG: value.avgMPG
        }));

        // Set dimensions and margins for bar chart
        const margin = { top: 70, right: 30, bottom: 100, left: 70 };
        const container = document.getElementById('manufacturer-chart');
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        const width = containerWidth - margin.left - margin.right;
        const height = containerHeight - margin.top - margin.bottom; // Dynamic height based on container

        const barSvg = d3.select("#manufacturer-chart")
            .append("svg")
            .attr("width", containerWidth) // Full container width
            .attr("height", containerHeight) // Full container height
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .domain(manufacturerDataArray.map(d => d.key))
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(manufacturerDataArray, d => d.avgMPG)])
            .range([height, 0]);

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
            .attr('y', height + 100)
            .attr('text-anchor', 'middle')
            .text('Car manufacturer');

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
            .text('Average Fuel Efficiency (MPG)');

        barSvg.selectAll('.bar')
            .data(manufacturerDataArray)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.key))
            .attr('y', d => y(d.avgMPG))
            .attr('width', x.bandwidth())
            .attr('height', d => height - y(d.avgMPG))
            .attr('fill', d => colorScale(d.key))  // Apply color scale here
            .on('mouseover', function(event, d) {
                const [x, y] = d3.pointer(event);
                const chartRect = this.closest('svg').getBoundingClientRect();
                d3.select('#tooltip')
                    .style('left', `${chartRect.left + x + 15}px`)
                    .style('top', `${chartRect.top + y + 15}px`)
                    .style('display', 'block')
                    .html(`Manufacturer: ${d.key}<br>Average MPG: ${d.avgMPG.toFixed(2)}<br># of car makes: ${d.count}`);
            })
            .on('mouseout', function() {
                d3.select('#tooltip').style('display', 'none');
            });

        // Add annotations with a delay
        setTimeout(() => {
            addBarAnnotations(barSvg, manufacturerDataArray, x, y);
        }, 2000);
    }


    function addBarAnnotations(svg, data, x, y) {
        const largest = data.reduce((prev, current) => (prev.avgMPG > current.avgMPG) ? prev : current);
        const smallest = data.reduce((prev, current) => (prev.avgMPG < current.avgMPG) ? prev : current);

        const annotations = [
            {
                note: { 
                    label: 'Highest MPG', 
                    title: largest.key
                },
                connector: {
                    end: "dot",          // Dot at the end of the connector line
                    type: "line",        // Type of connector line
                    lineType: "vertical", // Orientation of the line
                    endScale: 10         // Size of the dot
                },
                color: ["#FFFFFF"],    // Color of the annotation line and dot
                x: x(largest.key) + x.bandwidth() / 2, 
                y: y(largest.avgMPG), 
                dy: 30, 
                dx: 10
            },
            {
                note: { 
                    label: 'Lowest MPG', 
                    title: smallest.key
                },
                connector: {
                    end: "dot",          // Dot at the end of the connector line
                    type: "line",        // Type of connector line
                    lineType: "vertical", // Orientation of the line
                    endScale: 10         // Size of the dot
                },
                color: ["#FFFFFF"],    // Color of the annotation line and dot
                x: x(smallest.key) + x.bandwidth() / 2, 
                y: y(smallest.avgMPG), 
                dy: -30, 
                dx: 10
            }
        ];

        const makeAnnotations = d3.annotation()
            .annotations(annotations);

        svg.append('g').call(makeAnnotations);
    }


    loadData();
});
