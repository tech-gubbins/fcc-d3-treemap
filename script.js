// Load data and create the treemap
d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json').then(data => {
    // Set up SVG dimensions
    const width = 960;
    const height = 600;

    // Create an SVG element
    const svg = d3.select('#container').append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create a tooltip
    const tooltip = d3.select('#tooltip');

    // Create a color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create a treemap layout
    const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    d3.treemap()
        .size([width, height])
        .padding(2)(root);

    // Add rectangles for each tile
    svg.selectAll('rect')
        .data(root.leaves())
        .enter().append('rect')
        .attr('class', 'tile')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', d => color(d.data.category))
        .attr('data-name', d => d.data.name)
        .attr('data-category', d => d.data.category)
        .attr('data-value', d => d.data.value)
        .on('mouseover', (event, d) => {
            tooltip.transition().duration(200).style('opacity', .9);
            tooltip.html(`Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`)
                .attr('data-value', d.data.value)
                .style('left', (event.pageX + 5) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', () => {
            tooltip.transition().duration(200).style('opacity', 0);
        });

    // Create a legend
    const legend = d3.select('#legend')
        .append('svg')
        .attr('width', 200)
        .attr('height', 100);

    const legendItems = Array.from(color.domain()).map(category => {
        return {
            category: category,
            color: color(category)
        };
    });

    legend.selectAll('rect')
        .data(legendItems)
        .enter().append('rect')
        .attr('x', 10)
        .attr('y', (d, i) => i * 20 + 10)
        .attr('width', 18)
        .attr('height', 18)
        .attr('fill', d => d.color);

    legend.selectAll('text')
        .data(legendItems)
        .enter().append('text')
        .attr('x', 35)
        .attr('y', (d, i) => i * 20 + 20)
        .text(d => d.category);
});