import 'core-js/stable/array/find';
import 'core-js/stable/array/find-index';
import 'core-js/stable/array/flat';
import 'core-js/stable/array/includes';
import 'core-js/stable/array/entries';
import 'core-js/stable/array/from';
import 'core-js/stable/object/values';
import 'core-js/stable/object/entries';
import 'core-js/stable/string/includes';

import { setUpEnvironment, drawDiagram, createGradients, addInteractivity, addHoverFunctionality } from './_d3_handling'
import { Cord } from './_data_handling'

export function createCordDiagram(config) {
    let cord = new Cord(config);

    var superDataChanged = config.functions.dataChanged;
    config.functions.dataChanged = function dataChanged(data) {
        superDataChanged(data);

        config.data = data;

        cord.initialise();

        setUpEnvironment(config,
            { parent: 'svg', id: 'all', transform: 'translate(0,0)' },
            { parent: '#all', id: 'links', transform: 'translate(' + (cord._width / 2) + ',' + (cord._height / 2) + ') scale(0.85,0.95)' },
            { parent: '#all', id: 'nodes', transform: 'translate(' + (cord._width / 2) + ',' + (cord._height / 2) + ') scale(0.85,0.95)' },
            { parent: '#nodes', id: 'LHS' },
            { parent: '#nodes', id: 'RHS' },
            { parent: '#all', id: 'labels', transform: 'translate(' + (cord._width / 2) + ',' + (cord._height / 2) + ')' },
            { parent: '#labels', id: 'L', transform: 'translate(' + (cord._width * -0.4625) + ',0)' },
            { parent: '#labels', id: 'R', transform: 'translate(' + (cord._width / 2) + ',0)' },
            { parent: 'svg', id: 'defs' }
        )
    
        createGradients(cord)
        drawDiagram(cord);
        addInteractivity(config.functions, cord);
    };

    var superInputChanged = config.functions.inputChanged;
    config.functions.inputChanged = function inputChanged(name, value) {
        superInputChanged(name, value);

        if (name.toLowerCase() === "lhsnode") {
            config.inputs.LHSnode = value;
            config.functions.dataChanged(config.data);
        }
    };

    config.functions.dataChanged(config.data);
}