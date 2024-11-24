//import dataJson from './../../BuildData.json';
import { ProjectBuilder } from './ProjectBuilder';

const args = process.argv.slice(2); // Get command-line arguments starting from index 2
const [key, value] = args[0].split('=');
let projectRoot = '';
if (key === '--projectRoot') {
  projectRoot = value.replace(/(^"|"$)/g, ''); // Remove quotes if any
}

const dataJson: any = require(projectRoot + '/BuildData.json');


const builder = new ProjectBuilder();
builder
  .setIsLocalDevelopment(1)
  .setAbsolutePathToProjectRoot(projectRoot)
  .setRelativePathFromRootTsConfigCatalogPath('build_tools')
  .setRelativePathFromRootLintCatalog('.')
  .setRelativePathFromRootWww('www')
  .setBuildCatalogName('build/commonjs')
  .setBuildESNextCatalogName('build/esnext')
  .setBuildESNextTSConfigName('tsconfig.ESNext.json')
  .setBuildSimpleCatalogName('build/simple')
  .build(dataJson);

