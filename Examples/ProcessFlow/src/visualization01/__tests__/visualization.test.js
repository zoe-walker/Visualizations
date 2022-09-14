/**
 * @jest-environment jsdom
 */

import { visualization } from '../visualization'
import * as Data from '../process-data'
import { Diagram } from '../diagram'
 
//const { testEnvironment } = require('../../../jest.config')

jest.mock('../process-data')
jest.mock('../diagram')

var mockErrorOccurred = jest.fn(e => e)
var mockInputChanged = jest.fn((name, value) => {})
var mockDataChanged = jest.fn((data) => {})

const config = {
  width: '1500px',
  height: '600px',
  element: 'visualisation01_element_guid',
  functions: {
    errorOccurred: mockErrorOccurred,
    inputChanged: mockInputChanged,
    dataChanged: mockDataChanged
  },
  data :
  {
    "process": {"id": "55-786B4C023FBE4FF0884ABAAA1B16C640", "name": "BP 150 - Managing Support Impacts in Response to Design Change", "version": "1.0"}, 
  },
  inputs : {
    "highlightNode": ""
  },
  style: {
     "horizontalStepsAllowed": true,
     "horizontalDecisionsAllowed": true,
     "renderProcessHeader": false,
     "renderSwimlaneWatermarks": false,
     "gridSize": 10,
     "verticalStepSeparation": 40,
     "verticalIOSeparation": 10,
     "stepStandoff": 10,
     "ioStandoff": 5,
     "linkLabelStandoff": 70,
     "processHeaderHeight": 20,
     "swimlaneWatermarkSpacing": 600,
     "inputSwimlaneLabel": "Inputs",
     "outputSwimlaneLabel": "Outputs",
     "disableIOSwimlanes": true,
     "phaseLabelWidth": 40,
     "stepGroupPadding": 15,
     "elementSizes": {
         "Process Step": {"width": 100, "height": 60},
         "Decision": {"width": 100, "height": 100},
         "Off Page Input": {"width": 100, "height": 60},
         "Off Page Output": {"width": 100, "height": 60},
         "Sub Process": {"width": 100, "height": 60},
         "Process": {"width": 100, "height": 30},
         "Start": {"width": 100, "height": 40},
         "End": {"width": 100, "height": 40},
         "Document / Form": {"width": 100, "height": 40},
         "External Data": {"width": 100, "height": 40},
         "Database / Application": {"width": 100, "height": 40},
         "Data": {"width": 100, "height": 40},
         "Other": {"width": 100, "height": 40}
      }
    }
}

describe('Visualisation', () => {
    const mockDiagramHeight = jest.fn().mockReturnValue(123)
    const mockDiagramDraw = jest.fn()
    const mockDataProcess = 'Data.Process object'
    beforeAll(() => {
        Diagram.mockImplementation(() => {
          return {
            height: mockDiagramHeight,
            draw: mockDiagramDraw
            }
          })
      })
    beforeAll(() => {
        Data.Process.mockImplementation(() => {
            return {
                value: mockDataProcess
            }
        })
    })
    beforeEach(() => jest.clearAllMocks())
  
    it('Successful create', () => {
      document.body.innerHTML =
              '<div id="visualisation01_element_guid"></div>'
  
      visualization(config)
  
      expect(mockErrorOccurred).not.toHaveBeenCalled()
      expect(Data.Process).toHaveBeenCalledWith(config.data, config.style.disableIOSwimlanes)
      expect(Diagram).toHaveBeenCalledWith({value: mockDataProcess}, config.style, 1500, 600, Diagram.mock.calls[0][4])
      expect(mockDiagramHeight).toHaveBeenCalledTimes(0)
      expect(mockDiagramDraw).toHaveBeenCalledTimes(1)

      
    //   var element = document.getElementById('visualisation01_element_guid' + '_procHeader')
    //   expect(element).not.toBeNull()
    })
})
  