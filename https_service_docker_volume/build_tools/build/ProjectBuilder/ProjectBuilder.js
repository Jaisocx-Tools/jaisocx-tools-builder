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
        this.absolutePathToProjectRoot = '';
        this.relativePathFromRootTsConfigCatalogPath = '';
        this.absolutePathFromRootTsConfigCatalogPath = '';
        this.relativePathFromRootLintCatalog = '';
        this.absolutePathFromRootLintCatalog = '';
        this.relativePathFromRootWww = '';
        this.absolutePathFromRootWww = '';
        this.buildCatalogName = '';
        this.buildESNextCatalogName = '';
        this.buildESNextTSConfigName = '';
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
    setBuildCatalogName(catalogName) {
        this.buildCatalogName = catalogName;
        return this;
    }
    setBuildESNextCatalogName(catalogName) {
        this.buildESNextCatalogName = catalogName;
        return this;
    }
    setBuildESNextTSConfigName(tsConfigName) {
        this.buildESNextTSConfigName = tsConfigName;
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
            shell: 'bash',
            //shell: '/usr/bin/env bash',
            env: Object.assign(Object.assign({}, process.env), { PATH: (process.env.PATH + ':/usr/local/bin:/usr/bin:/bin') })
        };
    }
    build(dataJson) {
        process.env = Object.assign(Object.assign({}, process.env), { PATH: (process.env.PATH + ':/usr/local/bin:/usr/bin:/bin') });
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
    buildModule(moduleJson, rootPath) {
        console.log(`\n\n\n===============================`);
        console.log(`MODULE ${moduleJson.name}`);
        console.log(`===============================\n`);
        let modulePath = this.absolutePathFromRootWww + '/' + moduleJson.path;
        // install or link npm dependencies
        console.log(`Module [ ${moduleJson.name} ]: Calling npm dependencies install`);
        this.installModuleDependencies(moduleJson, modulePath);
        // transpile .ts
        console.log(`Module [ ${moduleJson.name} ]: Transpiling TypeScript code in ${modulePath}`);
        const result = (0, child_process_1.execSync)(`ls -la src`, this.getSpawnSyncPayload(modulePath));
        console.log(result);
        const result2 = (0, child_process_1.execSync)(`tsc -p ./tsconfig.json`, this.getSpawnSyncPayload(modulePath));
        console.log(result2);
        const result3 = (0, child_process_1.execSync)(`tsc -p ./${this.buildESNextTSConfigName}`, this.getSpawnSyncPayload(modulePath));
        console.log(result3);
        // link this module for usage in local development in other .ts files
        if (this.getIsLocalDevelopment()) {
            console.log(`Module [ ${moduleJson.name} ]: npm link module ${moduleJson.name} for local usage with other`);
            (0, child_process_1.execSync)('npm link', this.getSpawnSyncPayload(modulePath));
        }
        // building simple .js files to use in example.hml via <script src="...js"
        console.log(`Module [ ${moduleJson.name} ]: building simple .js for usage in .html in script tag as src`);
        this.buildSimple(moduleJson, modulePath);
    }
    installModuleDependencies(moduleJson, modulePath) {
        let dependencyCatalogPath = '';
        let localDependency = null;
        const dependencies = moduleJson["dependencies"];
        if (dependencies && dependencies.length > 0) {
            console.log(`Module [ ${moduleJson.name} ]: Installing npm dependencies at ${modulePath}...`);
            if (this.getIsLocalDevelopment()) {
                console.log(`Module [ ${moduleJson.name} ]: Local dev mode npm link method chosen`);
                const localDependenciesNames = [];
                for (localDependency of dependencies) {
                    dependencyCatalogPath = this.absolutePathFromRootWww + '/' + localDependency.path;
                    console.log(`cd && npm link in catalog: [ ${dependencyCatalogPath} ]`);
                    (0, child_process_1.execSync)(`cd "${dependencyCatalogPath}" && npm link`, this.getSpawnSyncPayload(dependencyCatalogPath));
                    localDependenciesNames.push(localDependency.name);
                }
                const modulesToLinkJoined = localDependenciesNames.join(" ");
                const npmLinkCommand = `cd "${modulePath}" && npm link ${modulesToLinkJoined}`;
                console.log(`${npmLinkCommand}`);
                (0, child_process_1.execSync)(npmLinkCommand, this.getSpawnSyncPayload(modulePath));
            }
            else {
                console.log(`Module [ ${moduleJson.name} ]: npm install from npm registry`);
                //for (dependencyName of dependencies) {
                //dependencyCatalogPath = rootPath + dependencyCatalogPath;
                //execSync('npm run build', { cwd: modulePath, stdio: 'inherit', , shell: '/usr/bin/env bash' }); // Run the build command
                //}
            }
        }
        else {
            console.log(`Module [ ${moduleJson.name} ]: No dependencies were set in BuildData.json`);
        }
    }
    buildSimple(moduleJson, modulePath) {
        //let buildFileName: string = '';
        let buildCatalogPath = '';
        //let buildFilePath: string = '';
        let buildSimpleCatalogPath = '';
        //let buildSimpleFilePath: string = '';
        const buildFiles = moduleJson["build-files"];
        if (!buildFiles || (0 === buildFiles.length)) {
            throw new Error(`Module [ ${moduleJson.name} ]: You forgot to set "build-files" array, You wish to provide for Simple Build!`);
        }
        buildCatalogPath = modulePath + '/' + this.buildESNextCatalogName;
        if (false === fs.existsSync(buildCatalogPath)) {
            throw new Error(`Module [ ${moduleJson.name} ]: build catalog not found: ${buildCatalogPath}`);
        }
        buildSimpleCatalogPath = modulePath + '/' + this.buildSimpleCatalogName;
        for (const buildFileName of buildFiles) {
            const buildFilePath = buildCatalogPath + '/' + buildFileName;
            const buildSimpleFilePath = buildSimpleCatalogPath + '/' + buildFileName;
            if (false === fs.existsSync(buildSimpleCatalogPath)) {
                fs.mkdirSync(buildSimpleCatalogPath, { recursive: true });
            }
            fs.copyFile(buildFilePath, buildSimpleFilePath, (err) => {
                if (err) {
                    console.error(`Module [ ${moduleJson.name} ]: Error copying file:`, err);
                    return;
                }
                (function () {
                    const fileName = buildFileName;
                    // @ts-ignore
                    const filePathToEslint = ('./' + this.buildSimpleCatalogName + '/' + fileName);
                    console.log(`Module [ ${moduleJson.name} ]: Copy file [ ${fileName} ] success, catalog ${buildSimpleFilePath}!`);
                    try {
                        // @ts-ignore
                        this.lintSimpleBuild(modulePath, filePathToEslint);
                    }
                    catch (e) { }
                }).call(this);
            });
        }
    }
    // prettifying .js
    lintSimpleBuild(eslintConfigCatalogPath, pathToEslint) {
        (0, child_process_1.execSync)(`npx eslint ${pathToEslint} --fix`, this.getSpawnSyncPayload(eslintConfigCatalogPath));
    }
}
exports.ProjectBuilder = ProjectBuilder;
