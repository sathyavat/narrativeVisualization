document.addEventListener('DOMContentLoaded', function() {
    async function loadData() {
        const data = await d3.csv('../data/cars2024.csv');
        createCharts(data);
    }

    function createCharts(data) {
        // Group data for pie chart
        const typeData = d3.rollup(data, v => v.length, d => d['Vehicle Type']);
        const typeDataArray = Array.from(typeData, ([key, value]) => ({ key, value }));

        // Group data for bar chart
        const manufacturerData = d3.rollup(data, v => v.length, d => d['Vehicle Manufacturer Name']);
        const manufacturerDataArray = Array.from(manufacturerData, ([key, value]) => ({ key, value }));

        // Set dimensions for pie chart
        const pieWidth = 300, pieHeight = 300, pieRadius = Math.min(pieWidth, pieHeight) / 2;
        const pieSvg = d3.select('#vehicle-type-chart')
            .append('svg')
            .attr('width', pieWidth)
            .attr('height', pieHeight)
            .append('g')
            .attr('transform', `translate(${pieWidth / 2},${pieHeight / 2})`);

        const pie = d3.pie().value(d => d.value);
        const arc = d3.arc().innerRadius(0).outerRadius(pieRadius);

        const pieColor = d3.scaleOrdinal(d3.schemeCategory10);
        const pieData = pie(typeDataArray);

        pieSvg.selectAll('path')
            .data(pieData)
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', d => pieColor(d.data.key))
            .on('mouseover', function(event, d) {
                const [x, y] = d3.pointer(event);
                const chartRect = this.closest('svg').getBoundingClientRect();
                d3.select('#tooltip')
                    .style('left', `${chartRect.left + x + 15}px`)
                    .style('top', `${chartRect.top + y + 15}px`)
                    .style('display', 'block')
                    .html(`Type: ${d.data.key}<br>Count: ${d.data.value}`);
            })
            .on('mouseout', function() {
                d3.select('#tooltip').style('display', 'none');
            });

        pieSvg.selectAll('text')
            .data(pieData)
            .enter()
            .append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('dy', '0.35em')
            .style('text-anchor', 'middle')
            .text(d => d.data.key);

        // Set dimensions for bar chart
        const barWidth = 500, barHeight = 300;
        const barSvg = d3.select('#manufacturer-chart')
            .append('svg')
            .attr('width', barWidth)
            .attr('height', barHeight)
            .append('g')
            .attr('transform', 'translate(50, 20)');

        const x = d3.scaleBand().domain(manufacturerDataArray.map(d => d.key)).range([0, barWidth - 100]).padding(0.1);
        const y = d3.scaleLinear().domain([0, d3.max(manufacturerDataArray, d => d.value)]).range([barHeight - 40, 0]);

        barSvg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${barHeight - 40})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end');

        barSvg.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(y));

        barSvg.selectAll('.bar')
            .data(manufacturerDataArray)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.key))
            .attr('y', d => y(d.value))
            .attr('width', x.bandwidth())
            .attr('height', d => barHeight - 40 - y(d.value))
            .attr('fill', 'steelblue')
            .on('mouseover', function(event, d) {
                const [x, y] = d3.pointer(event);
                const chartRect = this.closest('svg').getBoundingClientRect();
                d3.select('#tooltip')
                    .style('left', `${chartRect.left + x + 15}px`)
                    .style('top', `${chartRect.top + y + 15}px`)
                    .style('display', 'block')
                    .html(`Manufacturer: ${d.key}<br>Count: ${d.value}`);
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
        const largest = data.reduce((prev, current) => (prev.value > current.value) ? prev : current);
        const smallest = data.reduce((prev, current) => (prev.value < current.value) ? prev : current);

        const annotations = [
            {
                note: { label: 'Largest manufacturer', title: largest.key },
                x: x(largest.key) + x.bandwidth() / 2, y: y(largest.value), dy: 30, dx: 50
            },
            {
                note: { label: 'Smallest manufacturer', title: smallest.key },
                x: x(smallest.key) + x.bandwidth() / 2, y: y(smallest.value), dy: -30, dx: 50
            }
        ];

        const makeAnnotations = d3.annotation().annotations(annotations);
        svg.append('g').call(makeAnnotations);
    }

    loadData();
});
