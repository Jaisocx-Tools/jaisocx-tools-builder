"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import dataJson from './../../BuildData.json';
const ProjectBuilder_1 = require("./ProjectBuilder");
const args = process.argv.slice(2); // Get command-line arguments starting from index 2
const [key, value] = args[0].split('=');
let projectRoot = '';
if (key === '--projectRoot') {
    projectRoot = value.replace(/(^"|"$)/g, ''); // Remove quotes if any
}
const dataJson = require(projectRoot + '/BuildData.json');
const builder = new ProjectBuilder_1.ProjectBuilder();
builder
    .setIsLocalDevelopment(1)
    .setAbsolutePathToProjectRoot(projectRoot)
    .setRelativePathFromRootTsConfigCatalogPath('build_tools')
    .setRelativePathFromRootLintCatalog('.')
    .setRelativePathFromRootWww('www')
    .setBuildCatalogName('build')
    .setBuildESNextCatalogName('buildESNext')
    .setBuildESNextTSConfigName('tsconfig.ESNext.json')
    .setBuildSimpleCatalogName('BuildSimple')
    .build(dataJson);
