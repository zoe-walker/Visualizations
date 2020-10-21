export class StretchedChord {
  constructor (config) {
    if (!config.inputs.LHSnodes) {
      // config.functions.errorOccurred("The input for the 'Left Hand Side' is required to render properly.")
    }

    const StretchedChord = this

    StretchedChord._width = parseFloat(config.width)
    StretchedChord._height = parseFloat(config.height)
    StretchedChord._arcThickness = config.style.arcThickness
    StretchedChord._arcCentreSeparation = config.style.arcCentreSeparation
    StretchedChord._labelMargin = config.style.labelMargin
    StretchedChord._labelOffsetFactor = 0.6
    StretchedChord._outerRadius = (StretchedChord._width - StretchedChord._arcCentreSeparation - 2 * StretchedChord._labelMargin) / 2
    StretchedChord._innerRadius = StretchedChord._outerRadius - StretchedChord._arcThickness
    StretchedChord._nodeSeparation = config.style.nodeSeparation
    StretchedChord._arcHeight = StretchedChord._height - config.style.headerHeight - config.style.footerHeight
    StretchedChord._arcStartAngle = Math.acos(Math.min((StretchedChord._arcHeight / 2) / StretchedChord._outerRadius, 1.0))
    StretchedChord._flowPeriod = config.style.flowPeriod
    StretchedChord._flowOpacity = config.style.flowOpacity

    this.dataChanged = function dataChanged () {

      // store nodes in a dictionary for fast lookup
      var _NodeDict = {}

      // Copy RHS nodes from configuration data
      StretchedChord._RHSnodes = config.data.RHSnodes.map(function (node) {
        // setup node details and add it to the node dictionary for use with links
        node.bw = 0
        node.bwIn = 0
        node.bwOut = 0
        node.lastLinkEndAngle = 0
        node.lhs = false
        _NodeDict[node.id] = _NodeDict[node.id] === undefined ? node : _NodeDict[node.id]
        return node
      })

      // potential sort to make RHS nodes nicer
      // .sort((a, b) => a.id.localeCompare(b.id))

      // Copy LHS nodes from configuration data
      StretchedChord._LHSnodes = config.data.LHSnodes.map(function (node) {
        // setup node details and add it to the node dictionary for use with links
        node.bw = 0
        node.bwIn = 0
        node.bwOut = 0
        node.lastLinkEndAngle = 0
        node.lhs = true
        _NodeDict[node.id] = _NodeDict[node.id] === undefined ? node : _NodeDict[node.id]
        return node
      })

      var _totalLinkBandwidth = 0

      // Copy links from configuration data and sort them in RHSnode order
      StretchedChord._links = config.data.links.sort(function (a, b) {
        // arrange links based on node IDs to allow for better connection/less crossing
        var _AID = _NodeDict[a.target.id] === null ? 0 : _NodeDict[a.target.id].lhs === false ? a.target.id : a.source.id
        var _BID = _NodeDict[b.target.id] === null ? 0 : _NodeDict[b.target.id].lhs === false ? b.target.id : b.source.id
        return _AID.localeCompare(_BID)
      }).map(function (l) {

        // lookup source and target nodes
        l._sourceNode = _NodeDict[l.source.id]
        l._targetNode = _NodeDict[l.target.id]

        // make sure both nodes aren't left hand side
        if (l._sourceNode.lhs !== l._targetNode.lhs) {

          // update total bandwidth
          _totalLinkBandwidth += l.bw

          // add onto node bandwidths
          l._sourceNode.bw += l.bw
          l._sourceNode.bwOut += l.bw
          l._targetNode.bw += l.bw
          l._targetNode.bwIn += l.bw
          return l
        }

        // finally filter out all nulls
        return null
      }).filter(l => (l != null))

      function calculateLinkAngles (_link, _SourceOrTarget) {
        // if first link on node then start at node start
        var _Node = _SourceOrTarget === 'source' ? _link._sourceNode : _link._targetNode

        if (_Node.lastLinkEndAngle === 0) {
          _link[_SourceOrTarget].startAngle = _Node.startAngle
        } else {
          _link[_SourceOrTarget].startAngle = _Node.lastLinkEndAngle
        }

        // calculate link end position and update the last position on Node
        _link[_SourceOrTarget].endAngle = _link[_SourceOrTarget].startAngle + ((_Node.endAngle - _Node.startAngle) * (_link.bw / _Node.bw))
        _Node.lastLinkEndAngle = _link[_SourceOrTarget].endAngle
      }

      var _LHSAngleLeftAfterMinimum = 1
      var _RHSAngleLeftAfterMinimum = 1
      var _minimumSize = (config.style.minimumNodeSizePercentage / 100)

      var _TotalLeftSize = (Math.PI - 2 * StretchedChord._arcStartAngle - (StretchedChord._nodeSeparation * (StretchedChord._LHSnodes.length - 1)))
      var _TotalRightSize = (Math.PI - 2 * StretchedChord._arcStartAngle - (StretchedChord._nodeSeparation * (StretchedChord._RHSnodes.length - 1)))
      var _TotalLeftBandwidth = 0
      var _TotalRightBandwidth = 0
      var _RightTooSmall = 0
      var _LeftTooSmall = 0
      var _MinimumSizeRight = _minimumSize
      var _MinimumSizeLeft = _minimumSize

      function calculateNodeVariables (_Node) {
        if (_Node.lhs) {
          if (_Node.bw / _totalLinkBandwidth < _minimumSize) {
            _TotalLeftBandwidth -= _Node.bw
            _LHSAngleLeftAfterMinimum -= _minimumSize// - (_Node.bw / _totalLinkBandwidth)
            _LeftTooSmall++
          } else {
            _TotalLeftBandwidth += _Node.bw
          }
        } else {
          if (_Node.bw / _totalLinkBandwidth < _minimumSize) {
            _TotalRightBandwidth -= _Node.bw
            _RHSAngleLeftAfterMinimum -= _minimumSize// - (_Node.bw / _totalLinkBandwidth)
            _RightTooSmall++
          } else {
            _TotalRightBandwidth += _Node.bw
          }
        }

        // apply any colouring to the node
        _Node.criticality = config.style.nodeColour
        _Node.stroke = config.style.nodeBorderColour
      }

      // decrease minimum sizes while
      function checkSizeCalculations () {
        // if (_LeftTooSmall * _MinimumSizeLeft > 1) {
        //   do {
        //     _MinimumSizeLeft /= (_MinimumSizeLeft / 20)
        //   } while (_LeftTooSmall * _MinimumSizeLeft > 1 && _MinimumSizeLeft > 0.005)
        // }
        // if (_RightTooSmall * _MinimumSizeRight > 1) {
        //   do {
        //     _MinimumSizeRight /= (_MinimumSizeRight / 20)
        //   } while (_RightTooSmall * _MinimumSizeRight > 1 && _MinimumSizeRight > 0.005)
        // }
      }

      function calculateNodeAngles (_Node, _Index, _NodeArray) {
        // check if node is on the right or left side
        var _offset = _Node.lhs === true ? -1 : 1
        // var _nodeSize = (_Node.bw / _totalLinkBandwidth < _minimumSize) ? _minimumSize : _Node.bw / _totalLinkBandwidth

        //_nodeSize *= _nodeSize === _minimumSize ? 1 : _Node.lhs === true ? _LHSAngleLeftAfterMinimum : _RHSAngleLeftAfterMinimum
        var _nodeSize = 0

        if (_Node.bw / _totalLinkBandwidth < _minimumSize) {
          _nodeSize = _minimumSize * (_Node.lhs === true ? _TotalLeftSize : _TotalRightSize)
        } else {
          _nodeSize = _Node.bw / (_Node.lhs === true ? _TotalLeftBandwidth : _TotalRightBandwidth)
          _nodeSize *= _Node.lhs === true ? _TotalLeftSize * _LHSAngleLeftAfterMinimum : _TotalRightSize * _RHSAngleLeftAfterMinimum
        }

        // setup start and end angle
        _Node.startAngle = _Index === 0 ? StretchedChord._arcStartAngle : (_NodeArray[_Index - 1].endAngle + (_offset * StretchedChord._nodeSeparation))
        _Node.endAngle = _Node.startAngle + (_offset * _nodeSize)
      }

      // loop through both LHSnode and RHSnodes and calculate their starting and ending angles
      [StretchedChord._LHSnodes, StretchedChord._RHSnodes].forEach(arrayArray => (arrayArray.forEach(function (node) { calculateNodeVariables(node) })))
      checkSizeCalculations();
      [StretchedChord._LHSnodes, StretchedChord._RHSnodes].forEach(arrayArray => (arrayArray.forEach(function (node, index, array) { calculateNodeAngles(node, index, array) })))

      // Do one final sort on the links to arrange them so that
      // the chord is linked from top down I.E top left to top right
      StretchedChord._links.sort(function (a, b) {
        var _aSource = a._sourceNode.lhs === true ? a._sourceNode : a._targetNode
        var _bSource = b._sourceNode.lhs === true ? b._sourceNode : b._targetNode
        if (_aSource.startAngle > _bSource.startAngle) { return -1 }
        if (_aSource.startAngle < _bSource.startAngle) { return 1 }
        return 0
      })

      // calculate start and end angle for links
      StretchedChord._links.forEach(function (l) {
        calculateLinkAngles(l, 'source')
        calculateLinkAngles(l, 'target')
      })
    }

    this.sourceChanged = function sourceChanged (value) {
        StretchedChord.dataChanged()
    }

    this.initialise = function initialise () {
      StretchedChord.sourceChanged()
    }
  }
}
