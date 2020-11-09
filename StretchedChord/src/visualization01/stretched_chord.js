export class StretchedChord {
  constructor (config) {
    const StretchedChord = this

    const width = parseFloat(config.width)
    StretchedChord.width = () => width
    const height = parseFloat(config.height)
    StretchedChord.height = () => height
    const arcThickness = config.style.arcThickness
    StretchedChord.arcThickness = () => arcThickness
    const arcCentreSeparation = config.style.arcCentreSeparation
    StretchedChord.arcCentreSeparation = () => arcCentreSeparation
    const labelMargin = config.style.labelMargin
    StretchedChord.labelMargin = () => labelMargin
    const labelOffset = config.style.labelOffset
    StretchedChord.labelOffset = () => labelOffset
    const labelFontSize = config.style.labelFontSize
    StretchedChord.labelFontSize = () => labelFontSize
    const labelFontFamily = config.style.labelFontFamily
    StretchedChord.labelFontFamily = () => labelFontFamily

    const arcHeight = height - config.style.headerHeight - config.style.footerHeight
    const arcWidth = width - arcCentreSeparation - 2 * labelMargin
    const maxDimension = Math.max(arcHeight, arcWidth)
    const minDimension = Math.min(arcHeight, arcWidth)
    //
    // Constrain arc angle by viewing area aspect ratio
    // Only a square view will display a full sem-circle
    //
    const arcStartAngle = 2 * Math.atan(maxDimension / minDimension) - Math.PI / 2
    StretchedChord.arcStartAngle = () => arcStartAngle
    //
    // Calculate the radius of the arc to fit the size of the view area
    //
    const outerRadius = minDimension / 2 /
      (1 - Math.cos(Math.PI / 2 - arcStartAngle)) *
      arcHeight / maxDimension
    StretchedChord.outerRadius = () => outerRadius
      //
    // Calculate the horizontal offset of the LHS arc centre from centre of view area
    // The RHS arc centre offset is -1 * this
    //
    const arcCentreOffset = labelMargin + outerRadius - width / 2
    StretchedChord.arcCentreOffset = () => arcCentreOffset

    const innerRadius = outerRadius - arcThickness
    StretchedChord.innerRadius = () => innerRadius

    const nodeSeparationAngle = config.style.nodeSeparation / innerRadius
    StretchedChord.nodeSeparationAngle = () => nodeSeparationAngle

    const flowPeriod = config.style.flowPeriod
    StretchedChord.flowPeriod = () => flowPeriod
    const flowOpacity = config.style.flowOpacity
    StretchedChord.flowOpacity = () => flowOpacity
    //
    // Calculate offsets from centre of view area to left boundary of label areas
    // The LHS boundary would need to change to right boundary if right aligning LHS labels
    //
    const lhsLabelOffset = arcCentreOffset
    StretchedChord.lhsLabelOffset = () => lhsLabelOffset
    const rhsLabelOffset = -lhsLabelOffset
    StretchedChord.rhsLabelOffset = () => rhsLabelOffset

    this.dataChanged = function dataChanged () {
      // store nodes in a dictionary for fast lookup
      var nodeDict = {}

      // Copy RHS nodes from configuration data
      const rhsNodes = config.data.RHSnodes.map(function (node, index) {
        // setup node details and add it to the node dictionary for use with links
        node.size = 0
        node.sizeIn = 0
        node.sizeOut = 0
        node.lastLinkEndAngle = 0
        node.lhs = false
        node.order = index
        nodeDict[node.id] = nodeDict[node.id] === undefined ? node : nodeDict[node.id]
        return node
      })
      StretchedChord.rhsNodes = () => rhsNodes

      // Copy LHS nodes from configuration data
      const lhsNodes = config.data.LHSnodes.map(function (node, index) {
        // setup node details and add it to the node dictionary for use with links
        node.size = 0
        node.sizeIn = 0
        node.sizeOut = 0
        node.lastLinkEndAngle = 0
        node.lhs = true
        node.order = index
        nodeDict[node.id] = nodeDict[node.id] === undefined ? node : nodeDict[node.id]
        return node
      })
      StretchedChord.lhsNodes = () => lhsNodes

      var totalLinkSize = 0

      // Copy links from configuration
      const links = config.data.links.map(function (l) {
        // lookup source and target nodes
        l.sourceNode = nodeDict[l.source.id]
        l.targetNode = nodeDict[l.target.id]

        // make sure both nodes aren't left hand side
        if (l.sourceNode !== undefined && l.targetNode !== undefined && l.sourceNode.lhs !== l.targetNode.lhs) {
          // update total size
          totalLinkSize += l.size

          // add onto node size
          l.sourceNode.size += l.size
          l.sourceNode.sizeOut += l.size
          l.targetNode.size += l.size
          l.targetNode.sizeIn += l.size
          return l
        }

        // finally filter out all nulls
        return null
      }).filter(l => (l != null)).sort(function (a, b) {
        // arrange links based on node position to allow for better connection/less crossing
        const aRHS = a.targetNode.lhs === false ? a.targetNode : a.sourceNode
        const aLHS = a.targetNode.lhs === true ? a.targetNode : a.sourceNode
        const bRHS = b.targetNode.lhs === false ? b.targetNode : b.sourceNode
        const bLHS = b.targetNode.lhs === true ? b.targetNode : b.sourceNode
        var comparison
        if (aRHS.order === bRHS.order) {
          comparison = aLHS.order - bLHS.order
        }
        else {
          comparison = aRHS.order - bRHS.order
        }
        return comparison
      })
      StretchedChord.links = () => links

      function calculateLinkAngles (link, sourceOrTarget) {
        // if first link on node then start at node start
        var node = sourceOrTarget === 'source' ? link.sourceNode : link.targetNode
        const adjustedOffset = node.lhs ? -arcCentreOffset : arcCentreOffset

        if (node.lastLinkEndAngle === 0) {
          link[sourceOrTarget].startAngle = node.startAngle
        } else {
          link[sourceOrTarget].startAngle = node.lastLinkEndAngle
        }

        // calculate link end position and update the last position on Node
        link[sourceOrTarget].endAngle = link[sourceOrTarget].startAngle + ((node.endAngle - node.startAngle) * (link.size / node.size))
        node.lastLinkEndAngle = link[sourceOrTarget].endAngle

        // calculate coordinates of link on node inner arc
        link[sourceOrTarget].startPos = [innerRadius * Math.sin(link[sourceOrTarget].startAngle) - adjustedOffset, -innerRadius * Math.cos(link[sourceOrTarget].startAngle)]
        link[sourceOrTarget].endPos = [innerRadius * Math.sin(link[sourceOrTarget].endAngle) - adjustedOffset, -innerRadius * Math.cos(link[sourceOrTarget].endAngle)]
      }

      // setup variables for node size calculations
      var totalLeftAvailableAngle = (Math.PI - 2 * arcStartAngle - (StretchedChord.nodeSeparationAngle() * (lhsNodes.length - 1)))
      var totalRightAvailableAngle = (Math.PI - 2 * arcStartAngle - (StretchedChord.nodeSeparationAngle() * (rhsNodes.length - 1)))
      var minimumSizeRightProportion = (config.style.minimumNodeSizePercentage / 100)
      var minimumSizeLeftProportion = (config.style.minimumNodeSizePercentage / 100)

      var leftSizeUsed = 0
      var rightSizeUsed = 0
      var lhsMinimumProportionAdjustment = 1
      var rhsMinimumProportionAdjustment = 1

      function calculateNodeSizing (node, vars) {
        // store current node percentage size for easier typing
        var nodeSizeProportionOfTotal = node.size / totalLinkSize

        // check if node is left hand side
        if (node.lhs) {
          // check if node size is less than minimum
          if (nodeSizeProportionOfTotal * lhsMinimumProportionAdjustment < minimumSizeLeftProportion) {
            vars.leftTooSmall++
          } else {
            // add node to size calculations
            leftSizeUsed += node.size
          }
        } else {
          if (nodeSizeProportionOfTotal * rhsMinimumProportionAdjustment < minimumSizeRightProportion) {
            vars.rightTooSmall++
          } else {
            rightSizeUsed += node.size
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
          if (vars.leftTooSmall * minimumSizeLeftProportion > 1) {
            do {
              minimumSizeLeftProportion *= 0.99
            } while (vars.leftTooSmall * minimumSizeLeftProportion > 1 && minimumSizeLeftProportion > 0.001)
            minimumSizeLeftProportion = minimumSizeLeftProportion * vars.leftTooSmall > 1 ? 0 : minimumSizeLeftProportion
          }

          // do the same for the right side
          if (vars.rightTooSmall * minimumSizeRightProportion > 1) {
            do {
              minimumSizeRightProportion *= 0.99
            } while (vars.rightTooSmall * minimumSizeRightProportion > 1 && minimumSizeRightProportion > 0.001)
            minimumSizeRightProportion = minimumSizeRightProportion * vars.rightTooSmall > 1 ? 0 : minimumSizeRightProportion
          }

          // calculate remaining total size modifier
          lhsMinimumProportionAdjustment = 1 - (vars.leftTooSmall * minimumSizeLeftProportion)
          rhsMinimumProportionAdjustment = 1 - (vars.rightTooSmall * minimumSizeRightProportion)

          // update past loop variables
          vars.oldLeftTooSmall = vars.leftTooSmall
          vars.oldRightTooSmall = vars.rightTooSmall
          vars.leftTooSmall = 0
          vars.rightTooSmall = 0

          // reset variables used during this loop
          leftSizeUsed = 0
          rightSizeUsed = 0;

          // check minimum sizes are fine with every node
          [lhsNodes, rhsNodes].forEach(arrayArray => (arrayArray.forEach(function (node) { calculateNodeSizing(node, vars) })))
        } while (vars.leftTooSmall !== vars.oldLeftTooSmall || vars.rightTooSmall !== vars.oldRightTooSmall)
      }

      function calculateNodeAngles (node, index, nodeArray) {
        // check if node is on the right or left side
        var offset = node.lhs === true ? -1 : 1
        var nodeSize = 0

        // check if node is on the left
        if (node.lhs) {
          // check if node size is less than minimum
          if (node.size / totalLinkSize * lhsMinimumProportionAdjustment < minimumSizeLeftProportion) {
            // set node size to be minimum
            nodeSize = totalLeftAvailableAngle * minimumSizeLeftProportion
          } else {
            // set node size to be modified based on available size
            nodeSize = ((node.size / leftSizeUsed) * lhsMinimumProportionAdjustment) * totalLeftAvailableAngle
          }
        } else {
          // do the same for the right side
          if (node.size / totalLinkSize * rhsMinimumProportionAdjustment < minimumSizeRightProportion) {
            nodeSize = totalRightAvailableAngle * minimumSizeRightProportion
          } else {
            nodeSize = ((node.size / rightSizeUsed) * rhsMinimumProportionAdjustment) * totalRightAvailableAngle
          }
        }

        // setup start and end angle
        node.startAngle = index === 0 ? offset * arcStartAngle : (nodeArray[index - 1].endAngle + (offset * StretchedChord.nodeSeparationAngle()))
        node.endAngle = node.startAngle + (offset * nodeSize)

        // apply any colouring to the node
        node.colour = config.style.nodeColour
        node.stroke = config.style.nodeBorderColour
      }

      checkSizeCalculations();
      [lhsNodes, rhsNodes].forEach(arrayArray => (arrayArray.forEach(function (node, index, array) { calculateNodeAngles(node, index, array) })))

      // Do one final sort on the links to arrange them so that
      // the chord is linked from top down I.E top left to top right
      links.sort(function (a, b) {
        var aSource = a.sourceNode.lhs === true ? a.sourceNode : a.targetNode
        var bSource = b.sourceNode.lhs === true ? b.sourceNode : b.targetNode
        if (aSource.startAngle > bSource.startAngle) { return -1 }
        if (aSource.startAngle < bSource.startAngle) { return 1 }
        return 0
      })

      // calculate start and end angle for links
      links.forEach(function (l) {
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
