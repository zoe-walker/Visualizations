//
// D3 scatter plot example
// https://www.d3-graph-gallery.com/graph/scatter_basic.html
//
// ** MooD BA customisation - start **
//    Entry function declaration
//
import * as d3 from "d3";
/**
 * 
 * @param {object} config MooD visualisation config object 
 */
export function visualization(config) {
  //
  // Retrieve graph configuration
  //
  var inputs = config.inputs;
  var xMin = inputs.xAxisMin;
  var xMax = inputs.xAxisMax;
  var yMin = inputs.yAxisMin;
  var yMax = inputs.yAxisMax;
  var style = config.style;
  var margin = style.margin;
  var width = parseFloat(config.width) - margin.left - margin.right;
  var height = parseFloat(config.height) - margin.top - margin.bottom;
  var spotRadius = style.spotRadius;
  var fillColour = style.fillColour;
  //
  // ** MooD BA customisation - end **
  //
  
  //
  // ** MooD BA customisation - start **
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
  //
  // ** MooD BA customisation - end **
  //
  
  //
  // ** MooD BA customisation - start **
  //    Read the data
  //
  var data = config.data.rows
  //
  // ** MooD BA customisation - end **
  //

    // Add X axis
    var x = d3.scaleLinear()
      .domain([xMin, xMax])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([ height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));
  
    // Add dots
    svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function (d) { return x(d.x); } )
        .attr("cy", function (d) { return y(d.y); } )
        .attr("r", spotRadius)
        .style("fill", fillColour)
  
  }
  