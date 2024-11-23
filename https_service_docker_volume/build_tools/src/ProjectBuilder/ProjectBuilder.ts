import { execSync, spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { IDependency } from './types';

export class ProjectBuilder {
  isLocalDevelopment: number;

  absolutePathToProjectRoot: string;

  relativePathFromRootTsConfigCatalogPath: string;
  absolutePathFromRootTsConfigCatalogPath: string;

  relativePathFromRootLintCatalog: string;
  absolutePathFromRootLintCatalog: string;

  relativePathFromRootWww: string;
  absolutePathFromRootWww: string;

  buildCatalogName: string;
  buildESNextCatalogName: string;
  buildESNextTSConfigName: string;
  buildSimpleCatalogName: string;


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

  getIsLocalDevelopment(): number {
    return this.isLocalDevelopment;
  }

  setIsLocalDevelopment(isLocalDevelopment: number): ProjectBuilder {
    this.isLocalDevelopment = isLocalDevelopment;
    return this;
  }

  setAbsolutePathToProjectRoot(projectRoot: string): ProjectBuilder {
    this.absolutePathToProjectRoot = projectRoot;
    return this;
  }
  setAbsolutePath(propertyName: string, relativePath: string): ProjectBuilder {    
    if (!this.absolutePathToProjectRoot) {
      throw new Error('The Absolute Path to Project root is not specified!!!');
    }

    // @ts-ignore
    this[propertyName] = path.resolve(
      this.absolutePathToProjectRoot + '/' + relativePath
    );
    return this;
  }
  setRelativePathFromRootTsConfigCatalogPath(relativePath: string): ProjectBuilder {
    this.relativePathFromRootTsConfigCatalogPath = relativePath;
    this.setAbsolutePath('absolutePathFromRootTsConfigCatalogPath', relativePath);
    return this;
  }
  setRelativePathFromRootLintCatalog(relativePath: string): ProjectBuilder {
    this.relativePathFromRootLintCatalog = relativePath;
    this.setAbsolutePath('absolutePathFromRootLintCatalog', relativePath);
    return this;
  }
  setRelativePathFromRootWww(relativePath: string): ProjectBuilder {
    this.relativePathFromRootWww = relativePath;
    this.setAbsolutePath('absolutePathFromRootWww', relativePath);
    return this;
  }
  setBuildCatalogName(catalogName: string): ProjectBuilder {
    this.buildCatalogName = catalogName;
    return this;
  }
  setBuildESNextCatalogName(catalogName: string): ProjectBuilder {
    this.buildESNextCatalogName = catalogName;
    return this;
  }
  setBuildESNextTSConfigName(tsConfigName: string): ProjectBuilder {
    this.buildESNextTSConfigName = tsConfigName;
    return this;
  }
  setBuildSimpleCatalogName(catalogName: string): ProjectBuilder {
    this.buildSimpleCatalogName = catalogName;
    return this;
  }

  getSpawnSyncPayload(contextRoot: string): any {
    return {
      cwd: contextRoot,
      stdio: 'inherit', 
      shell: 'bash',
      //shell: '/usr/bin/env bash',
      env: { ...process.env, PATH: (process.env.PATH + ':/usr/local/bin:/usr/bin:/bin') }
    };
  }

  build(dataJson: any): any {
    process.env = { ...process.env, PATH: (process.env.PATH + ':/usr/local/bin:/usr/bin:/bin') };

    if (!dataJson.modules || 0 === dataJson.modules.length) {
      throw new Error('no modules array set in BuildData.json');
    }

    const modules: any[] = [
      ...dataJson.modules.filter(
        (moduleJson: any) => (true === moduleJson.build)
      )
    ];

    if (!modules || 0 === modules.length) {
      throw new Error('no modules marked to build in the BuildData.json');
    }

    for (let moduleJson of modules) {
      this.buildModule(moduleJson, this.absolutePathToProjectRoot);
    }
  }

  buildModule(moduleJson: any, rootPath: string) {
    console.log(`\n\n\n===============================`);
    console.log(`MODULE ${moduleJson.name}`);
    console.log(`===============================\n`);

    let modulePath: string = this.absolutePathFromRootWww + '/' + moduleJson.path;

    // install or link npm dependencies
    console.log(`Module [ ${moduleJson.name} ]: Calling npm dependencies install`);
    this.installModuleDependencies(moduleJson, modulePath);

    // transpile .ts
    console.log(`Module [ ${moduleJson.name} ]: Transpiling TypeScript code in ${modulePath}`);
    this.runCommandLine(modulePath, `ls -lahrts src`, true);

    this.prettifyWithEslint(this.absolutePathToProjectRoot, `${modulePath}/src/**/*.ts`, false);

    // transpiling to standard .js build,
    // using local module environment and tsconfig.json
    this.transpileTypeScriptSources(
      modulePath, 
      "tsconfig.json",
      true
    );

    // transpiling for BuildSimple .js prettified files, usable as are in <script src="" />
    // using local module environment, however tsconfig.ESNext.json is used from project root.
    const tsconfigPath: string = `${this.absolutePathToProjectRoot}/${this.buildESNextTSConfigName}`;
    this.transpileTypescriptSourcesWithPath(modulePath, tsconfigPath);

    // link this module for usage in local development in other .ts files
    if (this.getIsLocalDevelopment()) {
      console.log(`Module [ ${moduleJson.name} ]: npm link module ${moduleJson.name} for local usage with other`);
      this.runCommandLine(modulePath, `npm link`, false);
    }

    // building simple .js files to use in example.hml via <script src="...js"
    console.log(`Module [ ${moduleJson.name} ]: building simple .js for usage in .html in script tag as src`);
    this.buildSimple(moduleJson, modulePath);
  }

  installModuleDependencies(moduleJson: any, modulePath: string): void {
    let dependencyCatalogPath: string = '';
    let localDependency: IDependency|null = null;

    const dependencies: IDependency[]|null = moduleJson["dependencies"];
    if (dependencies && dependencies.length > 0) {
      console.log(`Module [ ${moduleJson.name} ]: Installing npm dependencies at ${modulePath}...`);

      if (this.getIsLocalDevelopment()) {
        console.log(`Module [ ${moduleJson.name} ]: Local dev mode npm link method chosen`);

        const localDependenciesNames: string[] = [];
        for (localDependency of dependencies) {
          dependencyCatalogPath = this.absolutePathFromRootWww + '/' + localDependency.path;

          console.log(`cd && npm link in catalog: [ ${dependencyCatalogPath} ]`);
          this.runCommandLine(dependencyCatalogPath, `cd "${dependencyCatalogPath}" && npm link`, false);
          localDependenciesNames.push(localDependency.name);
        }

        const modulesToLinkJoined: string = localDependenciesNames.join(" ");
        const npmLinkCommand: string = `cd "${modulePath}" && npm link ${modulesToLinkJoined}`;
        console.log(`${npmLinkCommand}`);
        this.runCommandLine(modulePath, npmLinkCommand, false);
        
      } else {
        console.log(`Module [ ${moduleJson.name} ]: npm install from npm registry`);

        //for (dependencyName of dependencies) {
          //dependencyCatalogPath = rootPath + dependencyCatalogPath;
          //execSync('npm run build', { cwd: modulePath, stdio: 'inherit', , shell: '/usr/bin/env bash' }); // Run the build command
        //}
      }
    } else {
      console.log(`Module [ ${moduleJson.name} ]: No dependencies were set in BuildData.json`);
    }
  }

  buildSimple(moduleJson: any, modulePath: string): void {
    //let buildFileName: string = '';
    let buildCatalogPath: string = '';
    //let buildFilePath: string = '';
    let buildSimpleCatalogPath: string = '';
    //let buildSimpleFilePath: string = '';

    const buildFiles: string[]|undefined = moduleJson["build-files"];
    if (!buildFiles || (0 === buildFiles.length)) {
      throw new Error(`Module [ ${moduleJson.name} ]: You forgot to set "build-files" array, You wish to provide for Simple Build!`);
    }

    buildCatalogPath    = modulePath + '/' + this.buildESNextCatalogName;
    if (false === fs.existsSync(buildCatalogPath)) {
      throw new Error(`Module [ ${moduleJson.name} ]: build catalog not found: ${buildCatalogPath}`);
    }
    buildSimpleCatalogPath = modulePath + '/' + this.buildSimpleCatalogName;

    for (const buildFileName of buildFiles) {
      const buildFilePath: string        = buildCatalogPath + '/' + buildFileName;
      const buildSimpleFilePath: string  = buildSimpleCatalogPath + '/' + buildFileName;

      if (false === fs.existsSync(buildSimpleCatalogPath)) {
        this.runCommandLine(modulePath, `mkdir -p "${buildSimpleCatalogPath}"`, false);
        //fs.mkdirSync(buildSimpleCatalogPath, {recursive: true});
      }

      if (true === fs.existsSync(buildSimpleFilePath)) {
        this.runCommandLine(modulePath, `rm "${buildSimpleFilePath}"`, false);
      }

      this.runCommandLine(modulePath, `cp "${buildFilePath}" "${buildSimpleFilePath}"`, false);

      // @ts-ignore
      this.prettifyWithEslint(this.absolutePathToProjectRoot, buildSimpleFilePath, false);

      /*fs.copyFile(buildFilePath, buildSimpleFilePath, (err) => {
        if (err) {
          console.error(`Module [ ${moduleJson.name} ]: Error copying file:`, err);
          return;
        }

        (function() {
          const fileName: string = buildFileName;
          // @ts-ignore
          const filePathToEslint: string = ('./' + this.buildSimpleCatalogName + '/' + fileName);
          console.log(`Module [ ${moduleJson.name} ]: Copy file [ ${fileName} ] success, catalog ${buildSimpleFilePath}!`);

          // @ts-ignore
          this.prettifyWithEslint(this.absolutePathToProjectRoot, filePathToEslint, false);
        }).call(this);
      });*/
    }
  }

  transpileTypeScriptSources(
    tsconfigCatalogPath: string, 
    tsconfigFileName: string,
    logToConsole: boolean
  ): any {
    const consoleCommand: string = `tsc -p "./${tsconfigFileName}"`;
    return this.runCommandLine(tsconfigCatalogPath, consoleCommand, logToConsole);
  }

  transpileTypescriptSourcesWithPath(modulePath: string, tsconfigPath: string): any {
    const tsconfig: any = require(tsconfigPath);
    const compilerOptions: any = tsconfig["compilerOptions"];
    const transpileOptions: string[] = [];
    for (let compilerOptonName in compilerOptions) {
      const compilerOptionValue: any = compilerOptions[compilerOptonName];
      transpileOptions.push(`--${compilerOptonName} ${compilerOptionValue}`);
    }

    const filesList: string[] = fs.readdirSync(`${modulePath}/src`);
    if (!filesList || filesList.length === 0) {
      return null;
    }

    const filesListJoinedString: string = "src/" + filesList.join(" src/");
    const transpileOptionsString: string = transpileOptions.join(" ");
    const transpileCommand: string = `cd "${modulePath}" && tsc ${filesListJoinedString} ${transpileOptionsString}`;
    return this.runCommandLine(`${modulePath}`, transpileCommand, true);
  }

  prettifyWithEslint(
    eslintConfigCatalogPath: string, 
    pathToFileToPrettify: string, 
    logToConsole: boolean
  ): any {
    const consoleCommand: string = `npx eslint "${pathToFileToPrettify}" --fix`;
    return this.runCommandLine(eslintConfigCatalogPath, consoleCommand, logToConsole);
  }

  runCommandLine(
    configCatalogPath: string, 
    consoleCommand: string, 
    logToConsole: boolean
  ): any {
    let result: any = null;
    try {
      result = execSync(
        consoleCommand, 
        this.getSpawnSyncPayload(configCatalogPath)
      );
    } catch (e: any) {
      result = e;
    }

    if ( logToConsole === true ) {
      console.log(result);
    }

    return result;
  }

}





