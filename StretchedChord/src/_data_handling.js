export class Cord {
    constructor(config) {
        if (!config.inputs.LHSnode) {
            config.functions.errorOccurred("The input for the 'Left Hand Side' is required to render properly.");
        }

        let cord = this, g = 0.005;

        cord._width = parseFloat(config.width);
        cord._height = parseFloat(config.height);

        this.dataChanged = function dataChanged() {
            cord._RHSnodes = config.data.nodes.filter(d => d.id !== config.inputs.LHSnode).map(d => (d.bw = 0, d));
            cord._links = JSON.parse(JSON.stringify(config.data.links));
            
            cord._RHSnodes = config.data.nodes.filter(d => d.id !== config.inputs.LHSnode).map(d => (d.bw = 0, d));
            cord._links = JSON.parse(JSON.stringify(config.data.links));
            
            cord._links.forEach(d => (
                cord._RHSnodes.find(e => e.id === (d.source.id === cord._LHSnode.id ? d.target.id : d.source.id)).bw += d.bw,
                cord._LHSnode.bw += d.bw));

            cord._RHSnodes.forEach(function (d, i, a) {
                d.startAngle = i === 0 ? Math.acos(cord._height / cord._width) : (a[i - 1].endAngle + g);
                d.endAngle = d.startAngle + ((Math.PI - 2 * Math.acos(cord._height / cord._width) - (g * (a.length - 1))) * ((d.bw / cord._LHSnode.bw)));

                cord._links.filter(l => l.source.id === d.id || l.target.id === d.id).forEach(function (e, j, b) {
                    e[e.target.id === d.id ? 'target' : 'source'].startAngle = j === 0 ?
                        d.startAngle :
                        b[j - 1].target.id === cord._LHSnode.id ?
                            b[j - 1].source.endAngle :
                            b[j - 1].target.endAngle;
                    e[e.target.id === d.id ? 'source' : 'target'].startAngle = i === 0 && j === 0 ?
                        2 * Math.PI - Math.acos(cord._height / cord._width) :
                        j === 0 ?
                            Math.min(...cord._links
                                .filter(d => d.source.id === a[i - 1].id || d.target.id === a[i - 1].id)
                                .map(d => d.target.id === cord._LHSnode.id ? d.target.endAngle : d.source.endAngle)) :
                            b[j - 1].target.id === cord._LHSnode.id ? b[j - 1].target.endAngle : b[j - 1].source.endAngle;

                    e[e.target.id === d.id ? 'target' : 'source'].endAngle = e[e.target.id === d.id ? 'target' : 'source'].startAngle + (d.endAngle - d.startAngle) * e.bw / d.bw;
                    e[e.target.id === d.id ? 'source' : 'target'].endAngle = e[e.target.id === d.id ? 'source' : 'target'].startAngle - ((Math.PI - 2 * Math.acos(cord._height / cord._width)) * e.bw / cord._LHSnode.bw)
                })
            });

            cord._LHSnode.criticality = getAverageNodeColour(cord._LHSnode, cord._links);
            cord._LHSnode.stroke = darkenColour(cord._LHSnode.criticality, -50);
            cord._RHSnodes.map(d => d.criticality = getAverageNodeColour(d, cord._links));
            cord._RHSnodes.map(d => d.stroke = darkenColour(d.criticality, -50));

        };

        this.sourceChanged = function sourceChanged(value) {
            if (typeof value === "string" && value.length > 0) {
                cord._LHSnode = Object.assign(config.data.nodes.find(d => d.id === value) || {}, { bw: 0 });

                cord.dataChanged();
            }
        };

        this.initialise = function initialise() {
            cord.sourceChanged(config.inputs.LHSnode)
        }
    }
}

function getAverageNodeColour(node, links) {
    let colours = links
        .filter(d =>
            d.source.id === node.id || d.target.id === node.id)
        .map(function (d) {
            return {
                bw: d.bw,
                col: [
                    d.criticality.slice(1, 3),
                    d.criticality.slice(3, 5),
                    d.criticality.slice(5)
                ]
                    .map(e => parseInt(e, 16) * d.bw)
            }
        })
        .reduce((prev, current) => ({
            bw: prev.bw + current.bw,
            col: prev.col.map((d, i) => d += current.col[i])
        }), { bw: 0, col: [0, 0, 0] });

    return '#' + colours.col.map(d => parseInt(d / colours.bw).toString(16)).map(d => d.length === 1 ? '0' + d : d).join('');
}
function darkenColour(col, amt) {
    return '#' + [col.slice(1, 3), col.slice(3, 5), col.slice(5)]
        .map(d => Math.min(255, Math.max(0, (parseInt(d, 16) + amt))).toString(16))
        .map(d => d.length === 1 ? '0' + d : d)
        .join('');
}