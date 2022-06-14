//
// Refer to the following guide on importing packages to keep the bundle size to a minimum:
// https://apache.github.io/echarts-handbook/en/basics/import#importing-required-charts-and-components-to-have-minimal-bundle
//
// Import the echarts core module, which provides the necessary interfaces for using echarts.
import * as echarts from 'echarts/core'
// Import bar charts, all suffixed with Chart
import { BarChart } from 'echarts/charts'
// Import the Canvas renderer
// Note that introducing the CanvasRenderer or SVGRenderer is a required step
import { CanvasRenderer } from 'echarts/renderers'

import {
  GridComponent
} from 'echarts/components'
// Import the tooltip, title, rectangular coordinate system, dataset and transform components
// all suffixed with Component
/*
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components'
*/
// Features like Universal Transition and Label Layout
// import { LabelLayout, UniversalTransition } from 'echarts/features'

// Register the required components
echarts.use([
  GridComponent,
  BarChart,
  CanvasRenderer
])

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
  // This based on the ECharts Bar with Background chart - https://echarts.apache.org/examples/en/index.html#chart-type-bar
  //
  const chart = echarts.init(el, null, { renderer: 'canvas', width: width, height: height })

  const option = {
    animation: config.animation,
    backgroundColor: config.style.backgroundColor,
    xAxis: {
      type: 'category',
      data: config.data.rows.map(row => row.x)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: config.data.rows.map(row => row.y),
        type: 'bar',
        showBackground: config.style.series.showBackground,
        backgroundStyle: config.style.series.backgroundStyle
      }
    ]
  }

  chart.setOption(option)
}
