'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
require('./demo.css')
const handle_key_events_1 = require('./util/handle-key-events')
const mod_1 = require('../src/mod')
const on_state_change_1 = require('./util/on-state-change')
const d3 = require('d3')
// prep some data
const points = [
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
  .select(document.getElementById('demo'))
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
} = mod_1.fromPoints({
  onStateChange: () => renderUi(),
  points,
  svg$
})
// ^ focus on ^
// below is for setting up the demo controls and outputs :)
let isNodesVisibile = true
const renderUi = () => {
  on_state_change_1.onStateChange({
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
handle_key_events_1.bindKeyEvents({ onUndo })
