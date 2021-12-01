const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require("path");
const output_dir = path.resolve(__dirname, "dist");

const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  entry: {
    app: ["./src/index.js"],
  },
  output: {
    filename: "js/[name].js",
    path: output_dir,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin([{ from: "src/index.html", to: output_dir }]),
    new CopyPlugin([{ from: "src/assets/", to: output_dir + "/assets/" }]),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          process.env.NODE_ENV !== "production"
            ? "style-loader"
            : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              includePaths: ["./node_modules"],
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"],
      },
      {
        test: /\.(glsl|txt)$/,
        use: ["raw-loader"],
      },
      {
        test: /\.worker\.js$/,
        use: { loader: "worker-loader" },
      },
    ],
  },
};
