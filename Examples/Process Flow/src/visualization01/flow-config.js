import * as Ports from './element-port-names'
import * as Sides from './jointjs-side-types'
import * as Data from './process-data'

export const flowDown = 'down'
export const flowNextDown = 'nextDown'
export const flowUp = 'up'
export const flowVerticalNone = 'verticalNone'
export const flowLeft = 'left'
export const flowRight = 'right'
export const flowHorizontalNone = 'horizontalNone'

//
// Flow input port identifier according to type of step and direction of flow
//
export const inPortId = {
  process: {
    [flowNextDown]: {
      [Sides.top]: Ports.flowInTopPort,
      [Sides.right]: Ports.flowInUpperRightPort,
      [Sides.bottom]: Ports.flowInBottomPort,
      [Sides.left]: Ports.flowInUpperLeftPort
    },
    [flowDown]: {
      [Sides.top]: Ports.flowInTopPort,
      [Sides.right]: Ports.flowInUpperRightPort,
      [Sides.bottom]: Ports.flowInBottomPort,
      [Sides.left]: Ports.flowInUpperLeftPort
    },
    [flowUp]: {
      [Sides.top]: Ports.flowInTopPort,
      [Sides.right]: Ports.flowInLowerRightPort,
      [Sides.bottom]: Ports.flowInBottomPort,
      [Sides.left]: Ports.flowInLowerLeftPort
    },
    [flowVerticalNone]: {
      [Sides.top]: Ports.flowInTopPort,
      [Sides.right]: Ports.ioOutputPort,
      [Sides.bottom]: Ports.flowInBottomPort,
      [Sides.left]: Ports.ioInputPort
    }
  },
  decision: {
    [flowNextDown]: {
      [Sides.top]: Ports.flowInTopPort,
      [Sides.right]: Ports.flowCentreRightPort,
      [Sides.bottom]: Ports.flowInBottomPort,
      [Sides.left]: Ports.flowCentreLeftPort
    },
    [flowDown]: {
      [Sides.top]: Ports.flowInTopPort,
      [Sides.right]: Ports.flowCentreRightPort,
      [Sides.bottom]: Ports.flowInBottomPort,
      [Sides.left]: Ports.flowCentreLeftPort
    },
    [flowUp]: {
      [Sides.top]: Ports.flowInTopPort,
      [Sides.right]: Ports.flowCentreRightPort,
      [Sides.bottom]: Ports.flowInBottomPort,
      [Sides.left]: Ports.flowCentreLeftPort
    },
    [flowVerticalNone]: {
      [Sides.top]: Ports.flowInTopPort,
      [Sides.right]: Ports.flowCentreRightPort,
      [Sides.bottom]: Ports.flowInBottomPort,
      [Sides.left]: Ports.flowCentreLeftPort
    }
  }
}
//
// Flow output port identifier according to type of step and direction of flow
//
export const outPortId = {
  process: {
    [flowNextDown]: {
      [Sides.top]: Ports.flowOutTopPort,
      [Sides.right]: Ports.flowOutLowerRightPort,
      [Sides.bottom]: Ports.flowOutBottomPort,
      [Sides.left]: Ports.flowOutLowerLeftPort
    },
    [flowDown]: {
      [Sides.top]: Ports.flowOutTopPort,
      [Sides.right]: Ports.flowOutLowerRightPort,
      [Sides.bottom]: Ports.flowOutBottomPort,
      [Sides.left]: Ports.flowOutLowerLeftPort
    },
    [flowUp]: {
      [Sides.top]: Ports.flowOutTopPort,
      [Sides.right]: Ports.flowOutUpperRightPort,
      [Sides.bottom]: Ports.flowOutBottomPort,
      [Sides.left]: Ports.flowOutUpperLeftPort
    },
    [flowVerticalNone]: {
      [Sides.top]: Ports.flowOutTopPort,
      [Sides.right]: Ports.ioOutputPort,
      [Sides.bottom]: Ports.flowOutBottomPort,
      [Sides.left]: Ports.ioInputPort
    }
  },
  decision: {
    [flowNextDown]: {
      [Sides.top]: Ports.flowOutTopPort,
      [Sides.right]: Ports.flowCentreRightPort,
      [Sides.bottom]: Ports.flowOutBottomPort,
      [Sides.left]: Ports.flowCentreLeftPort
    },
    [flowDown]: {
      [Sides.top]: Ports.flowOutTopPort,
      [Sides.right]: Ports.flowCentreRightPort,
      [Sides.bottom]: Ports.flowOutBottomPort,
      [Sides.left]: Ports.flowCentreLeftPort
    },
    [flowUp]: {
      [Sides.top]: Ports.flowOutTopPort,
      [Sides.right]: Ports.flowCentreRightPort,
      [Sides.bottom]: Ports.flowOutBottomPort,
      [Sides.left]: Ports.flowCentreLeftPort
    },
    [flowVerticalNone]: {
      [Sides.top]: Ports.flowOutTopPort,
      [Sides.right]: Ports.flowCentreRightPort,
      [Sides.bottom]: Ports.flowOutBottomPort,
      [Sides.left]: Ports.flowCentreLeftPort
    }
  }
}

// Flow intput port preferences for step according to type of step and direction of flow
//
export const preferredInPort = {
  process: {
    [flowNextDown]: {
      [flowLeft]: { port: Ports.flowInTopPort, side: Sides.top },
      [flowRight]: { port: Ports.flowInTopPort, side: Sides.top },
      [flowHorizontalNone]: { port: Ports.flowInTopPort, side: Sides.top }
    },
    [flowDown]: {
      [flowLeft]: { port: Ports.flowInTopPort, side: Sides.top },
      [flowRight]: { port: Ports.flowInTopPort, side: Sides.top },
      [flowHorizontalNone]: { port: Ports.flowInTopPort, side: Sides.top }
    },
    [flowUp]: {
      [flowLeft]: { port: Ports.flowInLowerRightPort, side: Sides.right },
      [flowRight]: { port: Ports.flowInLowerLeftPort, side: Sides.left },
      [flowHorizontalNone]: { port: Ports.flowInLowerLeftPort, side: Sides.left }
    },
    [flowVerticalNone]: {
      [flowLeft]: { port: Ports.ioOutputPort, side: Sides.right },
      [flowRight]: { port: Ports.ioInputPort, side: Sides.left }
    }
  },
  decision: {
    [flowNextDown]: {
      [flowLeft]: { port: Ports.flowInTopPort, side: Sides.top },
      [flowRight]: { port: Ports.flowInTopPort, side: Sides.top },
      [flowHorizontalNone]: { port: Ports.flowInTopPort, side: Sides.top }
    },
    [flowDown]: {
      [flowLeft]: { port: Ports.flowInTopPort, side: Sides.top },
      [flowRight]: { port: Ports.flowInTopPort, side: Sides.top },
      [flowHorizontalNone]: { port: Ports.flowInTopPort, side: Sides.top }
    },
    [flowUp]: {
      [flowLeft]: { port: Ports.flowInTopPort, side: Sides.top },
      [flowRight]: { port: Ports.flowInTopPort, side: Sides.top },
      [flowHorizontalNone]: { port: Ports.flowInTopPort, side: Sides.top }
    },
    [flowVerticalNone]: {
      [flowLeft]: { port: Ports.flowInTopPort, side: Sides.top },
      [flowRight]: { port: Ports.flowInTopPort, side: Sides.top }
    }
  }
}
//
// Flow output port preferences for process according to type of step and direction of flow
//
export const preferredOutPort = {
  process: {
    [flowNextDown]: {
      [flowLeft]: { port: Ports.flowOutBottomPort, side: Sides.bottom },
      [flowRight]: { port: Ports.flowOutBottomPort, side: Sides.bottom },
      [flowHorizontalNone]: { port: Ports.flowOutBottomPort, side: Sides.bottom }
    },
    [flowDown]: {
      [flowLeft]: { port: Ports.flowOutBottomPort, side: Sides.bottom },
      [flowRight]: { port: Ports.flowOutBottomPort, side: Sides.bottom },
      [flowHorizontalNone]: { port: Ports.flowOutLowerRightPort, side: Sides.right }
    },
    [flowUp]: {
      [flowLeft]: { port: Ports.flowOutUpperLeftPort, side: Sides.left },
      [flowRight]: { port: Ports.flowOutUpperRightPort, side: Sides.right },
      [flowHorizontalNone]: { port: Ports.flowOutUpperLeftPort, side: Sides.left }
    },
    [flowVerticalNone]: {
      [flowLeft]: { port: Ports.ioInputPort, side: Sides.left },
      [flowRight]: { port: Ports.ioOutputPort, side: Sides.right }
    }
  },
  decision: {
    [flowNextDown]: {
      [flowLeft]: { port: Ports.flowCentreLeftPort, side: Sides.left },
      [flowRight]: { port: Ports.flowCentreRightPort, side: Sides.right },
      [flowHorizontalNone]: { port: Ports.flowOutBottomPort, side: Sides.bottom }
    },
    [flowDown]: {
      [flowLeft]: { port: Ports.flowOutBottomPort, side: Sides.bottom },
      [flowRight]: { port: Ports.flowOutBottomPort, side: Sides.bottom },
      [flowHorizontalNone]: { port: Ports.flowOutBottomPort, side: Sides.bottom }
    },
    [flowUp]: {
      [flowLeft]: { port: Ports.flowCentreLeftPort, side: Sides.left },
      [flowRight]: { port: Ports.flowCentreRightPort, side: Sides.right },
      [flowHorizontalNone]: { port: Ports.flowCentreLeftPort, side: Sides.left }
    },
    [flowVerticalNone]: {
      [flowLeft]: { port: Ports.flowCentreLeftPort, side: Sides.left },
      [flowRight]: { port: Ports.flowCentreRightPort, side: Sides.right }
    }
  }
}
//
// Alternative output port for decision if preferred port is already in use
// Note: assume decision in same row as another step isn't allowed if it can't use first preference port
//
export const alternativeDecisionOutPort = {
  [Ports.flowCentreLeftPort]: { port: Ports.flowOutBottomPort, side: Sides.bottom },
  [Ports.flowOutBottomPort]: { port: Ports.flowCentreRightPort, side: Sides.right },
  [Ports.flowCentreRightPort]: { port: Ports.flowCentreLeftPort, side: Sides.left }
}

//
// Map sides to partitions
//
export const partition = {
  [Sides.left]: Data.partitionLeft,
  [Sides.right]: Data.partitionRight,
  [Sides.bottom]: Data.partitionCentre
}
//
// Identify opposite side of element
//
export const otherSide = {
  [Sides.left]: Sides.right,
  [Sides.right]: Sides.left,
  [Sides.top]: Sides.bottom,
  [Sides.bottom]: Sides.top
}
//
// Indicate if "side" is on side or top/bottom
//
export const onSide = {
  [Sides.left]: true,
  [Sides.right]: true,
  [Sides.top]: false,
  [Sides.bottom]: false
}
