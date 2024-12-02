"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {
      enumerable: true,
      get: function () {
        return m[k];
      }
    };
  }
  Object.defineProperty(o, k2, desc);
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});
var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});
var __importStar = this && this.__importStar || function () {
  var ownKeys = function (o) {
    ownKeys = Object.getOwnPropertyNames || function (o) {
      var ar = [];
      for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
      return ar;
    };
    return ownKeys(o);
  };
  return function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
    __setModuleDefault(result, mod);
    return result;
  };
}();
Object.defineProperty(exports, "__esModule", {
  value: true
});
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const ProjectBuilder_js_1 = require("./ProjectBuilder.js");
const argv = process.argv.slice(2); // Get command-line arguments starting from index 2
const commandArgs = {
  ProjectRoot: '',
  BuildData: '',
  PackagesPath: ''
};
argv.forEach(arg => {
  let [key, value] = arg.split('=');
  key = key.replace("--", "");
  commandArgs[key] = value ? value.replace(/(^"|"$)/g, '') : ''; // Remove quotes if any
});
console.log("commandArgs", commandArgs);
const buildDataPath = path.resolve(commandArgs.ProjectRoot, commandArgs.BuildData);
if (false === fs.existsSync(buildDataPath)) {
  throw new Error(`BuildData.json not available at path: ${buildDataPath}`);
}
const packagesPath = path.resolve(commandArgs.ProjectRoot, commandArgs.PackagesPath);
if (false === fs.existsSync(packagesPath)) {
  throw new Error(`modulesPath not available at path: ${packagesPath}`);
}
const buildDataJson = fs.readFileSync(path.resolve(commandArgs.ProjectRoot, commandArgs.BuildData), 'utf8');
const buildData = JSON.parse(buildDataJson);
console.log("buildDataPath", buildDataPath);
console.log("buildData", buildData);
console.log("packagesPath", packagesPath);
const builder = new ProjectBuilder_js_1.ProjectBuilder();
builder.setIsLocalDevelopment(1).setAbsolutePathToProjectRoot(commandArgs.ProjectRoot).setRelativePathFromRootTsConfigCatalogPath('build_tools').setRelativePathFromRootLintCatalog('.').setRelativePathFromRootWww('www').setBuildCjsCatalogName('build/CommonJS').setBuildEsmCatalogName('build/ESNext').setBuildSimpleCatalogName('build/Simple').build(buildData);