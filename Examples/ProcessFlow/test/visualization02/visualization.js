import {visualization} from '../../src/visualization02/visualization';
import MooDConfig from './MooDConfig.json';
// import dataConfig from '../visualization01/data.json';
//import styleConfig from '../visualization01/style.json';
// import dataConfig from '../visualization01/data2.json';
// import dataConfig from '../visualization01/data-bp001.json';
// import dataConfig from '../visualization01/data-bp025.json';
import dataConfig from '../visualization01/data-bp025-redrawn.json';
// import dataConfig from '../visualization01/data-bp027.json';
// import dataConfig from '../visualization01/data-bp100.json';
// import dataConfig from '../visualization01/data-bp108.json';
// import dataConfig from '../visualization01/data-bp124.json';
// import dataConfig from '../visualization01/data-bp135.json';
// import dataConfig from '../visualization01/data-bpXYZ.json';
// import dataConfig from '../visualization01/data-mro1-3 compact.json';
// import dataConfig from '../visualization01/data-mro1-3.json';
// import dataConfig from '../visualization01/data-mro4.json';
// import dataConfig from '../visualization01/data-ftp-demand.json';
import styleConfig from './style2.json';
import inputsConfig from './inputs.json';

const loadTestCSSurl = 'visualization02/load-test.css'
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
    }
    config.functions = {
        errorOccurred: errorOccurred,
        performAction: performAction
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

