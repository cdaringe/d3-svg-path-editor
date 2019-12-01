import { circle } from './dom'
import { D3SVG, D3Path, Point } from './interfaces'
import { findClosest } from './point-maths'
import d3 = require('d3')

export type PathPoint = {
  distance: number
  length: number
  point: Point
}

export type SnapperState = {
  isEnabled: boolean
  pathPoint: null | PathPoint
  isNodeAddEnabled: boolean
}

export type CreateSnapperOpts = {
  onAddNode: (pathPoint: PathPoint) => void
  path$: D3Path
  svg$: D3SVG
}
export const createNodeSnapper = ({
  onAddNode,
  path$,
  svg$
}: CreateSnapperOpts) => {
  const state: SnapperState = {
    isEnabled: true,
    pathPoint: null,
    isNodeAddEnabled: false
  }
  const snapperDot = circle.append({ x: -10, y: -10, node$: svg$ })
  snapperDot.attr('class', 'snapper')
  const snapperLine = svg$.append('line')
  const setSnapperUiVisible = () => {
    snapperLine.style('opacity', state.isNodeAddEnabled ? 1 : 0)
    snapperDot.style('opacity', state.isNodeAddEnabled ? 1 : 0)
  }
  const onMouseOverActiveRegion = (pathPoint: PathPoint) => {
    state.pathPoint = pathPoint
    if (state.isNodeAddEnabled) return // optimization
    state.isNodeAddEnabled = true
    setSnapperUiVisible()
  }
  const onMouseOutActiveRegion = () => {
    if (!state.isNodeAddEnabled) return // optimization
    state.isNodeAddEnabled = false
    state.pathPoint = null
    setSnapperUiVisible()
  }
  const snapperMouseHandler = createMouseMoveHandler({
    onMouseOverActiveRegion,
    onMouseOutActiveRegion,
    path: path$.node()!,
    snapperDot,
    snapperLine
  })
  svg$.on('mousemove', function onMouseMove () {
    state.isEnabled && snapperMouseHandler.call(this)
  })
  svg$.on('click', () => {
    if (!state.isEnabled) return
    const { pathPoint, isNodeAddEnabled } = state
    if (!pathPoint || !isNodeAddEnabled) return
    onAddNode(pathPoint)
  })
  return {
    state,
    disable: () => {
      state.isEnabled = false
      state.isNodeAddEnabled = false
      state.pathPoint = null
      setSnapperUiVisible()
    },
    enable: () => {
      state.isEnabled = true
    },
    unsubscribe: () => {
      svg$.on('click', null)
      svg$.on('mousemove', null)
    }
  }
}

/**
 * @todo
 * this mousehandler gets bound to the whole svg, and gets really slow when there's
 * a bunch of points.  we need to speed this mofo up. quadtree path trace perhaps?
 * but what resolution to add nodes to the tree?
 */
export function createMouseMoveHandler ({
  onMouseOverActiveRegion,
  onMouseOutActiveRegion,
  path,
  snapperLine,
  snapperDot
}: {
  onMouseOverActiveRegion: (pp: PathPoint) => void
  onMouseOutActiveRegion: () => void
  path: SVGPathElement
  snapperLine: d3.Selection<any, any, any, any>
  snapperDot: d3.Selection<SVGCircleElement, unknown, HTMLElement, any>
}) {
  let rendering = false
  function updateSnapper (mousePoint: Point) {
    // @info
    // optimize.  findClosest is expensive. queue requests, whilst
    // still accepting the _latest_ point for next paint
    const nextPoint = mousePoint
    if (rendering) return
    window.requestAnimationFrame(function getNextSnapperPoint () {
      rendering = true
      const { distance, point, pathLength: length } = findClosest(
        path,
        nextPoint
      )
      if (distance < 15 || distance > 100) {
        rendering = false
        return onMouseOutActiveRegion()
      }
      snapperLine
        .attr('x1', point[0])
        .attr('y1', point[1])
        .attr('x2', mousePoint[0])
        .attr('y2', mousePoint[1])
      snapperDot
        .attr('cx', point[0])
        .attr('cy', point[1])
        .lower()
      onMouseOverActiveRegion({ point, distance, length })
      rendering = false
    })
  }
  return function onMouseMove (this: any) {
    const mousePoint: Point = d3.mouse(this)
    return updateSnapper(mousePoint)
  }
}
