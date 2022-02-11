// A good example:          http://bl.ocks.org/mbostock/1153292
// and explained            http://www.d3noob.org/2013/03/d3js-force-directed-graph-example-basic.html
// filtering example:       http://jsfiddle.net/zhanghuancs/cuYu8/
// static tree example:     http://bl.ocks.org/d3noob/8323795
// Force hierarchy example: http://bl.ocks.org/mbostock/1138500

// TODO - why has the text shadow stopped working? only seems to work on chrome
// TODO - why have the arrows stopped working? It's the radius.. Maybe they are being drawn near the center of the circle?
// TODO - make this a class rather than globals.

var chartWidth = 800;
var chartHeight = 600;
var svg, mainGroup, force, nodes, edges, paths, markers;
var curveSetting = "Off"; // on / off
var config;
var radiusScale;

var seedRandom = function(i){
    var m_w = 123456789;
    var m_z = 987654321;
    var mask = 0xffffffff;

    m_w = (123456789 + i) & mask;
    m_z = (987654321 - i) & mask;
    
    Math.random = function(){
        // Returns number between 0 (inclusive) and 1.0 (exclusive), just like Math.random().
        m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
        m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
        var result = ((m_z << 16) + (m_w & 65535)) >>> 0;
        result /= 4294967296;
        return result;
    };
}

/////////////////////////////////////////////////////////////////////////////
// This is the entry point.
var createForceLayout = function(_config, css){

    config = _config;

    // Monkey patch Math.Random so we always get the same graph.
    seedRandom(42);

    // The data shape we are looking for:
    // var dataset = {
    //         nodes: [
    //         { name: "Vision", id: "Vision", color: "red", radius: 40, strokeWidth: 3, stroke: "#000" }
    //     ], edges: [
    //         { sourceId: "Customers", targetId: "Goals", label: "", stroke: "#000", strokeWidth: 2 }
    //     ]	
    // };

    var convertedData = {
        nodes: [],
        edges: []
    };

    chartWidth = parseInt(config.width,10);
    chartHeight = parseInt(config.height,10);

    createNodesFromMooDData(config.data.meta, convertedData.nodes);
    createEdgesFromMooDData(config.data.meta, convertedData.edges);

    /* Check for consistent incoming data.
    for(var i=0;i<convertedData.edges.length;i++){
        if(undefined===convertedData.nodes.find(n=>n.id===convertedData.edges[i].sourceId)){
            console.log("Missing node: "+convertedData.edges[i].sourceId);
        }

        if(undefined===convertedData.nodes.find(n=>n.id===convertedData.edges[i].targetId)){
            console.log("Missing node: "+convertedData.edges[i].targetId);
        }
    }*/

    convertedData.edges = convertedData.edges.filter(e=> undefined!==convertedData.nodes.find(n=>n.id===e.sourceId) && 
                                                         undefined!==convertedData.nodes.find(n=>n.id===e.targetId) );
    
    createRadiusScale(convertedData.nodes);

    onDataLoaded(convertedData);
}

var createNode = function(d)
{
    d.strokeWidth = 3;
    d.stroke = config.style["Node Line Colour"];

    d.radius = 0;
    if( d.size!==undefined && d.size!=null){
        d.radius = d.size;
    }

    if(d.color===undefined || d.color==null){
        d.color = config.style["Node Colour"];
    }
}

var createNodesFromMooDData = function(meta, convertedNodes){
    for(var i=0;i<meta.aliases.length;i++){
        var d = meta.aliases[i];

        // The ability to remove nodes
        if(config.style["Ignore Nodes"].find(x=>x==d.name) || config.style["Ignore Nodes"].find(x=>x==d.id)){
            continue;
        }

        if(d.type==="element relationship"){
            d.size = 0.5;
            d.color = config.style["Relationship Colour"];
        } else {
            d.size = 1;
        }
        createNode(d);
        convertedNodes.push(d);
    }
}

var createEdgesFromMooDData = function(meta, convertedData){

    for(var i=0;i<meta.aliases.length;i++){
        var alias = meta.aliases[i];

        // Add in links from relationships to their targets.
        if(alias.allowed_aliases!==undefined)
        {
            for(var a=0;a<alias.allowed_aliases.length;a++){
                var targetAlias = alias.allowed_aliases[a];
                convertedData.push({sourceId: alias.id, targetId: targetAlias.id, label: "", stroke: config.style["Edge Colour"], strokeWidth: 2});
            }
        }

        // Add in links from an alias to the relationship alias.
        if(alias.fields!==undefined){
            for(var j=0;j<alias.fields.length;j++) {
                var field = alias.fields[j];
                if(field.relationship_alias_id!==null){
                    convertedData.push({sourceId: alias.id, targetId: field.relationship_alias_id, label: "", stroke: config.style["Edge Colour"], strokeWidth: 2});
                }
            }
        }
    }
}

var createRadiusScale = function(nodes){
    var minRadius = Math.min.apply(Math, nodes.map(n=>n.radius));
    var maxRadius = Math.max.apply(Math, nodes.map(n=>n.radius));
    
    if(isNaN(minRadius)) { minRadius = 0; }
    if(isNaN(maxRadius)) { maxRadius = 0; }
    
    radiusScale = d3.scale.linear()
                    .domain([minRadius,maxRadius])
                    .range([config.style["Min Node Size"],config.style["Max Node Size"]])
}

function NodeRadius(node) { if(isNaN(node.radius)) {node.radius=0;}; return radiusScale(node.radius); }
function NodeColor(node)  { return node.color;  }
function NodeImage(node)  { return node.image;  }

function onDataLoaded(dataset) {

    CreateChart(dataset,tick);

    mainGroup = svg.append("svg:g");

    paths = mainGroup.append("svg:g")
                  .selectAll("path")
                  .data(force.links())
                  .enter().append("svg:path")
                  //.attr("class", function (d) { return "link " + d.type; })
                  .style("stroke", function (e) { return e.stroke; })
                  .style("stroke-width", function (e) { return e.strokeWidth; })
                  .style("marker-end", function (d) { return typeof (markers) === 'undefined' ? null : "url(#arrow)"; });  // Works on Chrome, removes links from IE.

    nodes = mainGroup.append("svg:g")
                    .selectAll("circle")
                    .data(force.nodes())
                    .enter().append("svg:circle")
                    .attr("r", function (d, i) { return NodeRadius(d); })
                    .style("fill", function (d, i) { return NodeColor(d); })
                    .style("stroke-width", function (d) { return d.strokeWidth; })
                    .style("stroke", function (d) { return d.stroke; })
        // MAYBE? .attr("text", function (d) { return d.text; })
                    .call(force.drag)

    // MJD TODO doesn't work
    //nodes.on("dblclick",function(d){ alert("node was double clicked"); });
                    
    var text = mainGroup.append("svg:g")
                  .selectAll("g")
                  .data(force.nodes())
                  .enter().append("svg:g")
                  .attr("class", "nodeText");

    // A copy of the text with a thick white stroke for legibility.
    text.append("svg:text")
        .attr("x", 0)
        .attr("y", ".31em")
        .attr("class", "shadow")
        .attr("color","#f00")
        .attr("text-anchor", "middle")
        //.attr("width", function (d) { return d.radius; })
        .text(function (d) { return d.name; });

    text.append("svg:text")
        .attr("x", 0)
        .attr("y", ".31em")
        .attr("text-anchor", "middle")
        //.attr("width", function (d) { return d.radius; })
        .text(function (d) { return d.name; });

    if(config.style["Show Icons"]===true){
        text.append("svg:image")
            //.attr("width",16)
            //.attr("height",16)
            .attr("href", function(d,i){return NodeImage(d);});
    }

    // We don't want to see the initial animation (e.g. when inside Business Architect)
    for (var i = 0; i < 200; ++i) force.tick();

    var min_zoom = 0.1;
    var max_zoom = 5;
    var zoom = d3.behavior.zoom().scaleExtent([min_zoom,max_zoom])
    
    zoom.on("zoom", function() {
        // Panning and zooming
        mainGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    });

    // Prevent panning when we click on a node.
    var drag = force.drag()
        .on("dragstart", function() { d3.event.sourceEvent.stopPropagation(); });

    //zoom.on("dblclick.zoom", null);

    svg.call(zoom);
    //svg.style("cursor","move");
    
    // Use elliptical arc path segments to doubly-encode directionality.
    function tick() {
        
        // keep in bounding box? http://mbostock.github.io/d3/talk/20110921/bounding.html
        //nodes.attr("cx", function (d) { return d.x = Math.max(NodeRadius(d), Math.min(chartWidth - NodeRadius(d), d.x)); })
        //    .attr("cy", function (d) { return d.y = Math.max(NodeRadius(d), Math.min(chartHeight - NodeRadius(d), d.y)); });
        //nodes.attr("cx", function (d) { return d.x = Math.max(NodeRadius(d), d.x); })
        //     .attr("cy", function (d) { return d.y = Math.max(NodeRadius(d), d.y); });

        nodes.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

        paths.attr("d", function (d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);

            if (curveSetting === "On") {
                return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0 1," + d.target.x + "," + d.target.y;
            } else {
                return "M" + d.source.x + "," + d.source.y + "A0,0 0 0 1," + d.target.x + "," + d.target.y;
            }
        });

        text.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

        //AdjustScrollbar();
    }
}

/*var AdjustScrollbar = function(){
    // Update the svg width/height so we get an appropriate scroll bar.
    var bbox = svg.node().getBBox();
    svg.attr("width",Math.max(bbox.x+bbox.width,chartWidth));
    svg.attr("height",Math.max(bbox.y+bbox.height,chartHeight));
} */

function CreateChart(dataset, onTick) {
    // transform from ids to nodes.
    var hash_lookup = [];
    dataset.nodes.forEach(function (d, i) {
        hash_lookup[d.id] = d;
    });

    dataset.edges.forEach(function (d, i) {
        d.source = hash_lookup[d.sourceId];
        d.target = hash_lookup[d.targetId];
    });

    force = d3.layout.force()
                  .nodes(dataset.nodes)
                  .links(dataset.edges)
                  .size([chartWidth, chartHeight])
                  .linkDistance(100)
                  .charge(function (d, i) {return -750;})
                  .linkStrength(function (d, i) {return 0.5;})
                  .on("tick", onTick)
                  .start();

    svg = d3.select("#mood-visualization")
        //.attr("style", "position: absolute; display:inline-block; overflow: auto; border: 1px solid red; width: "+chartWidth+"px; height:"+chartHeight+"px")
        .append("svg:svg")
        .attr("width", chartWidth)
        .attr("height", chartHeight);

    addArrowHeads();
}

// This has stopped working.
function addArrowHeads() {

    // Add in a marker for arrow heads (TODO only works on Chrome)
    // But seem to appear on IE when we filter something out and then in (but in the wrong place)
    // There are several posts confirming this.

    if (navigator.appName == 'Microsoft Internet Explorer') {
        return; // Taken from http://msdn.microsoft.com/en-us/library/ie/ms537509(v=vs.85).aspx
    }

    markers = svg.append("svg:defs")
        .selectAll("marker")
        .data(["arrow"])
        .enter().append("svg:marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");
}
