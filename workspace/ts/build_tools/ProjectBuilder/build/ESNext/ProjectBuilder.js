import { execSync } from 'child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import JSON5 from 'json5';
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
        if (!dataJson.packages || 0 === dataJson.packages.length) {
            throw new Error('no packages array set in BuildData.json');
        }
        const packages = [
            ...dataJson.packages.filter((packageJson) => (true === packageJson.build))
        ];
        if (!packages || 0 === packages.length) {
            throw new Error('no packages marked to build in the BuildData.json');
        }
        for (let packageJson of packages) {
            this.buildPackage(packageJson, this.absolutePathToProjectRoot);
        }
    }
    buildPackage(packageJson, rootPath) {
        console.log(`\n\n\n===============================`);
        console.log(`MODULE ${packageJson.name}`);
        console.log(`===============================\n`);
        let packagePath = this.absolutePathFromRootWww + '/' + packageJson.path;
        // install or link npm dependencies
        console.log(`Package [ ${packageJson.name} ]: Calling npm dependencies install`);
        this.installPackageDependencies(packageJson, packagePath);
        // transpile .ts
        this.runCommandLine(packagePath, `ls -lahrts src`, true);
        console.log(`Package [ ${packageJson.name} ]: Prettifying with Eslint TypeScript code in ${packagePath}`);
        this.prettifyWithEslint(packagePath, `${packagePath}/src/**/*.ts`, false);
        // transpiling for BuildSimple .js prettified files, usable as are in <script src="" />
        // using local package environment, however tsconfig.ESNext.json is used from project root.
        console.log(`Package [ ${packageJson.name} ]: Transpiling TypeScript code in ${packagePath}`);
        //const projectBuilderPath: string = `${this.absolutePathToProjectRoot}/build_tools/ProjectBuilder`;
        // transpile modern ES2023 node version compatible
        const tsconfigESNextName = 'tsconfig.ESNext.json';
        const tsconfigESNextPath = `${this.absolutePathToProjectRoot}/${tsconfigESNextName}`;
        this.transpileTypescriptSourcesWithPath(packagePath, tsconfigESNextPath);
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
                    dependencyCatalogPath = this.absolutePathFromRootWww + '/' + localDependency.path;
                    console.log(`cd && npm link in catalog: [ ${dependencyCatalogPath} ]`);
                    this.runCommandLine(dependencyCatalogPath, `cd "${dependencyCatalogPath}" && npm link`, false);
                    localDependenciesNames.push(localDependency.name);
                }
                const packagesToLinkJoined = localDependenciesNames.join(" ");
                const npmLinkCommand = `cd "${packagePath}" && npm link ${packagesToLinkJoined}`;
                console.log(`${npmLinkCommand}`);
                this.runCommandLine(packagePath, npmLinkCommand, false);
            }
            else {
                console.log(`Package [ ${packageJson.name} ]: npm install from npm registry`);
                //for (dependencyName of dependencies) {
                //dependencyCatalogPath = rootPath + dependencyCatalogPath;
                //execSync('npm run build', { cwd: packagePath, stdio: 'inherit', , shell: '/usr/bin/env bash' }); // Run the build command
                //}
            }
        }
        else {
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
        if (!buildFiles || (0 === buildFiles.length)) {
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
        const tsconfig = JSON5.parse(tsconfigJson);
        const compilerOptions = tsconfig["compilerOptions"];
        if (!compilerOptions) {
            throw new Error(`Typescript config file has no compilerOptions, or was not found at: ${tsconfigPath}`);
        }
        const transpileOptions = [];
        for (let compilerOptonName in compilerOptions) {
            const compilerOptionValue = compilerOptions[compilerOptonName];
            transpileOptions.push(`--${compilerOptonName} ${compilerOptionValue}`);
        }
        const filesAndCatalogsList = fs.readdirSync(`${packagePath}/src`, { recursive: true });
        if (!filesAndCatalogsList || filesAndCatalogsList.length === 0) {
            return null;
        }
        const filesList = filesAndCatalogsList.filter((filePath) => {
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