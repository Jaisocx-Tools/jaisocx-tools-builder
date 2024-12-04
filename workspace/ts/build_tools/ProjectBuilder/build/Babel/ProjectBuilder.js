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
var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProjectBuilder = void 0;
const child_process_1 = require("child_process");
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const json5_1 = __importDefault(require("json5"));
class ProjectBuilder {
  constructor() {
    this.isLocalDevelopment = 1;
    this.absolutePathToProjectRoot = '';
    this.relativePathFromRootTsConfigCatalogPath = '';
    this.absolutePathFromRootTsConfigCatalogPath = '';
    this.relativePathFromRootLintCatalog = '';
    this.absolutePathFromRootLintCatalog = '';
    this.relativePathFromRootWww = '';
    this.absolutePathFromRootWww = '';
    this.buildCjsCatalogName = '';
    this.buildEsmCatalogName = '';
    this.buildSimpleCatalogName = '';
  }
  getIsLocalDevelopment() {
    return this.isLocalDevelopment;
  }
  setIsLocalDevelopment(isLocalDevelopment) {
    this.isLocalDevelopment = isLocalDevelopment;
    return this;
  }
  setAbsolutePathToProjectRoot(projectRoot) {
    this.absolutePathToProjectRoot = projectRoot;
    return this;
  }
  setAbsolutePath(propertyName, relativePath) {
    if (!this.absolutePathToProjectRoot) {
      throw new Error('The Absolute Path to Project root is not specified!!!');
    }
    // @ts-ignore
    this[propertyName] = path.resolve(this.absolutePathToProjectRoot + '/' + relativePath);
    return this;
  }
  setRelativePathFromRootTsConfigCatalogPath(relativePath) {
    this.relativePathFromRootTsConfigCatalogPath = relativePath;
    this.setAbsolutePath('absolutePathFromRootTsConfigCatalogPath', relativePath);
    return this;
  }
  setRelativePathFromRootLintCatalog(relativePath) {
    this.relativePathFromRootLintCatalog = relativePath;
    this.setAbsolutePath('absolutePathFromRootLintCatalog', relativePath);
    return this;
  }
  setRelativePathFromRootWww(relativePath) {
    this.relativePathFromRootWww = relativePath;
    this.setAbsolutePath('absolutePathFromRootWww', relativePath);
    return this;
  }
  setBuildCjsCatalogName(catalogName) {
    this.buildCjsCatalogName = catalogName;
    return this;
  }
  setBuildEsmCatalogName(catalogName) {
    this.buildEsmCatalogName = catalogName;
    return this;
  }
  setBuildSimpleCatalogName(catalogName) {
    this.buildSimpleCatalogName = catalogName;
    return this;
  }
  build(dataJson) {
    if (!dataJson.packages || 0 === dataJson.packages.length) {
      throw new Error('no packages array set in BuildData.json');
    }
    const packages = [...dataJson.packages.filter(packageJson => true === packageJson.build)];
    if (!packages || 0 === packages.length) {
      throw new Error('no packages marked to build in the BuildData.json');
    }
    for (let packageJson of packages) {
      this.buildPackage(packageJson);
    }
  }
  buildPackage(packageJson) {
    console.log(`\n\n\n===============================`);
    console.log(`MODULE ${packageJson.name}`);
    console.log(`===============================\n`);
    let packagePath = path.resolve(this.absolutePathFromRootWww, packageJson.path);
    // install or link npm dependencies
    console.log(`Package [ ${packageJson.name} ]: Calling npm dependencies install`);
    this.installPackageDependencies(packageJson, packagePath);
    // console output list of files in the package src catalog
    this.runCommandLine(packagePath, `ls -lahrts src`, true);
    console.log(`Package [ ${packageJson.name} ]: Prettifying with Eslint TypeScript code in ${packagePath}`);
    this.prettifyWithEslint(packagePath, `${packagePath}/src/**/*.ts`, false);
    console.log(`Package [ ${packageJson.name} ]: ESNext Transpiling TypeScript code in ${packagePath}`);
    // transpile modern node version compatible
    const tsconfigESNextName = 'tsconfig.ESNext.json';
    const tsconfigESNextPath = `${this.absolutePathToProjectRoot}/${tsconfigESNextName}`;
    this.transpileTypescriptSourcesWithPath(packagePath, tsconfigESNextPath);
    console.log(`Package [ ${packageJson.name} ]: CommonjS Transpiling TypeScript code in ${packagePath}`);
    // transpile legacy node versions compatible
    const tsconfigCommonJSName = 'tsconfig.CommonJS.json';
    const tsconfigCommonJSPath = `${this.absolutePathToProjectRoot}/${tsconfigCommonJSName}`;
    this.transpileTypescriptSourcesWithPath(packagePath, tsconfigCommonJSPath);
    // apply babel polyfills
    this.babelize(packagePath);
    // link this package for usage in local development in other .ts files
    if (this.getIsLocalDevelopment()) {
      console.log(`Package [ ${packageJson.name} ]: npm link package ${packageJson.name} for local usage with other`);
      this.runCommandLine(packagePath, `npm link`, false);
    }
    // building simple .js files to use in example.hml via <script src="...js"
    console.log(`Package [ ${packageJson.name} ]: building simple .js for usage in .html in script tag as src`);
    this.buildSimple(packageJson, packagePath);
  }
  installPackageDependencies(packageJson, packagePath) {
    let dependencyCatalogPath = '';
    let localDependency = null;
    const dependencies = packageJson["dependencies"];
    if (dependencies && dependencies.length > 0) {
      console.log(`Package [ ${packageJson.name} ]: Installing npm dependencies at ${packagePath}...`);
      if (this.getIsLocalDevelopment()) {
        console.log(`Package [ ${packageJson.name} ]: Local dev mode npm link method chosen`);
        const localDependenciesNames = [];
        for (localDependency of dependencies) {
          dependencyCatalogPath = path.resolve(this.absolutePathFromRootWww, localDependency.path);
          console.log(`cd && npm link in catalog: [ ${dependencyCatalogPath} ]`);
          this.runCommandLine(dependencyCatalogPath, `cd "${dependencyCatalogPath}" && npm link`, false);
          localDependenciesNames.push(localDependency.name);
        }
        const packagesToLinkJoined = localDependenciesNames.join(" ");
        const npmLinkCommand = `cd "${packagePath}" && npm link ${packagesToLinkJoined}`;
        console.log(`${npmLinkCommand}`);
        this.runCommandLine(packagePath, npmLinkCommand, false);
      } else {
        console.log(`Package [ ${packageJson.name} ]: npm install from npm registry`);
        //for (dependencyName of dependencies) {
        //dependencyCatalogPath = rootPath + dependencyCatalogPath;
        //execSync('npm run build', { cwd: packagePath, stdio: 'inherit', , shell: '/usr/bin/env bash' }); // Run the build command
        //}
      }
    } else {
      console.log(`Package [ ${packageJson.name} ]: No dependencies were set in BuildData.json`);
    }
  }
  buildSimple(packageJson, packagePath) {
    //let buildFileName: string = '';
    let buildCatalogPath = '';
    //let buildFilePath: string = '';
    let buildSimpleCatalogPath = '';
    //let buildSimpleFilePath: string = '';
    const buildFiles = packageJson["build-files"];
    if (!buildFiles || 0 === buildFiles.length) {
      throw new Error(`Package [ ${packageJson.name} ]: You forgot to set "build-files" array, You wish to provide for Simple Build!`);
    }
    buildCatalogPath = packagePath + '/' + this.buildEsmCatalogName;
    if (false === fs.existsSync(buildCatalogPath)) {
      throw new Error(`Package [ ${packageJson.name} ]: build catalog not found: ${buildCatalogPath}`);
    }
    buildSimpleCatalogPath = packagePath + '/' + this.buildSimpleCatalogName;
    if (false === fs.existsSync(buildSimpleCatalogPath)) {
      this.runCommandLine(packagePath, `mkdir -p "${buildSimpleCatalogPath}"`, false);
    }
    for (const buildFileName of buildFiles) {
      const buildFilePath = buildCatalogPath + '/' + buildFileName;
      const buildSimpleFilePath = buildSimpleCatalogPath + '/' + buildFileName;
      if (true === fs.existsSync(buildSimpleFilePath)) {
        this.runCommandLine(packagePath, `rm "${buildSimpleFilePath}"`, false);
      }
      const fileSimplePathDir = path.parse(buildSimpleFilePath).dir;
      if (false === fs.existsSync(fileSimplePathDir)) {
        this.runCommandLine(packagePath, `mkdir -p "${fileSimplePathDir}"`, false);
      }
      this.runCommandLine(packagePath, `cp "${buildFilePath}" "${buildSimpleFilePath}"`, false);
      // @ts-ignore
      this.prettifyWithEslint(packagePath, `${this.buildSimpleCatalogName}/${buildFileName}`, false);
    }
  }
  transpileTypeScriptSources(tsconfigCatalogPath, tsconfigFileName, logToConsole) {
    const consoleCommand = `cd "${tsconfigCatalogPath}" && tsc -p "${tsconfigFileName}"`;
    return this.runCommandLine(tsconfigCatalogPath, consoleCommand, logToConsole);
  }
  transpileTypescriptSourcesWithPath(packagePath, tsconfigPath) {
    const tsconfigJson = fs.readFileSync(tsconfigPath);
    const tsconfig = json5_1.default.parse(tsconfigJson);
    const compilerOptions = tsconfig["compilerOptions"];
    if (!compilerOptions) {
      throw new Error(`Typescript config file has no compilerOptions, or was not found at: ${tsconfigPath}`);
    }
    const transpileOptions = [];
    for (let compilerOptonName in compilerOptions) {
      const compilerOptionValue = compilerOptions[compilerOptonName];
      transpileOptions.push(`--${compilerOptonName} ${compilerOptionValue}`);
    }
    const filesAndCatalogsList = fs.readdirSync(`${packagePath}/src`, {
      recursive: true
    });
    if (!filesAndCatalogsList || filesAndCatalogsList.length === 0) {
      return null;
    }
    const filesList = filesAndCatalogsList.filter(filePath => {
      const absPath = `${packagePath}/src/${filePath}`;
      return fs.lstatSync(absPath).isFile();
    });
    const packagePathRelative = packagePath.replace(`${this.absolutePathToProjectRoot}/`, '');
    //const filesListJoinedString: string = `${packagePathRelative}/src/` + filesList.join(` ${packagePathRelative}/src/`);
    const filesListJoinedString = `src/` + filesList.join(` src/`);
    const transpileOptionsString = transpileOptions.join(" ");
    // cd packagePath ensures usage of package.json installed deps for this exact subpackage.
    const transpileCommand = `cd "${packagePath}" && npx tsc ${filesListJoinedString} ${transpileOptionsString}`;
    return this.runCommandLine(`${packagePath}`, transpileCommand, true);
  }
  babelize(packagePath) {
    const packagePathRelative = packagePath.replace(`${this.absolutePathToProjectRoot}/`, '');
    const babelCommand = `cd "${this.absolutePathToProjectRoot}" && npx cpx "${packagePathRelative}/build/CommonJS/**/*.d.ts" "${packagePathRelative}/build/Babel/" && npx cpx "${packagePathRelative}/build/CommonJS/**/*.map" "${packagePathRelative}/build/Babel/" && npx babel "${packagePathRelative}/build/CommonJS" --out-dir "${packagePathRelative}/build/Babel" --extensions ".js"`;
    return this.runCommandLine(`${packagePath}`, babelCommand, true);
  }
  prettifyWithEslint(packagePath, pathToPrettify, logToConsole) {
    const consoleCommand = `cd "${packagePath}" && npx eslint "${pathToPrettify}" --fix`;
    return this.runCommandLine(packagePath, consoleCommand, logToConsole);
  }
  runCommandLine(configCatalogPath, consoleCommand, logToConsole) {
    let result = null;
    try {
      result = (0, child_process_1.execSync)(consoleCommand, this.getSpawnSyncPayload(configCatalogPath));
    } catch (e) {
      result = e;
    }
    return result;
  }
  getSpawnSyncPayload(contextRoot) {
    return {
      cwd: contextRoot,
      stdio: 'inherit',
      shell: 'bash'
      //shell: '/usr/bin/env bash',
      //env: { ...process.env, PATH: (process.env.PATH + ':/usr/local/bin:/usr/bin:/bin') }
    };
  }
}
exports.ProjectBuilder = ProjectBuilder;