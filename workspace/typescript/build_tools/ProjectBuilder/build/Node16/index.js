//import dataJson from './../../BuildData.json';
//import { ProjectBuilder } from './ProjectBuilder';
import path from 'path';
import fs from 'fs';
import fsp from 'fs/promises';
export const BuildModesNumber = {
    CommonJS: 1,
    ESNext: 2,
};
export const BuildModesString = {
    CommonJS: "CommonJS",
    ESNext: "ESNext",
};
const argv = process.argv.slice(2); // Get command-line arguments starting from index 2
const commandArgs = {
    ProjectRoot: '',
    BuildData: '',
    ModulesPath: '',
};
argv.forEach((arg) => {
    let [key, value] = arg.split('=');
    key = key.replace("--", "");
    commandArgs[key] = value ? value.replace(/(^"|"$)/g, '') : ''; // Remove quotes if any
});
console.log("commandArgs", commandArgs);
const buildDataPath = path.resolve(commandArgs.ProjectRoot, commandArgs.BuildData);
if (false === fs.existsSync(buildDataPath)) {
    throw new Error(`BuildData.json not available at path: ${buildDataPath}`);
}
const modulesPath = path.resolve(commandArgs.ProjectRoot, commandArgs.ModulesPath);
if (false === fs.existsSync(modulesPath)) {
    throw new Error(`modulesPath not available at path: ${modulesPath}`);
}
let buildData = await fsp.readFile(path.resolve(commandArgs.ProjectRoot, commandArgs.BuildData), 'utf8');
console.log("buildDataPath", buildDataPath);
console.log("buildData", buildData);
console.log("modulesPath", modulesPath);
/*
const builder = new ProjectBuilder();
builder
  .setIsLocalDevelopment(1)
  .setAbsolutePathToProjectRoot(projectRoot)
  .setRelativePathFromRootTsConfigCatalogPath('build_tools')
  .setRelativePathFromRootLintCatalog('.')
  .setRelativePathFromRootWww('www')
  .setBuildCjsCatalogName('build/commonjs')
  .setBuildEsmCatalogName('build/esnext')
  .setBuildSimpleCatalogName('build/simple')
  .build(buildData);

*/
//# sourceMappingURL=index.js.map