import { execSync } from 'child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
export class ProjectBuilder {
    isLocalDevelopment;
    absolutePathToProjectRoot;
    relativePathFromRootTsConfigCatalogPath;
    absolutePathFromRootTsConfigCatalogPath;
    relativePathFromRootLintCatalog;
    absolutePathFromRootLintCatalog;
    relativePathFromRootWww;
    absolutePathFromRootWww;
    buildCjsCatalogName;
    buildEsmCatalogName;
    buildSimpleCatalogName;
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
    getSpawnSyncPayload(contextRoot) {
        return {
            cwd: contextRoot,
            stdio: 'inherit',
            shell: 'bash',
            //shell: '/usr/bin/env bash',
            //env: { ...process.env, PATH: (process.env.PATH + ':/usr/local/bin:/usr/bin:/bin') }
        };
    }
    build(dataJson) {
        //process.env = { ...process.env, PATH: (process.env.PATH + ':/usr/local/bin:/usr/bin:/bin') };
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
        this.runCommandLine(modulePath, `ls -lahrts src`, true);
        this.prettifyWithEslint(this.absolutePathToProjectRoot, `${modulePath}/src/**/*.ts`, false);
        // transpiling to standard .js build,
        // using local module environment and tsconfig.json
        /*this.transpileTypeScriptSources(
          modulePath,
          `${modulePath}/tsconfig.json`,
          true
        );*/
        // transpiling for BuildSimple .js prettified files, usable as are in <script src="" />
        // using local module environment, however tsconfig.ESNext.json is used from project root.
        const tsconfigCjsName = 'tsconfig.cjs.json';
        const tsconfigCjsPath = `${this.absolutePathToProjectRoot}/${tsconfigCjsName}`;
        this.transpileTypescriptSourcesWithPath(modulePath, tsconfigCjsPath);
        const tsconfigEsmName = 'tsconfig.esm.json';
        const tsconfigEsmPath = `${this.absolutePathToProjectRoot}/${tsconfigEsmName}`;
        this.transpileTypescriptSourcesWithPath(modulePath, tsconfigEsmPath);
        // link this module for usage in local development in other .ts files
        if (this.getIsLocalDevelopment()) {
            console.log(`Module [ ${moduleJson.name} ]: npm link module ${moduleJson.name} for local usage with other`);
            this.runCommandLine(modulePath, `npm link`, false);
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
                    this.runCommandLine(dependencyCatalogPath, `cd "${dependencyCatalogPath}" && npm link`, false);
                    localDependenciesNames.push(localDependency.name);
                }
                const modulesToLinkJoined = localDependenciesNames.join(" ");
                const npmLinkCommand = `cd "${modulePath}" && npm link ${modulesToLinkJoined}`;
                console.log(`${npmLinkCommand}`);
                this.runCommandLine(modulePath, npmLinkCommand, false);
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
        buildCatalogPath = modulePath + '/' + this.buildEsmCatalogName;
        if (false === fs.existsSync(buildCatalogPath)) {
            throw new Error(`Module [ ${moduleJson.name} ]: build catalog not found: ${buildCatalogPath}`);
        }
        buildSimpleCatalogPath = modulePath + '/' + this.buildSimpleCatalogName;
        if (false === fs.existsSync(buildSimpleCatalogPath)) {
            this.runCommandLine(modulePath, `mkdir -p "${buildSimpleCatalogPath}"`, false);
        }
        for (const buildFileName of buildFiles) {
            const buildFilePath = buildCatalogPath + '/' + buildFileName;
            const buildSimpleFilePath = buildSimpleCatalogPath + '/' + buildFileName;
            if (true === fs.existsSync(buildSimpleFilePath)) {
                this.runCommandLine(modulePath, `rm "${buildSimpleFilePath}"`, false);
            }
            const fileSimplePathDir = path.parse(buildSimpleFilePath).dir;
            if (false === fs.existsSync(fileSimplePathDir)) {
                this.runCommandLine(modulePath, `mkdir -p "${fileSimplePathDir}"`, false);
            }
            this.runCommandLine(modulePath, `cp "${buildFilePath}" "${buildSimpleFilePath}"`, false);
            // @ts-ignore
            this.prettifyWithEslint(this.absolutePathToProjectRoot, buildSimpleFilePath, false);
        }
    }
    transpileTypeScriptSources(tsconfigCatalogPath, tsconfigFileName, logToConsole) {
        const consoleCommand = `cd "${tsconfigCatalogPath}" && tsc -p "${tsconfigFileName}"`;
        return this.runCommandLine(tsconfigCatalogPath, consoleCommand, logToConsole);
    }
    transpileTypescriptSourcesWithPath(modulePath, tsconfigPath) {
        const tsconfig = require(tsconfigPath);
        const compilerOptions = tsconfig["compilerOptions"];
        const transpileOptions = [];
        for (let compilerOptonName in compilerOptions) {
            const compilerOptionValue = compilerOptions[compilerOptonName];
            transpileOptions.push(`--${compilerOptonName} ${compilerOptionValue}`);
        }
        const filesAndCatalogsList = fs.readdirSync(`${modulePath}/src`, { recursive: true });
        if (!filesAndCatalogsList || filesAndCatalogsList.length === 0) {
            return null;
        }
        const filesList = filesAndCatalogsList.filter((filePath) => {
            const absPath = `${modulePath}/src/${filePath}`;
            return fs.lstatSync(absPath).isFile();
        });
        const filesListJoinedString = "src/" + filesList.join(" src/");
        const transpileOptionsString = transpileOptions.join(" ");
        const transpileCommand = `cd "${modulePath}" && tsc ${filesListJoinedString} ${transpileOptionsString}`;
        return this.runCommandLine(`${modulePath}`, transpileCommand, true);
    }
    prettifyWithEslint(eslintConfigCatalogPath, pathToFileToPrettify, logToConsole) {
        const consoleCommand = `npx eslint "${pathToFileToPrettify}" --fix`;
        return this.runCommandLine(eslintConfigCatalogPath, consoleCommand, logToConsole);
    }
    runCommandLine(configCatalogPath, consoleCommand, logToConsole) {
        let result = null;
        try {
            result = execSync(consoleCommand, this.getSpawnSyncPayload(configCatalogPath));
        }
        catch (e) {
            result = e;
        }
        if (logToConsole === true) {
            console.log(result);
        }
        return result;
    }
}
//# sourceMappingURL=ProjectBuilder.js.map