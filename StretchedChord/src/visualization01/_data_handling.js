export class StretchedChord {
  constructor (config) {
    if (!config.inputs.LHSnodes) {
      //config.functions.errorOccurred("The input for the 'Left Hand Side' is required to render properly.")
    }

    const StretchedChord = this
    const g = 0.005
    const sum = (accumulator, currentValue) => accumulator + currentValue

    StretchedChord._width = parseFloat(config.width)
    StretchedChord._height = parseFloat(config.height)
    StretchedChord._arcThickness = config.style.arcThickness
    StretchedChord._outerRadius = StretchedChord._width / 2
    StretchedChord._innerRadius = StretchedChord._outerRadius - StretchedChord._arcThickness

    this.dataChanged = function dataChanged () {

      function returnIDExists (d) {
        for (var l = 0; l < StretchedChord._LHSnodes.length; l++) {
          if (StretchedChord._LHSnodes[l].id === d) {
            return true
          }
        }
        return false
      }

      function findNode (_NodeID) {
        for (var _n = 0; _n < StretchedChord._LHSnodes.length; _n++) {
          if (StretchedChord._LHSnodes[_n].id === _NodeID) {
            return StretchedChord._LHSnodes[_n]
          }
        }
        for (_n = 0; _n < StretchedChord._RHSnodes.length; _n++) {
          if (StretchedChord._RHSnodes[_n].id === _NodeID) {
            return StretchedChord._RHSnodes[_n]
          }
        }
        return -1
      }

      function findLinkIndex (_LinkID, _Array) {
        for (var _l = 0; _l < _Array.length; _l++) {
          if (_LinkID === _Array[_l].id) {
            return _l
          }
        }
        return -1
      }

      // Copy RHS nodes from configuration data
      StretchedChord._RHSnodes = config.data.RHSnodes.map(d => (d))

      // Copy LHS nodes from configuration data
      StretchedChord._LHSnodes = config.data.LHSnodes.map(d => (d))

      //potential sort to make RHS nodes nicer
      //.sort((a, b) => a.id.localeCompare(b.id))

      // Copy links from configuration data and sort them in RHSnode order
      StretchedChord._links = config.data.links.sort(function (a, b) {
        var _AID = a.target.id
        var _BID = b.target.id
        StretchedChord._LHSnodes.forEach(function (_Node) {
          if (_Node.id === a.target.id) {
            _AID = a.source.id
          }
          if (_Node.id === b.target.id) {
            _BID = b.source.id
          }
        })
        return _AID.localeCompare(_BID)
      }).map(d => (d))

      // StretchedChord._links.sort(function (a, b) {
      //   if ((a.target.id === b.target.id && a.source.id === b.source.id) || a.target.id === b.source.id) {
      //     if (a.bw < b.bw) { return -1 }
      //     if (a.bw > b.bw) { return 1 }
      //     return 0
      //   }
      // })

      var _totalLinkBandwidth = 0

      // Calculate the total bandwith requirement of each RHS node
      // as the sum of the bandwidths of each link to or from the node
      StretchedChord._RHSnodes.forEach(function (node) {
        node.bw = 0
        node.bwIn = 0
        node.bwOut = 0
        node.lastLinkEndAngle = 0
      })

      // Calculate the total bandwith requirement of the LHS node
      // as the sum of the bandwidths of each link to or from the node.
      StretchedChord._LHSnodes.forEach(function (node) {
        node.bw = 0
        node.bwIn = 0
        node.bwOut = 0
        node.lastLinkEndAngle = 0
      })

      // Calculate node bandwidths as sum of 
      StretchedChord._links.forEach(function (l) {
        _totalLinkBandwidth += l.bw
        var _sourceNode = findNode(l.source.id)
        var _targetNode = findNode(l.target.id)
        _sourceNode.bw += l.bw
        _sourceNode.bwOut += l.bw
        _targetNode.bw += l.bw
        _targetNode.bwOut += l.bw
      })

      // potential sorting methods/options
      // StretchedChord._RHSnodes.sort(function (a, b) {
      //   if (a.bw < b.bw) { return 1 }
      //   if (a.bw > b.bw) { return -1 }
      //   return 0
      // })

      // StretchedChord._LHSnodes.sort(function (a, b) {
      //   if (a.bw < b.bw) { return -1 }
      //   if (a.bw > b.bw) { return 1 }
      //   return 0
      // })

      function calculateLinkAngles (_Node, _SourceOrTarget, _link) {
        // if first link on node then start at node start
        if (_Node.lastLinkEndAngle === 0) {
          _link[_SourceOrTarget].startAngle = _Node.startAngle
        } else {
          _link[_SourceOrTarget].startAngle = _Node.lastLinkEndAngle
        }

        // calculate link end position and update the last position on Node
        _link[_SourceOrTarget].endAngle = _link[_SourceOrTarget].startAngle + ((_Node.endAngle - _Node.startAngle) * (_link.bw / _Node.bw))
        _Node.lastLinkEndAngle = _link[_SourceOrTarget].endAngle
      }

      StretchedChord._LHSnodes.forEach(function (d, i, a) {
        // calculate node position
        d.startAngle = i === 0 ? -Math.acos(StretchedChord._height / StretchedChord._width) : (a[i - 1].endAngle + g)
        d.endAngle = d.startAngle - ((Math.PI - 2 * Math.acos(StretchedChord._height / StretchedChord._width) - (g * (a.length - 1))) * (d.bw / _totalLinkBandwidth))

        d.criticality = config.style.nodeColour
        d.stroke = darkenColour(d.criticality, config.style.flowProminence)
      })

      StretchedChord._RHSnodes.forEach(function (d, i, a) {
        // calculate node position
        d.startAngle = i === 0 ? Math.acos(StretchedChord._height / StretchedChord._width) : (a[i - 1].endAngle + g)
        d.endAngle = d.startAngle + ((Math.PI - 2 * Math.acos(StretchedChord._height / StretchedChord._width) - (g * (a.length - 1))) * ((d.bw / _totalLinkBandwidth)))

        d.criticality = config.style.nodeColour
        d.stroke = darkenColour(d.criticality, config.style.flowProminence)
      })

      // Do one final sort on the links to arrange them so that
      // the chord is linked from top down I.E top left to top right
      StretchedChord._links.sort(function (a, b) {
        var _aSource
        var _bSource
        StretchedChord._LHSnodes.forEach(function (_Node) {
          if (_Node.id === a.target.id || _Node.id === a.source.id) {
            _aSource = _Node
          }
          if (_Node.id === b.target.id || _Node.id === b.source.id) {
            _bSource = _Node
          }
        })
        if (_aSource.startAngle > _bSource.startAngle) { return -1 }
        if (_aSource.startAngle < _bSource.startAngle) { return 1 }
        return 0
      })

      // calculate start and end angle for links
      StretchedChord._links.forEach(function (l) {
        var _sourceNode = findNode(l.source.id)
        var _targetNode = findNode(l.target.id)
        calculateLinkAngles(_sourceNode, 'source', l)
        calculateLinkAngles(_targetNode, 'target', l)
      })
    }

    this.sourceChanged = function sourceChanged (value) {
      if (typeof StretchedChord._LHSnodes === 'undefined') {
        StretchedChord._LHSnodes = []
      }

      if (value.length > 0) {
        StretchedChord._LHSnodes = value
        StretchedChord.dataChanged()
      }
      /*
      // Only handle source, aka LHS, as a single element: a string not an array
      if (typeof value === 'string' && value.length > 0) {
        StretchedChord._LHSnodes = [Object.assign(config.data.nodes.find(d => d.id === value) || {}, { bw: 0 })]

        StretchedChord.dataChanged()
      } else if (Array.isArray(value) && value.length > 0) {
        for (var l = 0; l < value.length; l++) {
          if (!StretchedChord._LHSnodes.includes(value[l])) {
            var _value = Object.assign(config.data.nodes.find(d => d.id === value[l]) || {}, { bw: 0 })
            StretchedChord._LHSnodes.push(_value)
          }
        }
        StretchedChord.dataChanged()
      }
      */
    }

    this.initialise = function initialise () {
      StretchedChord.sourceChanged(config.inputs.LHSnode)
    }
  }
}

function darkenColour (col, amt) {
  return '#' + [col.slice(1, 3), col.slice(3, 5), col.slice(5)]
    .map(d => Math.min(255, Math.max(0, (parseInt(d, 16) - amt))).toString(16))
    .map(d => d.length === 1 ? '0' + d : d)
    .join('')
}
