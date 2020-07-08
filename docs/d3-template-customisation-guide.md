[README](../README.md)

# Table of Contents

*   [Install node modules for template](#install-node-modules-for-template)
*   [D3 Visualization Template File Customization](#d3-visualization-template-file-customization)
    * [webpack.common.js](#webpack.common.js)
    * [package.json](#package.json)
    * [package-lock.json](#package-lock.json)
    * [src/visualization01/visualization.js](#src/visualization01/visualization.js)
    * [src/visualization01/no-guid.visualization.config.json.ejs](#src/visualization01/no-guid.visualization.config.json.ejs)
    * [src/visualization01/visualization.datashape.gql](#src/visualization01/visualization.datashape.gql)
    * [src/no-guid.package.json.ejs](#src/no-guid.package.json.ejs)
*  [Debugging your visualization](#debugging-your-visualization)
    * [test/visualization01/data.json](#test/visualization01/data.json)
    * [test/visualization01/inputs.json](#test/visualization01/inputs.json)
    * [test/visualization01/MooDConfig.json](#test/visualization01/MooDConfig.json)
    * [test/visualization01/style.json](#test/visualization01/style.json)
* [Package version numbering](#package-version-numbering)
* [Generate GUIDs](#generate-guids)
* [Multiple visualizations in a package](#multiple-visualizations-in-a-package)

# Install node modules for template
Before customising the template files you will need to install the node modules that the template depends on.

In a Visual Studio Code terminal run the following:
```
npm install
```
If you include any additional packages for your visualization, you need to install them individually
```
npm install additional-package-name
```

[Table of Contents](#table-of-contents)

# D3 Visualization Template File Customization
__Warning: do not change the name of the following files__
* `src/visualizationNN/no-guid.visualization.config.json.ejs`
* `src/no-guid.package.json.ejs`

## webpack.common.js

* Babel loader configuration, including supported browsers
* visualization entry point(s)
* Possible SplitChunks for any additional D3 chart libraries

  You will need to update the dependencies in `src/no-guid.package.json.ejs` (see below) for any chunks you add

  For example
```JavaScript

   optimization: {
        splitChunks: {
            cacheGroups: {
                "d3" : {
                    test: /[\\/]node_modules[\\/](d3.*)[\\/]/,
                    name: 'd3',
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
 or update test property for "d3"

  For example
```JavaScript
                "d3" : {
                    test: /[\\/]node_modules[\\/](d3-hexbin.*)[\\/]/,
```
* VersionFile plugins for any additional visualizations

[Table of Contents](#table-of-contents)

## package.json

* Webpack Chart Package properties

  For example
```JSON
{
    "name": "scatter_plot",
    "description": "Example scatter plot chart based on D3 framework",
    "version": "1.1.10",
    "supportedVersions": "0",
    "license": "MIT",
```

[Table of Contents](#table-of-contents)


## package-lock.json

* Webpack Chart Package properties (lines 2 and 3)

  For example
```JSON
{
  "name": "scatter_plot",
  "version": "1.1.10",
```

[Table of Contents](#table-of-contents)


## src/visualization01/visualization.js

* Add import statements for any additional D3 chart libraries

    Add import any additional import statements after the d3 import
```JavaScript
//
//    Entry function declaration
//
import * as d3 from "d3";
import * as d3Hex from "d3-hexbin";
```

* Add chart code to visualization function

    Add the chart code at the TODO comment
```JavaScript
  //
  // TODO: Add D3 visualization code here, referencing configuration above
  //
  //
  //    append the svg to the element in MooD config
  //
  // set the dimensions and margins of the graph
  // append the svg object to the body of the page
  var svg = d3.select("#" + config.element)
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
...
```

* Pay attention to the domains within scaleLinear functions

```JavaScript
    // Add X axis
    var x = d3.scaleLinear()
      .domain([xMin, xMax])
```

[Table of Contents](#table-of-contents)


## src/visualization01/no-guid.visualization.config.json.ejs

Embedded JavaScript Template for visualization.config.json.ejs template.

See below for instructions on how to generate visualization.config.json.ejs containing a GUID after customising this file.
* Do not alter the id or version properties
* Update visualization properties

    For example
```JSON
{
  "id": "<%= uuid.v4(); %>",
  "name": "Simple Scatter Plot",
  "version": "<%%= package.version %%>",
  "supportedVersions": "0.1.0",
  "moodVersion": "16.0.064",
  "entry": {
    "file": "visualization.js",
    "function": "vis.visualization"
  },
  "supportedBrowsers": "Chrome, Edge, Firefox",
```
* Update visualization default Inputs

    For example
```JSON
  "inputs": [
    {
      "name": "xAxisMin",
      "displayName": "X Axis Range Minimum",
      "type": "Number",
      "default": 0.0
    },
    {
      "name": "xAxisMax",
      "displayName": "X Axis Range Maximum",
      "type": "Number",
      "default": 10.0
    },
    {
      "name": "yAxisMin",
      "displayName": "Y Axis Range Minimum",
      "type": "Number",
      "default": 0.0
    },
    {
      "name": "yAxisMax",
      "displayName": "Y Axis Range Maximum",
      "type": "Number",
      "default": 10.0
    }
  ],
```
* Update visualization default Styles

    For example
```JSON
  "style": {
    "JSON": {
      "margin": {
        "top": 20,
        "bottom": 20,
        "left": 20,
        "right": 20
      },
      "xAxisLabel": "X Axis",
      "yAxisLabel": "Y Axis",
      "spotRadius": 1.5,
      "fillColour": "#69b3a2"
    }
  }
```

[Table of Contents](#table-of-contents)

## src/visualization01/visualization.datashape.gql

* Define visualization graph shape


    For example
```GraphQL
type data {
	rows: [row]
}

type row implements MooDElement{
	key: ID!
	x: Number!
	y: Number!
}
```

[Table of Contents](#table-of-contents)

## src/no-guid.package.json.ejs

Embedded JavaScript Template for visualization package.json.ejs template.

See below for instructions on how to generate package.json.ejs containing a GUID after customising this file.
* Do not alter the id or version properties
* Update visualization package properties

    For example
```JSON
{
  "id": "<%= uuid.v4(); %>",
  "name": "scatter_plot",
  "version": "<%%= package.version %%>",
```
* Update dependencies - e.g. chart library

  Add dependencies for any chunks added by changes to `webpack.common.js` above

  For example
```JSON
{
...
  "dependencies": {
    "d3": "./d3/visualization.js",
    "other": "./other/visualization.js"
  }
}
```

[Table of Contents](#table-of-contents)

# Debugging your visualization
Populate the following JSON files with sample data matching the structure required by your visualization   

## test/visualization01/data.json

  For example
```JSON
"data" : {"rows" : [
    {
        "key": "guid-1",
        "x": 1.0,
        "y": 1.0
    },
```

[Table of Contents](#table-of-contents)

## test/visualization01/inputs.json

  For example
```JSON
{
  "inputs" : {
    "xAxisMin": 0.0,
    "xAxisMax": 10.0,
    "yAxisMin": 0.0,
    "yAxisMax": 10.0
  }
}
```

[Table of Contents](#table-of-contents)

## test/visualization01/MooDConfig.json

  For example
```JSON
{
    "width": "800px",
    "height": "600px",
    "element": "visualisation01_element_guid"
}
```

[Table of Contents](#table-of-contents)

## test/visualization01/style.json

  For example
```JSON
{
  "style" : {
    "margin": {
        "left": 20,
        "right": 20,
        "top": 20,
        "bottom": 20
        },
    "spotRadius": 1.5,
    "fillColour": "#69b3a2"
    }
}
```

[Table of Contents](#table-of-contents)

# Package version numbering
MooD requires the visualization package and each visualization within the package to have their own version number.
When changes are made to the visualization, the version number must be updated.
To enure that you don't forget to update the version number, the template has been configured to update the
patch number in the semantic version number (major.minor.patch) of the webpack visualization package configuration
file `./package.json`. This version is only updated when creating the production package, not when debugging.
To avoid updating the version number, use the rebuild script instead of the build script.
In a package with multiple visualizations, the version number is updated in all visualizations even if only one visualization is updated.

When running the build script to create the production
package, the newly updated version number is copied from the webpack package configuration file into the following files
* `src\package.json`
* `src\visualizationNN\visualization.config.json`

The files are updated via the corresponding EJS template files
* `src\package.json.ejs`
* `src\visualizationNN\visualization.config.json.ejs`

[Table of Contents](#table-of-contents)

# Generate GUIDs
A GUID is required in the following files
* `src\package.json`
* `src\visualizationNN\visualization.config.json`

To generate the GUIDs in these files, execute `npm run-script generate-guids`.
This uses the following EJS template files
* `src\no-guid.package.json.ejs`
* `src\no-guid.visualizationNN\visualization.config.json.ejs`

The GUIDs are written to the following files, which are the EJS templates for version numbering.
* `src\package.json.ejs`
* `src\visualizationNN\visualization.config.json.ejs`

[Table of Contents](#table-of-contents)

# Multiple visualizations in a package
If you want to have multiple visualizations in a package, the following files need to be updated
* create folder for additional visualization and should contain the following:
  * `no-guid.visualization.config.json.ejs`
  * `visualization.datashape.gql`
  * JavaScript entry file containing visualization entry function
* Create test folder for additional visualization as a copy of `./test/visualization01`
* Update json files and `visualization.js` in new test folder for the additional visualization

[Table of Contents](#table-of-contents)

[README](../README.md)
