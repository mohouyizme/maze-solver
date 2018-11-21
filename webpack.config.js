const path = require('path');

module.exports = {
  entry: './src/js/app.js',
  output: {
    path: path.resolve(__dirname, 'dist/js'),
    filename: 'bundle.min.js'
  },
  module: {
    rules: [
      {
        exclude: /node_module/,
        use: 'babel-loader'
      }
    ]
  },
  mode: 'development'
};
