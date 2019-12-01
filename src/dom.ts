import { D3Circle, D3Path, Point, D3Selection, D3Line } from './interfaces'
import d3 = require('d3')

export type AppendCircleOptions = {
  node$: d3.Selection<any, any, any, any>
  r?: number
  x: number
  y: number
}

export type SetCircleOptions = Pick<AppendCircleOptions, 'x' | 'y' | 'r'> & {
  node$: D3Circle
}

export const circle = {
  append: ({ x, y, r, node$ }: AppendCircleOptions) =>
    circle.set({ x, y, r, node$: node$.append('circle') }),
  set: ({ x, y, r, node$ }: SetCircleOptions) =>
    node$
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', r || 10)
}

export type LineTransform = (line: D3Line, points: Point[]) => D3Line

export const path = {
  renderLine: (
    path$: D3Path,
    points: Point[],
    withLineTransform?: LineTransform
  ) => {
    let line = d3.line()
    if (withLineTransform) line = withLineTransform(line, points)
    return path$.attr('d', line(points)!)
  }
}
