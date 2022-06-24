[README](../README.md)

[Template Customisation Guide](template-customisation-guide.md#webpackcommonjs)

# webpack.common.js

* Babel loader configuration, including supported browsers
* visualization entry point(s)
* Possible SplitChunks for any additional EChart chart libraries

  You will need to update the dependencies in `src/no-guid.package.json.ejs` (see below) for any chunks you add

  For example
```JavaScript

   optimization: {
        splitChunks: {
            cacheGroups: {
                "echarts" : {
                    test: /[\\/]node_modules[\\/](echarts.*)[\\/]/,
                    name: 'echarts',
                    chunks: 'all',
                    priority: -3,
                    enforce: true
                },
                "other" : {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'other',
                    chunks: 'all',
                    priority: -10,
                    enforce: true
                }
            }
        }
   }
```

* VersionFile plugins for any additional visualizations

[README](../README.md)

[Template Customisation Guide](template-customisation-guide.md#webpackcommonjs)

# src/visualization01/visualization.js

* Add/amend import statements for ECharts components you need

```JavaScript
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
```

* Define the options for the chart and populate the series data from the data passed in

```JavaScript
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

```

[README](../README.md)

[Template Customisation Guide](template-customisation-guide.md#srcvisualization01visualizationjs)

# src/no-guid.package.json.ejs

Embedded JavaScript Template for visualization package.json.ejs template.

[See instructions](template-customisation-guide.md#generate-guids) on how to generate package.json.ejs containing a GUID after customising this file.
* Do not alter the id or version properties
* Update visualization package properties

    For example
```JSON
{
  "id": "<%= uuid.v4(); %>",
  "name": "Bar Chart",
  "description": "Example Bar Chart",
  "version": "<%%= package.version %%>",
```
* Update dependencies - e.g. chart library

  Add dependencies for any chunks added by changes to `webpack.common.js` above

  For example
```JSON
{
  "dependencies": {
    "echarts": "./echarts/visualization.js",
    "other": "./other/visualization.js"
  }
}
```

[README](../README.md)

[Template Customisation Guide](template-customisation-guide.md#srcno-guidpackagejsonejs)
