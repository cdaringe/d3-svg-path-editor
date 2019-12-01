'use strict'
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k]
    result['default'] = mod
    return result
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const React = __importStar(require('react'))
const react_dom_1 = __importDefault(require('react-dom'))
let isPaintingState = false
exports.onStateChange = opts => {
  if (isPaintingState) return
  isPaintingState = true
  window.requestAnimationFrame(() => {
    exports.render(opts)
    isPaintingState = false
  })
}
exports.render = ({
  nodes,
  onDisableEditing,
  onEnableEditing,
  onShowNodes,
  snapperState
}) => {
  const toFourChars = num => {
    const rounded = Math.floor(num).toString()
    return rounded + ' '.repeat(4 - rounded.length)
  }
  react_dom_1.default.render(
    <div>
      <h2>controls</h2>
      <button onClick={onShowNodes}>toggle node visibility</button>
      <button onClick={onDisableEditing}>disable editing</button>
      <button onClick={onEnableEditing}>enable editing</button>

      <p>press cmd+z or ctrl+z to use the undo feature</p>

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
    self.document.getElementById('controls')
  )
}
