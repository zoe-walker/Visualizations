//
// D3 word cloud
// https://www.d3-graph-gallery.com/graph/wordcloud_size.html
//
//    Entry function declaration
//
import * as d3 from 'd3'
import * as d3Cloud from 'd3-cloud'
/**
 *
 * @param {object} config MooD visualisation config object
 */
export function visualization (config) {
  //
  // Retrieve graph configuration
  //
  try {
    const style = config.style
    const margin = style.margin
    const width = parseFloat(config.width) - margin.left - margin.right
    const height = parseFloat(config.height) - margin.top - margin.bottom
    style.minWordLength = Math.max(1, style.minWordLength)
    style.minInstanceCount = Math.max(1, style.minInstanceCount)
    style.baseFontSize = style.baseFontSize || 20
    style.maxFontSize = style.maxFontSize || 100
    style.instanceMultiplier = style.instanceMultiplier || 10
    style.ignoreWords = style.ignoreWords ? style.ignoreWords.map(word => word[0].toUpperCase() + word.substring(1)) : []
    const colourPalette = style.colourPalette

    if (!colourPalette) {
      throw new Error('colour Palette is not defined')
    }
    if (!Array.isArray(colourPalette)) {
      throw new Error('colour Palette is not defined as an array')
    }
    if (colourPalette.length === 0) {
      throw new Error('colour Palette is empty')
    }
    //
    //    append the svg to the element in MooD config
    //
    // set the dimensions and margins of the graph
    // append the svg object to the body of the page
    const svg = d3.select('#' + config.element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform',
        'translate(' + margin.left + ',' + margin.top + ')')
    //
    //    Read the data
    //
    const data = config.data.rows
    const wordSplit = /[ !-/:-@[-`{-~\n\f\t\r]/
    const numberPattern = /^-?\d+(?:\.\d*)?(?:e[+-]?\d+)?$/i
    // console.log(JSON.stringify(config))
    let allWords = []
    //
    // Build array of all words in the text and filter out numbers and words considered too short
    // and capitalise first letter
    //
    data.forEach(function (row) {
      allWords = allWords.concat((row.text ? row.text.split(wordSplit) : [])
        .filter(word => !numberPattern.test(word) && word.length >= style.minWordLength)
        .map(word => word[0].toUpperCase() + word.substring(1))
      )
    })
    //
    // Sort words into alphabetical order
    //
    allWords.sort()
    //
    // Build an array of unique words and a count of the number of occurences of each word
    // and filter out words that don't occur often enough
    //
    // console.log(JSON.stringify(allWords))
    const uniqueWords = allWords.reduce(function (accumulator, value, index, array) {
      if (index > 0 && value === array[index - 1]) {
        accumulator[accumulator.length - 1].count++ // matching word so increment instance count
      } else {
        accumulator.push({ word: value, count: 1 })
      }
      return accumulator
    }, [])
    //
    // Calculate font size for words based on the number of occurences,
    // filtering out words that don't occur often enough
    //
    const wordsOfInterest = uniqueWords
      .filter(word => word.count >= style.minInstanceCount && !style.ignoreWords.includes(word.word))
      .map(function (word) { return { ...word, size: Math.min(style.baseFontSize + (word.count - style.minInstanceCount) * style.instanceMultiplier, style.maxFontSize) } })
    // console.log(JSON.stringify(wordsOfInterest))
    //
    // Check if there are any words to put in the cloud
    //
    if (wordsOfInterest.length > 0) {
      console.log('Word count: ' + wordsOfInterest.length)
      //
      // Get range of occurrences
      //
      const occurenceRange = wordsOfInterest.reduce((accumulator, value) => {
        return { min: Math.min(accumulator.min, value.count), max: Math.max(accumulator.max, value.count) }
      }, { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY })
      //
      // Calculate colour palette mapping data
      //
      const occurenceRangeSize = (occurenceRange.max - occurenceRange.min)
      const colourMapFactor = colourPalette.length / (occurenceRangeSize + 1)

      // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
      // Wordcloud features that are different from one word to the other must be here
      const layout = d3Cloud()
        .size([width, height])
        .words(wordsOfInterest.map(function (d) { return { text: d.word, size: d.size, count: d.count } }))
        .padding(5) // space between words
        .rotate(function () { return ~~(Math.random() * 2) * 90 })
        .fontSize(function (d) { return d.size }) // font size of words
        .on('end', draw)
      layout.start()

      // This function takes the output of 'layout' above and draw the words
      // Wordcloud features that are THE SAME from one word to the other can be here
      function draw (words) {
        svg
          .append('g')
          .attr('transform', 'translate(' + layout.size()[0] / 2 + ',' + layout.size()[1] / 2 + ')')
          .selectAll('text')
          .data(words)
          .enter().append('text')
          .style('font-size', function (d) { return d.size + 'px' })
          .style('fill', function (d) { return calculateColour(d.count) })
          .attr('text-anchor', 'middle')
          .style('font-family', 'Impact')
          .attr('transform', function (d) {
            return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')'
          })
          .text(function (d) { return d.text })
      }
      //
      // Function to choose colour
      //
      function calculateColour (value) {
        const colourIndex = Math.round(colourMapFactor * (value - occurenceRange.min))
        return colourPalette[colourIndex]
      }
    }
  } catch (e) {
    //
    // Write error message to the canvas
    //
    console.log('Error caught')
    const el = document.getElementById(config.element)
    const errorMessage = e.name + ': ' + e.message
    console.log('Error: ' + errorMessage)

    const errorEl = document.createElement('text')
    errorEl.style.margin = 'auto'
    errorEl.style.textAlign = 'center'
    errorEl.style.display = 'block'
    errorEl.innerText = errorMessage
    el.appendChild(errorEl)
    //
    // Report error to MooD BA
    //
    config.functions.errorOccurred(errorMessage)
  }
}
