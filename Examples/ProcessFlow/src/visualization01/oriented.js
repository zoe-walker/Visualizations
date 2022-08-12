import * as Sides from './jointjs-side-types'

/**
 * Class to manage dimensions for vertical or horizontal alignment
 * For vertical swimlanes, physical width (of swimlane) is the logical width and for horizontal
 * swimlanes, physical width (of swimlane) is the logical height (of swimlane)
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
    /**
     *
     * @returns Physical width dimension in chosen orientation
     */
    this.width = () => isVerticalSwimlane ? width : height
    /**
     *
     * @returns Logical width dimension (width as for vertical swimlanes)
     */
    this.logicalWidth = () => width
    /**
     *
     * @returns Physical height dimension in chosen orientation
     */
    this.height = () => isVerticalSwimlane ? height : width
    /**
     *
     * @returns Logical height dimension (height as for vertical swimlanes)
     */
    this.logicalHeight = () => height
    /**
     *
     * @returns Physical dimensions in chosen orientation
     */
    this.dimensions = function () {
      return { width: this.width(), height: this.height() }
    }
    /**
     *
     * @returns Logical dimensions (as for vertical swimlanes)
     */
    this.logicalDimensions = function () {
      return { width: this.logicalWidth(), height: this.logicalHeight() }
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
 * Class to manage coordinates for vertical or horizontal alignment
 * For vertical swimlanes, physical x coordinate (of swimlane) is the logical x coordinate (horizontal axis)
 * and for horizontal swimlanes, physical x coordinate (of swimlane) is the logical y coordinate (vertical axis)
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
    /**
     *
     * @returns Physical x coordinate in chosen orientation
     */
    this.x = () => isVerticalSwimlane ? x : y
    /**
     *
     * @returns Logical x coordinate (x as for vertical swimlanes)
     */
    this.logicalX = () => x
    /**
     *
     * @returns Physical y coordinate in chosen orientation
     */
    this.y = () => isVerticalSwimlane ? y : x
    /**
     *
     * @returns Logical y coordinate (y as for vertical swimlanes)
     */
    this.logicalY = () => y
    /**
     *
     * @returns Physical coordinates in chosen orientation
     */
    this.coords = function () {
      return { x: this.x(), y: this.y() }
    }
    /**
     *
     * @returns Logical coordinates (as for vertical swimlanes)
     */
    this.logicalCoords = function () {
      return { x: this.logicalX(), y: this.logicalY() }
    }
    /**
     * Returns physical coordinates of parameters oriented according to chosen direction of swimlanes
     * @param {*} coords Logical (vertical swimlane orientation) coordinates
     * @returns Physical coordinates in chosen orientation
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
 * Class to manage shape side names for vertical or horizontal alignment
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
     * @param {String} side The logical (as for vertical swimlane orientation) side
     * @returns The side oriented according to chosen swimlane orientation
     */
    this.orientedSide = function (side) {
      return isVerticalSwimlane ? side : horizontalSides[side]
    }
  }
}
