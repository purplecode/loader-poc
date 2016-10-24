"use strict";

function loader(selector, options) {
    var settings = {
        svg: {
            width: 1100,
            height: 800
        },
        stroke: {
            width: 3,
            color: 'darkgray'
        },
        belt: {
            x: 100,
            y: 350,
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
            x: 0, y: 100, width: 200, height: 350, fill: 'white'
        }, {
            x: 30, y: 170, width: 140, height: 250, fill: 'white'
        }, {
            x: 70, y: 318, width: 200, height: 58, fill: 'white', stroke: 'white'
        }],
        packages: () => {
            var x = settings.belt.x,
                y = settings.belt.y - 5,
                sy = settings.belt.height / 2,
                sx = settings.belt.skew / 2;

            function box(w, h) {
                return `
            ${x},${y} 
            ${w + x},${y} 
            ${w + x},${y - h} 
            ${x},${y - h} 
            ${x},${y} 
            ${w + x},${y} 
            ${w + sx + x},${y - sy} 
            ${w + sx + x},${y - h - sy} 
            ${w + x},${y - h} 
            ${w + sx + x},${y - h - sy} 
            ${sx + x},${y - h - sy} 
            ${x},${y - h}`;
            }

            return [box(100, 80), box(50, 100), box(70, 70)];
        },
        clouds: []
    };

    var svg = d3.select(selector)
        .attr('width', settings.svg.width)
        .attr('height', settings.svg.height)
        .select('#d3-content');

    if (options.machine) {
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
    }

    var conveyorBelt = svg.append('g');

    var conveyorBeltEnding = conveyorBelt.append('g');
    conveyorBeltEnding
        .selectAll('.circle-end')
        .data([data.belt.cogs()[0]])
        .enter()
        .append('circle')
        .attr('class', 'circle-end')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', settings.belt.cogs.radius)
        .attr('transform', d => {
            return `translate(${settings.belt.width + settings.belt.skew},${-settings.belt.height})`
        })
        .style('fill', 'white')
        .attr("stroke-width", settings.stroke.width)
        .attr("stroke", settings.stroke.color);

    conveyorBeltEnding.append("rect")
        .attr("class", "circle-end-mask")
        .attr("x", settings.belt.x + settings.belt.width)
        .attr("y", settings.belt.y - settings.belt.height)
        .attr("width", settings.belt.skew)
        .attr("height", settings.belt.height * 2)
        .style('fill', 'white');

    conveyorBelt
        .append('g')
        .attr('class', 'belt-fixed')
        .selectAll('line')
        .data(data.belt.fixed)
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
        .data(data.belt.animated)
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


    var packages = svg.append('g')
        .attr('class', 'packages');

    packages
        .selectAll('polygon')
        .data(data.packages)
        .enter()
        .append('polygon')
        .attr('points', d => d)
        .attr('id', (d, i) => `package-${i}`)
        .attr('fill', 'white')
        .attr("stroke-width", settings.stroke.width)
        .attr("stroke", settings.stroke.color)
        .attr("stroke-linejoin", 'round');

    var packages = svg.append('g')
        .attr('class', 'clouds')
        .selectAll('path')
        .data(data.clouds)
        .enter()
        .append('path')
        .attr('d', d => d)
        .attr('fill', 'white')
        .attr("stroke-width", settings.stroke.width)
        .attr("stroke", settings.stroke.color)
        .attr("stroke-linejoin", 'round');
}