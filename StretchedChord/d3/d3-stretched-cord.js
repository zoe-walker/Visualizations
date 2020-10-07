function defaultSources(sources) {
    return Object.prototype.toString.call(sources) === '[object Array]' ? sources.sort(function (a, b) { return a.name < b.name ? 1 : -1 }) : [sources];
}

function defaultTargets(targets) {
    return Object.prototype.toString.call(targets) === '[object Array]' ? targets.sort(function (a, b) { return a.name > b.name ? 1 : -1 }) : [targets];
}

function defaultLinks(links) {
    return Object.prototype.toString.call(links) === '[object Array]' ? links.sort(function (a, b) { return a.source.name > b.source.name ? 1 : a.source.name < b.source.name ?  -1 : a.target.name > b.target.name ? 1 : -1 }) : [links];
}

export function StretchedCord() {
    let sources, targets, links,
        outerRadius = 100,
        innerRadius = 90,
        container,
        width = 200,
        height = 200,
        bandwidth = 10,
        offset = 0,
        totalStartAngle = { source: 0, target: 0 },
        totalEndAngle = { source: 0, target: 0 },
        ratio = { source: 0, target: 0 },
        padAngle = 0;

    function stretchedCord(_) {
        sources = defaultSources.apply(null, [_.sources]);
        targets = defaultTargets.apply(null, [_.targets]);
        links = defaultLinks.apply(null, [_.links]);

        CalculateTotalStartEndAngle();
        CalculateRatios(sources, targets, links);
        CalculateAngles(sources, targets, links);
        CalculateLinkStartEndPoints(sources, targets, links);
    }

    stretchedCord.container = function (_) {
        return arguments.length ? (container = _, stretchedCord) : container ? container : [width, height];
    }

    stretchedCord.size = function (_) {
        return arguments.length ? (width = +_[0], height = +_[1], outerRadius = +_[0] / 2 + offset, innerRadius = +_[0] / 2 + offset - bandwidth, stretchedCord) : [width, height];
    }

    stretchedCord.bandwidth = function (_) {
        return arguments.length ? (bandwidth = +_, innerRadius = outerRadius - +_, stretchedCord) : bandwidth;
    }

    stretchedCord.offset = function (_) {
        return arguments.length ? (offset = _, outerRadius = width / 2 + offset, innerRadius = width / 2 + offset - bandwidth, stretchedCord) : offset;
    }

    stretchedCord.padAngle = function (_) {
        return arguments.length ? (padAngle = +_, stretchedCord) : padAngle;
    }

    stretchedCord.sources = function () {
        return sources;
    }

    stretchedCord.targets = function () {
        return targets;
    }

    stretchedCord.links = function () {
        return links;
    }

    stretchedCord.outerRadius = function () {
        return outerRadius;
    }

    stretchedCord.innerRadius = function () {
        return innerRadius;
    }

    function CalculateTotalStartEndAngle() {
        totalStartAngle = {
            source: Math.PI + (Math.acos(Math.min(1, height / (2 * (offset + width / 2)))) || padAngle / 2),
            target: Math.acos(Math.min(1, height / (2 * (offset + width / 2)))) || padAngle / 2
        }
        totalEndAngle = {
            source: Math.min(totalStartAngle.source + 2 * Math.asin(Math.min(1, height / (2 * (offset + width / 2)))), 2 * Math.PI - padAngle / 2),
            target: Math.min(totalStartAngle.target + 2 * Math.asin(Math.min(1, height / (2 * (offset + width / 2)))), Math.PI - padAngle / 2)
        }
    }

    function CalculateRatios(sources, targets, links) {
        ratio.source = getRatio(sources, 'source');
        ratio.target = getRatio(targets, 'target');

        function getRatio(nodes, linkEnd) {
            return ((totalEndAngle[linkEnd] - totalStartAngle[linkEnd]) - (totalStartAngle === Math.PI + padAngle / 2 ? padAngle * nodes.length : padAngle * (nodes.length - 1))) / links.reduce(function (sum, link) { return sum + link.value }, 0)
        }
    }

    function CalculateAngles(sources, targets, links) {
        calcAngles(sources, 'source');
        calcAngles(targets, 'target');

        function calcAngles(nodes, linkEnd) {
            nodes.map(function (d, i) {
                d.startAngle = (i > 0) ? nodes[i - 1].endAngle + padAngle : totalStartAngle[linkEnd];
                d.endAngle = d.startAngle + ratio[linkEnd] * links.reduce(function (sum, link) { return (d.id === link[linkEnd].id) ? sum + link.value : sum }, 0)
            })
        }
    }

    function CalculateLinkStartEndPoints(sources, targets, links) {
        links.map(function (d) {
            let source = function () { for (let i = 0; i < sources.length; i++) if (sources[i].id === d.source.id) return sources[i]; }(),
                target = function () { for (let i = 0; i < targets.length; i++) if (targets[i].id === d.target.id) return targets[i]; }();

            let sourceAngle = source.angleUsed ? source.angleUsed : (source.angleUsed = source.endAngle, source.endAngle),
                targetAngle = target.angleUsed ? target.angleUsed : (target.angleUsed = target.startAngle, target.startAngle),
                radius = (innerRadius + bandwidth / 2),

                p0 = (container[0] / 2 + offset + radius * Math.sin(sourceAngle)) + ' ' + (container[1] / 2 - (radius * Math.cos(sourceAngle))) + ' ',
                p1 = (container[0] / 2 + offset + innerRadius * Math.sin(source.angleUsed)) + ' ' + (container[1] / 2 - (innerRadius * Math.cos(source.angleUsed))) + ' ',
                b1 = ((2 * container[0] / 2 + 2 * offset + 1 * innerRadius * Math.sin(source.angleUsed)) / 2) + ' ' + ((2 * container[1] / 2 - 1 * innerRadius * Math.cos(source.angleUsed)) / 2) + ' ',
                p2 = (container[0] / 2 + offset + innerRadius * Math.sin(targetAngle)) + ' ' + (container[1] / 2 - (innerRadius * Math.cos(targetAngle))) + ' ',
                b2 = ((2 * container[0] / 2 + 2 * offset + 1 * innerRadius * Math.sin(target.angleUsed)) / 2) + ' ' + ((2 * container[1] / 2 - 1 * innerRadius * Math.cos(target.angleUsed)) / 2) + ' ',
                p3 = (container[0] / 2 + offset + radius * Math.sin(target.angleUsed)) + ' ' + (container[1] / 2 - (radius * Math.cos(target.angleUsed))) + ' ';
                
            source.angleUsed -= d.value * ratio.source;
            target.angleUsed += d.value * ratio.target;
                
            let p7 = (container[0] / 2 + offset + (radius * Math.sin(source.angleUsed))) + ' ' + (container[1] / 2 - (radius * Math.cos(source.angleUsed))) + ' ',
                p6 = (container[0] / 2 + offset + (innerRadius * Math.sin(source.angleUsed))) + ' ' + (container[1] / 2 - (innerRadius * Math.cos(source.angleUsed))) + ' ',
                b6 = ((2 * container[0] / 2 + 2 * offset + 1 * innerRadius * Math.sin(source.angleUsed)) / 2) + ' ' + ((2 * container[1] / 2 - 1 * innerRadius * Math.cos(source.angleUsed)) / 2) + ' ',
                p5 = (container[0] / 2 + offset + innerRadius * Math.sin(target.angleUsed)) + ' ' + (container[1] / 2 - (innerRadius * Math.cos(target.angleUsed))) + ' ',
                b5 = ((2 * container[0] / 2 + 2 * offset + 1 * innerRadius * Math.sin(target.angleUsed)) / 2) + ' ' + ((2 * container[1] / 2 - 1 * innerRadius * Math.cos(target.angleUsed)) / 2) + ' ',
                p4 = (container[0] / 2 + offset + (radius * Math.sin(target.angleUsed))) + ' ' + (container[1] / 2 - (radius * Math.cos(target.angleUsed))) + ' ';
                
            d.d = 'M' + p0 + 'L' + p1 + 'C' + b1 + b2 + p2 + 'L' + p3 +
                'A' + ((innerRadius + outerRadius) / 2) + ' ' + ((innerRadius + outerRadius) / 2) + ' 0 0 1 ' + p4 +
                'L' + p5 + 'C' + b5 + b6 + p6 + 'L' + p7 + 
                'A' + ((innerRadius + outerRadius) / 2) + ' ' + ((innerRadius + outerRadius) / 2) + ' 0 0 1 ' + p0;
        })

        sources.map(function (d) { delete d.angleUsed; });
        targets.map(function (d) { delete d.angleUsed; });
    }

    return stretchedCord;
}