//
// Refer to the following guide on importing packages to keep the bundle size to a minimum:
// https://apache.github.io/echarts-handbook/en/basics/import#importing-required-charts-and-components-to-have-minimal-bundle
//
// Import the echarts core module, which provides the necessary interfaces for using echarts.
import * as echarts from 'echarts/core'
// Import bar charts, all suffixed with Chart
import { TreeChart } from 'echarts/charts'
// Import the Canvas renderer
// Note that introducing the CanvasRenderer or SVGRenderer is a required step
import { CanvasRenderer } from 'echarts/renderers'

import {
  TooltipComponent
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
  TooltipComponent,
  TreeChart,
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
  const seriesData = {}
  const flatData = []
  const superInputChanged = config.functions.inputChanged
  let chart
  let option
  try {
    const width = parseFloat(config.width)
    const height = parseFloat(config.height)

    config.functions.inputChanged = inputChanged

    buildData(config.data, seriesData, flatData)

    let treeDepth = config.inputs.maxDepth || 2
    console.log('Initial depth = ' + treeDepth)
    expand(flatData, treeDepth)

    const el = document.getElementById(config.element)
    //
    // This based on the ECharts Radial Tree chart - https://echarts.apache.org/examples/en/editor.html?c=tree-radial
    //
    chart = echarts.init(el, null, { renderer: 'canvas', width: width, height: height })

    chart.hideLoading()
    option = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          type: 'tree',
          data: [seriesData],
          top: config.style.series.top,
          bottom: config.style.series.bottom,
          layout: 'radial',
          symbol: config.style.series.symbol,
          symbolSize: config.style.series.symbolSize,
          initialTreeDepth: treeDepth,
          animationDurationUpdate: 750,
          emphasis: {
            focus: 'descendant'
          }
        }
      ]
    }
    chart.setOption(option)
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

  /**
   * Handle change to input.
   * Maximum tree depth
   * @param {String} name name of input
   * @param {*} value number
   */
  function inputChanged (name, value) {
    superInputChanged(name, value)
    console.log('name: ' + name + ', value: ' + value)

    let newDepth

    if (name === 'maxDepth') {
      // ensure depth is between 1 and 4
      newDepth = Math.max(Math.min(value, 4), 1)
      expand(flatData, newDepth)
      collapse(flatData, newDepth)
      chart.setOption(option)
    }

    return true
  }
}

/**
 * Extract the data passed in to the visualization and transform into tree series data
 * @param {*} moodData Data from MooD
 * @param {*} seriesData The object to be populated with data for the tree chart
 * @param {*} flatData An array that will be populated with all the nodes in the chart
 * @return {*} tree series data
 */
function buildData (moodData, seriesData, flatData) {
  const nodeDictionary = {}
  function flatNode (node, level) {
    return {
      node: node,
      level: level
    }
  }

  function hierarchicalNode (link) {
    const node = {name: link.target.name}
    if (link.target.value) {
      node.value = link.target.value
    }
    return node
  }

  function processLink (link, level) {
    const seriesNode = hierarchicalNode(link)
    nodeDictionary[link.target.key] = seriesNode
    const parentNode = nodeDictionary[link.source.key]
    if (!parentNode) {
      throw new Error('The parent of Node: "' + link.target.name + '" is not known')
    }
    if (parentNode.children === undefined) {
      parentNode.children = []
    }
    parentNode.children.push(seriesNode)
    flatData.push(flatNode(seriesNode, level))
  }

  seriesData.name = moodData.rootNode.name
  seriesData.children = []

  nodeDictionary[moodData.rootNode.key] = seriesData
  flatData.push(flatNode(seriesData, 0, false))

  //
  // Process array data in data properties level<N>Relationship
  //
  let key
  const linkLevelPropertyPrefix = 'level'
  for (key in moodData) {
    if (Object.prototype.hasOwnProperty.call(moodData, key) &&
       key.startsWith(linkLevelPropertyPrefix)) {
      const level = parseInt(key.substring(5))
      if (Array.isArray(moodData[key])) {
        moodData[key].forEach(link => processLink(link, level))
      } else {
        throw new Error('Data for ' + key + ' is not an array')
      }
    }
  }

  return seriesData
}

function collapse (flatData, maxLevel) {
  flatData.filter(node => node.level >= maxLevel).forEach(function (node) { node.node.collapsed = true })
}

function expand (flatData, maxLevel) {
  flatData.filter(node => node.level < maxLevel).forEach(function (node) { node.node.collapsed = false })
}


