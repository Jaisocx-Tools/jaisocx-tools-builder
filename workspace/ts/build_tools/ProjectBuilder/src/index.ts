import * as fs from 'node:fs';
import * as path from 'node:path';

import { ProjectBuilder } from './ProjectBuilder';

const argv = process.argv.slice(2); // Get command-line arguments starting from index 2
const commandArgs: any = {
  ProjectRoot: '',
  BuildData: '',
  PackagesPath: '',
};
argv.forEach( ( arg ) => {
  let [key, value] = arg.split('=');
  key = key.replace("--", "");
  commandArgs[key] = value ? value.replace(/(^"|"$)/g, '') : ''; // Remove quotes if any
});

console.log("commandArgs", commandArgs);

const buildDataPath: string = path.resolve( commandArgs.ProjectRoot, commandArgs.BuildData );
if (false === fs.existsSync( buildDataPath ) ) {
  throw new Error(`BuildData.json not available at path: ${buildDataPath}`);
}

const packagesPath: string = path.resolve( commandArgs.ProjectRoot, commandArgs.PackagesPath );
if (false === fs.existsSync( packagesPath ) ) {
  throw new Error(`modulesPath not available at path: ${packagesPath}`);
}

let buildData: any = fs.readFileSync(
  path.resolve( commandArgs.ProjectRoot, commandArgs.BuildData ), 
  'utf8'
);

console.log("buildDataPath", buildDataPath);
console.log("buildData", buildData);

console.log("packagesPath", packagesPath);


const builder = new ProjectBuilder();
builder
  .setIsLocalDevelopment(1)
  .setAbsolutePathToProjectRoot(commandArgs.ProjectRoot)
  .setRelativePathFromRootTsConfigCatalogPath('build_tools')
  .setRelativePathFromRootLintCatalog('.')
  .setRelativePathFromRootWww('www')
  .setBuildCjsCatalogName('build/CommonJS')
  .setBuildEsmCatalogName('build/ESNext')
  .setBuildSimpleCatalogName('build/simple')
  .build(buildData);


