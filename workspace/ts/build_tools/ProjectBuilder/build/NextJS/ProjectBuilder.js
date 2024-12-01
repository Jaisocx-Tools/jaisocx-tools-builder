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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
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
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectBuilder = void 0;
var child_process_1 = require("child_process");
var fs = __importStar(require("node:fs"));
var path = __importStar(require("node:path"));
var ProjectBuilder = /** @class */ (function () {
    function ProjectBuilder() {
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
    ProjectBuilder.prototype.getIsLocalDevelopment = function () {
        return this.isLocalDevelopment;
    };
    ProjectBuilder.prototype.setIsLocalDevelopment = function (isLocalDevelopment) {
        this.isLocalDevelopment = isLocalDevelopment;
        return this;
    };
    ProjectBuilder.prototype.setAbsolutePathToProjectRoot = function (projectRoot) {
        this.absolutePathToProjectRoot = projectRoot;
        return this;
    };
    ProjectBuilder.prototype.setAbsolutePath = function (propertyName, relativePath) {
        if (!this.absolutePathToProjectRoot) {
            throw new Error('The Absolute Path to Project root is not specified!!!');
        }
        // @ts-ignore
        this[propertyName] = path.resolve(this.absolutePathToProjectRoot + '/' + relativePath);
        return this;
    };
    ProjectBuilder.prototype.setRelativePathFromRootTsConfigCatalogPath = function (relativePath) {
        this.relativePathFromRootTsConfigCatalogPath = relativePath;
        this.setAbsolutePath('absolutePathFromRootTsConfigCatalogPath', relativePath);
        return this;
    };
    ProjectBuilder.prototype.setRelativePathFromRootLintCatalog = function (relativePath) {
        this.relativePathFromRootLintCatalog = relativePath;
        this.setAbsolutePath('absolutePathFromRootLintCatalog', relativePath);
        return this;
    };
    ProjectBuilder.prototype.setRelativePathFromRootWww = function (relativePath) {
        this.relativePathFromRootWww = relativePath;
        this.setAbsolutePath('absolutePathFromRootWww', relativePath);
        return this;
    };
    ProjectBuilder.prototype.setBuildCjsCatalogName = function (catalogName) {
        this.buildCjsCatalogName = catalogName;
        return this;
    };
    ProjectBuilder.prototype.setBuildEsmCatalogName = function (catalogName) {
        this.buildEsmCatalogName = catalogName;
        return this;
    };
    ProjectBuilder.prototype.setBuildSimpleCatalogName = function (catalogName) {
        this.buildSimpleCatalogName = catalogName;
        return this;
    };
    ProjectBuilder.prototype.getSpawnSyncPayload = function (contextRoot) {
        return {
            cwd: contextRoot,
            stdio: 'inherit',
            shell: 'bash',
            //shell: '/usr/bin/env bash',
            //env: { ...process.env, PATH: (process.env.PATH + ':/usr/local/bin:/usr/bin:/bin') }
        };
    };
    ProjectBuilder.prototype.build = function (dataJson) {
        //process.env = { ...process.env, PATH: (process.env.PATH + ':/usr/local/bin:/usr/bin:/bin') };
        var e_1, _a;
        if (!dataJson.modules || 0 === dataJson.modules.length) {
            throw new Error('no modules array set in BuildData.json');
        }
        var modules = __spreadArray([], __read(dataJson.modules.filter(function (moduleJson) { return (true === moduleJson.build); })), false);
        if (!modules || 0 === modules.length) {
            throw new Error('no modules marked to build in the BuildData.json');
        }
        try {
            for (var modules_1 = __values(modules), modules_1_1 = modules_1.next(); !modules_1_1.done; modules_1_1 = modules_1.next()) {
                var moduleJson = modules_1_1.value;
                this.buildModule(moduleJson, this.absolutePathToProjectRoot);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (modules_1_1 && !modules_1_1.done && (_a = modules_1.return)) _a.call(modules_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    ProjectBuilder.prototype.buildModule = function (moduleJson, rootPath) {
        console.log("\n\n\n===============================");
        console.log("MODULE ".concat(moduleJson.name));
        console.log("===============================\n");
        var modulePath = this.absolutePathFromRootWww + '/' + moduleJson.path;
        // install or link npm dependencies
        console.log("Module [ ".concat(moduleJson.name, " ]: Calling npm dependencies install"));
        this.installModuleDependencies(moduleJson, modulePath);
        // transpile .ts
        console.log("Module [ ".concat(moduleJson.name, " ]: Transpiling TypeScript code in ").concat(modulePath));
        this.runCommandLine(modulePath, "ls -lahrts src", true);
        this.prettifyWithEslint(this.absolutePathToProjectRoot, "".concat(modulePath, "/src/**/*.ts"), false);
        // transpiling to standard .js build,
        // using local module environment and tsconfig.json
        /*this.transpileTypeScriptSources(
          modulePath,
          `${modulePath}/tsconfig.json`,
          true
        );*/
        // transpiling for BuildSimple .js prettified files, usable as are in <script src="" />
        // using local module environment, however tsconfig.ESNext.json is used from project root.
        var tsconfigCjsName = 'tsconfig.cjs.json';
        var tsconfigCjsPath = "".concat(this.absolutePathToProjectRoot, "/").concat(tsconfigCjsName);
        this.transpileTypescriptSourcesWithPath(modulePath, tsconfigCjsPath);
        var tsconfigEsmName = 'tsconfig.esm.json';
        var tsconfigEsmPath = "".concat(this.absolutePathToProjectRoot, "/").concat(tsconfigEsmName);
        this.transpileTypescriptSourcesWithPath(modulePath, tsconfigEsmPath);
        // link this module for usage in local development in other .ts files
        if (this.getIsLocalDevelopment()) {
            console.log("Module [ ".concat(moduleJson.name, " ]: npm link module ").concat(moduleJson.name, " for local usage with other"));
            this.runCommandLine(modulePath, "npm link", false);
        }
        // building simple .js files to use in example.hml via <script src="...js"
        console.log("Module [ ".concat(moduleJson.name, " ]: building simple .js for usage in .html in script tag as src"));
        this.buildSimple(moduleJson, modulePath);
    };
    ProjectBuilder.prototype.installModuleDependencies = function (moduleJson, modulePath) {
        var e_2, _a;
        var dependencyCatalogPath = '';
        var localDependency = null;
        var dependencies = moduleJson["dependencies"];
        if (dependencies && dependencies.length > 0) {
            console.log("Module [ ".concat(moduleJson.name, " ]: Installing npm dependencies at ").concat(modulePath, "..."));
            if (this.getIsLocalDevelopment()) {
                console.log("Module [ ".concat(moduleJson.name, " ]: Local dev mode npm link method chosen"));
                var localDependenciesNames = [];
                try {
                    for (var dependencies_1 = __values(dependencies), dependencies_1_1 = dependencies_1.next(); !dependencies_1_1.done; dependencies_1_1 = dependencies_1.next()) {
                        localDependency = dependencies_1_1.value;
                        dependencyCatalogPath = this.absolutePathFromRootWww + '/' + localDependency.path;
                        console.log("cd && npm link in catalog: [ ".concat(dependencyCatalogPath, " ]"));
                        this.runCommandLine(dependencyCatalogPath, "cd \"".concat(dependencyCatalogPath, "\" && npm link"), false);
                        localDependenciesNames.push(localDependency.name);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (dependencies_1_1 && !dependencies_1_1.done && (_a = dependencies_1.return)) _a.call(dependencies_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                var modulesToLinkJoined = localDependenciesNames.join(" ");
                var npmLinkCommand = "cd \"".concat(modulePath, "\" && npm link ").concat(modulesToLinkJoined);
                console.log("".concat(npmLinkCommand));
                this.runCommandLine(modulePath, npmLinkCommand, false);
            }
            else {
                console.log("Module [ ".concat(moduleJson.name, " ]: npm install from npm registry"));
                //for (dependencyName of dependencies) {
                //dependencyCatalogPath = rootPath + dependencyCatalogPath;
                //execSync('npm run build', { cwd: modulePath, stdio: 'inherit', , shell: '/usr/bin/env bash' }); // Run the build command
                //}
            }
        }
        else {
            console.log("Module [ ".concat(moduleJson.name, " ]: No dependencies were set in BuildData.json"));
        }
    };
    ProjectBuilder.prototype.buildSimple = function (moduleJson, modulePath) {
        var e_3, _a;
        //let buildFileName: string = '';
        var buildCatalogPath = '';
        //let buildFilePath: string = '';
        var buildSimpleCatalogPath = '';
        //let buildSimpleFilePath: string = '';
        var buildFiles = moduleJson["build-files"];
        if (!buildFiles || (0 === buildFiles.length)) {
            throw new Error("Module [ ".concat(moduleJson.name, " ]: You forgot to set \"build-files\" array, You wish to provide for Simple Build!"));
        }
        buildCatalogPath = modulePath + '/' + this.buildEsmCatalogName;
        if (false === fs.existsSync(buildCatalogPath)) {
            throw new Error("Module [ ".concat(moduleJson.name, " ]: build catalog not found: ").concat(buildCatalogPath));
        }
        buildSimpleCatalogPath = modulePath + '/' + this.buildSimpleCatalogName;
        if (false === fs.existsSync(buildSimpleCatalogPath)) {
            this.runCommandLine(modulePath, "mkdir -p \"".concat(buildSimpleCatalogPath, "\""), false);
        }
        try {
            for (var buildFiles_1 = __values(buildFiles), buildFiles_1_1 = buildFiles_1.next(); !buildFiles_1_1.done; buildFiles_1_1 = buildFiles_1.next()) {
                var buildFileName = buildFiles_1_1.value;
                var buildFilePath = buildCatalogPath + '/' + buildFileName;
                var buildSimpleFilePath = buildSimpleCatalogPath + '/' + buildFileName;
                if (true === fs.existsSync(buildSimpleFilePath)) {
                    this.runCommandLine(modulePath, "rm \"".concat(buildSimpleFilePath, "\""), false);
                }
                var fileSimplePathDir = path.parse(buildSimpleFilePath).dir;
                if (false === fs.existsSync(fileSimplePathDir)) {
                    this.runCommandLine(modulePath, "mkdir -p \"".concat(fileSimplePathDir, "\""), false);
                }
                this.runCommandLine(modulePath, "cp \"".concat(buildFilePath, "\" \"").concat(buildSimpleFilePath, "\""), false);
                // @ts-ignore
                this.prettifyWithEslint(this.absolutePathToProjectRoot, buildSimpleFilePath, false);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (buildFiles_1_1 && !buildFiles_1_1.done && (_a = buildFiles_1.return)) _a.call(buildFiles_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    ProjectBuilder.prototype.transpileTypeScriptSources = function (tsconfigCatalogPath, tsconfigFileName, logToConsole) {
        var consoleCommand = "cd \"".concat(tsconfigCatalogPath, "\" && tsc -p \"").concat(tsconfigFileName, "\"");
        return this.runCommandLine(tsconfigCatalogPath, consoleCommand, logToConsole);
    };
    ProjectBuilder.prototype.transpileTypescriptSourcesWithPath = function (modulePath, tsconfigPath) {
        var tsconfig = require(tsconfigPath);
        var compilerOptions = tsconfig["compilerOptions"];
        var transpileOptions = [];
        for (var compilerOptonName in compilerOptions) {
            var compilerOptionValue = compilerOptions[compilerOptonName];
            transpileOptions.push("--".concat(compilerOptonName, " ").concat(compilerOptionValue));
        }
        var filesAndCatalogsList = fs.readdirSync("".concat(modulePath, "/src"), { recursive: true });
        if (!filesAndCatalogsList || filesAndCatalogsList.length === 0) {
            return null;
        }
        var filesList = filesAndCatalogsList.filter(function (filePath) {
            var absPath = "".concat(modulePath, "/src/").concat(filePath);
            return fs.lstatSync(absPath).isFile();
        });
        var filesListJoinedString = "src/" + filesList.join(" src/");
        var transpileOptionsString = transpileOptions.join(" ");
        var transpileCommand = "cd \"".concat(modulePath, "\" && tsc ").concat(filesListJoinedString, " ").concat(transpileOptionsString);
        return this.runCommandLine("".concat(modulePath), transpileCommand, true);
    };
    ProjectBuilder.prototype.prettifyWithEslint = function (eslintConfigCatalogPath, pathToFileToPrettify, logToConsole) {
        var consoleCommand = "npx eslint \"".concat(pathToFileToPrettify, "\" --fix");
        return this.runCommandLine(eslintConfigCatalogPath, consoleCommand, logToConsole);
    };
    ProjectBuilder.prototype.runCommandLine = function (configCatalogPath, consoleCommand, logToConsole) {
        var result = null;
        try {
            result = (0, child_process_1.execSync)(consoleCommand, this.getSpawnSyncPayload(configCatalogPath));
        }
        catch (e) {
            result = e;
        }
        if (logToConsole === true) {
            console.log(result);
        }
        return result;
    };
    return ProjectBuilder;
}());
exports.ProjectBuilder = ProjectBuilder;
//# sourceMappingURL=ProjectBuilder.js.map