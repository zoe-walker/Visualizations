//
// Names of diagram element "ports"
// Ports are positions on process step shapes where input/output and flow links can
// start or end as appropriate
//
export const flowPorts = {
  input: {
    left: {
      upper: 'portFlowInUpperLeft',
      centre: 'portFlowCentreLeft',
      lower: 'portFlowInLowerLeft'
    },
    right: {
      upper: 'portFlowInUpperRight',
      centre: 'portFlowCentreRight',
      lower: 'portFlowInLowerRight'
    },
    top: {
      centre: 'portFlowInTop'
    }
  },
  output: {
    left: {
      upper: 'portFlowOutUpperLeft',
      centre: 'portFlowCentreLeft',
      lower: 'portFlowOutLowerLeft'
    },
    right: {
      upper: 'portFlowOutUpperRight',
      centre: 'portFlowCentreRight',
      lower: 'portFlowOutLowerRight'
    },
    bottom: {
      centre: 'portFlowOutBottom'
    }
  }
}

export const ioPorts = {
  input: 'portInLeft',
  output: 'portOutRight'
}
//
// I/O ports
//
export const ioInputPort = ioPorts.input
export const ioOutputPort = ioPorts.output
//
// Flow input ports
//
export const flowInUpperLeftPort = flowPorts.input.left.upper
export const flowInLowerLeftPort = flowPorts.input.left.lower
export const flowInTopPort = flowPorts.input.top.centre
export const flowInBottomPort = flowPorts.output.bottom.centre
export const flowInUpperRightPort = flowPorts.input.right.upper
export const flowInLowerRightPort = flowPorts.input.right.lower
//
// Flow Output ports
//
export const flowOutUpperLeftPort = flowPorts.output.left.upper
export const flowOutLowerLeftPort = flowPorts.output.left.lower
export const flowOutTopPort = flowPorts.input.top.centre
export const flowOutBottomPort = flowPorts.output.bottom.centre
export const flowOutUpperRightPort = flowPorts.output.right.upper
export const flowOutLowerRightPort = flowPorts.output.right.lower
//
// Flow input/output (shared) ports
//
export const flowCentreLeftPort = flowPorts.input.left.centre
export const flowCentreRightPort = flowPorts.input.right.centre
//
// Object defining ports on opposite side
//
export const oppositePorts = {
  [ioInputPort]: ioOutputPort,
  [ioOutputPort]: ioInputPort,
  [flowInUpperLeftPort]: flowInUpperRightPort,
  [flowCentreLeftPort]: flowCentreRightPort,
  [flowInLowerLeftPort]: flowInLowerRightPort,
  [flowInTopPort]: flowInBottomPort,
  [flowInBottomPort]: flowInTopPort,
  [flowInUpperRightPort]: flowInUpperLeftPort,
  [flowCentreRightPort]: flowCentreLeftPort,
  [flowInLowerRightPort]: flowInLowerLeftPort,
  [flowOutUpperLeftPort]: flowOutUpperRightPort,
  [flowOutLowerLeftPort]: flowOutLowerRightPort,
  [flowOutBottomPort]: flowOutTopPort,
  [flowOutTopPort]: flowOutBottomPort,
  [flowOutUpperRightPort]: flowOutUpperLeftPort,
  [flowOutLowerRightPort]: flowOutLowerLeftPort
}
