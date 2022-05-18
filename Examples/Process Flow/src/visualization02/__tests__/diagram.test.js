/**
 * @jest-environment jsdom
 */
import * as Data from '../process-data'
import { Diagram } from '../diagram'
 
//const { testEnvironment } = require('../../../jest.config')

// jest.mock('../process-data')

const config = {
  width: '1500px',
  height: '600px',
  element: 'visualisation01_element_guid',
  functions: {
  },
  data :
  {
    "process": {"id": "55-786B4C023FBE4FF0884ABAAA1B16C640", "name": "BP 150 - Managing Support Impacts in Response to Design Change", "version": "1.0"}, 
    "actors": [
        {
          "id": "41-94FE1E0498464A59804D850FC12498B4", 
          "target": {"id": "55-2FF0F06AFD054E1ABC21BBA52996E9FF", "name": "Design Change Owner (DCO)", "navigable": true}
        },
        {
          "id": "41-2BB2828043914E21B863F72F6D1AE48C", 
          "target": {"id": "55-9FDC37967E4C4E74918A1D25401E39F0", "name": "Actor 2", "navigable": true}
        },
        {
          "id": "41-870B2A59DE204422AA61C1593671897D", 
          "target": {"id": "55-722A10AC709945C0AE5E07C7A0F28149", "name": "Actor 3", "navigable": true}
        },
        {
          "id": "41-4E42523538254751B72C0C68466E25B9", 
          "target": {"id": "55-061D10BE8B07404CAFAEB28CB348AEC7", "name": "Actor 4", "navigable": true}
        }
      ], 
      "phases": [
        {"id": "55-ED9AC05F80864AC8A286A611B42BC74E", "name": "Phase 1 - Identification and Definition of Support Influence and Chane Requirements", "navigable": false},
        {"id": "55-E5B7A48733084BCCAC0B85FB5FB84D25", "name": "Phase 2 - Produce and Approve ILS Plan", "navigable": false},
        {"id": "55-7422D300EE914A9FA03B61068CAC165E", "name": "Phase 3 - Manage Development and Delivery of Support Changes", "navigable": false},
        {"id": "55-35C96AF9C01E45D0AE4182E9B5798495", "name": "Phase 4 - Initial Supportability Approvals", "navigable": false},
        {"id": "55-4EE70459084D402799F66DC7BED89A23", "name": "Phase 5 -Close Out Remaining Safety Case and Supportaility Case Requirements", "navigable": false}
      ]
  },
  inputs : {
    "highlightNode": ""
  },
  style: {
     "gridSize": 10,
     "processHeaderHeight": 20,
     "phaseLabelWidth": 40,
     "editable": true,
     "inputSwimlaneLabel": "Inputs",
     "outputSwimlaneLabel": "Outputs"
   }
}

const mockHandleClickEvents = jest.fn()
const diagramConfig = {
    config: config,
    handleClickEvent: mockHandleClickEvents,
    handleHighlighting: {}
  }

describe('Diagram', () => {
    beforeEach(() => jest.clearAllMocks())
  
    it('Successful create', () => {
      let throwCount = 0
      document.body.innerHTML =
              '<div id="visualisation01_element_guid"></div>'
      const process = new Data.Process(config.data, config.style)

      try {
        const testObject = new Diagram(process, config.style, parseFloat(config.width), parseFloat(config.height), diagramConfig)
      }
      catch (e) {
        throwCount++
      }
  
      expect(throwCount).toBe(0)
    })
    it('Successful draw', () => {
        let throwCount = 0
                document.body.innerHTML =
                '<div id="visualisation01_element_guid"></div>'
        const process = new Data.Process(config.data, config.style)
  
        try {
          const testObject = new Diagram(process, config.style, parseFloat(config.width), parseFloat(config.height), diagramConfig)
          testObject.draw()
        }
        catch (e) {
          throwCount++
          console.log(e.name + ': ' + e.message)
        }
    
        expect(throwCount).toBe(0)
      })
  })
  