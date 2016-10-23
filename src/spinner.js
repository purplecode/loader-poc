var settings = {
    svg: {
        width: 800,
        height: 500
    },
    stroke: {
        width: 3,
        color: 'darkgray'
    },
    belt: {
        x: 100,
        y: 300,
        skew: 40,
        height: 30,
        width: 600,
        lines: {
            // adjust animation when changed
            n: 10
        },
        cogs: {
            n: 7,
            radius: 15,
            padding: 4
        }
    }
};

var data = {
    belt: {
        lines: {
            fixed: () => {
                var x = settings.belt.x,
                    y = settings.belt.y,
                    width = settings.belt.width,
                    height = settings.belt.height,
                    skew = settings.belt.skew;
                var fix = 5;
                return [
                    // horizontal
                    {
                        x1: x + skew - fix,
                        y1: y - height,
                        x2: x + skew + width,
                        y2: y - height
                    }, {
                        x1: x,
                        y1: y,
                        x2: x + width,
                        y2: y
                    }, {
                        x1: x,
                        y1: y + height,
                        x2: x + width,
                        y2: y + height
                    },
                    // skew
                    {
                        x1: x - fix,
                        y1: y,
                        x2: x - fix + skew,
                        y2: y - height
                    }, {
                        x1: x + width,
                        y1: y,
                        x2: x + skew + width,
                        y2: y - height
                    }, {
                        x1: x + width + fix,
                        y1: y + height,
                        x2: x + skew + width + fix,
                        y2: y
                    }]
            },
            animated: () => {
                var n = settings.belt.lines.n;
                var shift = settings.belt.width / n;
                return _.range(0, n).map(idx => ({
                    x1: settings.belt.x + idx * shift,
                    y1: settings.belt.y,
                    x2: settings.belt.x + idx * shift + settings.belt.skew,
                    y2: settings.belt.y - settings.belt.height
                }))
            }
        },
        cogs: () => {
            var n = settings.belt.cogs.n;
            var shift = settings.belt.width / (n - 1);
            return _.range(0, n).map(idx => ({
                x: settings.belt.x + idx * shift,
                y: settings.belt.y + settings.belt.height / 2
            }))
        }
    },
    machine: [{
        x: 0, y: 50, width: 200, height: 350, fill: 'white'
    }, {
        x: 30, y: 120, width: 140, height: 250, fill: 'white'
    }, {
        x: 70, y: 260, width: 200, height: 80, fill: 'white', stroke: 'white'
    }]
};

var svg = d3.select('svg')
    .attr('width', settings.svg.width)
    .attr('height', settings.svg.height);

var machine = svg.append('g').attr('class', 'machine');

machine.append('g')
    .selectAll('rect')
    .data(data.machine)
    .enter()
    .append("rect")
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .attr("width", d => d.width)
    .attr("height", d => d.height)
    .style('fill', d => d.fill)
    .attr("stroke-width", settings.stroke.width)
    .attr("stroke", d => d.stroke || settings.stroke.color);


var conveyorBelt = svg.append('g');

conveyorBelt
    .append('g')
    .attr('class', 'belt-fixed')
    .selectAll('line')
    .data(data.belt.lines.fixed)
    .enter()
    .append('line')
    .attr('x1', d => d.x1)
    .attr('y1', d => d.y1)
    .attr('x2', d => d.x2)
    .attr('y2', d => d.y2)
    .attr("stroke-width", settings.stroke.width)
    .attr("stroke", settings.stroke.color);

conveyorBelt
    .append('g')
    .attr('class', 'belt-animated')
    .selectAll('line')
    .data(data.belt.lines.animated)
    .enter()
    .append('line')
    .attr('x1', d => d.x1)
    .attr('y1', d => d.y1)
    .attr('x2', d => d.x2)
    .attr('y2', d => d.y2)
    .attr("stroke-width", settings.stroke.width)
    .attr("stroke", settings.stroke.color);

conveyorBelt.append('g')
    .selectAll('circle')
    .data(data.belt.cogs)
    .enter()
    .append('circle')
    .attr('cx', d => d.x)
    .attr('cy', d=> d.y)
    .attr('r', settings.belt.cogs.radius)
    .style('fill', 'white')
    .attr("stroke-width", settings.stroke.width)
    .attr("stroke", settings.stroke.color);

conveyorBelt.append('g')
    .selectAll('.cog')
    .data(data.belt.cogs)
    .enter()
    .append('g')
    .attr('transform', d => {
        var r = settings.belt.cogs.radius - settings.belt.cogs.padding;
        return `translate(${d.x - r},${d.y - r})`
    })
    .append('path')
    .attr('class', 'cog')
    .attr('fill', settings.stroke.color)
    .attr("d", d => cog((settings.belt.cogs.radius - settings.belt.cogs.padding) * 2));



