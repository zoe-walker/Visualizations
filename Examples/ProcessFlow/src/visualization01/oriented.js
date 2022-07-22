import * as Sides from './jointjs-side-types'

/**
 * Class to manage logical dimensions for vertical or horizontal alignment
 * For vertical swimlanes, logical width (of swimlane) is the width and for horizontal
 * swimlanes, logical width (of swimlane) is the height
 */
export class OrientedDimensions {
  constructor (isVerticalSwimlane) {
    let width = 0
    let height = 0

    /**
     * Set logical width dimension
     * @param {int} widthParam
     */
    this.setWidth = function (widthParam) {
      width = widthParam
    }
    /**
     * Set logical height dimension
     * @param {int} heightParam
     */
    this.setHeight = function (heightParam) {
      height = heightParam
    }
    /**
     * Set logical dimensions
     * @param {*} dimensions Logical width and height
     */
    this.setDimensions = function (dimensions) {
      this.setWidth(dimensions.width)
      this.setHeight(dimensions.height)
    }
    this.width = () => isVerticalSwimlane ? width : height
    this.logicalWidth = () => width
    this.height = () => isVerticalSwimlane ? height : width
    this.logicalHeight = () => height
    this.dimensions = function () {
      return { width: this.width(), height: this.height() }
    }
    this.logicalDimensions = function () {
      return { width: this.logicalWidth(), height: this.logicalHeight() }
    }
    /**
     * Returns logical dimensions of parameter oriented according to direction of swimlanes
     * @param {*} dimensions
     * @returns oriented position
     */
     this.orientedDimensions = function (dimensions) {
      return { width: isVerticalSwimlane ? dimensions.width : dimensions.height, height: isVerticalSwimlane ? dimensions.height : dimensions.width }
    }
    /**
     * Increase logical width
     * @param {int} widthOffset
     */
    this.increaseWidth = function (widthOffset) {
      width += widthOffset
    }
    /**
     * Increase logical height
     * @param {int} HeightOffset
     */
    this.increaseHeight = function (HeightOffset) {
      height += HeightOffset
    }
  }
}

/**
 * Class to manage logical coordinates for vertical or horizontal alignment
 * For vertical swimlanes, logical x coordinate (of swimlane) is the x coordinate (horizontal axis)
 * and for horizontal swimlanes, logical x coordinate (of swimlane) is the y coordinate (vertical axis)
 */
export class OrientedCoords {
  constructor (isVerticalSwimlane) {
    let x = 0
    let y = 0

    /**
     * Set logical x coordinate
     * @param {int} xParam
     */
    this.setX = function (xParam) {
      x = xParam
    }
    /**
     * Set logical height dimension
     * @param {int} yParam
     */
    this.setY = function (yParam) {
      y = yParam
    }
    /**
     * Set logical coordinates
     * @param {*} coords Logical x and y
     */
    this.setCoords = function (coords) {
      this.setX(coords.x)
      this.setY(coords.y)
    }
    this.x = () => isVerticalSwimlane ? x : y
    this.logicalX = () => x
    this.y = () => isVerticalSwimlane ? y : x
    this.logicalY = () => y
    this.coords = function () {
      return { x: this.x(), y: this.y() }
    }
    this.logicalCoords = function () {
      return { x: this.logicalX(), y: this.logicalY() }
    }
    /**
     * Returns logical position of parameters oriented according to direction of swimlanes
     * @param {*} coords
     * @returns oriented position
     */
    this.orientedCoords = function (coords) {
      return { x: isVerticalSwimlane ? coords.x : coords.y, y: isVerticalSwimlane ? coords.y : coords.x }
    }
    /**
     * Increase logical x coordinate
     * @param {int} xOffset
     */
    this.increaseX = function (xOffset) {
      x += xOffset
    }
    /**
     * Increase logical y coordinate
     * @param {int} yOffset
     */
    this.increaseY = function (yOffset) {
      y += yOffset
    }
  }
}

/**
 * Class to manage logical shape side names for vertical or horizontal alignment
 * For vertical swimlanes, sides are named naturally
 * For horizontal swimlanes, horizontal sides (left and right) are rotated 90 degress clockwise
 * and vertical sides (top and bottom) are rotated 90 degress anti-clockwise
 */
export class OrientedSides {
  constructor (isVerticalSwimlane) {
    const horizontalSides = {
      [Sides.top]: Sides.left,
      [Sides.bottom]: Sides.right,
      [Sides.left]: Sides.top,
      [Sides.right]: Sides.bottom
    }
    /**
     * Returns the name of the correctly oriented side
     * @param {String} side The logical (vertical swimlane orientation) side
     * @returns The side oriented according to actual swimlane orientation
     */
    this.orientedSide = function (side) {
      return isVerticalSwimlane ? side : horizontalSides[side]
    }
  }
}
