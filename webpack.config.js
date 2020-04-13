const path = require("path"); // node module for accessing file paths

module.exports = {
  entry: "./src/index.js", // which module webpack should use to begin building out its internal dependency graph
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "bundle.js",
  },
  // module: {
  //   rules: [
  //     {
  //       test: [/\.jsx?$/],
  //       exclude: /(node_modules)/,
  //       use: {
  //         loader: "babel-loader",
  //         query: {
  //           presets: ["@babel/env", "@babel/react"],
  //         },
  //       },
  //     },
  //   ],
  // },
  resolve: {
    extensions: [".js", ".jsx", "*"],
  },
  devtool: "inline-source-map",
};
