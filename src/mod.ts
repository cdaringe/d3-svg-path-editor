import { circle, path } from './dom'
import { createNodeDragger } from './dragger'
import { createNodeSnapper } from './snapper'
import { D3Path, Point, MetaNode, D3SVG } from './interfaces'
import { getPointInsertionIndex } from './point-maths'

export const toPointRef = ([x, y]: Point) => `${x.toFixed(3)}_${y.toFixed(3)}`

export const toMetaNodes: (points: Point[]) => MetaNode[] = points =>
  points.map(point => ({ point }))

type TestCanEditNode = (node: MetaNode) => boolean

export function renderNodes (opts: {
  getNodeEditTest: () => TestCanEditNode | undefined
  nodes: MetaNode[]
  onAddHistory: () => void
  path$: D3Path
  render: () => void
  svg$: D3SVG
}) {
  const {
    svg$,
    path$,
    nodes,
    render: rerender,
    onAddHistory,
    getNodeEditTest
  } = opts
  nodes.forEach(function renderNode (mp, i) {
    const {
      point: [x, y]
    } = mp
    if (!mp.node) {
      const node$ = circle.append({ x, y, node$: svg$ })
      createNodeDragger({
        node$,
        onDragStart: () => {
          mp.node!.dragStartPoint = mp.point
        },
        onDrag: ({ x, y }) => {
          const canEdit = getNodeEditTest()
          if (canEdit && !canEdit(mp)) return
          mp.isDirty = true
          mp.point = [x, y]
          rerender()
        },
        onDragEnd: () => {
          const currentPoint = mp.point
          // dangerously swap old point value in just for a hot second,
          // as the drag operation has already updated our point array and
          // we want to update history reflecting the start point
          mp.point = mp.node!.dragStartPoint!
          onAddHistory()
          mp.point = currentPoint
          delete mp.node!.dragStartPoint
          // phew! sorry.  that was gross.
        }
      })
      mp.node = {
        node$
      }
    }
    if (!mp.isDirty) return
    circle.set({ x, y, node$: mp.node.node$ })
    mp.isDirty = false
  })
  path.renderLine(
    path$,
    nodes.map(node => node.point)
  )
}

export type FromPoints = {
  /**
   * number of history entries to maintain for undo support
   * set to 0 to effectively disable
   */
  historySize?: number
  onStateChange?: (nodes: MetaNode[]) => void
  points: Point[]
  svg$: D3SVG
  testCanEditNode?: TestCanEditNode
}
export const fromPoints = (opts: FromPoints) => {
  const {
    historySize = 25,
    onStateChange = () => {},
    points,
    svg$,
    testCanEditNode: userTestCanEditNode
  } = opts
  let internalCanEditNode: undefined | TestCanEditNode
  let nodes = toMetaNodes(points)
  const path$ = svg$
    .append('path')
    .attr('stroke', 'black')
    .attr('fill', 'none')

  // bind node snapper
  const snapper = createNodeSnapper({
    onAddNode: ({ length, point }) => {
      const insertIndex = getPointInsertionIndex({
        pathDistance: length,
        pathNode: path$.node()!,
        point,
        points: nodes.map(node => node.point)
      })
      nodes.splice(insertIndex, 0, { point })
      onAddHistory()
      render()
    },
    svg$,
    path$
  })

  // setup undo support
  const history: any = []
  const onAddHistory = () => {
    onStateChange(nodes)
    if (historySize === 0) return
    history.push(JSON.stringify(nodes.map(node => node.point)))
    if (history.length > historySize) history.shift()
  }
  const onUndo = () => {
    if (!history.length) return
    nodes.map(mn => mn.node && mn.node.node$.remove())
    nodes = toMetaNodes(JSON.parse(history.pop()!))
    render()
  }

  // edit toggling
  const setNodeVisibility = (isVis?: boolean) =>
    nodes.forEach(
      ({ node }) => node && node.node$.attr('opacity', isVis ? 1 : 0)
    )
  const disableEditing = () => {
    setNodeVisibility(false)
    internalCanEditNode = () => false
    snapper.disable()
  }
  const enableEditing = () => {
    setNodeVisibility(true)
    internalCanEditNode = undefined
    snapper.enable()
  }

  // go
  const render = () =>
    window.requestAnimationFrame(() =>
      renderNodes({
        nodes,
        onAddHistory,
        path$,
        render,
        svg$,
        getNodeEditTest: () => userTestCanEditNode || internalCanEditNode
      })
    )
  render()

  // finish
  return {
    disableEditing,
    enableEditing,
    nodes,
    path$,
    setNodeVisibility,
    snapper,
    undo: onUndo
  }
}
