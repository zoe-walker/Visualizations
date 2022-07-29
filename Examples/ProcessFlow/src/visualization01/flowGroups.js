import * as Config from './flow-config'
import * as Sides from './jointjs-side-types'

/**
 * Compare compass directions for similarity. Where one direction is North or South, ignore East or West in the other
 * @param {*} direction1
 * @param {*} direction2
 */
export function similarCompassDirection (direction1, direction2) {
  const compareChars = Math.min(direction1.length, direction2.length)
  return direction1.substr(0, compareChars) === direction2.substr(0, compareChars)
}

/**
 * Compare compass directions for opposite vertical (North/South).
 * @param {*} direction1
 * @param {*} direction2
 */
export function oppositeVerticalDirection (direction1, direction2) {
  const compareChars = 1
  return direction1.substr(0, compareChars) !== direction2.substr(0, compareChars)
}

export class FlowGroup {
  constructor (specifier) {
    const flows = []
    const directions = {
      averageDirection: '',
      averageDirectionScore: 0
    }

    let shortestDistance = Number.POSITIVE_INFINITY

    let scoreOnPort = 0
    let horizontalScoreOnPort = 0
    let verticalScoreOnPort = 0
    let reserved = false

    this.flows = () => flows
    this.length = () => flows.length

    this.score = () => scoreOnPort
    this.horizontalScore = () => horizontalScoreOnPort
    this.verticalScore = () => verticalScoreOnPort
    this.isReservedPort = () => reserved

    this.averageDirection = () => directions.averageDirection
    this.shortestDistance = () => shortestDistance

    this.groupSpecifier = specifier

    this.addFlow = function addFlow (flow) {
      if (!flows.includes(flow)) {
        if (flows.length === 0) {
          horizontalScoreOnPort = Math.abs(flow.horizontalDistance)
          verticalScoreOnPort = Math.abs(flow.verticalDistance)
        } else {
          horizontalScoreOnPort = ((horizontalScoreOnPort * flows.length) + Math.abs(flow.horizontalDistance)) / (flows.length + 1)
          verticalScoreOnPort = ((verticalScoreOnPort * flows.length) + Math.abs(flow.verticalDistance)) / (flows.length + 1)
        }
        scoreOnPort = (horizontalScoreOnPort + verticalScoreOnPort) / 2

        directions[flow.compassDirection] === undefined ? directions[flow.compassDirection] = 1 : directions[flow.compassDirection]++
        if (directions[flow.compassDirection] > directions.averageDirectionScore) {
          directions.averageDirectionScore++
          directions.averageDirection = flow.compassDirection
        }

        if (shortestDistance > Math.abs(flow.horizontalDistance) + Math.abs(flow.verticalDistance)) {
          shortestDistance = Math.abs(flow.horizontalDistance) + Math.abs(flow.verticalDistance)
        }

        if (flow.flow.sourcePort()) {
          // If any flow in the group is tied to a port, then tie the whole group
          reserved = true
          // console.log('Group "' + specifier + '" is tied')
        }

        flows.push(flow)
      }
    }
  }
}

export class FlowGroupSet {
  constructor (currentPort, side) {
    const groups = []
    const port = currentPort
    const startDirection = side

    this.groups = () => groups
    this.length = () => groups.length
    this.port = () => port
    this.startDirection = () => startDirection

    this.allFlows = function () {
      const ret = []
      groups.forEach(function (group) {
        group.flows().forEach(function (flow) {
          ret.push(flow)
        })
      })
      return ret
    }

    this.addFlowGroup = function (flowGroupToAdd) {
      const group = groups.filter(function (flow) { return flow.groupSpecifier === flowGroupToAdd.groupSpecifier && flow.groupSpecifier !== null })
      if (group.length !== 0) {
        flowGroupToAdd.flows().forEach(function (flow) {
          group[0].addFlow(flow)
        })
      } else {
        groups.push(flowGroupToAdd)
      }
    }

    this.addFlow = function (flow, flowGroupSpecifier) {
      const group = groups.filter(function (flow) { return flowGroupSpecifier && flow.groupSpecifier === flowGroupSpecifier && flow.groupSpecifier !== null })
      if (group.length !== 0) {
        group[0].addFlow(flow)
      } else {
        this.addFlowGroup(new FlowGroup(flowGroupSpecifier))
        groups[groups.length - 1].addFlow(flow)
      }
    }

    this.pop = function () {
      return groups.pop()
    }

    function compareFlowGroups (a, b) {
      if (a.isReservedPort() || b.isReservedPort()) {
        //
        // Prefer flows with reserved output port
        //
        return a.isReservedPort() ? -1 : 1
      }
      if (similarCompassDirection(a.averageDirection(), b.averageDirection())) {
        //
        // For flows in a similar direction, prefer the one with the largest horizontal distance.
        // As a tie breaker, prefer the one with the least vertical distance to avoid line-jumps
        //
        return a.horizontalScore() === b.horizontalScore() ? a.verticalScore() - b.verticalScore() : b.horizontalScore() - a.horizontalScore()
      } else if (oppositeVerticalDirection(a.averageDirection(), b.averageDirection()) &&
                            Config.alternativeDecisionOutPort[port].side === Sides.bottom) {
        //
        // For flows in opposite vertical directions and alternative port is bottom,
        // prefer flows going upwards to avoid cross-overs
        //
        return similarCompassDirection(a.averageDirection(), 'n') ? -1 : 1
      } else if (a.verticalScore() === 0 || b.verticalScore() === 0) {
        //
        // Prefer the horizontal flow to a step in the same row
        //
        return a.verticalScore() === 0 ? -1 : 1
      } else {
        // Otherwise prefer the flow with the greatest vertical distance
        return b.verticalScore() - a.verticalScore()
      }
    }

    this.sort = function () {
      groups.sort(function (a, b) {
        return compareFlowGroups(a, b)
      })
    }
  }
}
