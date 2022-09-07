import * as Sides from './jointjs-side-types'

/**
 * Class to manage dimensions for vertical or horizontal alignment
 * For vertical swimlanes, physical width (of swimlane) is the logical width and for horizontal
 * swimlanes, physical width (of swimlane) is the logical height (of swimlane)
 */
export class OrientedDimensions {
  /**
   *
   * @param {boolean} isVerticalSwimlane True if swim-lanes are vertical, false if horizontal
   * @param {boolean} rotate True if the shape is rotated for horizontal swim-lanes, e.g. swim-lanes themselves,
   *                         False if the shape is not rotated for horizontal swim-lanes, e.g. steps and I/O elements
   */
  constructor (isVerticalSwimlane, rotate = true) {
    let width = 0
    let height = 0
    const rotateDimensions = !isVerticalSwimlane && rotate // physical dimensions are rotated
    const flipOrientation = !isVerticalSwimlane && !rotate // dimensions relative to a vertical swim-lane orientation are rotated

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
     * @returns Physical width dimension
     */
    this.width = () => rotateDimensions ? height : width
    /**
     *
     * @returns Length in the across swim-lane dimension (width as for vertical swimlanes)
     */
    this.acrossLaneLength = () => flipOrientation ? height : width
    /**
     *
     * @returns Physical height dimension
     */
    this.height = () => rotateDimensions ? width : height
    /**
     *
     * @returns Length in the along swim-lane dimension (height as for vertical swimlanes)
     */
    this.alongLaneLength = () => flipOrientation ? width : height
    /**
     *
     * @returns Physical dimensions in chosen orientation
     */
    this.dimensions = function () {
      return { width: this.width(), height: this.height() }
    }
    /**
     * Increase size of rectangle in across swim-lane dimension
     * @param {int} widthOffset
     */
    this.increaseAcrossLaneLength = function (widthOffset) {
      if (isVerticalSwimlane) {
        width += widthOffset
      } else {
        height += widthOffset
      }
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
     * @returns the across swim-lane dimension of position
     */
    this.acrossLanePosition = () => x
    /**
     *
     * @returns Physical y coordinate in chosen orientation
     */
    this.y = () => isVerticalSwimlane ? y : x
    /**
     *
     * @returns the along swim-lane dimension of position
     */
    this.alongLanePosition = () => y
    /**
     *
     * @returns Physical coordinates in chosen orientation
     */
    this.coords = function () {
      return { x: this.x(), y: this.y() }
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
     * Increase logical x (across swim-lane) coordinate
     * @param {int} xOffset
     */
    this.increaseX = function (xOffset) {
      x += xOffset
    }
    /**
     * Increase logical y (along swim-lane) coordinate
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
