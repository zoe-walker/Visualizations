
var createVisualization = function(config, css){
    var elem = document.getElementById(config.element);

    const testDiv = document.createElement('div');
    testDiv.style.width = '100%';
    testDiv.style.height = '100%';
    testDiv.innerText = config.data.title;
    elem.appendChild(testDiv);
}
