import * as echarts from 'echarts'

//
// Entry function declaration
//

/**
 * @param {object} config MooD visualisation config object
 */
export function visualization (config) {

  // const inputs = config.inputs
  // const style = config.style
  const width = parseFloat(config.width)
  const height = parseFloat(config.height)

  const el = document.getElementById(config.element)
  //
  // Add a basic chart to show the vis is working
  // This example is the ECharts basic bar chart - https://echarts.apache.org/examples/en/editor.html?c=bar-simple
  //
  var chart = echarts.init(el, null, { renderer: 'canvas', width: width, height: height });
  
  var option = {
    animation: config.animation,
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
      }
    ]
  };

  chart.setOption(option);
}
