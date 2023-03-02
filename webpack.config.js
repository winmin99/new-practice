const path = require('path');

module.exports = {
  devtool: "source-map",
  entry: ['./src/main.js'],
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'public', 'javascripts'),
  }
};
