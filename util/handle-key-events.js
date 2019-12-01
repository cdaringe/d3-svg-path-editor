'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const undo_redo_1 = require('./undo-redo')
exports.bindKeyEvents = ({ onUndo }) => {
  window.onkeydown = evt => {
    if (undo_redo_1.isUndo(evt, 'mac')) onUndo()
  }
}
