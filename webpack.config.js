const path = require('path');

module.exports = {
  devtool: "source-map",
  entry: ['./src/main.js', './src/kakao.js', './src/view.js','./src/psql.js'],
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'public', 'javascripts'),
  }
};
