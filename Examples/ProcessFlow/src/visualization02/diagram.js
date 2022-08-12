import { OrientedDimensions, OrientedCoords } from '../visualization01/oriented'

function alignValueUp (value, gridSize) {
  return Math.floor((value + gridSize - 1) / gridSize) * gridSize
  // return value
}

function alignValueDown (value, gridSize) {
  return Math.floor(value / gridSize) * gridSize
  // return value
}

/*
 * TODO:
 *   Add mouseclick on header event to trigger an action in MooD BA, and style cursor accordingly
 *   investigate making heading text non-selectable
 */
export class Diagram {
  constructor (process, style, width, height, visualizationData) {
    const elementId = visualizationData.config.element

    style.minimumSwimlaneHeight = style.minimumSwimlaneHeight === undefined ? 170 : style.minimumSwimlaneHeight
    style.verticalSwimlanes = style.verticalSwimlanes === undefined ? true : style.verticalSwimlanes
    const containerSize = new OrientedDimensions(style.verticalSwimlanes)
    containerSize.setDimensions({ width, height })

    const gridAlignedStyle = alignStyleToGrid(style)
    //
    // Set defaults for any missing configuration
    //
    gridAlignedStyle.inputSwimlaneLabel = gridAlignedStyle.inputSwimlaneLabel || 'Inputs'
    gridAlignedStyle.outputSwimlaneLabel = gridAlignedStyle.outputSwimlaneLabel || 'Outputs'
    gridAlignedStyle.disableIOSwimlanes = gridAlignedStyle.disableIOSwimlanes === undefined
      ? false
      : gridAlignedStyle.disableIOSwimlanes

    const phaseLabelWidth = process.getPhaseSet().noPhases() === true ? 0 : gridAlignedStyle.phaseLabelWidth
    const numIOSwimlanes = gridAlignedStyle.disableIOSwimlanes ? 0 : 2
    const numSwimlanes = process.getActorSet().numSwimlanes() + numIOSwimlanes // allow for swim lanes for inputs and outputs
    const verticalSwimlaneWidth = alignValueDown((containerSize.width() - phaseLabelWidth - numIOSwimlanes * style.gridSize * 2) / // allow extra width for I/O lanes
            numSwimlanes, style.gridSize)
    const swimlaneWidth = style.verticalSwimlanes ? verticalSwimlaneWidth : Math.max(verticalSwimlaneWidth, gridAlignedStyle.minimumSwimlaneHeight)
    const ioLaneWidth = gridAlignedStyle.disableIOSwimlanes ? 0 : swimlaneWidth + style.gridSize * 2
    const useableWidth = phaseLabelWidth + swimlaneWidth * process.getActorSet().numSwimlanes() + ioLaneWidth * 2

    gridAlignedStyle.swimlaneWidth = swimlaneWidth
    const drawProcessHeader = style.processHeaderHeight > 0 && style.verticalSwimlanes // only draw process heading for vertical swimlanes
    const logicalHeaderSize = {
      width: useableWidth,
      height: containerSize.height()
    }
    const headerSize = new OrientedDimensions(style.verticalSwimlanes)
    headerSize.setDimensions(logicalHeaderSize)

    const dimensions = {
      verticalSwimlanes: style.verticalSwimlanes,
      gridSize: style.gridSize,
      processHeaderHeight: drawProcessHeader ? gridAlignedStyle.processHeaderHeight : 0,
      swimlaneWidth,
      ioLaneWidth,
      phaseLabelWidth,
      logicalHeaderSize
    }
    const htmlElements = {
      containerElement: elementId,
      processHeaderElement: elementId,
      swimlaneHeaderElement: elementId
    }

    this.height = function () {
      return headerSize.height()
    }

    this.width = function () {
      return headerSize.width()
    }

    function alignStyleToGrid (style) {
      const alignedStyle = {
        ...style
      }
      alignedStyle.phaseLabelWidth = alignValueUp(style.phaseLabelWidth, style.gridSize)
      alignedStyle.minimumSwimlaneHeight = alignValueUp(style.minimumSwimlaneHeight, style.gridSize)

      return alignedStyle
    }

    this.draw = function () {
      const startTime = Date.now()
      //
      // Only draw process header if required.
      //
      if (dimensions.processHeaderHeight > 0) {
        layoutHeader(process, dimensions, htmlElements)
      }
      layoutSwimlaneLabels(process, dimensions, style, htmlElements.swimlaneHeaderElement)

      function layoutHeader (process, dimensions, htmlElements) {
        const el = document.getElementById(htmlElements.containerElement)
        const processHeaderSize = new OrientedDimensions(style.verticalSwimlanes)
        processHeaderSize.setDimensions({
          width: dimensions.logicalHeaderSize.width,
          height: dimensions.processHeaderHeight
        })
        // Mark container element with class to enable style override in CSS file
        el.classList.add('process-flow')
        htmlElements.processHeaderElement = htmlElements.containerElement + '_procHeader'

        const headerEl = document.createElement('div')
        el.appendChild(headerEl)
        headerEl.classList.add('process-flow-header')
        headerEl.id = htmlElements.processHeaderElement
        headerEl.style.height = processHeaderSize.height() + 'px'
        headerEl.style.width = processHeaderSize.width() + 'px'

        const nameEl = document.createElement('span')
        nameEl.innerText = process.name()
        headerEl.appendChild(nameEl)

        const versionEl = document.createElement('span')
        versionEl.style.float = 'right'
        versionEl.innerText = 'Version: ' + process.version()
        headerEl.appendChild(versionEl)

        htmlElements.swimlaneHeaderElement = htmlElements.containerElement + '_underProcHeader'
        const nextEl = document.createElement('div')
        nextEl.classList.add('process-flow-header-block')
        nextEl.id = htmlElements.swimlaneHeaderElement
        el.appendChild(nextEl)
      }

      function layoutSwimlaneLabels (process, dimensions, style, containerElementName) {
        const el = document.getElementById(containerElementName)
        const swimlaneHeaderHeight = dimensions.logicalHeaderSize.height - dimensions.processHeaderHeight
        // const inputSwimlane = swimlanes[0]
        // const outputSwimlane = swimlanes[numSwimlanes - 1]

        const actorLanes = []
        const position = new OrientedCoords(style.verticalSwimlanes)
        const phaseLabelDimensions = new OrientedDimensions(style.verticalSwimlanes)
        phaseLabelDimensions.setDimensions({ width: dimensions.phaseLabelWidth, height: swimlaneHeaderHeight })
        let index = 0
        //
        // Create spacer for phase label in header
        //
        if (!process.getPhaseSet().noPhases()) {
          actorLanes.push(createHeaderElement(
            el,
            null,
            '',
            'phase',
            phaseLabelDimensions.width(),
            phaseLabelDimensions.height(),
            -1,
            style.verticalSwimlanes))
          position.increaseX(dimensions.phaseLabelWidth)
        }
        const ioLaneDimensions = new OrientedDimensions(style.verticalSwimlanes)
        ioLaneDimensions.setDimensions({ width: dimensions.ioLaneWidth, height: swimlaneHeaderHeight })
        //
        // Create header for inputs
        //
        if (dimensions.ioLaneWidth > 0) {
          actorLanes.push(createHeaderElement(
            el,
            null,
            style.inputSwimlaneLabel,
            'actor',
            ioLaneDimensions.width(),
            ioLaneDimensions.height(),
            index++,
            style.verticalSwimlanes))
          position.increaseX(dimensions.ioLaneWidth)
        }
        //
        // Create headers for the actors
        //
        process.getActorSet().actors().forEach(function (actor) {
          const swimlaneDimensions = new OrientedDimensions(style.verticalSwimlanes)
          swimlaneDimensions.setDimensions({
            width: dimensions.swimlaneWidth * actor.numSwimlanes(),
            height: swimlaneHeaderHeight
          })
          actorLanes.push(createHeaderElement(
            el,
            actor,
            actor.name(),
            'actor',
            swimlaneDimensions.width(),
            swimlaneDimensions.height(),
            index++,
            style.verticalSwimlanes))
          position.increaseX(dimensions.swimlaneWidth * actor.numSwimlanes())
        })
        //
        // Create header for outputs
        //
        if (dimensions.ioLaneWidth > 0) {
          actorLanes.push(createHeaderElement(
            el,
            null,
            style.outputSwimlaneLabel,
            'actor',
            ioLaneDimensions.width(),
            ioLaneDimensions.height(),
            index++,
            style.verticalSwimlanes))
        }

        return actorLanes
      }

      /**
       * Create an element in the header
       * @param {HTMLElement} containerElement the HTML element to contain the element to create
       * @param {Actor}       actor Data for actor, or null if not an actor heading
       * @param {String}      name Name to use in header
       * @param {String}      className name of class to mark element with
       * @param {Integer}     width width of header element in pixels
       * @param {Integer}     height Height of header element in pixels
       * @param {Integer}     index zero based index of element in the header
       * @param {Boolean}     verticalSwimlanes True if swimlanes drawn vertically or false if horizontal
       */
      function createHeaderElement (containerElement, actor, name, className, width, height, index, verticalSwimlanes) {
        let container = containerElement
        if (!verticalSwimlanes) {
          //
          // For horizontal swimlanes add an outer div element
          // so that the header divs go down the page not across
          //
          const outerDiv = document.createElement('div')
          containerElement.appendChild(outerDiv)
          container = outerDiv
        }
        const headerEl = document.createElement('div')
        headerEl.classList.add(className)
        if (index >= 0) {
          const isEven = index % 2 === 0 ? 'true' : 'false'
          headerEl.setAttribute('even', isEven)
        }
        headerEl.classList.add('process-flow-column-header')
        headerEl.style.height = height + 'px'
        headerEl.style.width = width + 'px'
        headerEl.style.display = 'inline-flex'
        container.appendChild(headerEl)

        const nameEl = document.createElement('text')
        nameEl.innerHTML = name
        headerEl.appendChild(nameEl)
        //
        // Additional features for actor swimlane headings
        //
        if (actor) {
          headerEl.id = actor.id()
          if (actor.backgroundColour()) {
            headerEl.style.backgroundColor = actor.backgroundColour()
          }
          if (actor.textColour()) {
            nameEl.style.color = actor.textColour()
          }
        }
      }

      console.log('Draw diagram complete in ' + (Date.now() - startTime) / 1000 + ' seconds')
    }
  }
}
