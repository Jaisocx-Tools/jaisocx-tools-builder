const fs = require('fs');
const path = require('path');

const webpackConfigPath = path.resolve(__dirname, '../../webpack.config.js');

if (fs.existsSync(webpackConfigPath)) {
  const webpackConfig = require(webpackConfigPath);

  // Add alias to Webpack config
  webpackConfig.resolve = webpackConfig.resolve || {};
  webpackConfig.resolve.alias = webpackConfig.resolve.alias || {};
  webpackConfig.resolve.alias['@jaisocx-tree-assets'] = path.resolve(__dirname, 'build/assets/');

  // Write the modified webpack.config.js back
  fs.writeFileSync(webpackConfigPath, `module.exports = ${JSON.stringify(webpackConfig, null, 2)};`);
}
