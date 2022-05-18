# Word Cloud

## Purpose
Word clouds are useful for quickly perceiving the most prominent terms in a body of text. The MooD Word Cloud visualisation uses colour and text size to differentiate between the more and the less used terms.

The colour palette, font size range and words to ignore can be configured to tailor the Word Cloud.

__Note__: Words that are too large to fit into the Word Cloud rectangle are omitted. The font size configuration can be altered to ensure that long prominent words appear in the Word Cloud.

## Data Summary
The Word Cloud visualisation consumes a single data set. The details of the attributes of the data set is provided in the section Data Details section

1.	Rows
    1.	A list of text to visualise

## Style
The style of the visualisation is controlled by CSS and a collection of properties.

### CSS
A Cascading Style Sheet (CSS) is defined containing selectors for the following HTML elements in the rendered diagram. The CSS is editable within MooD BA, allowing control of the visual styling of the diagram:

1.  Background colour

### Properties
The properties are:

1.  __margin__: defines the size of a margin around the edge of the visualisation
    1.  __top__: size of margin across the top in pixels: Default 5
    1.  __bottom__: size of margin across the bottom in pixels: Default 5
    1.  __left__: size of margin across the left-hand side in pixels: Default 5
    1.  __right__: size of margin across the right-hand side in pixels: Default 5
1.  __minWordLength__: The minimum number of characters a word must be in order to be included in the Word Cloud. Default: 3.
1.  __minInstanceCount__: The minimum number of times a word must appear in the entire body of text in order to be included in the Word Cloud. Default: 2.
1.  baseFontSize__: The smallest font size in pixels to use for the least common words in the Word Cloud. Default: 20.
1.  __maxFontSize__: The largest font size in pixels to use for the most common words in the Word Cloud. Default: 100.
1.  __instanceMultiplier__: The amount, in pixels, to increase font size of words per increase in occurrence. The font size is calculated as baseFontSize + (word occurrence count - minInstanceCount) * instanceMultiplier. The font size is bounded to be no larger than maxFontSize. Default: 10.
1.  __ignoreWords__: An array of words to ignore, i.e. exclude from the Word Cloud. Default: the, and, this, are, but, its, for, that, also
1.  __colourPalette__: An array of RGB colours used to distinguish more common from less common words. The least common words are rendered in the first colour, the most common words are rendered in the last colour in the array, and others using intermediate colours. The length of the array can be altered to suit. The default array ranges from Green to Red.

## Inputs
The visualisation has no inputs.

## Outputs
The visualisation has no outputs.

## Actions
The visualisation has no actions.

## Data Details
1.	Rows – zero or more elements
    1. Text: text to be included in the Word Cloud.

