// Load the data and create the bar chart
d3.csv("../data/cars2024.csv").then(function(data) {
    // Process the data for emissions by fuel type
    const emissionsByFuelType = d3.rollups(data, v => d3.mean(v, d => +d['CO2 (g/mi)']), d => d['Test Fuel Type Description'])
        .map(([fuelType, avgEmissions]) => ({ fuelType, avgEmissions }))
        .sort((a, b) => d3.descending(a.avgEmissions, b.avgEmissions));

    // Set up the SVG dimensions and margins
    const margin = { top: 40, right: 20, bottom: 50, left: 70 }; // Updated to percentage for responsiveness
    const width = parseInt(d3.select('#emissions-chart').style('width')) - margin.left - margin.right; // Updated
    const height = parseInt(d3.select('#emissions-chart').style('height')) - margin.top - margin.bottom; // Updated

    const svg = d3.select("#emissions-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up the x and y scales
    const x = d3.scaleBand()
        .domain(emissionsByFuelType.map(d => d.fuelType))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(emissionsByFuelType, d => d.avgEmissions)])
        .nice()
        .range([height, 0]);

    // Append the x and y axes
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    // Create the bars
    svg.selectAll(".bar")
        .data(emissionsByFuelType)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.fuelType))
        .attr("y", d => y(d.avgEmissions))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.avgEmissions))
        .attr("fill", "steelblue")
        .on("mouseover", function(event, d) {
            d3.select("#tooltip")
                .style("left", event.pageX + "px")
                .style("top", event.pageY + "px")
                .style("display", "inline-block")
                .html(`Fuel Type: ${d.fuelType}<br>Average CO2 Emissions: ${d.avgEmissions.toFixed(2)} g/mi`);
        })
        .on("mouseout", function() {
            d3.select("#tooltip")
                .style("display", "none");
        });

    // Add annotations
    const annotations = [
        {
            note: {
                label: "Lowest average emissions",
                title: emissionsByFuelType[emissionsByFuelType.length - 1].fuelType
            },
            x: x(emissionsByFuelType[emissionsByFuelType.length - 1].fuelType) + x.bandwidth() / 2,
            y: y(emissionsByFuelType[emissionsByFuelType.length - 1].avgEmissions),
            dy: -30,
            dx: 0
        },
        {
            note: {
                label: "Highest average emissions",
                title: emissionsByFuelType[0].fuelType
            },
            x: x(emissionsByFuelType[0].fuelType) + x.bandwidth() / 2,
            y: y(emissionsByFuelType[0].avgEmissions),
            dy: -30,
            dx: 0
        }
    ];

    const makeAnnotations = d3.annotation()
        .annotations(annotations);

    svg.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);
});
