export type D3Circle = d3.Selection<SVGCircleElement, any, any, any>
export type D3Path = d3.Selection<SVGPathElement, any, any, any>
export type D3Selection = d3.Selection<any, any, any, any>
export type D3SVG = d3.Selection<SVGSVGElement, unknown, null, undefined>
export type Point = [number, number]

export type MetaNode = {
  isDirty?: boolean
  node?: {
    dragStartPoint?: Point
    node$: D3Circle
  }
  point: Point
}

export type NodeMove = { x: number; y: number }
