import { isUndo } from './undo-redo'

export const bindKeyEvents = ({ onUndo }: { onUndo: () => void }) => {
  window.onkeydown = (evt: KeyboardEvent) => {
    if (isUndo(evt, 'mac')) onUndo()
  }
}
