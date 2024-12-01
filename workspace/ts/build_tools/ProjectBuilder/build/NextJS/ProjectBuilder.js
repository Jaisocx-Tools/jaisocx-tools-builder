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
        if (!dataJson.packages || 0 === dataJson.packages.length) {
            throw new Error('no packages array set in BuildData.json');
        }
        var packages = __spreadArray([], __read(dataJson.packages.filter(function (packageJson) { return (true === packageJson.build); })), false);
        if (!packages || 0 === packages.length) {
            throw new Error('no packages marked to build in the BuildData.json');
        }
        try {
            for (var packages_1 = __values(packages), packages_1_1 = packages_1.next(); !packages_1_1.done; packages_1_1 = packages_1.next()) {
                var packageJson = packages_1_1.value;
                this.buildPackage(packageJson, this.absolutePathToProjectRoot);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (packages_1_1 && !packages_1_1.done && (_a = packages_1.return)) _a.call(packages_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    ProjectBuilder.prototype.buildPackage = function (packageJson, rootPath) {
        console.log("\n\n\n===============================");
        console.log("MODULE ".concat(packageJson.name));
        console.log("===============================\n");
        var packagePath = this.absolutePathFromRootWww + '/' + packageJson.path;
        // install or link npm dependencies
        console.log("Package [ ".concat(packageJson.name, " ]: Calling npm dependencies install"));
        this.installPackageDependencies(packageJson, packagePath);
        // transpile .ts
        this.runCommandLine(packagePath, "ls -lahrts src", true);
        console.log("Package [ ".concat(packageJson.name, " ]: Prettifying with Eslint TypeScript code in ").concat(packagePath));
        //this.prettifyWithEslint(this.absolutePathToProjectRoot, `${packagePath}/src/**/*.ts`, false);
        // transpiling for BuildSimple .js prettified files, usable as are in <script src="" />
        // using local package environment, however tsconfig.ESNext.json is used from project root.
        console.log("Package [ ".concat(packageJson.name, " ]: Transpiling TypeScript code in ").concat(packagePath));
        var projectBuilderPath = "".concat(this.absolutePathToProjectRoot, "/build_tools/ProjectBuilder");
        var tsconfigCjsName = 'tsconfig.CommonJS.json';
        var tsconfigCjsPath = "".concat(projectBuilderPath, "/").concat(tsconfigCjsName);
        this.transpileTypescriptSourcesWithPath(packagePath, tsconfigCjsPath);
        var tsconfigEsmName = 'tsconfig.ESNext.json';
        var tsconfigEsmPath = "".concat(projectBuilderPath, "/").concat(tsconfigEsmName);
        this.transpileTypescriptSourcesWithPath(packagePath, tsconfigEsmPath);
        // link this package for usage in local development in other .ts files
        if (this.getIsLocalDevelopment()) {
            console.log("Package [ ".concat(packageJson.name, " ]: npm link package ").concat(packageJson.name, " for local usage with other"));
            this.runCommandLine(packagePath, "npm link", false);
        }
        // building simple .js files to use in example.hml via <script src="...js"
        console.log("Package [ ".concat(packageJson.name, " ]: building simple .js for usage in .html in script tag as src"));
        this.buildSimple(packageJson, packagePath);
    };
    ProjectBuilder.prototype.installPackageDependencies = function (packageJson, packagePath) {
        var e_2, _a;
        var dependencyCatalogPath = '';
        var localDependency = null;
        var dependencies = packageJson["dependencies"];
        if (dependencies && dependencies.length > 0) {
            console.log("Package [ ".concat(packageJson.name, " ]: Installing npm dependencies at ").concat(packagePath, "..."));
            if (this.getIsLocalDevelopment()) {
                console.log("Package [ ".concat(packageJson.name, " ]: Local dev mode npm link method chosen"));
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
                var packagesToLinkJoined = localDependenciesNames.join(" ");
                var npmLinkCommand = "cd \"".concat(packagePath, "\" && npm link ").concat(packagesToLinkJoined);
                console.log("".concat(npmLinkCommand));
                this.runCommandLine(packagePath, npmLinkCommand, false);
            }
            else {
                console.log("Package [ ".concat(packageJson.name, " ]: npm install from npm registry"));
                //for (dependencyName of dependencies) {
                //dependencyCatalogPath = rootPath + dependencyCatalogPath;
                //execSync('npm run build', { cwd: packagePath, stdio: 'inherit', , shell: '/usr/bin/env bash' }); // Run the build command
                //}
            }
        }
        else {
            console.log("Package [ ".concat(packageJson.name, " ]: No dependencies were set in BuildData.json"));
        }
    };
    ProjectBuilder.prototype.buildSimple = function (packageJson, packagePath) {
        var e_3, _a;
        //let buildFileName: string = '';
        var buildCatalogPath = '';
        //let buildFilePath: string = '';
        var buildSimpleCatalogPath = '';
        //let buildSimpleFilePath: string = '';
        var buildFiles = packageJson["build-files"];
        if (!buildFiles || (0 === buildFiles.length)) {
            throw new Error("Package [ ".concat(packageJson.name, " ]: You forgot to set \"build-files\" array, You wish to provide for Simple Build!"));
        }
        buildCatalogPath = packagePath + '/' + this.buildEsmCatalogName;
        if (false === fs.existsSync(buildCatalogPath)) {
            throw new Error("Package [ ".concat(packageJson.name, " ]: build catalog not found: ").concat(buildCatalogPath));
        }
        buildSimpleCatalogPath = packagePath + '/' + this.buildSimpleCatalogName;
        if (false === fs.existsSync(buildSimpleCatalogPath)) {
            this.runCommandLine(packagePath, "mkdir -p \"".concat(buildSimpleCatalogPath, "\""), false);
        }
        try {
            for (var buildFiles_1 = __values(buildFiles), buildFiles_1_1 = buildFiles_1.next(); !buildFiles_1_1.done; buildFiles_1_1 = buildFiles_1.next()) {
                var buildFileName = buildFiles_1_1.value;
                var buildFilePath = buildCatalogPath + '/' + buildFileName;
                var buildSimpleFilePath = buildSimpleCatalogPath + '/' + buildFileName;
                if (true === fs.existsSync(buildSimpleFilePath)) {
                    this.runCommandLine(packagePath, "rm \"".concat(buildSimpleFilePath, "\""), false);
                }
                var fileSimplePathDir = path.parse(buildSimpleFilePath).dir;
                if (false === fs.existsSync(fileSimplePathDir)) {
                    this.runCommandLine(packagePath, "mkdir -p \"".concat(fileSimplePathDir, "\""), false);
                }
                this.runCommandLine(packagePath, "cp \"".concat(buildFilePath, "\" \"").concat(buildSimpleFilePath, "\""), false);
                // @ts-ignore
                //this.prettifyWithEslint(this.absolutePathToProjectRoot, buildSimpleFilePath, false);
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
    ProjectBuilder.prototype.transpileTypescriptSourcesWithPath = function (packagePath, tsconfigPath) {
        var tsconfig = fs.readFileSync(tsconfigPath);
        var compilerOptions = tsconfig["compilerOptions"];
        var transpileOptions = [];
        for (var compilerOptonName in compilerOptions) {
            var compilerOptionValue = compilerOptions[compilerOptonName];
            transpileOptions.push("--".concat(compilerOptonName, " ").concat(compilerOptionValue));
        }
        var filesAndCatalogsList = fs.readdirSync("".concat(packagePath, "/src"), { recursive: true });
        if (!filesAndCatalogsList || filesAndCatalogsList.length === 0) {
            return null;
        }
        var filesList = filesAndCatalogsList.filter(function (filePath) {
            var absPath = "".concat(packagePath, "/src/").concat(filePath);
            return fs.lstatSync(absPath).isFile();
        });
        var filesListJoinedString = "src/" + filesList.join(" src/");
        var transpileOptionsString = transpileOptions.join(" ");
        var transpileCommand = "cd \"".concat(packagePath, "\" && tsc ").concat(filesListJoinedString, " ").concat(transpileOptionsString);
        return this.runCommandLine("".concat(packagePath), transpileCommand, true);
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