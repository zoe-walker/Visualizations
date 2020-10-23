import 'core-js/stable/array/find'
import 'core-js/stable/array/find-index'
import 'core-js/stable/array/flat'
import 'core-js/stable/array/includes'
import 'core-js/stable/array/entries'
import 'core-js/stable/array/from'
import 'core-js/stable/object/values'
import 'core-js/stable/object/entries'
import 'core-js/stable/string/includes'

import { setUpEnvironment, drawDiagram, createGradients, addInteractivity } from './_d3_handling'
import { StretchedChord } from './_data_handling'

export function createStretchedChord (config) {
  const chord = new StretchedChord(config)

  var superDataChanged = config.functions.dataChanged
  config.functions.dataChanged = function dataChanged (data) {
    superDataChanged(data)

    config.data = data

    chord.initialise()

    setUpEnvironment(config,
      { parent: 'svg', id: 'all', transform: 'translate(' + (chord._width / 2) + ',' + (chord._height / 2) + ')' },
      { parent: '#all', id: 'links' },
      { parent: '#all', id: 'nodes' },
      { parent: '#nodes', id: 'LHS', transform: 'translate(' + chord.arcCentreOffset() + ',0)' },
      { parent: '#nodes', id: 'RHS', transform: 'translate(' + -chord.arcCentreOffset() + ',0)' },
      { parent: '#all', id: 'labels' },
      { parent: '#labels', id: 'L', transform: 'translate(' + chord.lhsLabelOffset() + ',0)' },
      { parent: '#labels', id: 'R', transform: 'translate(' + chord.rhsLabelOffset() + ',0)' },
      { parent: 'svg', id: 'defs' }
    )

    createGradients(chord)
    drawDiagram(chord)
    addInteractivity(config.functions, chord)
  }

  var superInputChanged = config.functions.inputChanged
  config.functions.inputChanged = function inputChanged (name, value, addOrSet) {
    superInputChanged(name, value)
    addOrSet = addOrSet || false

    if (name.toLowerCase() === 'lhsnode') {
      if (addOrSet) {
        if (!config.inputs.LHSnode.includes(value)) {
          config.inputs.LHSnode.push(value)
        }
      } else {
        config.inputs.LHSnode = [value]
      }
      config.functions.dataChanged(config.data)
    }
  }

  config.functions.dataChanged(config.data)
}
