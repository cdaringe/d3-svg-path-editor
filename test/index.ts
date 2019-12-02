import { fromPoints } from '../src'
import { Point } from '../src/interfaces'
import d3 = require('d3')
import test = require('blue-tape')

const createTestSvg = () =>
  d3.select(
    d3
      .select('body')
      .append('svg')
      .attr('width', 200)
      .attr('height', 200)
      .node()! as SVGSVGElement
  )

function injectTestFromPoints () {
  const points: Point[] = [
    [0, 0],
    [100, 100]
  ]
  const svg$ = createTestSvg()
  return fromPoints({ points, svg$ })
}

test('mod - fromPoints', t => {
  const { path$ } = injectTestFromPoints()
  t.ok(path$)
  t.equal(path$.attr('stroke'), 'black', 'path should be black')
  t.equal(path$.attr('fill'), 'none', 'path should not be filled')
  t.end()
})

test('mod - fromPoints', t => {
  const { path$ } = injectTestFromPoints()
  t.ok(path$)
  t.equal(path$.attr('stroke'), 'black', 'path should be black')
  t.equal(path$.attr('fill'), 'none', 'path should not be filled')
  t.end()
})
