import { D3Circle, D3Path, Point } from './interfaces'
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

export const path = {
  renderLine: (path$: D3Path, points: Point[]) =>
    path$.attr('d', d3.line().curve(d3.curveCatmullRom.alpha(0.5))(points)!)
}
