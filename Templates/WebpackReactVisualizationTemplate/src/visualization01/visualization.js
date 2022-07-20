//
// TODO: Add import statements for chosen React chart library
//
import x from '<chart library>'
import React from 'react'
import { createRoot } from 'react-dom/client'
//
//    Entry function declaration
//
export function visualization (config) {
  const data = config.data
  const style = config.style
  const width = parseFloat(config.width)
  const height = parseFloat(config.height)
  const animation = config.animation
  const containerElementId = config.element

  // console.log(JSON.stringify(config));
  //
  // TODO: Add chart code here
  //
  // const chart = (<JSX.Element>)
  const root = createRoot(document.getElementById(containerElementId))
  root.render(chart)
}
