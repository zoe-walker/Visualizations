import * as Data from './process-data'

class CellCollection {
  constructor () {
    const cellDictionary = {}
    const cellArray = []

    /**
     *
     * @param {Data.BasicElement} cell
     * @param {Boolean} isPrimary
     */
    this.addCell = function (cell, isPrimary) {
      let cellObject = cellDictionary[cell.id()]
      if (!cellObject) {
        cellObject = new Cell(cell.graphElement(), isPrimary)
        cellDictionary[cell.id()] = cellObject
        cellArray.push(cellObject)
      } else {
        //
        // Promote to primary a cell previously marked as secondary
        //
        cellObject.updatePriority(isPrimary)
      }
    }

    this.cells = () => cellArray
  }
}

class Cell {
  constructor (graphElement, isPrimary) {
    const cellData = {
      graphElement,
      isPrimary
    }
    this.highlight = () => cellData.graphElement && cellData.graphElement.highlight(cellData.isPrimary)
    this.unhighlight = () => cellData.graphElement && cellData.graphElement.unhighlight(cellData.isPrimary)
    this.updatePriority = function (newIsPrimary) {
      cellData.isPrimary |= newIsPrimary
    }
  }
}

export class Highlighter {
  constructor (process) {
    let cellCollection = new CellCollection()
    let currentElementIds
    let highlightOn = false

    this.clearHighlights = function () {
      const cells = cellCollection.cells()
      while (cells.length > 0) {
        const element = cells.pop()
        element.unhighlight()
      }
      cellCollection = new CellCollection()
      currentElementIds = undefined
      highlightOn = false
    }

    this.changeHighlight = function (elementIds) {
      const normalIds = normalisedIds(elementIds)
      if (!idsMatch(currentElementIds, normalIds)) {
        //
        // Clear highlighting on previously selected cells
        //
        this.clearHighlights()
        //
        // Construct set of primary cells to highlight
        //
        const primaryCells = []
        normalIds.forEach(id => {
          let element = process.getInformationSet().getInformation(id)
          if (element) {
            //
            // For information element, record all copies as primary cells
            //
            element.copies.forEach(copy => {
              primaryCells.push(copy)
            })
          }
          if (!element && (element = process.getActorSet().getActor(id))) {
            //
            // For actor (swimlane) element, record all steps in the swimlane as primary cells
            //
            process.getStepSet()
              .steps()
              .filter(step => step.swimlanes().filter(swimlane => swimlane.originalId() === id).length > 0)
              .forEach(step => {
                primaryCells.push(step)
              })
          }
          if (!element && (element = process.getStepSet().getStep(id))) {
            //
            // For Step record step as a primary cell
            //
            primaryCells.push(element)
          }
          if (!element && (element = process.getStepGroupSet().getStepGroup(id))) {
            //
            // For Step Groups, record each step in the group as a primary cell
            //
            element.steps().forEach(step => {
              primaryCells.push(step)
            })
          }
          if (!element && (element = process.getLinkSet().getLink(id))) {
            //
            // For Links, record the link as a primary element
            //
            primaryCells.push(element)
          }
        })
        //
        // Add primary cells and links from / to the cell
        //
        primaryCells.forEach(cell => {
          cellCollection.addCell(cell, true)
          if (cell instanceof Data.Link) {
            //
            // Add ends of link as secondary cells
            //
            cellCollection.addCell(cell.source(), false)
            cellCollection.addCell(cell.target(), false)
            //
            // If off page connection flow then add off page connectors and flows
            //
            if ((cell instanceof Data.Flow) && cell.isOffPageConnection()) {
              if (cell.inputConnector()) {
                cellCollection.addCell(cell.inputConnector().flows()[0], true)
                cellCollection.addCell(cell.inputConnector(), true)
              } else {
                //
                // Off Page output connector to collapsed target so add target
                //
                cell.target().flows().filter(l => l.isOffPageConnection() &&
                                          l.inputConnector() &&
                                          l.target() === cell.target())
                  .forEach(l => {
                    cellCollection.addCell(l.inputConnector().flows()[0], true)
                    cellCollection.addCell(l.inputConnector(), true)
                  })
              }
              //
              // Add all off page output connectors and source steps connected to target step
              //
              cell.target().flows().filter(l => l.isOffPageConnection() &&
                                        l.target() === cell.target())
                .forEach(l => {
                  cellCollection.addCell(l.outputConnector().flows()[0], true)
                  cellCollection.addCell(l.outputConnector(), true)
                  cellCollection.addCell(l.source(), false)
                })
            }
          } else {
            //
            // Add links from cell as primary cells
            //
            cell.links().forEach(link => {
              if (!(link instanceof Data.Flow) || !link.isOffPageConnection()) {
                //
                // Add links from cell as primary cells
                //
                cellCollection.addCell(link, true)
              } else {
                //
                // Add links from off page connectors as primary cells
                // and off page connectors as primary cells
                //
                // Handle collapsing of all input connectors into one
                //
                if (link.inputConnector()) {
                  cellCollection.addCell(link.inputConnector().flows()[0], true)
                  cellCollection.addCell(link.inputConnector(), true)
                } else {
                  link.target().flows().filter(l => l.isOffPageConnection() &&
                                           l.inputConnector() &&
                                           l.target() === link.target())
                    .forEach(l => {
                      cellCollection.addCell(l.inputConnector().flows()[0], true)
                      cellCollection.addCell(l.inputConnector(), true)
                    })
                }
                //
                // Add link to output connector and the output connector
                //
                cellCollection.addCell(link.outputConnector().flows()[0], true)
                cellCollection.addCell(link.outputConnector(), true)
              }
              //
              // Add cell at other end of link as secondary cell
              //
              const otherEnd = link.otherEnd(cell)
              if (otherEnd) {
                cellCollection.addCell(otherEnd, false)
              } else {
                console.log('Link ' + link.id() + ' not from or to cell ' + cell.name())
              }
            })
          }
        })
      }
      //
      // Toggle highlighting
      //
      highlightOn = !highlightOn
      cellCollection.cells().forEach(cell => {
        if (highlightOn) {
          cell.highlight()
        } else {
          cell.unhighlight()
        }
      })
      currentElementIds = normalIds
    }

    /**
     * Convert id (string) or ids (array) into a sorted array of ids
     * @param {*} ids string or array of strings
     */
    function normalisedIds (ids) {
      let idArray
      if (Array.isArray(ids)) {
        idArray = ids.map(a => a).sort()
      } else {
        (
          idArray = [ids]
        )
      }
      return idArray
    }
    function idsMatch (oldIds, newIds) {
      let match = false
      if (oldIds) {
        if (oldIds.length === newIds.length) {
          match = true
          for (let i = 0; i < newIds.length; i++) {
            match = match && newIds[i] === oldIds[i]
          }
        }
      }
      return match
    }
  }
}
