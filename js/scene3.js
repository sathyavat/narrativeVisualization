import { cleanData } from './dataCleaning.js';
import { colorScale } from './colorScale.js';

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
    const dataForChart = data.map(d => ({
      horsepower: +d['Rated Horsepower'],
      mpg: +d['RND_ADJ_FE'],
      manufacturer: d['Vehicle Manufacturer Name']
    }));

    const margin = { top: 120, right: 30, bottom: 100, left: 70 };
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

    const x = d3.scaleLinear()
      .domain([0, d3.max(dataForChart, d => d.horsepower)])
      .nice()
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(dataForChart, d => d.mpg)])
      .nice()
      .range([height, 0]);

    const manufacturers = Array.from(new Set(dataForChart.map(d => d.manufacturer)));

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
      .text("Average Fuel Efficiency (MPG)");

    const dotsGroup = svg.append("g")
      .attr("class", "dots");

    const dots = dotsGroup.selectAll(".dot")
      .data(dataForChart)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => x(d.horsepower))
      .attr("cy", d => y(d.mpg))
      .attr("r", 4)
      .attr("fill", d => colorScale(d.manufacturer))
      .attr("opacity", 0.9)
      .on("mouseover", function(event, d) {
        const tooltip = d3.select("#tooltip");
        tooltip.style("display", "block")
          .html(`<strong>${d.manufacturer}</strong><br>Horsepower: ${d.horsepower}<br>MPG: ${d.mpg}`)
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 28}px`)
          .style("max-width", "300px")  // Increase max width for longer text
          .style("padding", "15px");    // Increase padding for more space
      })
      .on("mouseout", function() {
        d3.select("#tooltip").style("display", "none");
      });

    const legendContainer = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(0, -70)`); // Positioned at the top

    const itemsPerRow = 9; // Number of items per row (adjust as needed)
    const itemSpacing = 100; // Spacing between items
    const rowHeight = 20; // Vertical spacing between rows

    const legend = legendContainer.selectAll(".legend-item")
      .data(manufacturers)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("data-manufacturer", d => d)
      .attr("transform", (d, i) => {
        const row = Math.floor(i / itemsPerRow); // Determine row
        const col = i % itemsPerRow; // Determine column
        return `translate(${col * itemSpacing}, ${(row * rowHeight) - 20})`; // Position items
      })
      .on("click", function(event, d) {
        const isActive = d3.select(this).classed("active");
        d3.selectAll(".legend-item").classed("active", false);
        d3.select(this).classed("active", !isActive);

        // Update dots visibility
        dots
          .transition()
          .duration(300)
          .attr("opacity", dot => dot.manufacturer === d || isActive ? 0.9 : 0.01);
      });

    legend.append("rect")
      .attr("x", 0)
      .attr("width", 15)  // Reduced width
      .attr("height", 15) // Reduced height
      .style("fill", d => colorScale(d)) // Color for each manufacturer
      .style("stroke", "#000") // Optional: Add a stroke to make the rectangles more visible
      .style("stroke-width", 1);

    legend.append("text")
      .attr("x", 20) // Adjusted x position to fit text next to smaller rectangle
      .attr("y", 12) // Adjusted y position to align text with rectangle
      .attr("fill", "#FFFFFF")  // White text for dark mode
      .style("font-size", "12px") // Optional: Adjust font size
      .text(d => d.length > 10 ? d.slice(0, 10) + "..." : d); // Truncate text and add "..."

    // Set Tesla as default filter
    d3.selectAll(".legend-item").classed("active", false);
    d3.selectAll(".legend-item[data-manufacturer='Tesla']").classed("active", true);
    dots
      .attr("opacity", dot => dot.manufacturer === 'Tesla' ? 0.9 : 0.01);

    // Inline CSS for the active class
    const style = document.createElement('style');
    style.textContent = `
      .legend-item.active rect {
        stroke: #000;
        stroke-width: 2;
      }
      .legend-item.active text {
        font-weight: bold;
      }
    `;
    document.head.appendChild(style);
  }

  loadData();
});
