//
//    Entry function declaration
//
import * as Data from './process-data'
import { Diagram } from './diagram'
/**
 *
 * @param {object} config MooD visualisation config object
 */
export function visualization (config) {
  //
  // Retrieve configuration
  //
  const style = config.style
  const width = parseFloat(config.width)
  const height = parseFloat(config.height)
  //  var animation = config.animation
  const data = config.data

  let diagram = null
  let process

  const diagramConfig = {
    config: config
  }

  try {
    process = new Data.Process(data, style)
    diagram = new Diagram(process, style, width, height, diagramConfig)
    diagram.draw()
  } catch (e) {
    //
    // Write error message to the canvas
    //
    const el = document.getElementById(config.element)
    let errorMessage = e.name + ': ' + e.message
    if ('stack' in e) {
      errorMessage += '\n\nStack:\n' + e.stack
    }
    if ('lineNumber' in e && 'fileName' in e) {
      errorMessage += 'At ' + e.fileName + ':' + e.lineNumber
    }

    const errorEl = document.createElement('text')
    errorEl.style.margin = 'auto'
    errorEl.style.textAlign = 'center'
    errorEl.style.display = 'block'
    errorEl.innerText = errorMessage
    el.appendChild(errorEl)
    //
    // Report error to MooD BA
    //
    config.functions.errorOccurred(errorMessage)
  }
}
