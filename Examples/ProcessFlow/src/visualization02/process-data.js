import { ActorSet, PhaseSet } from '../visualization01/process-data'

export class Process {
  constructor (data) {
    if (!data.process) {
      throw new Error('Process data is missing')
    }
    const name = data.process.name
    const version = data.process.version
    const actors = new ActorSet(data.actors)
    const phases = new PhaseSet(data.phases)

    this.name = () => name
    this.version = () => version
    this.getActorSet = () => actors
    this.getPhaseSet = () => phases
  }
}
