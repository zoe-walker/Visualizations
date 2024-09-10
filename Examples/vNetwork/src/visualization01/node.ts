import { Edge } from './edge'

interface EdgeMap {
  [name: string]: Edge
}

export class Node {
  readonly id: string
  protected outEdges: Edge[] = []
  protected inEdges: Edge[] = []
  protected edgeMap: EdgeMap = {}

  constructor (id: string) {
    this.id = id
  }

  public addEdge (edge: Edge): void {
    if (edge.source !== this.id && edge.target !== this.id) {
      throw new DOMException('Edge ' + edge.id + ' is not a valid edge to add to node ' + this.id)
    }
    if (this.edgeMap[edge.id] === undefined) {
      this.edgeMap[edge.id] = edge
      if (edge.source === this.id) {
        this.outEdges.push(edge)
      }
      if (edge.target === this.id) {
        this.inEdges.push(edge)
      }
    }
  }

  public isUnbalanced (): boolean {
    return this.outEdges.length !== this.inEdges.length
  }

  public flowMismatch (): number {
    return this.outEdges.length - this.inEdges.length
  }

  public edges (): Edge[] {
    return this.outEdges
  }

  public untraversedEdges (): Edge[] {
    return this.outEdges.filter(edge => !edge.isTraversed())
  }

  public isSource (): boolean {
    return this.inEdges.length === 0
  }

  public isValidPathSource (): boolean {
    return this.inEdges.length === 0 &&
     this.outEdges.length === 1
  }

  public isSink (): boolean {
    return this.outEdges.length === 0
  }

  public isValidPathSink (): boolean {
    return this.outEdges.length === 0 &&
     this.inEdges.length === 1
  }
}
