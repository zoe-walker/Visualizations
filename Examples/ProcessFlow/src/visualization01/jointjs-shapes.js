import * as joint from 'jointjs'
import * as Ports from './element-port-names'
import * as Types from './element-types'
import { OrientedDimensions, OrientedCoords } from './oriented'

let ActorShape
let SwimlaneShape
let StartShape
let ProcessStepShape
let SubProcessShape
let ProcessShape
let DecisionShape
let VerticalLabelShape
let PhaseExtentShape
let ExternalDataShape
let DatabaseShape
let DocumentShape
let DataShape
let OtherShape
let OffPageOutputShape
let OffPageInputShape
let StepGroupShape
//
// Shape input and output port configuration
// The ports are visible in editable mode and invisible in non-edit mode
//

export function defineShapes (gridSize, elementSizes, renderSwimlaneWatermarks, verticalSwimlanes, isEditable) {
  const portConfig = definePorts(isEditable)
  ActorShape = defineActor(renderSwimlaneWatermarks, verticalSwimlanes)
  SwimlaneShape = defineSwimlane()
  StartShape = defineStart(portConfig, verticalSwimlanes)
  ProcessStepShape = defineProcessStep(portConfig, gridSize, elementSizes[Types.processStep], verticalSwimlanes)
  SubProcessShape = defineSubProcess(portConfig, gridSize, elementSizes[Types.subProcess], verticalSwimlanes)
  ProcessShape = defineProcess()
  DecisionShape = defineDecision(portConfig, verticalSwimlanes)
  VerticalLabelShape = defineVerticalLabel(verticalSwimlanes)
  PhaseExtentShape = definePhaseExtent(verticalSwimlanes)
  ExternalDataShape = defineExternalData()
  DatabaseShape = defineDatabase()
  DocumentShape = defineDocument()
  DataShape = defineData()
  OtherShape = defineOther()
  OffPageOutputShape = defineOffPageOutput()
  OffPageInputShape = defineOffPageInput()
  StepGroupShape = defineStepGroup()
}

export function createActor (id) {
  return new ActorShape(id)
}

export function createSwimlane (id) {
  return new SwimlaneShape(id)
}

export function createStart (id) {
  return new StartShape(id)
}

export function createProcessStep (id) {
  return new ProcessStepShape(id)
}

export function createSubProcess (id) {
  return new SubProcessShape(id)
}

export function createProcess (id) {
  return new ProcessShape(id)
}

export function createDecision (id) {
  return new DecisionShape(id)
}

export function createVerticalLabel (id) {
  return new VerticalLabelShape(id)
}

export function createPhaseExtent (id) {
  return new PhaseExtentShape(id)
}

export function createExternalData (id) {
  return new ExternalDataShape(id)
}

export function createDatabase (id) {
  return new DatabaseShape(id)
}

export function createDocument (id) {
  return new DocumentShape(id)
}

export function createData (id) {
  return new DataShape(id)
}

export function createOther (id) {
  return new OtherShape(id)
}

export function createOffPageOutput (id) {
  return new OffPageOutputShape(id)
}

export function createOffPageInput (id) {
  return new OffPageInputShape(id)
}

export function createStepGroup (id) {
  return new StepGroupShape(id)
}

function defineActor (renderSwimlaneWatermarks, verticalSwimlanes) {
  const attrs = {
    body: {
      refWidth: 1,
      refHeight: 1,
      even: 'false'
    }
  }
  const markup = []
  if (renderSwimlaneWatermarks) {
    attrs.defs = {}
    attrs.pattern = {
      x: 0,
      y: 0,
      width: 1,
      height: 1
    }
    attrs.text = {
      class: 'actor-watermark'
    }
    if (verticalSwimlanes) {
      attrs.text = {
        refX: 0.5,
        y: 2,
        textVerticalAnchor: 'top',
        textAnchor: 'middle'
      }
    } else {
      attrs.text = {
        x: 2,
        y: 10,
        textVerticalAnchor: 'top',
        textAnchor: 'left'
      }
    }
    attrs.watermark = {
      refWidth: 1,
      refHeight: 1,
      fillOpacity: 0
    }
    markup.push({
      tagName: 'defs',
      selector: 'defs',
      children: [{
        tagName: 'pattern',
        selector: 'pattern',
        children: [{
          tagName: 'text',
          selector: 'text'
        }]
      }]
    })
  }
  markup.push({
    tagName: 'rect',
    selector: 'body'
  })
  if (renderSwimlaneWatermarks) {
    markup.push({
      tagName: 'rect',
      selector: 'watermark'
    })
  }
  return joint.dia.Element.define('MooD.Actor', {
    attrs
  }, {
    markup
  })
}

function defineSwimlane () {
  return joint.dia.Element.define('MooD.Swimlane', {
    attrs: {
      body: {
        refWidth: 1,
        refHeight: 1,
        fillOpacity: 0
      }
    }
  }, {
    markup: [{
      tagName: 'rect',
      selector: 'body'
    }]
  })
}

function definePorts (isEditable) {
  const portSize = isEditable ? 8 : 2
  const fillOpacity = isEditable ? 0.5 : 0
  const magnet = isEditable
  const returnValue = {}
  //
  // Base Port configuration
  //
  const portMarkup = [{
    tagName: 'rect',
    selector: 'portBody'
  }]

  const basePortAttrs = {
    r: portSize / 2,
    width: portSize,
    height: portSize,
    fillOpacity,
    magnet
  }
  const baseLeftPortAttrs = {
    ...basePortAttrs,
    x: 0,
    y: -portSize / 2
  }
  const baseRightPortAttrs = {
    ...basePortAttrs,
    x: -portSize,
    y: -portSize / 2
  }
  const baseTopPortAttrs = {
    ...basePortAttrs,
    x: -portSize / 2,
    y: 0
  }
  const baseBottomPortAttrs = {
    ...basePortAttrs,
    x: -portSize / 2,
    y: -portSize
  }

  function portAttrs (baseAttrs, colour) {
    return {
      portBody: {
        ...baseAttrs,
        fill: colour
      }
    }
  }
  //
  // I/O Ports
  //
  const ioPortColour = 'red'
  returnValue.portInLeft = {
    id: Ports.ioInputPort,
    group: 'inLeft',
    markup: portMarkup,
    attrs: portAttrs(baseLeftPortAttrs, ioPortColour)
  }

  returnValue.portOutRight = {
    id: Ports.ioOutputPort,
    group: 'outRight',
    markup: portMarkup,
    attrs: portAttrs(baseRightPortAttrs, ioPortColour)
  }
  //
  // Process Flow input ports
  //
  const flowInPortColour = 'green'
  returnValue.portFlowInUpperLeft = {
    id: Ports.flowInUpperLeftPort,
    group: 'flowInUpperLeft',
    markup: portMarkup,
    attrs: portAttrs(baseLeftPortAttrs, flowInPortColour)
  }

  returnValue.portFlowInLowerLeft = {
    id: Ports.flowInLowerLeftPort,
    group: 'flowInLowerLeft',
    markup: portMarkup,
    attrs: portAttrs(baseLeftPortAttrs, flowInPortColour)
  }

  returnValue.portFlowInTop = {
    id: Ports.flowInTopPort,
    group: 'flowInTop',
    markup: portMarkup,
    attrs: portAttrs(baseTopPortAttrs, flowInPortColour)
  }

  returnValue.portFlowInUpperRight = {
    id: Ports.flowInUpperRightPort,
    group: 'flowInUpperRight',
    markup: portMarkup,
    attrs: portAttrs(baseRightPortAttrs, flowInPortColour)
  }

  returnValue.portFlowInLowerRight = {
    id: Ports.flowInLowerRightPort,
    group: 'flowInLowerRight',
    markup: portMarkup,
    attrs: portAttrs(baseRightPortAttrs, flowInPortColour)
  }
  //
  // Process Flow output ports
  //
  const flowOutPortColour = 'blue'
  returnValue.portFlowOutUpperLeft = {
    id: Ports.flowOutUpperLeftPort,
    group: 'flowOutUpperLeft',
    markup: portMarkup,
    attrs: portAttrs(baseLeftPortAttrs, flowOutPortColour)
  }

  returnValue.portFlowOutLowerLeft = {
    id: Ports.flowOutLowerLeftPort,
    group: 'flowOutLowerLeft',
    markup: portMarkup,
    attrs: portAttrs(baseLeftPortAttrs, flowOutPortColour)
  }

  returnValue.portFlowOutBottom = {
    id: Ports.flowOutBottomPort,
    group: 'flowOutBottom',
    markup: portMarkup,
    attrs: portAttrs(baseBottomPortAttrs, flowOutPortColour)
  }

  returnValue.portFlowOutUpperRight = {
    id: Ports.flowOutUpperRightPort,
    group: 'flowOutUpperRight',
    markup: portMarkup,
    attrs: portAttrs(baseRightPortAttrs, flowOutPortColour)
  }

  returnValue.portFlowOutLowerRight = {
    id: Ports.flowOutLowerRightPort,
    group: 'flowOutLowerRight',
    markup: portMarkup,
    attrs: portAttrs(baseRightPortAttrs, flowOutPortColour)
  }
  //
  // Process Flow input/output (shared) ports
  //
  const flowSharedPortColour = 'red'
  returnValue.portFlowCentreLeft = {
    id: Ports.flowCentreLeftPort,
    group: 'flowLeft',
    markup: portMarkup,
    attrs: portAttrs(baseLeftPortAttrs, flowSharedPortColour)
  }

  returnValue.portFlowCentreRight = {
    id: Ports.flowCentreRightPort,
    group: 'flowRight',
    markup: portMarkup,
    attrs: portAttrs(baseRightPortAttrs, flowSharedPortColour)
  }

  return returnValue
}

function defineStart (portConfig, verticalSwimlanes) {
  const position = new OrientedCoords(verticalSwimlanes)
  return joint.dia.Element.define('MooD.Start', {
    ports: {
      groups: {
        flowInTop: {
          position: {
            name: 'absolute',
            args: position.orientedCoords({ x: '50%', y: 0 })
          }
        },
        flowOutBottom: {
          position: {
            name: 'absolute',
            args: position.orientedCoords({ x: '50%', y: '100%' })
          }
        }
      },
      items: [
        portConfig.portFlowInTop,
        portConfig.portFlowOutBottom
      ]
    },
    attrs: {
      body: {
        rx: 20,
        refRy: '50%',
        refWidth: 1,
        refHeight: 1
      },
      label: {
        textVerticalAnchor: 'middle',
        textAnchor: 'middle',
        refX: 0.5,
        refY: 0.5
      },
      title: {
      }
    }
  }, {
    markup: [{
      tagName: 'rect',
      selector: 'body',
      groupSelector: 'bodyGroup',
      className: 'mood-graph-step'
    }, {
      tagName: 'text',
      selector: 'label',
      className: 'mood-graph-step-label'
    }, {
      tagName: 'title',
      selector: 'title'
    }]
  })
}

// Return port group definitions for process type shapes
// Calculate vertical positions of flow in and out ports to
// align with the grid if the shape is tall enough
function processPortGroups (gridSize, elementSize, verticalSwimlanes) {
  const elementDimensions = new OrientedDimensions(verticalSwimlanes)
  elementDimensions.setDimensions(elementSize)
  const position = new OrientedCoords(verticalSwimlanes)
  let offsets
  if (elementDimensions.height() > 2 * gridSize) {
    offsets = {
      upperInY: elementDimensions.height() / 2 - 2 * gridSize,
      upperOutY: elementDimensions.height() / 2 - gridSize,
      lowerInY: elementDimensions.height() / 2 + 2 * gridSize,
      lowerOutY: elementDimensions.height() / 2 + gridSize
    }
  } else {
    offsets = {
      upperInY: Math.floor(elementDimensions.height() * 0.63),
      upperOutY: Math.floor(elementDimensions.height() * 0.38),
      lowerInY: Math.floor(elementDimensions.height() * 0.7),
      lowerOutY: Math.floor(elementDimensions.height() * 0.3)
    }
  }
  const groups = {
    inLeft: {
      position: {
        name: 'absolute',
        args: position.orientedCoords({ x: 0, y: '50%' })
      }
    },
    flowInUpperLeft: {
      position: {
        name: 'absolute',
        args: position.orientedCoords({ x: 0, y: offsets.upperInY })
      }
    },
    flowInLowerLeft: {
      position: {
        name: 'absolute',
        args: position.orientedCoords({ x: 0, y: offsets.lowerInY })
      }
    },
    flowInTop: {
      position: {
        name: 'absolute',
        args: position.orientedCoords({ x: '50%', y: 0 })
      }
    },
    flowInUpperRight: {
      position: {
        name: 'absolute',
        args: position.orientedCoords({ x: '100%', y: offsets.upperInY })
      }
    },
    flowInLowerRight: {
      position: {
        name: 'absolute',
        args: position.orientedCoords({ x: '100%', y: offsets.lowerInY })
      }
    },
    outRight: {
      position: {
        name: 'absolute',
        args: position.orientedCoords({ x: '100%', y: '50%' })
      }
    },
    flowOutUpperLeft: {
      position: {
        name: 'absolute',
        args: position.orientedCoords({ x: 0, y: offsets.upperOutY })
      }
    },
    flowOutLowerLeft: {
      position: {
        name: 'absolute',
        args: position.orientedCoords({ x: 0, y: offsets.lowerOutY })
      }
    },
    flowOutBottom: {
      position: {
        name: 'absolute',
        args: position.orientedCoords({ x: '50%', y: '100%' })
      }
    },
    flowOutUpperRight: {
      position: {
        name: 'absolute',
        args: position.orientedCoords({ x: '100%', y: offsets.upperOutY })
      }
    },
    flowOutLowerRight: {
      position: {
        name: 'absolute',
        args: position.orientedCoords({ x: '100%', y: offsets.lowerOutY })
      }
    }
  }

  return groups
}

function processPortItems (portConfig) {
  const items = [
    portConfig.portInLeft,
    portConfig.portFlowInUpperLeft,
    portConfig.portFlowInLowerLeft,
    portConfig.portFlowInTop,
    portConfig.portFlowInUpperRight,
    portConfig.portFlowInLowerRight,
    portConfig.portOutRight,
    portConfig.portFlowOutUpperLeft,
    portConfig.portFlowOutLowerLeft,
    portConfig.portFlowOutBottom,
    portConfig.portFlowOutUpperRight,
    portConfig.portFlowOutLowerRight
  ]

  return items
}

export function defineSubProcess (portConfig, gridSize, elementSize, verticalSwimlanes) {
  const portGroups = processPortGroups(gridSize, elementSize, verticalSwimlanes)
  const portItems = processPortItems(portConfig)
  // Add groups for side flow ports

  return joint.dia.Element.define('MooD.SubProcess', {
    ports: {
      groups: portGroups,
      items: portItems
    },
    attrs: {
      body: {
        refX: 0,
        refWidth: 1,
        refHeight: 1
      },
      inner: {
        refX: 0.1,
        refWidth: 0.8,
        refHeight: 1
      },
      label: {
        refWidth: 0.8,
        refHeight: 1,
        textVerticalAnchor: 'middle',
        textAnchor: 'middle',
        refX: 0.5,
        refY: 0.5
      },
      title: {
      }
    }
  }, {
    markup: [{
      tagName: 'rect',
      selector: 'body',
      groupSelector: 'bodyGroup',
      className: 'mood-graph-step'
    }, {
      tagName: 'rect',
      selector: 'inner',
      groupSelector: 'bodyGroup',
      className: 'mood-graph-step'
    }, {
      tagName: 'text',
      selector: 'label',
      className: 'mood-graph-step-label'
    }, {
      tagName: 'title',
      selector: 'title'
    }]
  })
}

export function defineProcess () {
  // Add groups for side flow ports

  return joint.dia.Element.define('MooD.Process', {
    attrs: {
      body: {
        refX: 0,
        refWidth: 1,
        refHeight: 1
      },
      inner: {
        refX: 0.1,
        refWidth: 0.8,
        refHeight: 1
      },
      label: {
        refWidth: 0.8,
        refHeight: 1,
        textVerticalAnchor: 'middle',
        textAnchor: 'middle',
        refX: 0.5,
        refY: 0.5
      },
      title: {
      }
    }
  }, {
    markup: [{
      tagName: 'rect',
      selector: 'body',
      groupSelector: 'bodyGroup',
      className: 'mood-graph-io'
    }, {
      tagName: 'rect',
      selector: 'inner',
      groupSelector: 'bodyGroup',
      className: 'mood-graph-io'
    }, {
      tagName: 'text',
      selector: 'label',
      className: 'mood-graph-io-label'
    }, {
      tagName: 'title',
      selector: 'title'
    }]
  })
}

export function defineProcessStep (portConfig, gridSize, elementSize, verticalSwimlanes) {
  const portGroups = processPortGroups(gridSize, elementSize, verticalSwimlanes)
  const portItems = processPortItems(portConfig)
  // Add groups for side flow ports

  return joint.dia.Element.define('MooD.ProcessStep', {
    ports: {
      groups: portGroups,
      items: portItems
    },
    attrs: {
      body: {
        refWidth: 1,
        refHeight: 1
      },
      label: {
        textVerticalAnchor: 'middle',
        textAnchor: 'middle',
        refX: 0.5,
        refY: 0.5,
        fontSize: ''
      },
      title: {
      }
    }
  }, {
    markup: [{
      tagName: 'rect',
      selector: 'body',
      groupSelector: 'bodyGroup',
      className: 'mood-graph-step'
    }, {
      tagName: 'text',
      selector: 'label',
      className: 'mood-graph-step-label'
    }, {
      tagName: 'title',
      selector: 'title'
    }]
  })
}

export function defineDecision (portConfig, verticalSwimlanes) {
  const position = new OrientedCoords(verticalSwimlanes)
  return joint.dia.Element.define('MooD.Decision', {
    ports: {
      groups: {
        inLeft: {
          position: {
            name: 'absolute',
            args: position.orientedCoords({ x: '10%', y: '40%' })
          }
        },
        flowLeft: {
          position: {
            name: 'absolute',
            args: position.orientedCoords({ x: 0, y: '50%' })
          }
        },
        flowInTop: {
          position: {
            name: 'absolute',
            args: position.orientedCoords({ x: '50%', y: 0 })
          }
        },
        flowRight: {
          position: {
            name: 'absolute',
            args: position.orientedCoords({ x: '100%', y: '50%' })
          }
        },
        outRight: {
          position: {
            name: 'absolute',
            args: position.orientedCoords({ x: '90%', y: '40%' })
          }
        },
        flowOutBottom: {
          position: {
            name: 'absolute',
            args: position.orientedCoords({ x: '50%', y: '100%' })
          }
        }
      },
      items: [
        portConfig.portInLeft,
        portConfig.portFlowCentreLeft,
        portConfig.portFlowInTop,
        portConfig.portFlowCentreRight,
        portConfig.portOutRight,
        portConfig.portFlowOutBottom
      ]
    },
    attrs: {
      path: {
        refDResetOffset:
                  'M 50 0 L 100 50 ' +
                  'L 50 100 ' +
                  'L 0 50 z'
      },
      label: {
        textVerticalAnchor: 'middle',
        textAnchor: 'middle',
        refWidth: 0.95,
        refHeight: 0.95,
        refX: 0.5,
        refY: 0.5
      },
      title: {
      }
    }
  }, {
    markup: [{
      tagName: 'path',
      selector: 'body',
      groupSelector: 'bodyGroup',
      className: 'mood-graph-step'
    }, {
      tagName: 'text',
      selector: 'label',
      className: 'mood-graph-step-label'
    }, {
      tagName: 'title',
      selector: 'title'
    }]
  })
}

export function defineVerticalLabel (verticalSwimlanes) {
  const labelDefaults = {
    attrs: {
      body: {
        refWidth: 1,
        refHeight: 1
      },
      label: {
        textVerticalAnchor: 'middle',
        textAnchor: 'middle',
        refX: 0.5,
        refY: 0.5
      },
      title: {
      }
    }
  }
  const labelProtoProps = {
    markup: [{
      tagName: 'rect',
      selector: 'body',
      groupSelector: 'bodyGroup'
    }, {
      tagName: 'text',
      selector: 'label'
    }, {
      tagName: 'title',
      selector: 'title'
    }]
  }
  if (verticalSwimlanes) {
    labelDefaults.attrs.label.transform = 'rotate(-90)'
  }
  return joint.dia.Element.define('MooD.VLabel', labelDefaults, labelProtoProps)
}

export function definePhaseExtent (verticalSwimlanes) {
  let path
  if (verticalSwimlanes) {
    path = 'L 100 0'
  } else {
    path = 'L 0 100'
  }
  return joint.dia.Element.define('MooD.PhaseExtent', {
    attrs: {
      path: {
        refDResetOffset:
                  path
      }
    }
  }, {
    markup: [{
      tagName: 'path',
      selector: 'body',
      groupSelector: 'bodyGroup'
    }]
  })
}

export function defineExternalData () {
  return joint.dia.Element.define('MooD.ExternalData', {
    attrs: {
      path: {
        refDResetOffset:
                  'M 20 0 L 100 0 ' +
                  'A 20 20 0 0 0 100 40 ' +
                  'L 20 40 ' +
                  'A 20 20 0 0 1 20 0'
      },
      label: {
        textVerticalAnchor: 'middle',
        textAnchor: 'middle',
        refX: 0.4,
        refY: 0.5,
        refWidth: 0.8
      },
      title: {
      }
    }
  }, {
    markup: [{
      tagName: 'path',
      selector: 'body',
      groupSelector: 'bodyGroup',
      className: 'mood-graph-io'
    }, {
      tagName: 'text',
      selector: 'label',
      className: 'mood-graph-io-label'
    }, {
      tagName: 'title',
      selector: 'title'
    }]
  })
}

export function defineDatabase () {
  return joint.dia.Element.define('MooD.Database', {
    attrs: {
      path: {
        refDResetOffset:
                  'M 20 0 L 100 0 ' +
                  'A 20 20 0 0 0 100 40 ' +
                  'A 20 20 0 0 0 100 0 ' +
                  'A 20 20 0 0 0 100 40 ' +
                  'L 20 40 ' +
                  'A 20 20 0 0 1 20 0'
      },
      label: {
        textVerticalAnchor: 'middle',
        textAnchor: 'middle',
        refX: 0.35,
        refY: 0.5,
        refWidth: 0.8
      },
      title: {
      }
    }
  }, {
    markup: [{
      tagName: 'path',
      selector: 'body',
      groupSelector: 'bodyGroup',
      className: 'mood-graph-io'
    }, {
      tagName: 'text',
      selector: 'label',
      className: 'mood-graph-io-label'
    }, {
      tagName: 'title',
      selector: 'title'
    }]
  })
}

export function defineDocument () {
  return joint.dia.Element.define('MooD.Document', {
    attrs: {
      path: {
        refDResetOffset:
                  'M 0 0 L 100 0 ' +
                  'L 100 35 ' +
                  'C 95 30 75 30 65 37 ' +
                  'C 40 55 0 40 0 35 ' +
                  'L 0 0'
      },
      label: {
        textVerticalAnchor: 'middle',
        textAnchor: 'middle',
        refX: 0.5,
        refY: 0.4,
        refWidth: 1.0
      },
      title: {
      }
    }
  }, {
    markup: [{
      tagName: 'path',
      selector: 'body',
      groupSelector: 'bodyGroup',
      className: 'mood-graph-io'
    }, {
      tagName: 'text',
      selector: 'label',
      className: 'mood-graph-io-label'
    }, {
      tagName: 'title',
      selector: 'title'
    }]
  })
}

export function defineData () {
  return joint.dia.Element.define('MooD.Data', {
    attrs: {
      path: {
        refDResetOffset:
                  'M 20 0 L 100 0 ' +
                  'L 80 40 ' +
                  'L 0 40 ' +
                  'Z'
      },
      label: {
        textVerticalAnchor: 'middle',
        textAnchor: 'middle',
        refX: 0.5,
        refY: 0.5,
        refWidth: 1.0
      },
      title: {
      }
    }
  }, {
    markup: [{
      tagName: 'path',
      selector: 'body',
      groupSelector: 'bodyGroup',
      className: 'mood-graph-io'
    }, {
      tagName: 'text',
      selector: 'label',
      className: 'mood-graph-io-label'
    }, {
      tagName: 'title',
      selector: 'title'
    }]
  })
}

export function defineOther () {
  return joint.dia.Element.define('MooD.Other', {
    attrs: {
      path: {
        refDResetOffset:
                  'M 0 10 L 100 0 ' +
                  'L 100 40 ' +
                  'L 0 40 ' +
                  'Z'
      },
      label: {
        textVerticalAnchor: 'middle',
        textAnchor: 'middle',
        refX: 0.5,
        refY: 0.6,
        refWidth: 1.0
      },
      title: {
      }
    }
  }, {
    markup: [{
      tagName: 'path',
      selector: 'body',
      groupSelector: 'bodyGroup',
      className: 'mood-graph-io'
    }, {
      tagName: 'text',
      selector: 'label',
      className: 'mood-graph-io-label'
    }, {
      tagName: 'title',
      selector: 'title'
    }]
  })
}

export function defineOffPageOutput () {
  return joint.dia.Element.define('MooD.OffPageOutput', {
    attrs: {
      path: {
        refDResetOffset:
                  'L 100 0 ' +
                  'L 100 30 ' +
                  'L 50 40 ' +
                  'L 0 30 ' +
                  'Z'
      },
      label: {
        textVerticalAnchor: 'middle',
        textAnchor: 'middle',
        refX: 0.5,
        refY: 0.33,
        refWidth: 1.0,
        refHeight: 0.75
      },
      title: {
      }
    }
  }, {
    markup: [{
      tagName: 'path',
      selector: 'body',
      groupSelector: 'bodyGroup',
      className: 'mood-graph-step'
    }, {
      tagName: 'text',
      selector: 'label',
      className: 'mood-graph-step-label'
    }, {
      tagName: 'title',
      selector: 'title'
    }]
  })
}

export function defineOffPageInput () {
  return joint.dia.Element.define('MooD.OffPageInput', {
    attrs: {
      path: {
        refDResetOffset:
                  'L 100 0 ' +
                  'L 100 40 ' +
                  'L 50 30 ' +
                  'L 0 40 ' +
                  'Z'
      },
      label: {
        textVerticalAnchor: 'middle',
        textAnchor: 'middle',
        refX: 0.5,
        refY: 0.33,
        refWidth: 1.0,
        refHeight: 0.75
      },
      title: {
      }
    }
  }, {
    markup: [{
      tagName: 'path',
      selector: 'body',
      groupSelector: 'bodyGroup',
      className: 'mood-graph-step'
    }, {
      tagName: 'text',
      selector: 'label',
      className: 'mood-graph-step-label'
    }, {
      tagName: 'title',
      selector: 'title'
    }]
  })
}

export function defineStepGroup () {
  return joint.dia.Element.define('MooD.StepGroup', {
    attrs: {
      body: {
        refWidth: 1,
        refHeight: 1
      },
      label: {
        textVerticalAnchor: 'bottom',
        textAnchor: 'start',
        refX: '0%',
        refY: '0%',
        refWidth: 1.0
      }
    }
  }, {
    markup: [{
      tagName: 'rect',
      selector: 'body',
      className: 'mood-graph-step-group'
    }, {
      tagName: 'text',
      selector: 'label',
      className: 'mood-graph-step-group-label'
    }]
  })
}
