import './demo.css'
import { bindKeyEvents } from './util/handle-key-events'
import { fromPoints } from '../src/mod'
import { onStateChange } from './util/on-state-change'
import { Point } from '../src/interfaces'
import d3 = require('d3')

// prep some data
const points: Point[] = [
  [10, 80],
  [100, 100],
  [200, 30],
  [300, 50],
  [400, 40],
  [500, 80]
]

// build a svg
const height = 300
const width = 600
const svg$ = d3
  .select((document.getElementById('demo') as unknown) as SVGSVGElement)
  .attr('width', width)
  .attr('height', height)

const {
  path$, // d3 path selection
  nodes,
  undo: onUndo,
  disableEditing,
  enableEditing,
  setNodeVisibility,
  snapper
} = fromPoints({
  onStateChange: () => renderUi(),
  points,
  svg$
})

// ^ focus on ^
// below is for setting up the demo controls and outputs :)
let isNodesVisibile = true
const renderUi = () => {
  onStateChange({
    nodes,
    onShowNodes: () => {
      isNodesVisibile = !isNodesVisibile
      setNodeVisibility(isNodesVisibile)
    },
    onDisableEditing: () => {
      disableEditing()
      renderUi()
    },
    onEnableEditing: () => {
      enableEditing()
      renderUi()
    },
    snapperState: snapper.state
  })
}
renderUi()
bindKeyEvents({ onUndo })
