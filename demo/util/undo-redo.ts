export type Style = 'mac' | 'windows'

export function check (ev: KeyboardEvent, style: Style, shift: boolean) {
  const macAllow = !style || style === 'mac'
  const winAllow = !style || style === 'windows'
  const code = ev.keyCode || ev.which

  if (code !== 122 && code !== 90) return false
  if (macAllow && ev.metaKey && shift && !ev.ctrlKey && !ev.altKey) return true
  if (winAllow && ev.ctrlKey && shift && !ev.metaKey && !ev.altKey) return true
  return false
}

export const isUndo = function (ev: KeyboardEvent, style: Style) {
  return check(ev, style, !ev.shiftKey)
}

export const isRedo = function (ev: KeyboardEvent, style: Style) {
  return check(ev, style, ev.shiftKey)
}
