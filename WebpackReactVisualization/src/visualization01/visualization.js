//
// Recharts Line Chart example
// See: http://recharts.org/en-US/guide/getting-started
//

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import React from 'react';
import ReactDOM from 'react-dom';
//
//    Entry function declaration
//
export function visualization(config) {
 
  var data = config.data.rows;
  var style = config.style;
  var margin = style.margin;
  var lineStyle = config.style.line;
  var gridStyle = config.style.CartesianGrid
  var width = parseFloat(config.width);
  var height = parseFloat(config.height);
  var animation = config.animation;
 
  //console.log(JSON.stringify(config));
  const renderLineChart = (
    <LineChart width={width} height={height} data={data} margin={margin} >
      <Line type={lineStyle.type} dataKey="value" stroke={lineStyle.strokeColour} isAnimationActive={animation} />
      <CartesianGrid stroke={gridStyle.stroke} strokeDasharray={gridStyle.strokeDasharray} />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip isAnimationActive={animation} />
    </LineChart>
  );
//         console.log(JSON.stringify(renderLineChart, function(key, val) { return (typeof val === 'function') ? '[function]'  : val; }, 4));
    ReactDOM.render(renderLineChart, document.getElementById(config.element));
}

