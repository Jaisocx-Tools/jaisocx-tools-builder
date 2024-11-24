const path = require('path');

module.exports = {
  entry: './src/index.ts', // Entry point for your TypeScript code
  output: {
    filename: 'bundle.js', // Output bundle name
    path: path.resolve(__dirname, 'build-webpack'), // Output directory
  },
  resolve: {
    extensions: ['.ts', '.js'], // File extensions to resolve
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // Process TypeScript files
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'production', // Set mode (development | production)
};
