module.exports = {
  entry: './test/index.js',
  output: {
    path: __dirname,
    filename: 'bundle.test.js'
  },
  node: {
    fs: 'empty'
  },
  mode: 'development'
};
