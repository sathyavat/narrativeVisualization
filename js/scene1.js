document.addEventListener('DOMContentLoaded', function () {
    d3.csv('../cars2024.csv').then(data => {
        // Transform data for vehicle types
        const vehicleTypeCounts = d3.rollup(data, v => v.length, d => d['Vehicle Type']);
        const vehicleTypeData = Array.from(vehicleTypeCounts, ([key, value]) => ({ type: key, count: value }));

        // Transform data for manufacturers
        const manufacturerCounts = d3.rollup(data, v => v.length, d => d['Vehicle Manufacturer Name']);
        const manufacturerData = Array.from(manufacturerCounts, ([key, value]) => ({ manufacturer: key, count: value }));

        createVehicleTypeChart(vehicleTypeData);
        createManufacturerChart(manufacturerData);
    });

    function createVehicleTypeChart(data) {
        const width = 500;
        const height = 500;
        const radius = Math.min(width, height) / 2;

        const svg = d3.select("#vehicle-type-chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const pie = d3.pie()
            .value(d => d.count)
            .sort(null);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        const arcs = svg.selectAll("arc")
            .data(pie(data))
            .enter()
            .append("g")
            .attr("class", "arc");

        arcs.append("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.type));

        arcs.append("title")
            .text(d => `${d.data.type}: ${d.data.count} vehicles`);

        const annotations = [
            {
                note: { label: "Largest vehicle type" },
                subject: { radius: radius },
                x: 0,
                y: 0,
                dy: -radius - 10,
                dx: -radius - 10
            }
        ];

        const makeAnnotations = d3.annotation()
            .type(d3.annotationLabel)
            .annotations(annotations);

        svg.append("g")
            .attr("class", "annotation-group")
            .call(makeAnnotations);
    }

    function createManufacturerChart(data) {
        const width = 800;
        const height = 500;
        const margin = { top: 20, right: 30, bottom: 40, left: 100 };

        const svg = d3.select("#manufacturer-chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .range([0, width - margin.left - margin.right])
            .padding(0.1)
            .domain(data.map(d => d.manufacturer));

        const y = d3.scaleLinear()
            .range([height - margin.top - margin.bottom, 0])
            .domain([0, d3.max(data, d => d.count)]);

        svg.append("g")
            .selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.manufacturer))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d.count))
            .attr("height", d => height - margin.top - margin.bottom - y(d.count))
            .attr("fill", "steelblue");

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y));

        svg.selectAll(".bar")
            .append("title")
            .text(d => `${d.manufacturer}: ${d.count} vehicles`);
    }
});
