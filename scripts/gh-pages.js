require('perish')
var pages = require('gh-pages')
var { resolve } = require('path')
var distDirname = resolve(__dirname, '..', 'dist')

pages.publish(
  distDirname,
  {
    user: {
      name: 'cdaringe',
      email: 'cdaringe@cdaringe.com',
      silent: true
    }
  },
  (err, res) => {
    if (err) throw err
    console.log({ res })
  }
)
