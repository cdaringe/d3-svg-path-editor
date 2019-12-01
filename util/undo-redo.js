'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
function check (ev, style, shift) {
  const macAllow = !style || style === 'mac'
  const winAllow = !style || style === 'windows'
  const code = ev.keyCode || ev.which
  if (code !== 122 && code !== 90) return false
  if (macAllow && ev.metaKey && shift && !ev.ctrlKey && !ev.altKey) return true
  if (winAllow && ev.ctrlKey && shift && !ev.metaKey && !ev.altKey) return true
  return false
}
exports.check = check
exports.isUndo = function (ev, style) {
  return check(ev, style, !ev.shiftKey)
}
exports.isRedo = function (ev, style) {
  return check(ev, style, ev.shiftKey)
}
