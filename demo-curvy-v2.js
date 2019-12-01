'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
require('./demo.css')
const handle_key_events_1 = require('./util/handle-key-events')
const mod_1 = require('../src/mod')
const on_state_change_1 = require('./util/on-state-change')
const d3 = require('d3')
const points = [
  [10, 80],
  [100, 100],
  [200, 30],
  [300, 50],
  [400, 40],
  [500, 80]
]
const height = 600
const width = 800
const svg$ = d3
  .select(document.getElementById('demo'))
  .attr('width', width)
  .attr('height', height)
const { path$, undo: onUndo } = mod_1.fromPoints({
  onStateChange: on_state_change_1.onStateChange,
  points,
  svg$
})
handle_key_events_1.bindKeyEvents({ onUndo })
