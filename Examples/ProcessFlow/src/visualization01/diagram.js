import * as Graph from './jointjs-graph'
import * as Data from './process-data'
import * as Types from './element-types'
import * as Ports from './element-port-names'
import * as Sides from './jointjs-side-types'
import * as ActivityGroup from './group-label'
import * as FlowGroup from './flowGroups'
import * as Config from './flow-config'
import { OrientedDimensions, OrientedCoords } from './oriented'

function alignValueUp (value, gridSize) {
  return Math.floor((value + gridSize - 1) / gridSize) * gridSize
  // return value
}

function alignValueDown (value, gridSize) {
  return Math.floor(value / gridSize) * gridSize
  // return value
}

export class Diagram {
  constructor (process, style, width, height, visualizationData) {
    const elementId = visualizationData.config.element

    //
    // Set defaults for any missing configuration
    //
    const defaultMaxLabelSize = {
      width: 100,
      height: 60
    }
    const defaultRouterConfig = {
      coincidentLineSpace: 3,
      targetTolerance: 1
    }
    style.minimumSwimlaneHeight = style.minimumSwimlaneHeight === undefined ? 170 : style.minimumSwimlaneHeight
    style.verticalSwimlanes = style.verticalSwimlanes === undefined ? true : style.verticalSwimlanes
    const gridAlignedStyle = alignStyleToGrid(style)
    gridAlignedStyle.inputSwimlaneLabel = gridAlignedStyle.inputSwimlaneLabel || 'Inputs'
    gridAlignedStyle.outputSwimlaneLabel = gridAlignedStyle.outputSwimlaneLabel || 'Outputs'
    gridAlignedStyle.disableIOSwimlanes = gridAlignedStyle.disableIOSwimlanes === undefined
      ? false
      : gridAlignedStyle.disableIOSwimlanes
    gridAlignedStyle.maxFlowLabelSize = gridAlignedStyle.maxFlowLabelSize || defaultMaxLabelSize
    gridAlignedStyle.maxFlowLabelSize.width = gridAlignedStyle.maxFlowLabelSize.width ||
      defaultMaxLabelSize.width
    gridAlignedStyle.maxFlowLabelSize.height = gridAlignedStyle.maxFlowLabelSize.height ||
      defaultMaxLabelSize.height
    gridAlignedStyle.router = gridAlignedStyle.router || defaultRouterConfig
    gridAlignedStyle.router.coincidentLineSpace = gridAlignedStyle.router.coincidentLineSpace ||
      defaultRouterConfig.coincidentLineSpace
    gridAlignedStyle.router.targetTolerance = gridAlignedStyle.router.targetTolerance ||
      defaultRouterConfig.targetTolerance
    gridAlignedStyle.horizontalDecisionsAllowed = gridAlignedStyle.horizontalDecisionsAllowed === undefined
      ? true
      : gridAlignedStyle.horizontalDecisionsAllowed

    const containerSize = new OrientedDimensions(style.verticalSwimlanes)
    containerSize.setDimensions({ width, height })

    const drawProcessHeader = style.renderProcessHeader && style.verticalSwimlanes // only draw process heading for vertical swimlanes
    const drawWatermark = style.renderSwimlaneWatermarks
    const phaseLabelWidth = process.getPhaseSet().noPhases() === true ? 0 : gridAlignedStyle.phaseLabelWidth
    const numIOSwimlanes = gridAlignedStyle.disableIOSwimlanes ? 0 : 2
    const numSwimlanes = process.getActorSet().numSwimlanes() + numIOSwimlanes // allow for swim lanes for inputs and outputs
    const verticalSwimlaneWidth = alignValueDown((containerSize.width() - phaseLabelWidth - numIOSwimlanes * style.gridSize * 2) / // allow extra width for I/O lanes
                                                 numSwimlanes, style.gridSize)
    const swimlaneWidth = style.verticalSwimlanes ? verticalSwimlaneWidth : Math.max(verticalSwimlaneWidth, gridAlignedStyle.minimumSwimlaneHeight)
    const ioLaneWidth = gridAlignedStyle.disableIOSwimlanes ? 0 : swimlaneWidth + style.gridSize * 2
    const useableWidth = phaseLabelWidth + swimlaneWidth * process.getActorSet().numSwimlanes() + ioLaneWidth * 2
    gridAlignedStyle.swimlaneWidth = swimlaneWidth

    const diagramSize = new OrientedDimensions(style.verticalSwimlanes)
    diagramSize.setDimensions({
      width: useableWidth,
      height: 0 // Will be updated after height of diagram has been calculated
    })
    const dimensions = {
      verticalSwimlanes: style.verticalSwimlanes,
      gridSize: style.gridSize,
      processHeaderHeight: drawProcessHeader ? gridAlignedStyle.processHeaderHeight : 0,
      swimlaneWidth,
      swimlaneWatermarkSpacing: drawWatermark ? style.swimlaneWatermarkSpacing : 0,
      ioLaneWidth,
      phaseLabelWidth,
      stepGroupPadding: gridAlignedStyle.stepGroupPadding,
      flowLabelSize: gridAlignedStyle.maxFlowLabelSize,
      diagramSize
    }
    const htmlElements = {
      containerElement: elementId,
      processHeaderElement: '',
      diagramElement: ''
    }
    const phasedRowSet = new PhasedRowSet(process.getStepSet(), gridAlignedStyle)

    dimensions.diagramSize.setHeight(phasedRowSet.height())
    // console.log('Height: ' + dimensions.diagramSize.height())

    this.height = function () {
      return dimensions.processHeaderHeight +
      dimensions.diagramSize.height()
    }

    this.width = function () {
      return dimensions.diagramSize.width()
    }

    function alignStyleToGrid (style) {
      const alignedStyle = {
        ...style
      }
      const elementSizes = style.elementSizes
      for (const key in elementSizes) {
        alignedStyle.elementSizes[key] = {
          width: alignValueUp(elementSizes[key].width, 2 * style.gridSize),
          height: alignValueUp(elementSizes[key].height, 2 * style.gridSize)
        }
      }
      alignedStyle.verticalStepSeparation = alignValueUp(style.verticalStepSeparation, 2 * style.gridSize)
      alignedStyle.verticalIOSeparation = alignValueUp(style.verticalIOSeparation, style.gridSize)
      alignedStyle.minimumSwimlaneHeight = alignValueUp(style.minimumSwimlaneHeight, style.gridSize)
      // alignedStyle.stepStandoff = alignValueUp(style.stepStandoff, style.gridSize)
      // alignedStyle.ioStandoff = alignValueUp(style.ioStandoff, style.gridSize)
      alignedStyle.phaseLabelWidth = alignValueUp(style.phaseLabelWidth, style.gridSize)

      return alignedStyle
    }

    this.draw = function () {
      const el = document.getElementById(htmlElements.containerElement)
      // Mark container element with class to enable style override in CSS file
      el.classList.add('process-flow')
      //
      // Only draw process header if required.
      //
      if (dimensions.processHeaderHeight > 0) {
        layoutHeader(process, dimensions, el, htmlElements)
      }

      htmlElements.diagramElement = htmlElements.containerElement + '_diagram'
      const diagramEl = document.createElement('div')
      diagramEl.id = htmlElements.diagramElement
      el.appendChild(diagramEl)
      const diagramSize = dimensions.diagramSize

      const graph = new Graph.Graph(
        diagramEl,
        diagramSize.dimensions(),
        gridAlignedStyle.gridSize,
        gridAlignedStyle.elementSizes,
        {
          handleClickEvent: visualizationData.handleClickEvent,
          handleHighlighting: visualizationData.handleHighlighting,
          otherOffPageConnector: visualizationData.otherOffPageConnector
        },
        style.renderSwimlaneWatermarks,
        style.verticalSwimlanes)

      function layoutHeader (process, dimensions, containerElement, htmlElements) {
        htmlElements.processHeaderElement = htmlElements.containerElement + '_procHeader'

        const headerEl = document.createElement('div')
        containerElement.appendChild(headerEl)
        headerEl.classList.add('process-flow-header')
        headerEl.id = htmlElements.processHeaderElement
        headerEl.style.height = dimensions.processHeaderHeight + 'px'
        headerEl.style.width = dimensions.diagramSize.width() + 'px'

        const nameEl = document.createElement('span')
        nameEl.innerText = process.name()
        headerEl.appendChild(nameEl)

        const versionEl = document.createElement('span')
        versionEl.style.float = 'right'
        versionEl.innerText = 'Version: ' + process.version()
        headerEl.appendChild(versionEl)
      }

      return drawGraph(graph)
    }
    //
    // Draw the graph
    // In debug mode this function is called by the graph when it is ready to proceed
    //
    function drawGraph (graph) {
      layoutPhaseLabels(process.getPhaseSet(), phasedRowSet, dimensions)
      return layoutDiagram(process.getPhaseSet(), phasedRowSet, dimensions)

      function layoutPhaseLabels (phaseSet, phasedRowSet, dimensions) {
        if (phaseSet.noPhases() !== true) {
          const phasePosition = new OrientedCoords(dimensions.verticalSwimlanes)
          phasedRowSet.rowSets().forEach(function (rowSet) {
            const phaseSize = new OrientedDimensions(dimensions.verticalSwimlanes)
            phaseSize.setDimensions({ width: dimensions.phaseLabelWidth, height: rowSet.height() })
            graph.createLabel(
              rowSet.phase(),
              phaseSize.width(),
              phaseSize.height(),
              phasePosition.coords())
            phasePosition.increaseY(rowSet.height())
          })
        }
      }

      function checkPortConflicts () {
        const portConflicts = []
        phasedRowSet.rowSets().forEach(function (phase) {
          phase.rows().forEach(function (row) {
            row.steps().forEach(function (step) {
              let conflicts = false
              // console.log('Step ' + step.name())
              //
              // Inspect all output ports in use and see if the same port is used as input
              //
              const outputPorts = step.getOutputPorts()
              for (const sourcePortId in outputPorts) {
                // console.log('Port Id: ' + sourcePortId + ', output in use: ' + step.outputPortInUse(sourcePortId) + ', input in use: ' + step.inputPort(sourcePortId))
                if (step.outputPortInUse(sourcePortId) && step.inputPort(sourcePortId)) {
                  // console.log('Step "' + step.name() + '" has input and output flows using the same port')
                  conflicts = true
                }
              }
              if (conflicts) {
                portConflicts.push('Step "' + step.name() + '" has input and output flows using the same port')
              }
            })
          })
        })

        return portConflicts
      }

      function layoutDiagram (phaseSet, phasedRowSet, dimensions) {
        const startTime = Date.now()
        const style = phasedRowSet.style()

        const noPhases = phaseSet.noPhases()
        //
        // Create swimlane elements
        //
        getActorLanes(
          process.getActorSet(),
          dimensions,
          style)

        const swimlanes = getSwimlanes(
          process.getSwimlaneSet(),
          dimensions)

        const inputSwimlane = swimlanes[0]
        const outputSwimlane = swimlanes[numSwimlanes - 1]
        const swimlanePositions = swimlanes.map(function (lane) {
          const position = new OrientedCoords(dimensions.verticalSwimlanes)
          position.setCoords(lane.position())
          return position.coords()
        })
        const swimlaneSizes = swimlanes.map(function (lane) {
          const size = new OrientedDimensions(dimensions.verticalSwimlanes)
          size.setDimensions(lane.size())
          return size.dimensions()
        })
        const inputSwimlanePosition = swimlanePositions[0]
        const outputSwimlanePosition = swimlanePositions[numSwimlanes - 1]
        const inputSwimlaneSize = swimlaneSizes[0]
        const outputSwimlaneSize = swimlaneSizes[numSwimlanes - 1]
        //
        // Layout all steps, inputs and outputs for every phase
        //
        const phasePosition = new OrientedCoords(style.verticalSwimlanes)
        phasedRowSet.rowSets().forEach(function (phase) {
          const phaseHeight = phase.height()
          const phaseMarkerDimensions = new OrientedDimensions(style.verticalSwimlanes)
          phaseMarkerDimensions.setDimensions({ width: dimensions.diagramSize.width(), height: 1 })
          const phaseMarkerPosition = new OrientedCoords(style.verticalSwimlanes)
          phaseMarkerPosition.setY(phasePosition.logicalY() + phaseHeight - 1)

          if (noPhases !== true) {
            //
            // Draw phase marker
            //
            graph.createPhaseMarker(
              phase,
              phaseMarkerDimensions.width(),
              phaseMarkerDimensions.height(),
              phaseMarkerPosition.coords()
            )
          }
          //
          // Determine position of step elements
          //
          let rowPosition = phasePosition.logicalY()
          phase.rows().forEach(function (row) {
            // console.log('Row bottomMargin: ' + row.bottomMargin(1) + ', height: ' + row.height())
            row.steps().forEach(function (step) {
              const stepSize = step.logicalSize()
              const stepPosition = new OrientedCoords(style.verticalSwimlanes)
              stepPosition.setCoords({
                x: Math.floor(swimlanePositions[step.leftLaneIndex()].x +
                                    (swimlaneSizes[step.leftLaneIndex()].width *
                                     (step.rightLaneIndex() - step.leftLaneIndex() + 1) - stepSize.width) / 2),
                y: Math.floor(rowPosition + row.stepCentreVerticalOffset() - stepSize.height / 2)
              })
              step.setPosition(stepPosition)
              //
              // Determine position of step inputs
              //
              let ioPosition = Math.floor(rowPosition + row.stepCentreVerticalOffset() - step.inputsHeight() / 2)
              step.inputs().forEach(function (infoLink) {
                const infoSize = infoLink.information().logicalSize()
                const infoPosition = new OrientedCoords(style.verticalSwimlanes)
                infoPosition.setCoords({
                  x: Math.floor(inputSwimlanePosition.x +
                                        (inputSwimlaneSize.width - infoSize.width) / 2),
                  y: ioPosition
                })
                infoLink.information().setPosition(infoPosition)
                infoLink.information().setLaneIndex(0)

                ioPosition += infoSize.height + style.verticalIOSeparation
              })
              //
              // Determine position of step outputs
              //
              ioPosition = Math.floor(rowPosition + row.stepCentreVerticalOffset() - step.outputsHeight() / 2)
              step.outputs().forEach(function (infoLink) {
                const infoSize = infoLink.information().logicalSize()
                const infoPosition = new OrientedCoords(style.verticalSwimlanes)
                infoPosition.setCoords({
                  x: Math.floor(outputSwimlanePosition.x +
                                        (outputSwimlaneSize.width - infoSize.width) / 2),
                  y: ioPosition
                })
                infoLink.information().setPosition(infoPosition)
                infoLink.information().setLaneIndex(numSwimlanes - 1)

                ioPosition += infoSize.height + style.verticalIOSeparation
              })
            })

            rowPosition += row.height()
          })

          phasePosition.increaseY(phaseHeight)
        })
        //
        // Having determined the size and position of all the steps,
        // calculate the size and position of activity group rectangles
        //
        process.getStepGroupSet().calculateBounds(dimensions.stepGroupPadding)
        //
        // Layout activity group rectangles
        //
        process.getStepGroupSet().stepGroups().forEach(group => {
          //
          // Choose a free corner for the label position if one isn't specified
          //
          if (!group.labelPosition()) {
            group.setLabelPosition(group.freeCorner(style.verticalSwimlanes) || ActivityGroup.labelPositionDefault)
          }
          graph.createStepGroup(group)
        })
        //
        // Create step graph elements
        //
        phasedRowSet.rowSets().forEach(function (phase) {
          phase.rows().forEach(function (row) {
            row.steps().forEach(function (step) {
              const stepElement = graph.createElement(
                step,
                step.leftLaneIndex())
              swimlanes[step.leftLaneIndex()].addChild(stepElement)
              step.setGraphElement(stepElement)
              //
              // Create step input graph elements
              //
              step.inputs().forEach(function (infoLink) {
                const infoElement = graph.createElement(
                  infoLink.information(),
                  0)
                inputSwimlane.addChild(infoElement)
                infoLink.information().setGraphElement(infoElement)
              })
              //
              // Create step output graph elements
              //
              step.outputs().forEach(function (infoLink) {
                const infoElement = graph.createElement(
                  infoLink.information(),
                  numSwimlanes - 1)
                outputSwimlane.addChild(infoElement)
                infoLink.information().setGraphElement(infoElement)
              })
            })
          })
        })
        //
        // Build list of flows
        //
        const allFlows = []
        let assignedSequence = 1000000
        let assignedLabelledDownFlowSequence = 2000000
        let assignedLabelledUpFlowSequence = 3000000
        phasedRowSet.rowSets().forEach(function (phase) {
          phase.rows().forEach(function (row) {
            row.steps().forEach(function (step) {
              //
              // Add all flows from step to list
              //
              const outputPorts = step.getOutputPorts()
              for (const sourcePortId in outputPorts) {
                outputPorts[sourcePortId].groups().forEach(function (group) {
                  group.flows().forEach(function (flowData) {
                    //
                    // Record flow group and output port data
                    //
                    flowData.startDirection = outputPorts[sourcePortId].startDirection()
                    flowData.labelStandoff = flowData.flow.labelPosition()
                      ? flowData.flow.labelPosition()
                      : (group.shortestDistance() === 1 ? undefined : style.linkLabelStandoff)
                    flowData.sourcePortId = sourcePortId
                    flowData.labelText = (Math.abs(flowData.horizontalDistance) + Math.abs(flowData.verticalDistance)) === group.shortestDistance()
                      ? (flowData.flow.name() === undefined ? null : flowData.flow.name())
                      : null
                    //
                    // Set input port in flow target step
                    //
                    flowData.flow.target().addInputPort(flowData.targetPortId)
                    //
                    // Assign sequence number if not defined in source data
                    // Draw flows without labels first, then downward flows with labels
                    // and lastly upward flows with labels
                    // This ordering gives the best chance of labels appearing above all flow lines
                    //
                    if (!flowData.flow.sequence()) {
                      flowData.flow.setSequence(
                        flowData.labelText
                          ? flowData.flow.target().index() > flowData.flow.source().index()
                            ? assignedLabelledDownFlowSequence++
                            : assignedLabelledUpFlowSequence--
                          : assignedSequence++)
                    }
                    //
                    // Add flow to list
                    //
                    allFlows.push(flowData)
                  })
                })
              }
            })
          })
        })
        //
        // Check for input and output flow conflicts
        //
        const portConflicts = checkPortConflicts()
        //
        // Sort flows into drawing sequence
        //
        allFlows.sort((a, b) => a.flow.sequence() - b.flow.sequence())
        //
        // Create flow graph elements in drawing sequence
        //
        allFlows.forEach(function (flowData) {
          // console.log('From "' + flowData.flow.source().name() + '" to "' + flowData.flow.target().name() + '"')
          const graphFlow = graph.createFlow(
            flowData.flow,
            {
              stepStandoff: flowData.stepStandoff,
              labelStandoff: flowData.labelStandoff,
              labelMaxSize: style.maxFlowLabelSize,
              sourcePortId: flowData.sourcePortId,
              targetPortId: flowData.targetPortId,
              startDirections: [flowData.startDirection],
              endDirections: [flowData.endDirection],
              coincidentLineSpace: style.router.coincidentLineSpace,
              targetTolerance: style.router.targetTolerance,
              jumpOverOnHorizontalLines: style.router.jumpOverOnHorizontalLines,
              vertices: [],
              labelText: flowData.labelText
            })
          flowData.flow.setGraphElement(graphFlow)
        })
        //
        // Link inputs and outputs to steps
        //
        console.log('Link steps etc: ' + (Date.now() - startTime) / 1000)
        phasedRowSet.rowSets().forEach(function (phase) {
          phase.rows().forEach(function (row) {
            row.steps().forEach(function (step) {
              //
              // Link step to its inputs
              //
              const inputPortId = Ports.ioInputPort
              const inputPortPosition = step.graphElement().getPortPosition(inputPortId)
              const flowInPortId = Ports.flowCentreLeftPort
              const flowInPortPosition = step.graphElement().getPortPosition(flowInPortId)
              let flowOutPortId = Ports.flowCentreLeftPort
              let flowOutPortPosition = step.graphElement().getPortPosition(flowOutPortId)
              step.inputs().forEach(function (infoLink) {
                //
                // Choose input port to try to enter step at vertical centre
                //
                let portId = inputPortId
                let portPosition = inputPortPosition
                // Switch port if:
                // central flow input port exists and
                // that port is not in use as flow input, and
                // (port is not in same position as input port or output not in use)
                if (flowInPortPosition &&
                                     step.inputPort(flowInPortId) === false &&
                                     step.outputPort(flowOutPortId) === undefined) {
                  portId = flowInPortId
                  portPosition = flowInPortPosition
                }
                // Define points through which the link must flow
                // Default to point just inside RHS of Inputs swimlane
                let xPos = swimlanePositions[infoLink.information().laneIndex()].x +
                    swimlaneSizes[infoLink.information().laneIndex()].width - style.ioStandoff
                if (infoLink.name()) {
                  // Adjust points to separate input links with labels
                  xPos = swimlanePositions[step.leftLaneIndex()].x - style.ioStandoff
                }
                const logicalPortPosition = new OrientedCoords(style.verticalSwimlanes)
                const point1 = new OrientedCoords(style.verticalSwimlanes)
                const point2 = new OrientedCoords(style.verticalSwimlanes)
                logicalPortPosition.setCoords(portPosition)
                point1.setCoords({
                  x: xPos,
                  y: infoLink.information().logicalCentre().y
                })
                point2.setCoords({
                  x: xPos,
                  y: step.logicalPosition().y + logicalPortPosition.y()
                })
                const vertices = [{ // force link to pass through point just to right of Inputs swimlane
                  x: point1.x(),
                  y: point1.y()
                }, {
                  x: point2.x(),
                  y: point2.y()
                }]
                const graphLink = graph.createIOLink(
                  infoLink,
                  {
                    startDirections: [Sides.right],
                    targetPortId: portId,
                    labelMaxSize: style.maxFlowLabelSize,
                    coincidentLineSpace: style.router.coincidentLineSpace,
                    targetTolerance: style.router.targetTolerance,
                    jumpOverOnHorizontalLines: style.router.jumpOverOnHorizontalLines,
                    vertices
                  })
                infoLink.setGraphElement(graphLink)
              })
              //
              // Link step to its outputs
              //
              const outputPortId = Ports.ioOutputPort
              const outputPortPosition = step.graphElement().getPortPosition(outputPortId)
              flowOutPortId = Ports.flowCentreRightPort
              flowOutPortPosition = step.graphElement().getPortPosition(flowOutPortId)
              step.outputs().forEach(function (infoLink) {
                //
                // Define horizontal positions of points through which the link passes
                //
                let xPos = swimlanePositions[infoLink.information().laneIndex()].x + style.ioStandoff
                //
                // Choose output port according to type of flow
                //
                let portId = outputPortId
                let portPosition = outputPortPosition
                // Handle flow links
                if (infoLink.isFlow() === true) {
                  // Switch port if:
                  // Flow link and flow output port not in use, and
                  //    other port at vertical centre of step, or
                  //    step has other outputs
                  if (flowOutPortPosition && (step.outputPort(flowOutPortId) === undefined ||
                       step.outputPort(flowOutPortId).allFlows().length === 0) &&
                                        step.outputs().filter(output => output.isFlow() === false).length !== 0) {
                    // Switch ports
                    portId = flowOutPortId
                    portPosition = flowOutPortPosition
                  }
                  // Adjust first x position in order to split multiple flows and allow labels to separate
                  if (step.outputs().filter(output => output.isFlow()).length > 1) {
                    xPos = swimlanePositions[step.rightLaneIndex()].x +
                        swimlaneSizes[step.rightLaneIndex()].width + style.ioStandoff
                  }
                }
                const logicalPortPosition = new OrientedCoords(style.verticalSwimlanes)
                const point1 = new OrientedCoords(style.verticalSwimlanes)
                const point2 = new OrientedCoords(style.verticalSwimlanes)
                logicalPortPosition.setCoords(portPosition)
                point1.setCoords({
                  x: xPos,
                  y: step.logicalPosition().y + logicalPortPosition.y()
                })
                point2.setCoords({
                  x: xPos,
                  y: infoLink.information().logicalCentre().y
                })
                const vertices = [{ // force link to pass through point just to left of Outputs swimlane
                  x: point1.x(),
                  y: point1.y()
                }, {
                  x: point2.x(),
                  y: point2.y()
                }]
                const graphLink = graph.createIOLink(
                  infoLink,
                  {
                    sourcePortId: portId,
                    endDirections: [Sides.left],
                    labelMaxSize: style.maxFlowLabelSize,
                    coincidentLineSpace: style.router.coincidentLineSpace,
                    targetTolerance: style.router.targetTolerance,
                    jumpOverOnHorizontalLines: style.router.jumpOverOnHorizontalLines,
                    vertices
                  })
                infoLink.setGraphElement(graphLink)
              })
            })
          })
        })
        //
        // Add all the diagram elements to the graph
        //
        console.log('Ready to draw in ' + (Date.now() - startTime) / 1000 + ' secs')
        const drawingReport = graph.draw()
        drawingReport.portConflicts = portConflicts
        console.log('Completed drawing in ' + (Date.now() - startTime) / 1000 + ' secs')

        function getActorLanes (actorSet, dimensions, style) {
          const actorLanes = []
          const position = new OrientedCoords(style.verticalSwimlanes)
          position.setX(dimensions.phaseLabelWidth)
          const ioLaneDimensions = new OrientedDimensions(style.verticalSwimlanes)
          ioLaneDimensions.setDimensions({ width: dimensions.ioLaneWidth, height: dimensions.diagramSize.logicalHeight() })
          let index = 0
          //
          // Create lane for inputs
          //
          if (dimensions.ioLaneWidth > 0) {
            actorLanes.push(graph.createActorLane(
              null,
              style.inputSwimlaneLabel,
              ioLaneDimensions.width(),
              ioLaneDimensions.height(),
              index++,
              position.coords(),
              dimensions.swimlaneWatermarkSpacing))
            position.increaseX(ioLaneDimensions.logicalWidth())
          }
          //
          // Create lanes for the actors
          //
          actorSet.actors().forEach(function (actor) {
            const swimlaneDimensions = new OrientedDimensions(style.verticalSwimlanes)
            swimlaneDimensions.setDimensions({
              width: dimensions.swimlaneWidth * actor.numSwimlanes(),
              height: dimensions.diagramSize.logicalHeight()
            })
            actorLanes.push(graph.createActorLane(
              actor,
              actor.name(),
              swimlaneDimensions.width(),
              swimlaneDimensions.height(),
              index++,
              position.coords(),
              dimensions.swimlaneWatermarkSpacing))
            position.increaseX(swimlaneDimensions.logicalWidth())
          })
          //
          // Create lane for outputs
          //
          if (dimensions.ioLaneWidth > 0) {
            actorLanes.push(graph.createActorLane(
              null,
              style.outputSwimlaneLabel,
              ioLaneDimensions.width(),
              ioLaneDimensions.height(),
              index++,
              position.coords(),
              dimensions.swimlaneWatermarkSpacing))
          }

          return actorLanes
        }

        function getSwimlanes (swimlaneSet, dimensions) {
          const swimlanes = []
          const position = new OrientedCoords(dimensions.verticalSwimlanes)
          position.setX(dimensions.phaseLabelWidth)
          const ioLaneDimensions = new OrientedDimensions(dimensions.verticalSwimlanes)
          ioLaneDimensions.setDimensions({ width: dimensions.ioLaneWidth, height: dimensions.diagramSize.logicalHeight() })
          let index = 0
          //
          // Create swimlane for inputs
          //
          if (dimensions.ioLaneWidth > 0) {
            swimlanes.push(graph.createSwimlane(
              null,
              ioLaneDimensions.width(),
              ioLaneDimensions.height(),
              index++,
              position.coords()))
            position.increaseX(ioLaneDimensions.logicalWidth())
          }
          //
          // Create swimlanes for the actors
          //
          swimlaneSet.swimlanes().forEach(function (swimlane) {
            const swimlaneDimensions = new OrientedDimensions(dimensions.verticalSwimlanes)
            swimlaneDimensions.setDimensions({
              width: dimensions.swimlaneWidth,
              height: dimensions.diagramSize.logicalHeight()
            })
            swimlanes.push(graph.createSwimlane(
              swimlane,
              swimlaneDimensions.width(),
              swimlaneDimensions.height(),
              index++,
              position.coords()))
            position.increaseX(swimlaneDimensions.logicalWidth())
          })
          //
          // Create swimlane for outputs
          //
          if (dimensions.ioLaneWidth > 0) {
            swimlanes.push(graph.createSwimlane(
              null,
              ioLaneDimensions.width(),
              ioLaneDimensions.height(),
              index++,
              position.coords()))
          }

          return swimlanes
        }
        console.log('Draw diagram complete in ' + (Date.now() - startTime) / 1000 + ' seconds')
        return drawingReport
      }
    }
  }
}

let nextRowIndex = 0
class Row {
  /**
   *
   * @param {*} style
   * @param {Row} previousRow
   */
  constructor (style, previousRow) {
    const rowIndex = nextRowIndex++
    const steps = []
    let minLaneIndex = Infinity
    let maxLaneIndex = -Infinity
    let height = 0
    let topPadding = 0 // Padding / margin at top of row to allow for routing flows with larger than normal step Standoff
    const requiredPadding = [] // padding required between step in swimlane and the row above
    const dimensionsWorker = new OrientedDimensions(style.verticalSwimlanes)

    this.rowIndex = () => rowIndex
    this.height = () => height + topPadding
    this.phase = () => steps.length === 0 ? null : steps[0].phase()
    this.steps = () => steps
    this.stepCentreVerticalOffset = () => topPadding + Math.floor(height / 2)
    /**
     * Return the step in a swimlane or undefined if there is no step in the swimlane
     * @param {int} swimlaneIndex
     * @returns the step in the specified swimlane
     */
    this.step = function (swimlaneIndex) {
      const filteredSteps = steps.filter(step =>
        step.leftLaneIndex() <= swimlaneIndex && step.rightLaneIndex() >= swimlaneIndex)
      return filteredSteps ? filteredSteps[0] : undefined
    }
    /**
     * Update the padding at the top of the row to allow for an extra margin
     * If a margin is already set the larger of the existing or new margin is recorded
     * @param {int} margin the margin required in pixels
     */
    this.setTopPadding = function () {
      for (let i = 0; i < requiredPadding.length; i++) {
        if (requiredPadding[i]) {
          const previousRowSpace = previousRow ? previousRow.bottomMargin(i) : 0
          const margin = requiredPadding[i] - Math.floor(height / 2 + previousRowSpace)
          topPadding = Math.max(topPadding, margin)
        }
      }
    }
    /**
     * The margin at the bottom of the row in a specific swimlane
     * The margin is the space between the bottom of the step in the swimlane and the bottom of the row
     * When there is no step in the swimlane the margin is the height of the row
     * @param {int} swimlaneIndex the index of the swimlane
     * @returns {int} the margin in pixels
     */
    this.bottomMargin = function (swimlaneIndex) {
      const swimlaneStep = this.step(swimlaneIndex)
      const stepHeight = swimlaneStep ? swimlaneStep.size().height : 0
      return stepHeight === 0 ? this.height() : Math.floor((height - stepHeight) / 2)
    }
    /**
     * Record the minimum vertical space between the top of the step in the current row and the
     * bottom of any step in the row above.
     * Include an adjacent lane on one side of the step to account for wide steps / narrow lanes
     * @param {Data.Step} step the step in the current row requiring minimum vertical space
     * @param {string} adjacentLaneDirection the direction (left or right) from step of the adjacent row to include
     * @param {int} padding the space require in pixels to allow routing of flows to the step
     */
    function setPaddingRequired (step, adjacentLaneDirection, padding) {
      const startOffset = adjacentLaneDirection === Config.flowLeft ? -1 : 0
      const endOffset = adjacentLaneDirection === Config.flowLeft ? 0 : 1
      for (let i = step.leftLaneIndex() + startOffset; i <= step.rightLaneIndex() + endOffset; i++) {
        const currentRequirement = requiredPadding[i] ? requiredPadding[i] : 0
        requiredPadding[i] = Math.max(Math.floor(step.size().height / 2) + padding, currentRequirement)
      }
    }

    function invalidLinksInRow (newStep) {
      let invalidLinks = false
      //
      // See if any existing steps in the row have a link to the new step
      // and links would cross other steps in the row
      //
      steps.forEach(function (step) {
        if (step.flows().filter(flow => flow.target() === newStep).length > 0 ||
            newStep.flows().filter(flow => flow.target() === step).length > 0) {
          if ((newStep.fullLaneRange().max < minLaneIndex && step.fullLaneRange().min > minLaneIndex) ||
              (newStep.fullLaneRange().min > maxLaneIndex && step.fullLaneRange().max < maxLaneIndex)) {
            invalidLinks = true
          }
        }
        // Check if newStep targets an existing step on the same row
        // and the existing step has a flow back to the new step
        if (newStep.outFlows().filter(flow => flow.target() === step).length > 0 &&
            step.outFlows().filter(flow => flow.target() === newStep).length > 0) {
          invalidLinks = true
        }
      })

      return invalidLinks
    }
    /**
     * Checks if step is a decision the flows in and out are simple enough to render on the same row as another step
     * @param {Data.Step} newStep Step to check if it can be added to row
     * @param {Data.Step[]} existingSteps Array of step(s) already on the row
     * @param {boolean} horizontalDecisionsAllowed - Decision steps allowed to share row with other steps
     */
    function decisionStepOK (newStep, existingSteps, horizontalDecisionsAllowed) {
      let retVal = true
      if (!horizontalDecisionsAllowed) {
        retVal = !(newStep.isDecision() ||
          existingSteps[0].isDecision()) // don't allow a decision with other elements
      }

      return retVal
    }

    /**
     * Checks if swimlanes are too narrow to hold steps in adjoining lanes
     * @param {Data.Step} newStep
     */
    function tooClose (newStep) {
      let close = false
      //
      // Check if swimlanes are wider than step by a sufficient amount
      // style.elementSizes[infoLink.information().type()])
      const minDistanceRequired = 2 * (newStep.isDecision() ? 3 * style.stepStandoff : style.stepStandoff) + style.gridSize
      const newStepLaneRange = newStep.swimlaneRange()
      const newStepSpace = (style.swimlaneWidth - style.elementSizes[newStep.type()].width) / 2
      //
      // See if any existing steps in the row are in the next lane to the new step
      // and there is a flow between them
      // or one of the adjacent steps is a decision (likely to have flows coming out the side)
      //
      steps.forEach(function (step) {
        if ((step.swimlaneRange().max === newStepLaneRange.min - 1 ||
              step.swimlaneRange().min === newStepLaneRange.max + 1)) {
          const totalSpace = newStepSpace + (style.swimlaneWidth - style.elementSizes[step.type()].width) / 2
          // console.log('New step: ' + newStep.name() + ', space: ' + totalSpace + ', min dist: ' + minDistanceRequired)
          if (totalSpace <= minDistanceRequired &&
            ((newStep.flows().filter(flow => flow.target() === step).length > 0 ||
              step.flows().filter(flow => flow.target() === newStep).length > 0) ||
              (newStep.isDecision() || step.isDecision()))) {
            close = true
          }
        }
      })

      return close
    }
    /**
     * Check if a step is allowed to be added to this row
     * @param {Data.Step} step - the step to test
     * @param {boolean} horizontalStepsAllowed - multiple steps on a row are allowed
     * @param {boolean} horizontalDecisionsAllowed - Decision steps allowed to share row with other steps
     */
    this.stepAllowed = function (step, horizontalStepsAllowed, horizontalDecisionsAllowed) {
      let allowed
      if (steps.length === 0 || (
        horizontalStepsAllowed === true &&
                    !steps[steps.length - 1].preventSharingRow() &&
                    step.phase() === steps[0].phase() &&
                    step.group() === steps[0].group() && (
          step.fullLaneRange().min > maxLaneIndex ||
                      step.fullLaneRange().max < minLaneIndex
        ) &&
                    (invalidLinksInRow(step) === false) &&
                    !tooClose(step) &&
                    decisionStepOK(step, steps, horizontalDecisionsAllowed) && // check that a decision step is OK to add to the row
                    step.type() !== Types.offPageInput // don't allow an off page input connector to be added; preference is to be in same row as the step it flows into
      )) {
        allowed = true
        if (steps.length > 0) {
          // console.log('Step ' + step.name() + ' allowed on same row as ' + steps[steps.length - 1].name())
          // console.log(steps.length + ', ' + step.phase().name() + ', ' + step.actor().index() + ', ' + minLaneIndex + ', ' + maxLaneIndex)
        }
      } else {
        allowed = false
      }

      return allowed
    }

    /**
     * Add step to the row and update row height accordingly
     * @param {Data.Step} step - Step to add to row
     * @param {*} elementSizes - sizes of process element types
     * @param {int} verticalIOSeparation - vertical gap between input or output elements
     */
    this.addStep = function (step, style) {
      step.setRowIndex(rowIndex)
      steps.push(step)
      //
      // Maintain range of swimlanes occupied in row
      //
      minLaneIndex = Math.min(step.fullLaneRange().min, minLaneIndex)
      maxLaneIndex = Math.max(step.fullLaneRange().max, maxLaneIndex)
      //
      // Maintain height of row
      //
      const inputsHeight = IOHeight(step.inputs(), style, step.name(), 'input')
      step.setInputsHeight(inputsHeight)
      const outputsHeight = IOHeight(step.outputs(), style, step.name(), 'output')
      step.setOutputsHeight(outputsHeight)

      const rowHeight = Math.max(
        dimensionsWorker.orientedDimensions(step.size()).height + style.verticalStepSeparation,
        inputsHeight + style.verticalIOSeparation * 2,
        outputsHeight + style.verticalIOSeparation * 2)
      height = alignValueUp(Math.max(height, rowHeight), 2 * style.gridSize)
    }

    /**
     * Calculate height required for inputs or outputs
     * @param {Data.Information[]} information
     * @param {*} style
     * @param {String} stepName - name of the step with information
     * @param {String} infoType - type of information (input or output)
     */
    function IOHeight (information, style, stepName, infoType) {
      let height = 0
      information.forEach(function (infoLink) {
        //
        // Width and Height of elements are not rotated when drawing horizontal swimlanes
        // So create "oriented" dimensions that are not rotated with horizontal swimlanes
        //
        const infoSize = style.elementSizes[infoLink.information().type()]
        if (infoSize === undefined) {
          throw new Error('Step "' + stepName + '" has "' + infoType + '" "' + infoLink.information().name() + '" with unrecognised element type "' + infoLink.information().type() + '"')
        }
        const rotatedSize = new OrientedDimensions(style.verticalSwimlanes)
        rotatedSize.setDimensions(infoSize)
        const unrotatedSize = new OrientedDimensions(style.verticalSwimlanes)
        unrotatedSize.setDimensions(rotatedSize.dimensions())
        infoLink.information().setSize(unrotatedSize)
        height += infoLink.information().logicalSize().height
      })
      height += (information.length - 1) * style.verticalIOSeparation

      return height
    }
    /**
     * Return a compass direction from the vertical and horizontal directions
     * @param {*} verticalDirection
     * @param {*} horizontalDirection
     */
    function compassDirection (verticalDirection, horizontalDirection) {
      const verticalCompass = {
        [Config.flowNextDown]: 's',
        [Config.flowDown]: 's',
        [Config.flowUp]: 'n'
      }
      const horizontalCompass = {
        [Config.flowLeft]: 'w',
        [Config.flowRight]: 'e',
        [Config.flowHorizontalNone]: ''
      }

      return verticalCompass[verticalDirection] + horizontalCompass[horizontalDirection]
    }

    /**
     * Perform processing after all the flow ports have been identified
     *   Adjust step standoff distance for flows into decision steps from step on same row
     * @param {Data.Step} step
     */
    this.flowPostProcessing = function (step) {
      const source = step
      const outputPorts = step.getOutputPorts()
      for (const sourcePortId in outputPorts) {
        outputPorts[sourcePortId].groups().forEach(function (group) {
          group.flows().forEach(function (flowData) {
            const target = flowData.flow.target()
            const verticalDistance = Math.abs(source.rowIndex() - target.rowIndex())
            if (verticalDistance === 0 && target.isDecision()) {
              //
              // Test if target decision step has a flow out of the same side as the source
              //
              const targetFlowDirection = source.centralLaneIndex() > target.centralLaneIndex() ? Config.flowRight : Config.flowLeft
              const targetOutPortId = Config.preferredOutPort.decision[Config.flowVerticalNone][targetFlowDirection].port
              const isTargetOutPortInUse = target.outputPortInUse(targetOutPortId)
              if (isTargetOutPortInUse) {
                //
                // Force flow to decision from another step on the same row to have extra
                // stand off from steps to allow routing of flows out of the decision step
                //
                const stepStandoff = style.stepStandoff * 3
                flowData.stepStandoff = stepStandoff
                const minVerticalSpace = stepStandoff * 2 + style.gridSize * 2
                setPaddingRequired(target, targetFlowDirection, minVerticalSpace)
              }
            }
          })
        })
      }
    }
    /**
     * Identify the best combination of output ports for the flows from the step
     * @param {Data.Step} step
     * @param {Data.StepSet} stepSet
     */
    this.chooseFlowOutputPorts = function (step, stepSet) {
      const outputPorts = {}
      let port
      let flowCount = 0
      let offPageFlowCount = 0
      //
      // Loop through each flow and identify preference ignoring other flows
      //
      step.outFlows().forEach(function (flow) {
        const source = step
        let target
        let drawFlow
        if (flow.isOffPageConnection()) {
          target = flow.outputConnector()
          drawFlow = target.flows()[0]
          offPageFlowCount++
        } else {
          target = flow.target()
          drawFlow = flow
        }
        let flowVerticalDirection
        let flowHorizontalDirection
        const sourceStepType = source.isDecision() ? 'decision' : 'process'
        const targetStepType = target.isDecision() ? 'decision' : 'process'
        flowCount++
        //
        // Using the relative positions of the start and end of the flow
        // determine the sides of the step elements to connect to
        // Note: never use top for output, or bottom for input
        //
        if (source.rowIndex() < target.rowIndex()) {
          if (source.rowIndex() === target.rowIndex() - 1 ||
            stepSet.numInterveningSteps(source, target, Data.partitionCentre, false) === 0) {
            flowVerticalDirection = Config.flowNextDown
          } else {
            flowVerticalDirection = Config.flowDown
          }
        } else if (source.rowIndex() > target.rowIndex()) {
          flowVerticalDirection = Config.flowUp
        } else {
          flowVerticalDirection = Config.flowVerticalNone
        }

        const sourceLaneRange = source.swimlaneRange()
        const targetLaneRange = target.swimlaneRange()
        if (sourceLaneRange.max < targetLaneRange.min) {
          flowHorizontalDirection = Config.flowRight
        } else if (sourceLaneRange.min > targetLaneRange.max) {
          flowHorizontalDirection = Config.flowLeft
        } else {
          flowHorizontalDirection = Config.flowHorizontalNone
        }
        // console.log('step ' + source.name() + ' to ' + target.name() + ' x-dir ' + flowHorizontalDirection)
        let targetPortId
        let endDirection
        let sourcePortId
        let startDirection

        if (drawFlow.targetPort()) {
          // Use port reserved in process flow configuration data
          targetPortId = Config.inPortId[targetStepType][flowVerticalDirection][drawFlow.targetPort()]
          endDirection = drawFlow.targetPort()
        } else {
          // Use preferred port when port not reserved in process flow configuration data
          targetPortId = Config.preferredInPort[targetStepType][flowVerticalDirection][flowHorizontalDirection].port
          endDirection = Config.preferredInPort[targetStepType][flowVerticalDirection][flowHorizontalDirection].side
        }

        if (drawFlow.sourcePort()) {
          // Use port reserved in process flow configuration data
          sourcePortId = Config.outPortId[sourceStepType][flowVerticalDirection][drawFlow.sourcePort()]
          startDirection = drawFlow.sourcePort()
          // console.log('Flow from step "' + step.name() + '" is tied to port "' + drawFlow.sourcePort() + '"')
        } else {
          // Use preferred port when port not reserved in process flow configuration data
          sourcePortId = Config.preferredOutPort[sourceStepType][flowVerticalDirection][flowHorizontalDirection].port
          startDirection = Config.preferredOutPort[sourceStepType][flowVerticalDirection][flowHorizontalDirection].side
          //
          // If output is from bottom port flowing to another lane and there are intervening steps in the source lane
          // switch to side
          //
          if (startDirection === Sides.bottom) { // && flowHorizontalDirection !== Config.flowHorizontalNone) {
            const interveningSteps = flow.isOffPageConnection() ? offPageFlowCount - 1 : stepSet.numInterveningSteps(source, target, Config.partition[startDirection], false)
            // console.log('step ' + source.name() + ' to ' + target.name() + ' intervening ' + interveningSteps)
            if (interveningSteps > 0) {
              if (flowHorizontalDirection === Config.flowRight) {
                startDirection = Sides.right
                sourcePortId = source.isDecision() ? Ports.flowCentreRightPort : Ports.flowOutLowerRightPort
              } else {
                startDirection = Sides.left
                sourcePortId = source.isDecision() ? Ports.flowCentreLeftPort : Ports.flowOutLowerLeftPort
              }
            }
          }
          // console.log('step ' + source.name() + ' to ' + target.name() + ' source port ' + sourcePortId)
          //
          // If output is from a port on a side (not top or bottom), see if it would better coming out of the other side
          // If flow is downwards, switch to bottom port rather than other side
          //
          if (Config.onSide[startDirection] === true) {
            //
            // Only consider flows that travel further than 1 row and between different swimlanes
            // or the same swimlane of the flow is going down or target is a decision step.
            // (Upward flows to process step would have to cross over swimlane to reach input)
            //
            if ((Math.abs(source.rowIndex() - target.rowIndex()) > 1 &&
                (flowHorizontalDirection !== Config.flowHorizontalNone || flowVerticalDirection === Config.flowDown)) ||
                target.isDecision()) {
              const interveningStepsThisSide = flow.isOffPageConnection() ? 0 : stepSet.numInterveningSteps(source, target, Config.partition[startDirection], false)
              const interveningStepsOtherSide = flow.isOffPageConnection() ? 0 : stepSet.numInterveningSteps(source, target, Config.partition[Config.otherSide[startDirection]], false)
              // console.log('step ' + source.name() + ' to ' + target.name() + ' intervening steps this side ' + interveningStepsThisSide + ' other side ' + interveningStepsOtherSide)

              if (interveningStepsThisSide > interveningStepsOtherSide) {
                if (flowVerticalDirection === Config.flowDown) {
                  const interveningStepsBeneath = flow.isOffPageConnection() ? offPageFlowCount - 1 : stepSet.numInterveningSteps(source, target, Config.partition[startDirection], true)
                  if (interveningStepsBeneath > 0) {
                    sourcePortId = Ports.oppositePorts[sourcePortId]
                    startDirection = Config.otherSide[startDirection]
                  } else {
                    sourcePortId = Ports.flowOutBottomPort
                    startDirection = Sides.bottom
                  }
                } else {
                  sourcePortId = Ports.oppositePorts[sourcePortId]
                  startDirection = Config.otherSide[startDirection]
                }
              }
            }
          }
        }
        // console.log('step ' + source.name() + ' to ' + target.name() + ' source port ' + sourcePort)
        //
        // Record details of preferred port for the flow
        //
        if (!outputPorts[sourcePortId]) {
          outputPorts[sourcePortId] = new FlowGroup.FlowGroupSet(sourcePortId, startDirection)
        }
        const verticalDistance = Math.abs(source.rowIndex() - target.rowIndex())
        const horizontalDistance = verticalDistance > 0
          ? Math.abs(source.centralLaneIndex() - target.centralLaneIndex())
          : Math.min(Math.abs(source.swimlaneRange().max - target.swimlaneRange().min), Math.abs(source.swimlaneRange().min - target.swimlaneRange().max))
        outputPorts[sourcePortId].addFlow({
          flow: drawFlow,
          stepStandoff: style.stepStandoff,
          targetPortId,
          endDirection,
          flowVerticalDirection,
          flowHorizontalDirection,
          verticalDistance,
          horizontalDistance,
          compassDirection: compassDirection(flowVerticalDirection, flowHorizontalDirection)
        }, drawFlow.name())
      })
      //
      // For decision steps, reallocate ports where there is more than one flow from the port
      //
      if (step.isDecision()) {
        let conflicts
        let conflictsExisted = false
        let loopCount = 0
        do {
          conflicts = false
          for (port in outputPorts) {
            if (outputPorts[port].length() > 1) {
              // console.log('Step ' + step.name() + ' conflict on port ' + port)
              conflicts = true
              conflictsExisted = true

              outputPorts[port].sort()

              const candidate = outputPorts[port].pop()
              if (candidate.isReservedPort()) {
                // do not move flow if it is tied to this port
                // so put it back
                outputPorts[port].addFlowGroup(candidate)
                // console.log('Do not move flow group tied to port')
              } else {
                const newPort = Config.alternativeDecisionOutPort[port].port
                const newSide = Config.alternativeDecisionOutPort[port].side
                // console.log('Move flow group "' + candidate.groupSpecifier + '" in step "' + step.name() + '" from "' + port + '" to "' + newPort + '"')

                if (!outputPorts[newPort]) {
                  outputPorts[newPort] = new FlowGroup.FlowGroupSet(newPort, newSide)
                }
                outputPorts[newPort].addFlowGroup(candidate)
              }
            }
            // }
          }
          loopCount++
        } while (conflicts && loopCount < flowCount)

        if (conflictsExisted && outputPorts[Ports.flowOutBottomPort]) {
          //
          // If bottom output port in use then see if the flow is upward
          // This will be the case if the upward flow has been moved from a side output port to resolve conflict,
          // hence the side output port is an upward flow too
          // Check if other side output flow is downward and if so swap them
          //
          const bottomFlowGroup = outputPorts[Ports.flowOutBottomPort].groups()[0]
          if (!bottomFlowGroup.isReservedPort() && FlowGroup.similarCompassDirection(bottomFlowGroup.averageDirection(), 'n')) {
            const alternativePort = Config.alternativeDecisionOutPort[Ports.flowOutBottomPort].port
            const alternativeFlowGroup = outputPorts[alternativePort] ? outputPorts[alternativePort].groups()[0] : undefined

            if (alternativeFlowGroup && !alternativeFlowGroup.isReservedPort() &&
                FlowGroup.similarCompassDirection(alternativeFlowGroup.averageDirection(), 's')) {
              outputPorts[Ports.flowOutBottomPort].pop()
              outputPorts[alternativePort].pop()
              outputPorts[Ports.flowOutBottomPort].addFlowGroup(alternativeFlowGroup)
              outputPorts[alternativePort].addFlowGroup(bottomFlowGroup)
            }
          }
        }

        // if conflicts is true then fail drawing???
      }

      return outputPorts
    }
  }
}

class RowSet {
  constructor (style) {
    let previousRow
    let currentRow = new Row(style, previousRow)
    const rows = [currentRow]
    let phase
    const pendingOffPageConnectors = []

    this.rows = () => rows
    this.phase = () => phase

    /**
     * Add the step to the row set. The step is added to the current row if allowed
     * or placed on a new row if not.
     * Off Page Output Connector steps are buffered up to allow the subsequent steps to share
     * the same row as the step that the output connector flows out of
     * @param {Data.Step} step
     */
    this.addStep = function (step) {
      if (step.type() === Types.offPageOutput) {
        // Don't add off page output connectors immediately
        // Record them and add when forced to move to the next row
        // Note: it is assumed that the output connector cannot share the row
        // with the step it flows out of
        pendingOffPageConnectors.push(step)
      } else {
        while (!currentRow.stepAllowed(step, style.horizontalStepsAllowed, style.horizontalDecisionsAllowed)) {
          // Move to next row
          previousRow = currentRow
          currentRow = new Row(style, previousRow)
          rows.push(currentRow)
          // Add any pending off page output connectors that are allowed to be added to the new row
          let i = 0
          while (i < pendingOffPageConnectors.length) {
            if (currentRow.stepAllowed(pendingOffPageConnectors[i], style.horizontalStepsAllowed, style.horizontalDecisionsAllowed)) {
              currentRow.addStep(pendingOffPageConnectors[i], style, style.horizontalDecisionsAllowed)
              pendingOffPageConnectors.splice(i, 1)
            } else {
              i++
            }
          }
        }
        // Add step to the current row
        currentRow.addStep(step, style, style.horizontalDecisionsAllowed)
        phase = currentRow.phase()
      }
    }

    /**
     * Add any buffered Off Page Output Connectors to the end of the RowSet
     * This function should be called after adding all the steps in the phase
     */
    this.addPendingConnectors = function () {
      while (pendingOffPageConnectors.length > 0) {
        let i = 0
        // Loop to add all the pending connectors that can be added to the current row
        while (i < pendingOffPageConnectors.length) {
          if (currentRow.stepAllowed(pendingOffPageConnectors[i], style.horizontalStepsAllowed, style.horizontalDecisionsAllowed)) {
            currentRow.addStep(pendingOffPageConnectors[i], style, style.horizontalDecisionsAllowed)
            pendingOffPageConnectors.splice(i, 1)
          } else {
            i++
          }
        }
        // If there are still pending connectors create a new row to add them to
        if (pendingOffPageConnectors.length > 0) {
          // Move to next row
          previousRow = currentRow
          currentRow = new Row(style, previousRow)
          rows.push(currentRow)
        }
      }
    }

    this.height = function () {
      const rowHeights = rows.reduce((accumulator, row) => accumulator + row.height(),
        0)
      return rowHeights
    }
  }
}

class PhasedRowSet {
  /**
     *
     * @param {Data.StepSet} stepSet
     * @param {*} style
     */
  constructor (stepSet, style) {
    let currentPhase
    let currentRowSet
    const phasedRowSets = []
    //
    // Add steps and split into phases
    //
    stepSet.steps().forEach(function (step) {
      if (step.phase() !== currentPhase) {
        if (currentRowSet) {
          currentRowSet.addPendingConnectors()
        }
        phasedRowSets.push(new RowSet(style))
        currentPhase = step.phase()
        currentRowSet = phasedRowSets[phasedRowSets.length - 1]
      }
      //
      // Insert off page input connector steps
      //
      step.flows()
        .filter(flow => flow.isOffPageConnection() && flow.target() === step && flow.inputConnector())
        .forEach(flow => {
          const connectorStep = flow.inputConnector()
          const connectorSize = style.elementSizes[connectorStep.type()]
          if (connectorSize === undefined) {
            throw new Error('Step "' + connectorStep.name() + '" has unrecognised element type "' + connectorStep.type() + '"')
          }
          //
          // Width and Height of elements are not rotated when drawing horizontal swimlanes
          // So create "oriented" dimensions that are not rotated with horizontal swimlanes
          //
          const rotatedSize = new OrientedDimensions(style.verticalSwimlanes)
          rotatedSize.setDimensions(connectorSize)
          const unrotatedSize = new OrientedDimensions(style.verticalSwimlanes)
          unrotatedSize.setDimensions(rotatedSize.dimensions())
          connectorStep.setSize(unrotatedSize)
          currentRowSet.addStep(connectorStep)
        })
      const stepSize = style.elementSizes[step.type()]
      if (stepSize === undefined) {
        throw new Error('Step "' + step.name() + '" has unrecognised element type "' + step.type() + '"')
      }
      //
      // Width and Height of elements are not rotated when drawing horizontal swimlanes
      // So create "oriented" dimensions that are not rotated with horizontal swimlanes
      //
      const rotatedSize = new OrientedDimensions(style.verticalSwimlanes)
      rotatedSize.setDimensions(stepSize)
      const unrotatedSize = new OrientedDimensions(style.verticalSwimlanes)
      unrotatedSize.setDimensions(rotatedSize.dimensions())
      //
      // Extend logical width of step if owned by more than one actor / in multiple swimlanes.
      // N.B. multiple swimlanes have been checked to ensure that they are contiguous
      //
      unrotatedSize.increaseWidth((step.swimlanes().length - 1) * style.swimlaneWidth)
      step.setSize(unrotatedSize)
      currentRowSet.addStep(step)
      //
      // Insert off page output connector steps
      //
      step.flows()
        .filter(flow => flow.isOffPageConnection() && flow.source() === step)
        .forEach(flow => {
          const connectorStep = flow.outputConnector()
          const connectorSize = style.elementSizes[connectorStep.type()]
          if (connectorSize === undefined) {
            throw new Error('Step "' + connectorStep.name() + '" has unrecognised element type "' + connectorStep.type() + '"')
          }
          //
          // Width and Height of elements are not rotated when drawing horizontal swimlanes
          // So create "oriented" dimensions that are not rotated with horizontal swimlanes
          //
          const rotatedSize = new OrientedDimensions(style.verticalSwimlanes)
          rotatedSize.setDimensions(connectorSize)
          const unrotatedSize = new OrientedDimensions(style.verticalSwimlanes)
          unrotatedSize.setDimensions(rotatedSize.dimensions())
          connectorStep.setSize(unrotatedSize)
          currentRowSet.addStep(connectorStep)
        })
    })
    if (currentRowSet) {
      currentRowSet.addPendingConnectors()
    }
    //
    // Link steps with flows
    //
    phasedRowSets.forEach(function (phase) {
      phase.rows().forEach(function (row) {
        row.steps().forEach(function (step) {
          //
          // Link flow elements
          //
          // const outputPorts = row.chooseFlowOutputPorts(step, stepSet)
          // console.log('Step: ' + step.name() + ' outputPorts: ' + JSON.stringify(outputPorts))
          step.setOutputPorts(row.chooseFlowOutputPorts(step, stepSet))
        })
      })
    })
    //
    // Perform post port selection processing
    //
    phasedRowSets.forEach(function (phase) {
      phase.rows().forEach(function (row) {
        row.steps().forEach(function (step) {
          row.flowPostProcessing(step)
        })
        row.setTopPadding()
      })
    })

    this.rowSets = () => phasedRowSets

    this.height = function () {
      const rowSetHeights = phasedRowSets.reduce((accumulator, rowSet) => accumulator + rowSet.height(),
        0)
      return rowSetHeights
    }

    this.style = function () {
      return style
    }
  }
}
