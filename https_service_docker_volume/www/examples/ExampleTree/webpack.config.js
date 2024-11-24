const path = require('path');
const jaisocxTreeAliasConfig = require('@jaisocx/tree/webpack.aliases.js');

module.exports = {
  entry: './src/index.ts', // Entry point for your TypeScript code
  output: {
    filename: 'bundle.js', // Output bundle name
    path: path.resolve(__dirname, 'build/webpack'), // Output directory
  },
  resolve: {
    alias: {
      ...jaisocxTreeAliasConfig.resolve.alias,
    },
    extensions: ['.ts', '.js'], // File extensions to resolve
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // Process TypeScript files
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader', 
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('postcss-url')({
                    url: 'rebase', // Rewrite URLs relative to the final CSS file
                  }),
                ],
              },
            },
          },
        ], // Use these loaders for CSS files
      },
      {
        test: /\.(webp|png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
        type: 'asset/resource', // Handles images and fonts
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        type: 'asset/resource', // Use Webpack 5's native asset modules for images
        generator: {
          filename: 'assets/fonts/[name][ext]', // Define output path for assets
        },
      },
      {
        test: /\.(webp|png|jpg|gif|svg)$/,
        type: 'asset/resource', // Use Webpack 5's native asset modules for images
        generator: {
          filename: 'assets/images/[name][ext]', // Define output path for assets
        },
      },
    ],
  },
  mode: 'production', // Set mode (development | production)
};
