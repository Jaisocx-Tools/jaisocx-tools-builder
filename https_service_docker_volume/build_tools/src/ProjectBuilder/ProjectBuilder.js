import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
export class ProjectBuilder {
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
        const result = execSync(`ls -la src`, this.getSpawnSyncPayload(modulePath));
        console.log(result);
        this.prettifyWithEslint(this.absolutePathToProjectRoot, `"${modulePath}/src/**/*.ts"`);
        const result2 = execSync(`tsc -p ./tsconfig.json`, this.getSpawnSyncPayload(modulePath));
        console.log(result2);
        const result3 = execSync(`tsc -p "${this.absolutePathToProjectRoot}/${this.buildESNextTSConfigName}"`, this.getSpawnSyncPayload(this.absolutePathToProjectRoot));
        console.log(result3);
        // link this module for usage in local development in other .ts files
        if (this.getIsLocalDevelopment()) {
            console.log(`Module [ ${moduleJson.name} ]: npm link module ${moduleJson.name} for local usage with other`);
            execSync('npm link', this.getSpawnSyncPayload(modulePath));
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
                    execSync(`cd "${dependencyCatalogPath}" && npm link`, this.getSpawnSyncPayload(dependencyCatalogPath));
                    localDependenciesNames.push(localDependency.name);
                }
                const modulesToLinkJoined = localDependenciesNames.join(" ");
                const npmLinkCommand = `cd "${modulePath}" && npm link ${modulesToLinkJoined}`;
                console.log(`${npmLinkCommand}`);
                execSync(npmLinkCommand, this.getSpawnSyncPayload(modulePath));
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
                    // @ts-ignore
                    this.prettifyWithEslint(this.absolutePathToProjectRoot, filePathToEslint);
                }).call(this);
            });
        }
    }
    prettifyWithEslint(eslintConfigCatalogPath, pathToFileToPrettify) {
        let result = null;
        try {
            result = execSync(`npx eslint "${pathToFileToPrettify}" --fix`, this.getSpawnSyncPayload(eslintConfigCatalogPath));
        }
        catch (e) {
            result = e;
        }
        return result;
    }
}
