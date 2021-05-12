[README](../README.md)

# Table of Contents

*   [Install node modules for template](#install-node-modules-for-template)
*   [React Visualization Template File Customization](#react-visualization-template-file-customization)
    * [webpack.common.js](#webpackcommonjs)
    * [package.json](#packagejson)
    * [package-lock.json](#package-lockjson)
    * [src/visualization01/visualization.js](#srcvisualization01visualizationjs)
    * [src/visualization01/no-guid.visualization.config.json.ejs](#srcvisualization01no-guidvisualizationconfigjsonejs)
    * [src/visualization01/visualization.datashape.gql](#srcvisualization01visualizationdatashapegql)
    * [src/no-guid.package.json.ejs](#srcno-guidpackagejsonejs)
*  [Debugging your visualization](#debugging-your-visualization)
    * [test/visualization01/data.json](#testvisualization01datajson)
    * [test/visualization01/inputs.json](#testvisualization01inputsjson)
    * [test/visualization01/MooDConfig.json](#testvisualization01moodconfigjson)
    * [test/visualization01/style.json](#testvisualization01stylejson)
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
# React Visualization Template File Customization
__Warning: do not change the name of the following files__

* `src/visualizationNN/no-guid.visualization.config.json.ejs`
* `src/no-guid.package.json.ejs`

After you have [generated GUIDs](#generate-guids) for the package configuration files, the following configuration files are generated each time you rebuild the package for debugging or production:
* `src/visualizationNN/visualization.config.json` is generated from `src/visualizationNN/visualization.config.json.ejs`
* `src/package.json` is generated from `src/package.json.ejs`

__Warning: generated configuration files__

If you need to amend configuration only edit the source `.json.ejs` file, not the generated `.json` file. Any edits you make in the `.json` file will be lost the next time you rebuild the package for debugging or production.

## webpack.common.js
* Babel loader configuration, including supported browsers and Babel plug-ins for chosen React chart library

  For example
```JavaScript
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    useBuiltIns: 'entry',
                                    corejs: '3.1.4',
                                    targets: {
                                        chrome: 34,
                                        ie: 11,
                                        edge: 20,
                                        firefox: 30,
                                    },
                                    modules: false
                                }
                            ],
                            '@babel/preset-react',
                        ],
                        plugins: [
                            'recharts'
                        ],
                    }
                }
            },
        ]
    },
```
* Chunk configuration for chosen React chart library

  You will need to update the dependencies in `src/no-guid.package.json.ejs` (see below) for any chunks you add

  For example
```JavaScript
    optimization: {
        splitChunks: {
            cacheGroups: {
                "react" : {
                    test: /[\\/]node_modules[\\/](react.*)[\\/]/,
                    name: 'react',
                    chunks: 'all',
                    priority: -5,
                    enforce: true
                },
                "recharts" : {
                    test: /[\\/]node_modules[\\/](recharts.*)[\\/]/,
                    name: 'recharts',
                    chunks: 'all',
                    priority: -6,
                    enforce: true
                },
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
    },
```
* VersionFile plugins for any additional visualizations

[Table of Contents](#table-of-contents)

## package.json

* Webpack Chart Package properties

  For example
```JSON
{
  "name": "line_chart",
  "description": "Example simple line chart based on React framework and recharts library",
  "version": "0.0.6",
  "supportedVersions": "0",
  "license": "MIT",
```

[Table of Contents](#table-of-contents)

## package-lock.json

* Webpack Chart Package properties (lines 2 and 3)

  For example
```JSON
{
  "name": "line_chart",
  "version": "0.0.6",
```

[Table of Contents](#table-of-contents)

## src/visualization01/visualization.js

* Add import statements for chosen React chart library

  For example
```JavaScript
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import React from 'react';
import ReactDOM from 'react-dom';
```

* Add chart code to visualization function

    Add the chart code at the TODO comment
```JSX
  //
  // TODO: Add chart code here
  //
  const renderLineChart = (
    <LineChart width={width} height={height} data={data} margin={margin}>
      <Line type={lineStyle.type} dataKey="value" stroke={lineStyle.strokeColour} />
      <CartesianGrid stroke={gridStyle.stroke} strokeDasharray={gridStyle.strokeDasharray} />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
    </LineChart>
  );
  ReactDOM.render(renderLineChart, document.getElementById(config.element));
}
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
  "name": "Recharts Line Chart",
  "description": "Example of a line chart using Recharts framework",
  "version": "<%%= package.version %%>",
  "supportedVersions": "0.0.0",
  "moodVersion": "16.0.76",
  "entry": {
    "file": "visualization.js",
    "function": "vis.visualization"
  },
  "supportedBrowsers": "Chrome, Edge, Firefox",
```

* Update visualization default Inputs

    For example
```JSON
{
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
{
  "style": {
    "URL": "visualization01/simple.css",
    "JSON": {
      "margin": {
        "left": 20,
        "right": 20,
        "top": 20,
        "bottom": 20
       },
    "line": {
        "type": "monotone",
        "strokeColour" : "#8884d8"
       },
    "CartesianGrid": {
        "stroke": "#ccc",
        "strokeDasharray" : "5 5"
       }
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
	name: String!
	value: Number!
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
  "name": "Line Chart",
  "description": "Example line chart",
  "version": "<%%= package.version %%>",
```

* Update dependencies - e.g. chart library

  For example
```JSON
{
  "dependencies": {
    "recharts": "./recharts/visualization.js",
    "react": "./react/visualization.js",
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
{
  "data" : {"rows" : [
    {"key": "guid-1", "name": "Page A", "value": 400},
    {"key": "guid-2", "name": "Page B", "value": 300},
    {"key": "guid-3", "name": "Page C", "value": 300},
    {"key": "guid-4", "name": "Page D", "value": 200},
    {"key": "guid-5", "name": "Page E", "value": 278},
    {"key": "guid-6", "name": "Page F", "value": 189}
    ]
    }
}
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
  "URL": "visualization01/simple.css",
  "style" : {
    "margin": {
        "left": 20,
        "right": 20,
        "top": 20,
        "bottom": 20
        },
    "line" : {
        "type": "monotone",
        "strokeColour" : "#8884d8"
        },
    "CartesianGrid" : {
        "stroke": "#ccc",
        "strokeDasharray" : "5 5"
        }
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
To avoid updating the version number, use the `rebuild` script instead of the `build` script.

In a package with multiple visualizations, the version number is updated in all visualizations even if only one visualization is updated. If you need to control version numbers of the individual visualizations separately you can disable the automatic version numbering of visualizations. You then need to manually update the version number (and any other visualization configuration) in the `src/visualizationNN/visualization.config.json` file; the `src/visualizationNN/visualization.config.json.ejs` will no longer be used. To disable automatic version numbering remove or comment out the following code from the `.\webpack.common.js` file:

```JavaScript
//
//  VersionFiles for each visualization configuration
//
    let vcVersionFiles = VisualizationDirectories
        .map(d => Object(new VersionFile({
            packageFile: path.join(__dirname, 'package.json'),
            template: path.join(__dirname, 'src', d.directoryName, 'visualization.config.json.ejs'),
            outputFile: path.join(__dirname, 'src', d.directoryName, 'visualization.config.json')
            })));
```

When running the build script to create the production
package, the newly updated version number is copied from the webpack package configuration file into the following files

* `src/package.json`
* `src/visualizationNN/visualization.config.json`

The files are updated via the corresponding EJS template files

* `src/package.json.ejs`
* `src/visualizationNN/visualization.config.json.ejs`

[Table of Contents](#table-of-contents)

# Generate GUIDs
A GUID is required in the following files

* `src/package.json`
* `src/visualizationNN/visualization.config.json`

To generate the GUIDs in these files, execute `npm run-script generate-guids`.

This uses the following EJS template files

* `src/no-guid.package.json.ejs`
* `src/no-guid.visualizationNN\visualization.config.json.ejs`

The GUIDs are written to the following files, which are the EJS templates for version numbering.

* `src/package.json.ejs`
* `src/visualizationNN/visualization.config.json.ejs`

If you need to amend configuration only edit the source `.json.ejs` files for version numbering, not the generated `.json` file. Any edits you make in the `.json` file will be lost the next time you rebuild the package for debugging or production.

[Table of Contents](#table-of-contents)

# Multiple visualizations in a package
If you want to have multiple visualizations in a package, the following files need to be updated

* create folder for additional visualization and should contain the following:

  * `no-guid.visualization.config.json.ejs`
    * See [Package version numbering](#package-version-numbering) above about manually setting visualization version numbers in a multi-visualization package.
  * `visualization.datashape.gql`
  * JavaScript entry file containing visualization entry function
* Create test folder for additional visualization as a copy of `./test/visualization01`
* Update json files and `visualization.js` in new test folder for the additional visualization

[Table of Contents](#table-of-contents)

[README](../README.md)


