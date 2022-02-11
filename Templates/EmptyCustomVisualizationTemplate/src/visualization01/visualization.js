//
// Entry function declaration
//

/**
 *
 * @param {object} config MooD visualisation config object
 */
export function visualization (config) {
  //
  // Retrieve configuration
  //

  // const inputs = config.inputs
  // const style = config.style
  // const width = parseFloat(config.width)
  // const height = parseFloat(config.height)

  if (!config.animation) {
    // Sometimes you need to draw differently when inside Business Architect. For example without animations.
  }
  
  // Add a DIV to show the vis is working
  var testDiv = document.createElement('div');
  testDiv.style.width = '100%';
  testDiv.style.height = '100%';
  testDiv.innerText = 'Place your visualization here again';

  var el = document.getElementById(config.element);
  el.appendChild(testDiv);
}
