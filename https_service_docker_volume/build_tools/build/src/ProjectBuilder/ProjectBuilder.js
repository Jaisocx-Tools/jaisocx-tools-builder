"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectBuilder = void 0;
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class ProjectBuilder {
    constructor() {
        this.isLocalDevelopment = 1;
        this.npmPath = '';
        this.absolutePathToProjectRoot = '';
        this.relativePathFromRootTsConfigCatalogPath = '';
        this.absolutePathFromRootTsConfigCatalogPath = '';
        this.relativePathFromRootLintCatalog = '';
        this.absolutePathFromRootLintCatalog = '';
        this.relativePathFromRootWww = '';
        this.absolutePathFromRootWww = '';
        this.buildCatalogName = '';
        this.buildSimpleCatalogName = '';
    }
    getIsLocalDevelopment() {
        return this.isLocalDevelopment;
    }
    setNpmPath(path) {
        this.npmPath = path;
        return this;
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
    setBuildCatalogName(catalogName) {
        this.buildCatalogName = catalogName;
        return this;
    }
    setBuildSimpleCatalogName(catalogName) {
        this.buildSimpleCatalogName = catalogName;
        return this;
    }
    getSpawnSyncPayload(contextRoot) {
        return {
            cwd: contextRoot,
            stdio: 'inherit',
            //shell: 'bash',
            //shell: '/usr/bin/env bash',
            env: Object.assign(Object.assign({}, process.env), { PATH: (process.env.PATH + ':/usr/local/bin:/usr/bin:/bin') })
        };
    }
    installModuleDependencies(moduleJson, modulePath) {
        let dependencyCatalogPath = '';
        let localDependency = null;
        const dependencies = moduleJson["dependencies"];
        if (dependencies && dependencies.length > 0) {
            console.log(`Module ${moduleJson.name}: Installing npm dependencies at ${modulePath}...`);
            if (this.getIsLocalDevelopment()) {
                console.log(`Local dev mode npm link method chosen`);
                for (localDependency of dependencies) {
                    dependencyCatalogPath = this.absolutePathFromRootWww + '/' + localDependency.path;
                    (0, child_process_1.spawnSync)('npm', ['link'], this.getSpawnSyncPayload(dependencyCatalogPath));
                    (0, child_process_1.spawnSync)('npm', ['link', localDependency.name], this.getSpawnSyncPayload(modulePath));
                }
            }
            else {
                //for (dependencyName of dependencies) {
                //dependencyCatalogPath = rootPath + dependencyCatalogPath;
                //execSync('npm run build', { cwd: modulePath, stdio: 'inherit', , shell: '/usr/bin/env bash' }); // Run the build command
                //}
            }
        }
    }
    copyToBuildSimple(moduleJson, modulePath) {
        let buildFileName = '';
        let buildCatalogPath = '';
        let buildFilePath = '';
        let buildSimpleCatalogPath = '';
        let buildSimpleFilePath = '';
        const buildFiles = moduleJson["build-files"];
        if (!buildFiles || (0 === buildFiles.length)) {
            throw new Error(`Module ${moduleJson.name}: You forgot to set "build-files" array, You wish to provide for Simple Build!`);
        }
        for (buildFileName of buildFiles) {
            buildCatalogPath = modulePath + '/' + this.buildCatalogName;
            buildFilePath = buildCatalogPath + '/' + buildFileName;
            buildSimpleCatalogPath = modulePath + '/' + this.buildSimpleCatalogName;
            buildSimpleFilePath = buildSimpleCatalogPath + '/' + buildFileName;
            if (false === fs.existsSync(buildCatalogPath)) {
                throw new Error(`Module ${moduleJson.name}: build catalog not found: ${buildCatalogPath}`);
            }
            if (false === fs.existsSync(buildSimpleCatalogPath)) {
                fs.mkdirSync(buildSimpleCatalogPath, { recursive: true });
            }
            fs.copyFile(buildFilePath, buildSimpleFilePath, (err) => {
                if (err) {
                    console.error(`Module ${moduleJson.name}: Error copying file:`, err);
                }
                else {
                    console.log(`Module ${moduleJson.name}: File ${buildFileName} copied successfully to ${buildSimpleFilePath}!`);
                }
            });
        }
    }
    lintSimpleBuild(modulePath) {
        const lintCatalogToCheck = modulePath + '/' + this.buildSimpleCatalogName;
        (0, child_process_1.spawnSync)('npx', ['eslint', lintCatalogToCheck, '--fix'], this.getSpawnSyncPayload(this.absolutePathFromRootLintCatalog));
    }
    buildSimple(moduleJson, modulePath) {
        // copying built .js file to module undercatalog BuildSimple
        this.copyToBuildSimple(moduleJson, modulePath);
        // prettifying .js
        this.lintSimpleBuild(modulePath);
    }
    buildModule(moduleJson, rootPath) {
        console.log(`\n\n\n===============================`);
        console.log(`MODULE ${moduleJson.name}`);
        console.log(`===============================\n`);
        let modulePath = this.absolutePathFromRootWww + '/' + moduleJson.path;
        // install or link npm dependencies
        //console.log(`Module ${moduleJson.name}: Calling npm dependencies install`);
        //this.installModuleDependencies(moduleJson, modulePath);
        // transpile .ts
        console.log(`Module ${moduleJson.name}: Transpiling TypeScript code ${modulePath}`, `${this.absolutePathFromRootTsConfigCatalogPath}/tsconfig.json`);
        const result = (0, child_process_1.execSync)(`ls -la src`, this.getSpawnSyncPayload(modulePath));
        console.log(result);
        const result2 = (0, child_process_1.execSync)(`npm run build`, this.getSpawnSyncPayload(modulePath));
        console.log(result2);
        return;
        /*
        const result: any = execSync(
          `tsc -p "${this.absolutePathFromRootTsConfigCatalogPath}/tsconfig.json"`,
          this.getSpawnSyncPayload(modulePath)
        );
    
    
        const result: any = spawnSync(
          'tsc',
          [`-p`, `${this.absolutePathFromRootTsConfigCatalogPath}/tsconfig.json`],
          this.getSpawnSyncPayload(modulePath)
        );
        
        const result: any = spawnSync(
          '/usr/bin/env bash',
          [`-c 'tsc -p \"${this.absolutePathFromRootTsConfigCatalogPath}/tsconfig.json\"'`],
          this.getSpawnSyncPayload(modulePath)
        );*/
        // link this module for usage in local development in other .ts files
        if (this.getIsLocalDevelopment()) {
            console.log(`Module ${moduleJson.name}: npm link module ${moduleJson.name} for local usage with other`);
            (0, child_process_1.spawnSync)('npm', ['link'], this.getSpawnSyncPayload(modulePath));
        }
        // building simple .js files to use in example.hml via <script src="...js"
        console.log(`Module ${moduleJson.name}: building simple .js for usage in .html in script tag as src`);
        this.buildSimple(moduleJson, modulePath);
    }
    build(dataJson) {
        if (!dataJson.modules || 0 === dataJson.modules.length) {
            throw new Error('no modules array set in BuildData.json');
        }
        const modules = [
            ...dataJson.modules.filter((moduleJson) => (true === moduleJson.build))
        ];
        if (!modules || 0 === modules.length) {
            throw new Error('no modules marked to build in the BuildData.json');
        }
        for (let moduleJson of modules) {
            this.buildModule(moduleJson, this.absolutePathToProjectRoot);
        }
    }
}
exports.ProjectBuilder = ProjectBuilder;
