import { Point } from './interfaces'

function distance (p1: Point, p2: Point) {
  var dx = p2[0] - p1[0]
  var dy = p2[1] - p1[1]
  return Math.sqrt(dx * dx + dy * dy)
}

function distanceRectilinear (p1: Point, p2: Point) {
  var dx = p2[0] - p1[0]
  var dy = p2[1] - p1[1]
  return Math.abs(dx) + Math.abs(dy)
}

const isNear = (p1: Point, p2: Point, px: number = 1) =>
  distanceRectilinear(p1, p2) < px

/**
 * to insert point between p1 & p2
 * - get initial point
 * - find smallest allowable step
 *   - take that step
 *   - see if we have a point in range yet
 *   - if not, repeat
 *   - on success, assign, get remaining point
 */
export function getPointInsertionIndex ({
  point,
  pathDistance,
  pathNode,
  points
}: {
  pathDistance: number
  pathNode: SVGPathElement
  points: Point[]
  point: Point
}): number {
  if (!points.length || points.length < 2) throw new Error('not enough points')
  const derivedPoint = pathNode.getPointAtLength(pathDistance)
  if (!isNear(point, [derivedPoint.x, derivedPoint.y])) {
    throw new Error(
      [
        'pathDistance does not produce initial point',
        `([${derivedPoint.x}, ${derivedPoint.y}]) equivalent`,
        `passed point (${point.toString()})`
      ].join(' ')
    )
  }
  let currentLength = pathDistance
  while (true) {
    const { x, y } = pathNode.getPointAtLength(currentLength)
    const distancesToPoint = points.map(point => distance(point, [x, y]))
    const minTravelToNextPoint = Math.min(...distancesToPoint)
    if (minTravelToNextPoint < 1) {
      return distancesToPoint.findIndex(d => d === minTravelToNextPoint)
    }
    currentLength += minTravelToNextPoint
  }
}

export function findClosest (pathNode: SVGPathElement, point: Point) {
  /* eslint-disable */
  var pathLength = pathNode.getTotalLength()
  var precision: number = Math.floor(pathLength / 10)
  var bestDistance: number = Infinity
  var best: DOMPoint = new DOMPoint(0, 0, 0, 0)
  var bestLength: number = 0

  // linear scan for coarse approximation
  for (
    var scan, scanLength = 0, scanDistance;
    scanLength <= pathLength;
    scanLength += precision
  ) {
    scan = pathNode.getPointAtLength(scanLength)
    scanDistance = distance2(scan)
    if (scanDistance < bestDistance) {
      best = scan
      bestLength = scanLength
      bestDistance = scanDistance
    }
  }

  // binary search for precise estimate
  precision /= 2
  while (precision > 0.5) {
    var before, after, beforeLength, afterLength, beforeDistance, afterDistance
    if (
      (beforeLength = bestLength - precision) >= 0 &&
      (beforeDistance = distance2(
        (before = pathNode.getPointAtLength(beforeLength))
      )) < bestDistance
    ) {
      ;(best = before),
        (bestLength = beforeLength),
        (bestDistance = beforeDistance)
    } else if (
      (afterLength = bestLength + precision) <= pathLength &&
      (afterDistance = distance2(
        (after = pathNode.getPointAtLength(afterLength))
      )) < bestDistance
    ) {
      best = after
      bestLength = afterLength
      bestDistance = afterDistance
    } else {
      precision /= 2
    }
  }
  /* eslint-enable */
  return {
    pathLength: bestLength,
    distance: Math.sqrt(bestDistance),
    point: [best.x, best.y] as Point
  }

  function distance2 (p: DOMPoint) {
    var dx = p.x - point[0]
    var dy = p.y - point[1]
    return dx * dx + dy * dy
  }
}
