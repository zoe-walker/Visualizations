import {visualization} from '../../src/visualization01/visualization';
import MooDConfig from './MooDConfig.json';
// import dataConfig from './data.json';
//import styleConfig from './style.json';
// import dataConfig from './data2.json';
// import dataConfig from './data-bp001.json';
// import dataConfig from './data-bp025.json';
// import dataConfig from './data-bp027.json';
import dataConfig from './data-bp100.json';
// import dataConfig from './data-bp108.json';
// import dataConfig from './data-bp124.json';
// import dataConfig from './data-bp135.json';
// import dataConfig from './data-bpXYZ.json';
// import dataConfig from './data-mro1-3 compact.json';
// import dataConfig from './data-mro1-3.json';
// import dataConfig from './data-mro4.json';
// import dataConfig from './data-ftp-demand.json';
import styleConfig from './style2.json';
import inputsConfig from './inputs.json';

const loadTestCSSurl = 'visualization01/load-test.css'
const cssTestPropertyName = 'font-size'
const cssTestPropertyAppliedValue = '10px'

const config = {}
let key
let css

for (key in MooDConfig) {
    if(MooDConfig.hasOwnProperty(key)) {
        config[key] = MooDConfig[key]
    }
}

for (key in dataConfig) {
    if(dataConfig.hasOwnProperty(key)) {
        config[key] = dataConfig[key]
    }
}

if (styleConfig.URL !== undefined) {
    css = styleConfig.URL
}


for (key in styleConfig) {
    if(styleConfig.hasOwnProperty(key) && key !== 'URL') {
        config[key] = styleConfig[key]
    }
}

for (key in inputsConfig) {
    if(inputsConfig.hasOwnProperty(key)) {
        config[key] = inputsConfig[key]
    }
}

//   console.log(JSON.stringify(config));
   addCSSFile('CSS/joint.css')
   addCSSFile('CSS/default.css')
   addCSSFile(css)
   //
   // Load test CSS. Will check that this has been applied before
   // calling visualisation
   //
   addCSSFile(loadTestCSSurl)
   
    //
    // Define updateOutput function to log to console changes to output
    //
    var errorOccurred = function(error) {
        console.log(error)
    }
    //
    // Define performAction function to log to console actions triggered by visualisation
    //
    var performAction = function(name, id, event) {
        console.log('Perform Action: name = ' + name + ', id = ' + id + ', event: ' + JSON.stringify(event))
        config.functions.inputChanged('highlightNode', id)
    }
    //
    // Define inputChanged function
    //
    var inputChanged = function (name, value) {
        console.log('Inputs Changed: name = ' + name + ', value: ' + JSON.stringify(value))
    }
    //
    // Define hasAction function
    // Executes callback function for each id, naively responding with true 
    //
    var hasAction = function (actionName, ids, callbackFn) {
        let idArray = ids
        if (!Array.isArray(ids)) {
            idArray = []
            idArray.push(ids)
        }
        idArray.forEach(id => callbackFn(true, id))
    }

    config.functions = {
        errorOccurred: errorOccurred,
        performAction: performAction,
        inputChanged: inputChanged,
        hasAction: hasAction
    };
   var el = document.getElementById(config.element)
   el.style.height = config.height
   el.style.width = config.width
   waitForCss(visualization, config)


function addCSSFile(cssURL) {
    if (cssURL !== undefined && cssURL !== null) {
        var link = document.createElement( "link" );
        link.href = cssURL
        link.type = "text/css";
        link.rel = "stylesheet";
        link.media = "screen,print";

        document.getElementsByTagName( "head" )[0].appendChild( link );    
    }
}

function waitForCss(callback, param) {
    function checkStyle(testElement, prop, param, callback) {
        const computedValue = window.getComputedStyle(testElement, null).getPropertyValue(prop)
        console.log('Computed value = ' + computedValue)
        if (computedValue !== cssTestPropertyAppliedValue) {
            window.setTimeout(function() {checkStyle(testElement, prop, param, callback)}, 100)
        } else {
            callback(param)
        }
    }

    const testElement = document.getElementById(param.element)
    checkStyle(testElement, cssTestPropertyName, param, callback)
}

