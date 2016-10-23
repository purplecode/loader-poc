var svg = d3.select('svg')
    .attr('width', 800)
    .attr('height', 500);

var conveyorBelt = svg.append('g');
var lines = conveyorBelt
    .append('g')
    .selectAll('line')
    .data([
        {x1: 140, y1: 260, x2: 740, y2: 260},
        {x1: 100, y1: 300, x2: 700, y2: 300},
        {x1: 100, y1: 330, x2: 700, y2: 330}
    ])
    .enter()
    .append('line')
    .attr('x1', d => d.x1)
    .attr('y1', d => d.y1)
    .attr('x2', d => d.x2)
    .attr('y2', d => d.y2)
    .attr("stroke-width", 2)
    .attr("stroke", "black");

var circlesData = _.range(0, 7).map(idx => ({
    x: 100 + idx * 100, y: 315, radius: 15
}));

var circles = conveyorBelt.append('g')
    .selectAll('circle')
    .data(circlesData)
    .enter()
    .append('circle')
    .attr('cx', d => d.x)
    .attr('cy', d=> d.y)
    .attr('r', d=> d.radius)
    .style('fill', 'white')
    .attr("stroke-width", 2)
    .attr("stroke", "black");

var cogs = conveyorBelt.append('g')
    .selectAll('.cog')
    .data(circlesData)
    .enter()
    .append('g')
    .attr('transform', d => `translate(${d.x - 13},${d.y - 13})`)
    .append('path')
    .attr('class', 'cog')
    .attr("d", d => cog(26));