// Load data and create the treemap
d3.json(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
).then((data) => {
    // Set up SVG dimensions
    const width = 960;
    const height = 600;

    // Create an SVG element
    const svg = d3
        .select("#container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Create a tooltip
    const tooltip = d3.select("#tooltip");

    // Create a color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create a treemap layout
    const treemapLayout = d3.treemap().size([width, height]).padding(1); // Adjust padding if necessary

    const root = d3
        .hierarchy(data)
        .sum((d) => d.value)
        .sort((a, b) => b.value - a.value);

    treemapLayout(root);

    root.leaves().forEach((d) => {
        const width = d.x1 - d.x0;
        const height = d.y1 - d.y0;
        const area = width * height;

        // For debugging
        // console.log(`Data-value: ${d.data.value}, Calculated Area: ${area}`);
    });

    // Add rectangles for each tile
    const tiles = svg
        .selectAll("g")
        .data(root.leaves())
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);

    tiles
        .append("rect")
        .attr("class", "tile")
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0)
        .attr("fill", (d) => color(d.data.category))
        .attr("data-name", (d) => d.data.name)
        .attr("data-category", (d) => d.data.category)
        .attr("data-value", (d) => d.data.value)
        .on("mouseover", (event, d) => {
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip
                .html(
                    `Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`
                )
                .attr("data-value", d.data.value)
                .style("left", event.pageX + 5 + "px")
                .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", () => {
            tooltip.transition().duration(200).style("opacity", 0);
        });

    // Add text labels for each tile
    tiles
        .append("text")
        .attr("class", "tile-text")
        .selectAll("tspan")
        .data((d) => d.data.name.split(/(?=\s)/g)) // Split the name for better wrapping
        .enter()
        .append("tspan")
        .attr("x", 4) // Padding from the left edge
        .attr("y", (d, i) => 15 + i * 12) // Adjust line height
        .text((d) => d)
        .attr("font-size", "10px") // Adjust the font size
        .attr("fill", "white"); // Choose a color that contrasts with the background

    // Create a legend
    const legend = d3
        .select("#legend")
        .append("svg")
        .attr("width", 200)
        .attr("height", 100);

    const legendItems = Array.from(color.domain()).map((category) => {
        return {
            category: category,
            color: color(category),
        };
    });

    legend
        .selectAll("rect")
        .data(legendItems)
        .enter()
        .append("rect")
        .attr("x", 10)
        .attr("y", (d, i) => i * 20 + 4)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", (d) => d.color)
        .attr("class", "legend-item"); // Add this line to ensure the class is applied

    legend
        .selectAll("text")
        .data(legendItems)
        .enter()
        .append("text")
        .attr("x", 35)
        .attr("y", (d, i) => i * 20 + 20)
        .text((d) => d.category);
});
