function defaultData(data) {
    return Object.prototype.toString.call(data) === '[object Array]' ? data : [data];
}

export function Sunburst() {
    let data = defaultData,
        padding = 0,
        bandwidth = 200,
        maxDepth = 0,
        minRadius = 20,
        maxRadius = 200,
        dataAngleRatio = 0;

    function sunburst() {
        const d = data.apply(null, arguments);
        computeDepths(d);
        computeDataAngleRatio(d);
        computeAngles(d);
        computeBandWidth();
        computeRadius(d);
    }

    sunburst.maxRadius = function(_) {
        return arguments.length ? (maxRadius = +_, sunburst) : maxRadius;
    }

    sunburst.padding = function (_) {
        return arguments.length ? (padding = +_, sunburst) : padding;
    }

    sunburst.minRadius = function (_) {
        return arguments.length ? (minRadius = +_, sunburst) : minRadius;
    }

    sunburst.bandwidth = function () {
        return bandwidth;
    }

    function computeDepths(data, depth = 0) {
        if (depth > maxDepth)
            maxDepth = depth;

        data.forEach(function (d) {
            d.depth = depth;
            if (d.children && Array.isArray(d.children)) computeDepths(d.children, depth + 1) // && children is an array
        })
    }

    function computeBandWidth() {
        bandwidth = ((maxRadius - minRadius) - padding * (maxDepth - 1)) / Math.max(maxDepth, 1);
    }

    function computeDataAngleRatio(data) {
        dataAngleRatio = (2 * Math.PI) / data.reduce(function (a, b) { return a + b.value }, 0);
    }

    function computeAngles(data, parent) {
        for (var i = 0; i < data.length; i++) {
            data[i].startAngle = ((i > 0) ? data[i - 1].endAngle :
                parent ? parent.startAngle :
                    0);

            data[i].endAngle = data[i].startAngle +
                (dataAngleRatio * data[i].value)

            if (parent ? data[i].endAngle > parent.endAngle : data[i].endAngle > 360) {
                console.log(data[i]);
                throw 'Sum of child values greater than parent';
            }

            if (data[i].children) computeAngles(data[i].children, data[i])
        }
    }

    function computeRadius(data) {
        data.forEach(function (d) {
            d.innerRadius = minRadius + d.depth * (padding + bandwidth);
            d.outerRadius = d.innerRadius + bandwidth;

            if (d.children && Array.isArray(d.children)) computeRadius(d.children);
        })
        //for (var i = 0; i < data.length; i++) {
        //    data[i].innerRadius = minRadius + data[i].depth * (padding + bandwidth);
        //    data[i].outerRadius = data[i].innerRadius + bandwidth;

        //    if (data[i].children && Array.isArray(data[i].children)) computeRadius(data[i].children);
        //}
    }

    return sunburst;
}