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

      function calculateNodeSizing (node, vars) {
        // store current node percentage size for easier typing
        var nodeSizeProportionOfTotal = node.size / totalLinkSize

        // check if node size is less than minimum
        if (nodeSizeProportionOfTotal * vars.minimumProportionAdjustment < vars.minimumSizeProportion) {
          vars.tooSmall++
        } else {
          // add node to size calculations
          vars.sizeUsed += node.size
        }
      }

      function checkSideSizeCalculations (nodes) {
        // store past variables between loops
        var totalAvailableAngle = (Math.PI - 2 * arcStartAngle - (StretchedChord.nodeSeparationAngle() * (nodes.length - 1)))
        var vars = {
          oldTooSmall: 0,
          tooSmall: 0,
          sizeUsed: totalAvailableAngle,
          minimumProportionAdjustment: 1,
          minimumSizeProportion: config.style.minimumNodeSizePercentage / 100
        }
  
        do {
          if (vars.tooSmall * vars.minimumSizeProportion > 1 || vars.sizeUsed === 0) {
            // Minimum percentage configured is too large for data
            // All nodes will be equal size
            vars.minimumSizeProportion = 1 / vars.tooSmall
          }

          // calculate remaining total size modifier
          vars.minimumProportionAdjustment = 1 - (vars.tooSmall * vars.minimumSizeProportion)

          // update past loop variables
          vars.oldTooSmall = vars.tooSmall
          vars.tooSmall = 0

          // reset variables used during this loop
          vars.sizeUsed = 0

          // check minimum sizes are fine with every node
          nodes.forEach(function (node) { calculateNodeSizing(node, vars) })
        } while (vars.tooSmall !== vars.oldTooSmall)

        return {
          totalAvailableAngle: totalAvailableAngle,
          minimumSizeProportion: vars.minimumSizeProportion,
          minimumProportionAdjustment: vars.minimumProportionAdjustment,
          sizeUsed: vars.sizeUsed
        }
      }

      function calculateNodeAngles (node, index, nodeArray, sizeControl) {
        // check if node is on the right or left side
        var offset = node.lhs === true ? -1 : 1
        var nodeSize = 0

        // check if node size is less than minimum
        if (node.size / totalLinkSize * sizeControl.minimumProportionAdjustment < sizeControl.minimumSizeProportion) {
          // set node size to be minimum
          nodeSize = sizeControl.totalAvailableAngle * sizeControl.minimumSizeProportion
        } else {
          // set node size to be modified based on available size
          nodeSize = ((node.size / sizeControl.sizeUsed) * sizeControl.minimumProportionAdjustment) * sizeControl.totalAvailableAngle
        }

        // setup start and end angle
        node.startAngle = index === 0 ? offset * arcStartAngle : (nodeArray[index - 1].endAngle + (offset * StretchedChord.nodeSeparationAngle()))
        node.endAngle = node.startAngle + (offset * nodeSize)

        // apply any colouring to the node
        node.colour = config.style.nodeColour
        node.stroke = config.style.nodeBorderColour
      }

      [lhsNodes, rhsNodes].forEach(nodes => {
        var sizeControl = checkSideSizeCalculations(nodes)
        nodes.forEach(function (node, index, array) { calculateNodeAngles(node, index, array, sizeControl) })
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
