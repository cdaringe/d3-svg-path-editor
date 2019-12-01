import { D3Selection, NodeMove } from './interfaces'
import d3 = require('d3')

export const createNodeDragger = ({
  node$,
  onDrag,
  onDragEnd,
  onDragStart
}: {
  node$: D3Selection
  onDrag: (opts: NodeMove) => void
  onDragEnd: () => void
  onDragStart: () => void
}) => {
  ;(node$ as any).call(
    d3
      .drag()
      .on('start', d => {
        node$.attr('stroke', 'black')
        onDragStart()
      })
      .on('drag', d => {
        const { x, y } = d3.event
        onDrag({ x, y })
      })
      .on('end', d => {
        node$.attr('stroke', null)
        onDragEnd()
      })
  )
}
