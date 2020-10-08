export class StretchedChord {
  constructor (config) {
    if (!config.inputs.LHSnode) {
      config.functions.errorOccurred("The input for the 'Left Hand Side' is required to render properly.")
    }

    const StretchedChord = this; const g = 0.005

    StretchedChord._width = parseFloat(config.width)
    StretchedChord._height = parseFloat(config.height)

    this.dataChanged = function dataChanged () {
      StretchedChord._RHSnodes = config.data.nodes.filter(d => d.id !== config.inputs.LHSnode).map(d => (d.bw = 0, d))
      StretchedChord._links = JSON.parse(JSON.stringify(config.data.links))

      StretchedChord._RHSnodes = config.data.nodes.filter(d => d.id !== config.inputs.LHSnode).map(d => (d.bw = 0, d))
      StretchedChord._links = JSON.parse(JSON.stringify(config.data.links))

      StretchedChord._links.forEach(d => (
        StretchedChord._RHSnodes.find(e => e.id === (d.source.id === StretchedChord._LHSnode.id ? d.target.id : d.source.id)).bw += d.bw,
        StretchedChord._LHSnode.bw += d.bw))

      StretchedChord._RHSnodes.forEach(function (d, i, a) {
        d.startAngle = i === 0 ? Math.acos(StretchedChord._height / StretchedChord._width) : (a[i - 1].endAngle + g)
        d.endAngle = d.startAngle + ((Math.PI - 2 * Math.acos(StretchedChord._height / StretchedChord._width) - (g * (a.length - 1))) * ((d.bw / StretchedChord._LHSnode.bw)))

        StretchedChord._links.filter(l => l.source.id === d.id || l.target.id === d.id).forEach(function (e, j, b) {
          e[e.target.id === d.id ? 'target' : 'source'].startAngle = j === 0
            ? d.startAngle
            : b[j - 1].target.id === StretchedChord._LHSnode.id
              ? b[j - 1].source.endAngle
              : b[j - 1].target.endAngle
          e[e.target.id === d.id ? 'source' : 'target'].startAngle = i === 0 && j === 0
            ? 2 * Math.PI - Math.acos(StretchedChord._height / StretchedChord._width)
            : j === 0
              ? Math.min(...StretchedChord._links
                .filter(d => d.source.id === a[i - 1].id || d.target.id === a[i - 1].id)
                .map(d => d.target.id === StretchedChord._LHSnode.id ? d.target.endAngle : d.source.endAngle))
              : b[j - 1].target.id === StretchedChord._LHSnode.id ? b[j - 1].target.endAngle : b[j - 1].source.endAngle

          e[e.target.id === d.id ? 'target' : 'source'].endAngle = e[e.target.id === d.id ? 'target' : 'source'].startAngle + (d.endAngle - d.startAngle) * e.bw / d.bw
          e[e.target.id === d.id ? 'source' : 'target'].endAngle = e[e.target.id === d.id ? 'source' : 'target'].startAngle - ((Math.PI - 2 * Math.acos(StretchedChord._height / StretchedChord._width)) * e.bw / StretchedChord._LHSnode.bw)
        })
      })

      StretchedChord._LHSnode.criticality = getAverageNodeColour(StretchedChord._LHSnode, StretchedChord._links)
      StretchedChord._LHSnode.stroke = darkenColour(StretchedChord._LHSnode.criticality, -50)
      StretchedChord._RHSnodes.map(d => d.criticality = getAverageNodeColour(d, StretchedChord._links))
      StretchedChord._RHSnodes.map(d => d.stroke = darkenColour(d.criticality, -50))
    }

    this.sourceChanged = function sourceChanged (value) {
      if (typeof value === 'string' && value.length > 0) {
        StretchedChord._LHSnode = Object.assign(config.data.nodes.find(d => d.id === value) || {}, { bw: 0 })

        StretchedChord.dataChanged()
      }
    }

    this.initialise = function initialise () {
      StretchedChord.sourceChanged(config.inputs.LHSnode)
    }
  }
}

function getAverageNodeColour (node, links) {
  const colours = links
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
    }), { bw: 0, col: [0, 0, 0] })

  return '#' + colours.col.map(d => parseInt(d / colours.bw).toString(16)).map(d => d.length === 1 ? '0' + d : d).join('')
}
function darkenColour (col, amt) {
  return '#' + [col.slice(1, 3), col.slice(3, 5), col.slice(5)]
    .map(d => Math.min(255, Math.max(0, (parseInt(d, 16) + amt))).toString(16))
    .map(d => d.length === 1 ? '0' + d : d)
    .join('')
}
