const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.ts", // Entry file of your TypeScript project
  output: {
    path: path.resolve("dist", "web"), // Output directory for the bundle
    filename: "gatekeeper.js", // Name of the output bundle
    library: 'GateKeeper'
  },
  resolve: {
    extensions: [".ts", ".js"], // Extensions to resolve during module resolution
    fallback: {
      querystring: require.resolve('querystring-es3'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // Use ts-loader to handle TypeScript files
        exclude: /node_modules/,
        use: "ts-loader",
      },
    ],
  },
};
