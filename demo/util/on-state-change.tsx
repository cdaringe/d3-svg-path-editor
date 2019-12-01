import { MetaNode } from '../../src/interfaces'
import * as React from 'react'
import ReactDom from 'react-dom'
import { SnapperState } from '../../src/snapper'

let isPaintingState = false

export type OnStateChange = {
  onDisableEditing: () => void
  onEnableEditing: () => void
  onShowNodes: () => void
  nodes: MetaNode[]
  snapperState: SnapperState
}
export const onStateChange = (opts: OnStateChange) => {
  if (isPaintingState) return
  isPaintingState = true
  window.requestAnimationFrame(() => {
    render(opts)
    isPaintingState = false
  })
}

export const render = ({
  nodes,
  onDisableEditing,
  onEnableEditing,
  onShowNodes,
  snapperState
}: OnStateChange) => {
  const toFourChars = (num: number) => {
    const rounded = Math.floor(num).toString()
    return rounded + ' '.repeat(4 - rounded.length)
  }
  ReactDom.render(
    <div>
      <h2>controls</h2>
      <button onClick={onShowNodes}>toggle node visibility</button>
      <button onClick={onDisableEditing}>disable editing</button>
      <button onClick={onEnableEditing}>enable editing</button>

      <p>press cmd+z or ctrl+z to use the undo feature</p>
      {/*  */}
      <div id='state'>
        <pre>{JSON.stringify(snapperState, null, 2)}</pre>
        <ul>
          {nodes.map((node, i) => (
            <li
              key={i}
              children={
                <pre children={node.point.map(toFourChars).join(', ')} />
              }
            />
          ))}
        </ul>
      </div>
    </div>,
    self.document.getElementById('controls')!
  )
}
