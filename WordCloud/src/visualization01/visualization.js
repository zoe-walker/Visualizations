//
// D3 scatter plot example
// https://www.d3-graph-gallery.com/graph/scatter_basic.html
//
// ** MooD BA customisation - start **
//    Entry function declaration
//
import * as d3 from "d3";
import * as d3Cloud from "d3-cloud"
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
  var myWords = [{word: "Running", size: 10}, {word: "Surfing", size: 20}, {word: "Climbing", size: 50}, {word: "Kiting", size: 30}, {word: "Sailing", size: 20}, {word: "Snowboarding", size: 60} ]
//
  // ** MooD BA customisation - end **
  //

  // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
  // Wordcloud features that are different from one word to the other must be here
  var layout = d3Cloud()
    .size([width, height])
    .words(myWords.map(function(d) { return {text: d.word, size:d.size}; }))
    .padding(5)        //space between words
    .rotate(function() { return ~~(Math.random() * 2) * 90; })
    .fontSize(function(d) { return d.size; })      // font size of words
    .on("end", draw);
  layout.start();

  // This function takes the output of 'layout' above and draw the words
  // Wordcloud features that are THE SAME from one word to the other can be here
  function draw(words) {
    svg
      .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
          .data(words)
        .enter().append("text")
          .style("font-size", function(d) { return d.size + "px"; })
          .style("fill", "#69b3a2")
          .attr("text-anchor", "middle")
          .style("font-family", "Impact")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text; });  
  }
}
  