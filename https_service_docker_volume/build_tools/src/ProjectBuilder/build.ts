import dataJson from './../../BuildData.json';
import { ProjectBuilder } from './ProjectBuilder';

const args = process.argv.slice(2); // Get command-line arguments starting from index 2
const [key, value] = args[0].split('=');
let projectRoot = '';
if (key === '--projectRoot') {
  projectRoot = value.replace(/(^"|"$)/g, ''); // Remove quotes if any
}

const builder = new ProjectBuilder();
builder
  .setIsLocalDevelopment(1)
  .setAbsolutePathToProjectRoot(projectRoot)
  .setRelativePathFromRootTsConfigCatalogPath('https_service_docker_volume/build_tools')
  .setRelativePathFromRootLintCatalog('https_service_docker_volume')
  .setRelativePathFromRootWww('https_service_docker_volume/www')
  .setBuildCatalogName('build')
  .setBuildESNextCatalogName('buildESNext')
  .setBuildESNextTSConfigName('tsconfig.ESNext.json')
  .setBuildSimpleCatalogName('BuildSimple')
  .build(dataJson);

