import * as ActivityGroup from './group-label'
//
// Configuration of JointJS Activity (Step) Group Label position
//
export const elementAttributes = {
  [ActivityGroup.labelPositionNW]: {
    textVerticalAnchor: 'top',
    textAnchor: 'start',
    refX: '0%',
    refY: '0%',
    refX2: 5,
    refY2: 5
  },
  [ActivityGroup.labelPositionN]: {
    textVerticalAnchor: 'top',
    textAnchor: 'middle',
    refX: '50%',
    refY: '0%',
    refX2: 0,
    refY2: 5
  },
  [ActivityGroup.labelPositionNE]: {
    textVerticalAnchor: 'top',
    textAnchor: 'end',
    refX: '100%',
    refY: '0%',
    refX2: -5,
    refY2: 5
  },
  [ActivityGroup.labelPositionW]: {
    textVerticalAnchor: 'middle',
    textAnchor: 'start',
    refX: '0%',
    refY: '50%',
    refX2: 5,
    refY2: 0
  },
  [ActivityGroup.labelPositionZero]: {
    textVerticalAnchor: 'middle',
    textAnchor: 'middle',
    refX: '50%',
    refY: '50%',
    refX2: 0,
    refY2: 0
  },
  [ActivityGroup.labelPositionE]: {
    textVerticalAnchor: 'middle',
    textAnchor: 'end',
    refX: '100%',
    refY: '50%',
    refX2: -5,
    refY2: 0
  },
  [ActivityGroup.labelPositionSW]: {
    textVerticalAnchor: 'bottom',
    textAnchor: 'start',
    refX: '0%',
    refY: '100%',
    refX2: 5,
    refY2: -5
  },
  [ActivityGroup.labelPositionS]: {
    textVerticalAnchor: 'bottom',
    textAnchor: 'middle',
    refX: '50%',
    refY: '100%',
    refX2: 0,
    refY2: -5
  },
  [ActivityGroup.labelPositionSE]: {
    textVerticalAnchor: 'bottom',
    textAnchor: 'end',
    refX: '100%',
    refY: '100%',
    refX2: -5,
    refY2: -5
  },
  [ActivityGroup.labelPositionDefault]: {
    textVerticalAnchor: 'bottom',
    textAnchor: 'start',
    refX: '0%',
    refY: '0%',
    refX2: 0,
    refY2: 0
  },
  [ActivityGroup.labelPositionLeft]: {
    textVerticalAnchor: 'top',
    textAnchor: 'end',
    refX: '0%',
    refY: '0%',
    refX2: -5,
    refY2: 5
  },
  [ActivityGroup.labelPositionRight]: {
    textVerticalAnchor: 'top',
    textAnchor: 'start',
    refX: '100%',
    refY: '0%',
    refX2: 5,
    refY2: 5
  }
}
