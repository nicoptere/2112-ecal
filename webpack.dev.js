const merge = require("webpack-merge");

const common = require("./webpack.common.js");

const path = require("path");
const output_dir = path.resolve(__dirname, "../dist");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    hot: true,
    host: "0.0.0.0",
    port: 8080,
    contentBase: [output_dir, path.join(__dirname, "/src/assets")],
  },
});
