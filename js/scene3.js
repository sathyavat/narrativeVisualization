import { cleanData } from './dataCleaning.js'; // Import the cleaning function

document.addEventListener('DOMContentLoaded', function() {
    async function loadData() {
        try {
            const data = await d3.csv('../data/cars2024.csv');
            const cleanedData = await cleanData(data);
            createCharts(cleanedData);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    function createCharts(data) {
        // Process the data for fuel efficiency vs. horsepower
        const dataForChart = data.map(d => ({
            manufacturer: d['Vehicle Manufacturer Name'],
            horsepower: +d['Rated Horsepower'],
            mpg: +d['RND_ADJ_FE']
        }));

        // Define color scale
        const manufacturers = [...new Set(dataForChart.map(d => d.manufacturer))];
        const color = d3.scaleOrdinal()
            .domain(manufacturers)
            .range(d3.schemeCategory10);

        // Set dimensions and margins for the scatter plot
        const margin = { top: 70, right: 30, bottom: 100, left: 70 };
        const container = document.getElementById('fuel-efficiency-chart');
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        const width = containerWidth - margin.left - margin.right;
        const height = containerHeight - margin.top - margin.bottom;

        const svg = d3.select("#fuel-efficiency-chart")
            .append("svg")
            .attr("width", containerWidth)
            .attr("height", containerHeight)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Set up x and y scales
        const x = d3.scaleLinear()
            .domain([0, d3.max(dataForChart, d => d.horsepower)])
            .nice()
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(dataForChart, d => d.mpg)])
            .nice()
            .range([height, 0]);

        // Append x and y axes
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .append("text")
            .attr("class", "x-axis-label")
            .attr("x", width / 2)
            .attr("y", margin.bottom - 10)
            .attr("text-anchor", "middle")
            .text("Horsepower");

        svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("class", "y-axis-label")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 15)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .text("Fuel Efficiency (MPG)");

        // Add scatter plot points
        svg.selectAll(".dot")
            .data(dataForChart)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d.horsepower))
            .attr("cy", d => y(d.mpg))
            .attr("r", 4)
            .attr("fill", d => color(d.manufacturer))
            .attr("opacity", 0.6) // Set opacity for overlapping points
            .on("mouseover", function(event, d) {
                const [x, y] = d3.pointer(event);
                const chartRect = this.closest('svg').getBoundingClientRect();
                d3.select('#tooltip')
                    .style('left', `${chartRect.left + x + 15}px`)
                    .style('top', `${chartRect.top + y + 15}px`)
                    .style('display', 'block')
                    .html(`Manufacturer: ${d.manufacturer}<br>Horsepower: ${d.horsepower}<br>Fuel Efficiency: ${d.mpg.toFixed(2)} MPG`);
            })
            .on("mouseout", function() {
                d3.select('#tooltip').style('display', 'none');
            });

        // Add legend
        const legend = svg.append("g")
            .attr("class", "legend") // Add this class
            .attr("transform", `translate(${width - 150}, 20)`);

        manufacturers.forEach((manufacturer, i) => {
            legend.append("rect")
                .attr("x", 0)
                .attr("y", i * 20)
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", color(manufacturer));

            legend.append("text")
                .attr("x", 20)
                .attr("y", i * 20 + 12)
                .text(manufacturer)
                .style("font-size", "12px")
                .attr("class", "legend-label");;
        });

        // Filter data points by manufacturer selection
        d3.selectAll(".legend rect").on("click", function(event, manufacturer) {
            const isActive = d3.select(this).classed("active");
            d3.selectAll(".dot")
                .style("opacity", d => d.manufacturer === manufacturer || isActive ? 1 : 0.1);
            d3.selectAll(".legend rect").classed("active", false);
            d3.select(this).classed("active", !isActive);
        });
    }

    loadData();
});
