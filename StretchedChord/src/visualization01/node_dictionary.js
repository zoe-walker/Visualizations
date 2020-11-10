export class NodeDictionary {
  constructor () {
    const lhsNodes = {}
    const rhsNodes = {}

    this.add = function (node) {
      if (node.lhs) {
        lhsNodes[node.id] = node
      } else {
        rhsNodes[node.id] = node
      }
    }

    this.find = function (id) {
      const node = lhsNodes[id]
      return node === undefined ? rhsNodes[id] : node
    }

    this.findOnOtherSide = function (sourceId, id) {
      const sourceNode = this.find(sourceId)
      return sourceNode === undefined ? undefined : sourceNode.lhs ? rhsNodes[id] : lhsNodes[id]
    }
  }
}
