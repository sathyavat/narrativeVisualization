document.addEventListener('DOMContentLoaded', function() {
    async function loadData() {
        const data = await d3.csv('../data/cars2024.csv');
        createCharts(data);
    }

    function createCharts(data) {

        // Group data for bar chart
        const manufacturerData = d3.rollup(data, v => v.length, d => d['Vehicle Manufacturer Name']);
        const manufacturerDataArray = Array.from(manufacturerData, ([key, value]) => ({ key, value }));

        // Set dimensions and margins for bar chart
        const margin = { top: 100, right: 100, bottom: 100, left: 100 },
            width = 800 - margin.left - margin.right, 
            height = 500 - margin.top - margin.bottom;

        const barSvg = d3.select('#manufacturer-chart')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand().domain(manufacturerDataArray.map(d => d.key)).range([0, width]).padding(0.1);
        const y = d3.scaleLinear().domain([0, d3.max(manufacturerDataArray, d => d.value)]).range([height, 0]);

        barSvg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
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
            .attr('height', d => height - y(d.value))
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
                note: { 
                    label: 'Largest manufacturer', 
                    title: largest.key,
                    bgPadding: { top: 2, left: 5, right: 5, bottom: 2 } // Add background padding
                },
                x: x(largest.key) + x.bandwidth() / 2, 
                y: y(largest.value), 
                dy: 30, 
                dx: 50
            },
            {
                note: { 
                    label: 'Smallest manufacturer', 
                    title: smallest.key,
                    bgPadding: { top: 2, left: 5, right: 5, bottom: 2 } // Add background padding
                },
                x: x(smallest.key) + x.bandwidth() / 2, 
                y: y(smallest.value), 
                dy: -30, 
                dx: 50
            }
        ];

        const makeAnnotations = d3.annotation()
            .annotations(annotations)
            .type(d3.annotationCallout)
            .notePadding(10)
            .textWrap(150);

        svg.append('g').call(makeAnnotations);
    }


    loadData();
});
