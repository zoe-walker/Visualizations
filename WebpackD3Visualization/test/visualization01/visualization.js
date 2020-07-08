import {visualization} from '../../src/visualization01/visualization';
import MooDConfig from './MooDConfig.json';
import dataConfig from './data.json';
import styleConfig from './style.json';
import inputsConfig from './inputs.json';

const config = {};
let key;

for (key in MooDConfig) {
    if(MooDConfig.hasOwnProperty(key)) {
        config[key] = MooDConfig[key];
    }
}

for (key in dataConfig) {
    if(dataConfig.hasOwnProperty(key)) {
        config[key] = dataConfig[key];
    }
}

for (key in styleConfig) {
    if(styleConfig.hasOwnProperty(key)) {
        config[key] = styleConfig[key];
    }
}

for (key in inputsConfig) {
    if(inputsConfig.hasOwnProperty(key)) {
        config[key] = inputsConfig[key];
    }
}

   console.log(JSON.stringify(config));
   visualization(config);
