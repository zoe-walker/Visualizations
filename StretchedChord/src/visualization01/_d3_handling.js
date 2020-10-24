import * as d3 from 'd3'
import 'd3-interpolate'

export function setUpEnvironment (config) {
  d3.select('#' + config.element).append('svg').attr('width', parseFloat(config.width)).attr('height', parseFloat(config.height))
  Array.from(arguments).slice(1).forEach(d => d3.select(d.parent).append('g').attr('id', d.id).attr('transform', d.transform))
}
export function drawDiagram (stretchedChord) {
  d3.select('#links').selectAll('*').remove()
  d3.select('#LHS').selectAll('*').remove()
  d3.select('#RHS').selectAll('*').remove()
  d3.select('#L').selectAll('*').remove()
  d3.select('#R').selectAll('*').remove()

  const innerRadius = stretchedChord._innerRadius
  const outerRadius = stretchedChord._outerRadius
  const centreOffset = stretchedChord.arcCentreOffset()

  drawLinks()
  drawNodes('#LHS', stretchedChord._LHSnodes)
  drawNodes('#RHS', stretchedChord._RHSnodes)
  addLabels('L')
  addLabels('R')

  function drawLinks () {
    d3.select('#links').selectAll().data(stretchedChord._links).enter().append('path')
      .attr('d', d => linkPath(d))
      .style('fill', d => 'url(#' + (d._sourceNode.lhs ? 'r' : 'l') + d.colour.slice(1) + ')')
      .style('opacity', 0.8)
  }

  function drawNodes (_d3Search, _Data) {
    d3.select(_d3Search).selectAll().data(_Data).enter().append('path')
      .attr('id', d => 'n_' + d.id)
      .attr('name', d => d.name)
      .attr('d', d3.arc().innerRadius(innerRadius).outerRadius(outerRadius))
      .style('fill', d => d.colour)
      .style('stroke', d => d.stroke)
      .style('stroke-width', '2px')
      .style('opacity', 1)
      .style('cursor', 'pointer')
  }

  function linkPath (link) {
    const adjustedOffset = link._sourceNode.lhs ? -centreOffset : centreOffset

    const srcStart = [innerRadius * Math.sin(link.source.startAngle) - adjustedOffset, -innerRadius * Math.cos(link.source.startAngle)]
    const srcEnd = [innerRadius * Math.sin(link.source.endAngle) - adjustedOffset, -innerRadius * Math.cos(link.source.endAngle)]
    const tgtEnd = [innerRadius * Math.sin(link.target.endAngle) + adjustedOffset, -innerRadius * Math.cos(link.target.endAngle)]
    const tgtStart = [innerRadius * Math.sin(link.target.startAngle) + adjustedOffset, -innerRadius * Math.cos(link.target.startAngle)]

    return 'M' + srcStart.join(' ') + // Start at link starting angle on source node
    'A' + innerRadius + ' ' + innerRadius + ' 0 0 0 ' + srcEnd.join(' ') + // draw arc following inside of source node to link end angle
    'Q 0 ' + (srcEnd[1] + tgtEnd[1]) / 4 + ' ' + tgtEnd.join(' ') + // draw quadratic Bezier curve to end angle of link on target node
    'A' + innerRadius + ' ' + innerRadius + ' 0 0 0 ' + tgtStart.join(' ') + // draw arc following inside of target node to link start angle
    'Q 0 ' + (srcStart[1] + tgtStart[1]) / 4 + ' ' + srcStart.join(' ') // draw quadratic Bezier curve to start angle of link on source node
  }

  function addLabels (side) {
    const nodeTag = '#' + side + 'HS'
    const labelTag = '#' + side
    d3.select(nodeTag).selectAll('path').each(function (d) { addLabel(d3.select(this)) })

    function addLabel (path) {
      const offset = getOffset()
      const formattedLabel = getLabelFormatted(path.attr('name'), stretchedChord._labelMargin * 0.9 + (outerRadius - Math.abs(offset[0])) / 3)
      const label = d3.select(labelTag)
        .append('text')
        .style('alignment-baseline', 'left')
        .style('text-anchor', 'left')
        .style('font-family', stretchedChord._labelFontFamily)
        .style('font-size', stretchedChord._labelFontSize)

      if (!(isNaN(offset[0]) || isNaN(offset[1]))) {
        label.attr('transform', 'translate(' + offset[0] * stretchedChord._labelOffsetFactor + ',' + (offset[1] - (stretchedChord._labelFontSize / 2 * formattedLabel.length)) + ')')
      }

      formattedLabel.forEach(d => label.append('tspan').text(d).attr('x', 0).attr('dy', stretchedChord._labelFontSize))

      function getOffset () {
        const center = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius).centroid(path.datum())

        return [center[0], center[1]]
      }
    }
  }
}

export function createGradients (stretchedChord) {
  const config = {
    flowPeriod: stretchedChord._flowPeriod,
    flowOpacity: stretchedChord._flowOpacity
  }
  stretchedChord._links.forEach(function (d) {
    const colour = d.colour.slice(1)
    const direction = d._sourceNode.lhs ? 'r' : 'l'
    if (!d3.select('#' + direction + colour).node()) {
      (direction === 'l' ? leftGradient : rightGradient)(
        d,
        d3.select('#defs').append('linearGradient').attr('id', direction + colour),
        config)
    }
  })
}

export function addInteractivity (functions, stretchedChord) {
  d3.select('#LHS').selectAll('path')
    .on('mouseover', nodeMouseover(functions.updateOutput))
    .on('mouseleave', nodeMouseleave)
    .on('click', nodeClick(functions.performAction, 'Source'))

  d3.select('#RHS').selectAll('path')
    .on('mouseover', nodeMouseover(functions.updateOutput))
    .on('mouseleave', nodeMouseleave)
    .on('click', nodeClick(functions.performAction, 'Target'))

  d3.select('#links').selectAll('path')
    .on('mouseover', linkMouseover(stretchedChord, functions.updateOutput))
    .on('mouseleave', linkMouseleave)
    .on('click', linkClick(functions.performAction))
}

function rightGradient (link, grad, config) {
  const flowPeriod = config.flowPeriod
  const flowOpacity = config.flowOpacity
  grad.append('stop').attr('offset', '-50%').attr('stop-color', link.colour).attr('stop-opacity', flowOpacity)
    .append('animate').attr('attributeName', 'offset').attr('values', '-.5;0').attr('dur', flowPeriod).attr('repeatCount', 'indefinite')
  grad.append('stop').attr('offset', '-25%').attr('stop-color', link.colour).attr('stop-opacity', '1')
    .append('animate').attr('attributeName', 'offset').attr('values', '-.25;.25').attr('dur', flowPeriod).attr('repeatCount', 'indefinite')
  grad.append('stop').attr('offset', '0%').attr('stop-color', link.colour).attr('stop-opacity', flowOpacity)
    .append('animate').attr('attributeName', 'offset').attr('values', '0;.5').attr('dur', flowPeriod).attr('repeatCount', 'indefinite')
  grad.append('stop').attr('offset', '25%').attr('stop-color', link.colour).attr('stop-opacity', '1')
    .append('animate').attr('attributeName', 'offset').attr('values', '0.25;.75').attr('dur', flowPeriod).attr('repeatCount', 'indefinite')
  grad.append('stop').attr('offset', '50%').attr('stop-color', link.colour).attr('stop-opacity', flowOpacity)
    .append('animate').attr('attributeName', 'offset').attr('values', '.5;1').attr('dur', flowPeriod).attr('repeatCount', 'indefinite')
  grad.append('stop').attr('offset', '75%').attr('stop-color', link.colour).attr('stop-opacity', '1')
    .append('animate').attr('attributeName', 'offset').attr('values', '.75;1.25').attr('dur', flowPeriod).attr('repeatCount', 'indefinite')
  grad.append('stop').attr('offset', '100%').attr('stop-color', link.colour).attr('stop-opacity', flowOpacity)
    .append('animate').attr('attributeName', 'offset').attr('values', '1;1.5').attr('dur', flowPeriod).attr('repeatCount', 'indefinite')
}

function leftGradient (link, grad, config) {
  const flowPeriod = config.flowPeriod
  const flowOpacity = config.flowOpacity
  grad.append('stop').attr('offset', '0%').attr('stop-color', link.colour).attr('stop-opacity', flowOpacity)
    .append('animate').attr('attributeName', 'offset').attr('values', '0;-.5').attr('dur', flowPeriod).attr('repeatCount', 'indefinite')
  grad.append('stop').attr('offset', '25%').attr('stop-color', link.colour).attr('stop-opacity', '1')
    .append('animate').attr('attributeName', 'offset').attr('values', '.25;-.25').attr('dur', flowPeriod).attr('repeatCount', 'indefinite')
  grad.append('stop').attr('offset', '50%').attr('stop-color', link.colour).attr('stop-opacity', flowOpacity)
    .append('animate').attr('attributeName', 'offset').attr('values', '.5;0').attr('dur', flowPeriod).attr('repeatCount', 'indefinite')
  grad.append('stop').attr('offset', '75%').attr('stop-color', link.colour).attr('stop-opacity', '1')
    .append('animate').attr('attributeName', 'offset').attr('values', '.75;.25').attr('dur', flowPeriod).attr('repeatCount', 'indefinite')
  grad.append('stop').attr('offset', '100%').attr('stop-color', link.colour).attr('stop-opacity', flowOpacity)
    .append('animate').attr('attributeName', 'offset').attr('values', '1;.5').attr('dur', flowPeriod).attr('repeatCount', 'indefinite')
  grad.append('stop').attr('offset', '125%').attr('stop-color', link.colour).attr('stop-opacity', '1')
    .append('animate').attr('attributeName', 'offset').attr('values', '1.25;.75').attr('dur', flowPeriod).attr('repeatCount', 'indefinite')
  grad.append('stop').attr('offset', '150%').attr('stop-color', link.colour).attr('stop-opacity', flowOpacity)
    .append('animate').attr('attributeName', 'offset').attr('values', '1.5;1').attr('dur', flowPeriod).attr('repeatCount', 'indefinite')
}

function getLabelFormatted (label, lineLength) {
  d3.select('svg').append('text').attr('id', 'temp')

  let line = []; const lines = []
  let labels = label
  if (typeof labels === 'undefined') {
    return
  } else if (typeof labels === 'string') {
    labels = labels.split(' ')
  } else if (Array.isArray(labels) === false) {
    return
  }

  labels.forEach(function (word) {
    if (d3.select('#temp').text([line, word].flat().join(' ')).node().getComputedTextLength() <= lineLength) line.push(word)
    else {
      if (line.length > 0) lines.push(line.join(' '))
      if (d3.select('#temp').text(word).node().getComputedTextLength() > lineLength) {
        word = word.split('').reduce((total, amount) =>
          d3.select('#temp').text(total[total.length - 1] + amount).node().getComputedTextLength() <= lineLength ? total.slice(0, total.length - 1).concat(total[total.length - 1] + amount) : total.concat(amount),
        [''])
        lines.push(...word.slice(0, word.length - 1))
        word = word[word.length - 1]
      }
      line = [word]
    }
  })

  d3.select('#temp').remove()

  return lines.concat(line.join(' '))
}

function linkMouseover (stretchedChord, updateOutput) {
  return function (d) {
    const center = -(Math.cos(d.source.endAngle) + Math.cos(d.target.endAngle) + Math.cos(d.source.startAngle) + Math.cos(d.target.startAngle)) * 0.07125 * stretchedChord._width

    d3.select('#labels').append('rect').attr('transform', 'translate(0,' + center + ')')
    d3.select('#labels').append('text').text(d.size)
      .attr('id', 'size').attr('transform', 'translate(0,' + center + ')')
      .style('alignment-baseline', 'middle').style('text-anchor', 'middle')

    const node = d3.select('#size').node().getBBox()

    d3.select('#labels').append('rect').attr('transform', 'translate(0,' + center + ')')
      .style('x', -node.width / 2 - 2).style('y', -node.height / 2 - 2).style('rx', 4)
      .style('width', node.width + 4).style('height', node.height + 4)
      .style('fill', '#f2f2f2').style('opacity', 0.9)
      .style('stroke', '#a2a2a2').style('stroke-width', '1px')
      .lower()

    updateOutput('hoverLink', d.id)
  }
}

function linkMouseleave () {
  d3.select('#size').remove()
  d3.select('#labels').select('rect').remove()
}

function linkClick (performAction) {
  return function (d) {
    performAction('Chord Click', d.id, d3.event)
  }
}

function nodeMouseover (updateOutput) {
  return function (d) {
    d3.select('#links').selectAll('path').style('opacity', l => l.source.id === d.id ? 1 : 0.2)
    updateOutput('hoverNode', d.id)
  }
}

function nodeMouseleave () {
  d3.select('#links').selectAll('path').style('opacity', 0.8)
}

function nodeClick (performAction, from) {
  return function (d) {
    performAction(from + ' Click', d.id, d3.event)
  }
}
