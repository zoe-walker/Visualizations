# Stretched Chord

## Purpose
The Stretched Chord visualisation is a combination of a chord diagram and a Sankey diagram resulting in a more circular looking Sankey-like flow chart. Its primary purpose is to visualise the relationships between items in two distinct domains. For instance, showing how much your education defines where you end up working; visualising the number of people leaving education in various subjects entering careers in different areas of the economy.

## Data
The stretched chord consumes three data sets:

1.  Nodes on left hand side of chart, e.g. education subjects
1.  Nodes on right hand side of chart, e.g. careers
    1.  If the nodes on both sides are in the same domain, individual nodes can appear on both sides to show relationships to self
1.  Links between nodes, e.g. people entering a career with an education in a particular subject. The relationship can flow in either direction.
    1. A numeric “size” value on the relationship controls the width of the chord displayed between the LHS and RHS
    1. A colour on the relationship controls the colour of the chord displayed

## Style
The style of the visualisation is controlled by the following parameters:

1. nodeColour – colour to draw the nodes on the LHS and RHS arcs. Default "#0080F0"
1. nodeBorderColour – colour to draw the 2 pixel border drawn around the nodes on the arcs. Default "#002090",
1. nodeSeparation – the gap, in pixels, between nodes. Default 5
1. flowOpacity – the opacity of the animated flow across the links. Default 0.5
1. minimumNodeSizePercentage – the minimum size for a node as a percentage of overall length for nodes arcs. Default 5
1. flowPeriod – the period of the flow animation across the links. Default "5s"
1. arcThickness – the thickness, in pixels, of the node arcs. Default 20
1. arcCentreSeparation – the horizontal separation, in pixels, between the centres of the arcs on the two sides. Default 100
1. labelMargin – the width of the margin, in pixels, on the outer side of each arc reserved for drawing the node labels. Default  220
1. labelOffset – the gap, in pixels, between the outer edge of the arc and the label text. Default 10
1. labelFontSize – size, in pixels, of the font that the labels and link size pop-up are rendered in. Default 15
1. labelFontFamily – the font family that the labels and link size pop-up are rendered in. Default "sans-serif"
1. headerHeight – the size, in pixels, of a margin above the top of the arcs. Default 10
1. footerHeight – the size, in pixels, of a margin above the top of the arcs. Default 10

## Inputs
There are no inputs that can be pinned to the stretched chord visualisation.

## Outputs
The visualisation has the following outputs that MooD components can be pinned to

1. Node Hover – the identity of the node on the arcs that the cursor is hovering over
1. Link Hover – the identity of the link (relationship) that the cursor is hovering over

## Actions
The visualisation reports the following events. These can be configured to trigger actions in MooD, e.g. navigation

1. Source Click –a mouse click on a node on the LHS
   1. Identifies the element
1. Target Click – a mouse click on a node on the LHS
   1. Identifies the element
1. Chord Click – a mouse click on a chord
   1. Identifies the relationship