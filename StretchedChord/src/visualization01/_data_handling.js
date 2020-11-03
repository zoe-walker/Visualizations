export class StretchedChord {
  constructor (config) {
    const StretchedChord = this

    StretchedChord._width = parseFloat(config.width)
    StretchedChord._height = parseFloat(config.height)
    StretchedChord._arcThickness = config.style.arcThickness
    StretchedChord._arcCentreSeparation = config.style.arcCentreSeparation
    StretchedChord._labelMargin = config.style.labelMargin
    StretchedChord._labelFontSize = config.style.labelFontSize
    StretchedChord._labelFontFamily = config.style.labelFontFamily
    StretchedChord._labelOffsetFactor = 0.7

    const arcHeight = StretchedChord._height - config.style.headerHeight - config.style.footerHeight
    const arcWidth = StretchedChord._width - StretchedChord._arcCentreSeparation - 2 * StretchedChord._labelMargin
    const maxDimension = Math.max(arcHeight, arcWidth)
    const minDimension = Math.min(arcHeight, arcWidth)
    //
    // Constrain arc angle by viewing area aspect ratio
    // Only a square view will display a full sem-circle
    //
    StretchedChord._arcStartAngle = 2 * Math.atan(maxDimension / minDimension) - Math.PI / 2
    //
    // Calculate the radius of the arc to fit the size of the view area
    //
    StretchedChord._outerRadius = minDimension / 2 /
      (1 - Math.cos(Math.PI / 2 - StretchedChord._arcStartAngle)) *
      arcHeight / maxDimension
    //
    // Calculate the horizontal offset of the LHS arc centre from centre of view area
    // The RHS arc centre offset is -1 * this
    //
    const arcCentreOffset = StretchedChord._labelMargin + StretchedChord._outerRadius - StretchedChord._width / 2
    StretchedChord.arcCentreOffset = () => arcCentreOffset

    StretchedChord._innerRadius = StretchedChord._outerRadius - StretchedChord._arcThickness

    const nodeSeparationAngle = config.style.nodeSeparation / StretchedChord._innerRadius
    StretchedChord.nodeSeparationAngle = () => nodeSeparationAngle

    StretchedChord._flowPeriod = config.style.flowPeriod
    StretchedChord._flowOpacity = config.style.flowOpacity
    //
    // Calculate offsets from centre of view area to left boundary of label areas
    // The LHS boundary would need to change to right boundary if right aligning LHS labels
    //
    const lhsLabelOffset = arcCentreOffset - StretchedChord._arcThickness / 2 - StretchedChord._labelMargin * 0.9 - StretchedChord._outerRadius * (1 - StretchedChord._labelOffsetFactor)
    StretchedChord.lhsLabelOffset = () => lhsLabelOffset
    const rhsLabelOffset = -arcCentreOffset + StretchedChord._arcThickness / 2 + StretchedChord._outerRadius * (1 - StretchedChord._labelOffsetFactor)
    StretchedChord.rhsLabelOffset = () => rhsLabelOffset

    this.dataChanged = function dataChanged () {
      // store nodes in a dictionary for fast lookup
      var nodeDict = {}

      // Copy RHS nodes from configuration data
      StretchedChord._RHSnodes = config.data.RHSnodes.map(function (node) {
        // setup node details and add it to the node dictionary for use with links
        node.size = 0
        node.sizeIn = 0
        node.sizeOut = 0
        node.lastLinkEndAngle = 0
        node.lhs = false
        nodeDict[node.id] = nodeDict[node.id] === undefined ? node : nodeDict[node.id]
        return node
      })

      // Copy LHS nodes from configuration data
      StretchedChord._LHSnodes = config.data.LHSnodes.map(function (node) {
        // setup node details and add it to the node dictionary for use with links
        node.size = 0
        node.sizeIn = 0
        node.sizeOut = 0
        node.lastLinkEndAngle = 0
        node.lhs = true
        nodeDict[node.id] = nodeDict[node.id] === undefined ? node : nodeDict[node.id]
        return node
      })

      var totalLinkSize = 0

      // Copy links from configuration data and sort them in RHSnode order
      StretchedChord._links = config.data.links.sort(function (a, b) {
        // arrange links based on node IDs to allow for better connection/less crossing
        var aID = nodeDict[a.target.id] === undefined ? undefined : nodeDict[a.target.id].lhs === false ? a.target.id : a.source.id
        var bID = nodeDict[b.target.id] === undefined ? undefined : nodeDict[b.target.id].lhs === false ? b.target.id : b.source.id
        return (aID === undefined || bID === undefined) ? 0 : aID.localeCompare(bID)
      }).map(function (l) {
        // lookup source and target nodes
        l._sourceNode = nodeDict[l.source.id]
        l._targetNode = nodeDict[l.target.id]

        // make sure both nodes aren't left hand side
        if (l._sourceNode !== undefined && l._targetNode !== undefined && l._sourceNode.lhs !== l._targetNode.lhs) {
          // update total size
          totalLinkSize += l.size

          // add onto node size
          l._sourceNode.size += l.size
          l._sourceNode.sizeOut += l.size
          l._targetNode.size += l.size
          l._targetNode.sizeIn += l.size
          return l
        }

        // finally filter out all nulls
        return null
      }).filter(l => (l != null))

      function calculateLinkAngles (link, sourceOrTarget) {
        // if first link on node then start at node start
        var node = sourceOrTarget === 'source' ? link._sourceNode : link._targetNode

        if (node.lastLinkEndAngle === 0) {
          link[sourceOrTarget].startAngle = node.startAngle
        } else {
          link[sourceOrTarget].startAngle = node.lastLinkEndAngle
        }

        // calculate link end position and update the last position on Node
        link[sourceOrTarget].endAngle = link[sourceOrTarget].startAngle + ((node.endAngle - node.startAngle) * (link.size / node.size))
        node.lastLinkEndAngle = link[sourceOrTarget].endAngle
      }

      // setup variables for node size calculations
      var totalLeftAvailableSize = (Math.PI - 2 * StretchedChord._arcStartAngle - (StretchedChord.nodeSeparationAngle() * (StretchedChord._LHSnodes.length - 1)))
      var totalRightAvailableSize = (Math.PI - 2 * StretchedChord._arcStartAngle - (StretchedChord.nodeSeparationAngle() * (StretchedChord._RHSnodes.length - 1)))
      var minimumSizeRight = (config.style.minimumNodeSizePercentage / 100)
      var minimumSizeLeft = (config.style.minimumNodeSizePercentage / 100)

      var totalLeftSize = 0
      var totalRightSize = 0
      var _LHSAngleLeftAfterMinimum = 1
      var _RHSAngleLeftAfterMinimum = 1

      function calculateNodeSizing (node, vars) {
        // store current node percentage size for easier typing
        var nodeSizeProportionOfTotal = node.size / totalLinkSize

        // check if node is left hand side
        if (node.lhs) {
          // check if node size is less than minimum
          if (nodeSizeProportionOfTotal * _LHSAngleLeftAfterMinimum < minimumSizeLeft) {
            vars.leftTooSmall++
          } else {
            // add node to size calculations
            totalLeftSize += node.size
          }
        } else {
          if (nodeSizeProportionOfTotal * _RHSAngleLeftAfterMinimum < minimumSizeRight) {
            vars.rightTooSmall++
          } else {
            totalRightSize += node.size
          }
        }
      }

      // decrease minimum sizes while
      function checkSizeCalculations () {
        // store past variables between loops
        var vars = {
          oldLeftTooSmall: 0,
          oldRightTooSmall: 0,
          leftTooSmall: 0,
          rightTooSmall: 0
        }

        do {
          // dynamically resize minimum size by 1% until it either
          // fails because it's smaller than 0.1% or succeeds
          if (vars.leftTooSmall * minimumSizeLeft > 1) {
            do {
              minimumSizeLeft *= 0.99
            } while (vars.leftTooSmall * minimumSizeLeft > 1 && minimumSizeLeft > 0.001)
            minimumSizeLeft = minimumSizeLeft * vars.leftTooSmall > 1 ? 0 : minimumSizeLeft
          }

          // do the same for the right side
          if (vars.rightTooSmall * minimumSizeRight > 1) {
            do {
              minimumSizeRight *= 0.99
            } while (vars.rightTooSmall * minimumSizeRight > 1 && minimumSizeRight > 0.001)
            minimumSizeRight = minimumSizeRight * vars.rightTooSmall > 1 ? 0 : minimumSizeRight
          }

          // calculate remaining total size modifier
          _LHSAngleLeftAfterMinimum = 1 - (vars.leftTooSmall * minimumSizeLeft)
          _RHSAngleLeftAfterMinimum = 1 - (vars.rightTooSmall * minimumSizeRight)

          // update past loop variables
          vars.oldLeftTooSmall = vars.leftTooSmall
          vars.oldRightTooSmall = vars.rightTooSmall
          vars.leftTooSmall = 0
          vars.rightTooSmall = 0

          // reset variables used during this loop
          totalLeftSize = 0
          totalRightSize = 0;

          // check minimum sizes are fine with every node
          [StretchedChord._LHSnodes, StretchedChord._RHSnodes].forEach(arrayArray => (arrayArray.forEach(function (node) { calculateNodeSizing(node, vars) })))
        } while (vars.leftTooSmall !== vars.oldLeftTooSmall || vars.rightTooSmall !== vars.oldRightTooSmall)
      }

      function calculateNodeAngles (node, index, nodeArray) {
        // check if node is on the right or left side
        var offset = node.lhs === true ? -1 : 1
        var nodeSize = 0

        // check if node is on the left
        if (node.lhs) {
          // check if node size is less than minimum
          if (node.size / totalLinkSize * _LHSAngleLeftAfterMinimum < minimumSizeLeft) {
            // set node size to be minimum
            nodeSize = totalLeftAvailableSize * minimumSizeLeft
          } else {
            // set node size to be modified based on available size
            nodeSize = ((node.size / totalLeftSize) * _LHSAngleLeftAfterMinimum) * totalLeftAvailableSize
          }
        } else {
          // do the same for the right side
          if (node.size / totalLinkSize * _RHSAngleLeftAfterMinimum < minimumSizeRight) {
            nodeSize = totalRightAvailableSize * minimumSizeRight
          } else {
            nodeSize = ((node.size / totalRightSize) * _RHSAngleLeftAfterMinimum) * totalRightAvailableSize
          }
        }

        // setup start and end angle
        node.startAngle = index === 0 ? offset * StretchedChord._arcStartAngle : (nodeArray[index - 1].endAngle + (offset * StretchedChord.nodeSeparationAngle()))
        node.endAngle = node.startAngle + (offset * nodeSize)

        // apply any colouring to the node
        node.colour = config.style.nodeColour
        node.stroke = config.style.nodeBorderColour
      }

      checkSizeCalculations();
      [StretchedChord._LHSnodes, StretchedChord._RHSnodes].forEach(arrayArray => (arrayArray.forEach(function (node, index, array) { calculateNodeAngles(node, index, array) })))

      // Do one final sort on the links to arrange them so that
      // the chord is linked from top down I.E top left to top right
      StretchedChord._links.sort(function (a, b) {
        var aSource = a._sourceNode.lhs === true ? a._sourceNode : a._targetNode
        var bSource = b._sourceNode.lhs === true ? b._sourceNode : b._targetNode
        if (aSource.startAngle > bSource.startAngle) { return -1 }
        if (aSource.startAngle < bSource.startAngle) { return 1 }
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
