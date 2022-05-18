# Lollipop chart

## Purpose
A lollipop chart is a bar chart, where the bar is transformed into a line and a dot. It shows the relationship between a numeric and a categoric variable. The lollipop custom visualisation is based on [D3 Ordered Lollipop](https://www.d3-graph-gallery.com/graph/lollipop_ordered.html)

The categories are drawn on the vertical (y) axis and the values are on the horizontal (x) axis. The lollipop lines are drawn horizontally. The categories on the y axis are ordered by value, with the category with the minimum value appearing at the bottom and the category with the maximum value appearing at the top.

The x-axis range is enlarged in such a way that its minimum and maximum are nicely-rounded values, i.e. multiples of 2, 5 and powers of 10. The chart can be configured to include zero on the x-axis.

## Data Summary
The Lollipop visualisation consumes a single data set. The details of the attributes of the data set is provided in the section Data Details section

1.	Rows
    1.	A list of variables to visualise

## Style
The style of the visualisation is controlled by CSS and a collection of properties.

### CSS
A Cascading Style Sheet (CSS) is defined containing selectors for the following HTML elements in the rendered diagram. The CSS is editable within MooD BA, allowing control of the visual styling of the diagram:
1. Background colour
1. Tick text (axis label) font size

### Properties
The properties are:
1. __margin__: defines the size of a margin around the edge of the chart
    1. __top__: size of margin across the top in pixels: Default 5
    1. __bottom__: size of margin across the bottom in pixels. This defines the space reserved for the x-axis labels: Default 40
    1. __left__: size of margin across the left-hand side in pixels. This defines the space reserved for the y-axis labels. Default 150
    1. __right__: size of margin across the right-hand side in pixels: Default 5
1. __lineStroke__: The colour of the line drawn (lollipop stick). Default: grey.
1. __circleStroke__: The colour of the outline of the lollipop circle. Default: black.
1. __circleFill__: The colour of the lollipop circle. Default: #69b3a2 (green).
1. __circleRadius__: The radius of the lollipop circle in pixels. Default: 7.
1. __includeXZero__: Selects if the range of the X-axis should include zero value (true) or not (false). If false, the range of the X-axis runs from the minimum value to the maximum value in the dataset. Default: true.

## Inputs
The visualisation has no inputs.

## Outputs
The visualisation has no outputs.

## Actions
The visualisation has no actions.

## Data Details
1.	Rows – zero or more elements
    1. Name: the name of the category
    1. Value: the value associated with the category

