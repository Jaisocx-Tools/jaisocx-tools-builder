import { execSync } from 'child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
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

  buildCjsCatalogName: string;
  buildEsmCatalogName: string;
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
  
    this.buildCjsCatalogName = '';
    this.buildEsmCatalogName = '';
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
  setBuildCjsCatalogName(catalogName: string): ProjectBuilder {
    this.buildCjsCatalogName = catalogName;
    return this;
  }
  setBuildEsmCatalogName(catalogName: string): ProjectBuilder {
    this.buildEsmCatalogName = catalogName;
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
      //env: { ...process.env, PATH: (process.env.PATH + ':/usr/local/bin:/usr/bin:/bin') }
    };
  }

  build(dataJson: any): any {
    //process.env = { ...process.env, PATH: (process.env.PATH + ':/usr/local/bin:/usr/bin:/bin') };

    if (!dataJson.packages || 0 === dataJson.packages.length) {
      throw new Error('no packages array set in BuildData.json');
    }

    const packages: any[] = [
      ...dataJson.packages.filter(
        (packageJson: any) => (true === packageJson.build)
      )
    ];

    if (!packages || 0 === packages.length) {
      throw new Error('no packages marked to build in the BuildData.json');
    }

    for (let packageJson of packages) {
      this.buildPackage(packageJson, this.absolutePathToProjectRoot);
    }
  }

  buildPackage(packageJson: any, rootPath: string) {
    console.log(`\n\n\n===============================`);
    console.log(`MODULE ${packageJson.name}`);
    console.log(`===============================\n`);

    let packagePath: string = this.absolutePathFromRootWww + '/' + packageJson.path;

    // install or link npm dependencies
    console.log(`Package [ ${packageJson.name} ]: Calling npm dependencies install`);
    this.installPackageDependencies(packageJson, packagePath);

    // transpile .ts
    this.runCommandLine(packagePath, `ls -lahrts src`, true);

    console.log(`Package [ ${packageJson.name} ]: Prettifying with Eslint TypeScript code in ${packagePath}`);
    //this.prettifyWithEslint(this.absolutePathToProjectRoot, `${packagePath}/src/**/*.ts`, false);

    // transpiling for BuildSimple .js prettified files, usable as are in <script src="" />
    // using local package environment, however tsconfig.ESNext.json is used from project root.
    console.log(`Package [ ${packageJson.name} ]: Transpiling TypeScript code in ${packagePath}`);
    const projectBuilderPath: string = `${this.absolutePathToProjectRoot}/build_tools/ProjectBuilder`;
    const tsconfigCjsName: string = 'tsconfig.CommonJS.json';
    const tsconfigCjsPath: string = `${projectBuilderPath}/${tsconfigCjsName}`;
    this.transpileTypescriptSourcesWithPath(packagePath, tsconfigCjsPath);

    const tsconfigEsmName: string = 'tsconfig.ESNext.json';
    const tsconfigEsmPath: string = `${projectBuilderPath}/${tsconfigEsmName}`;
    this.transpileTypescriptSourcesWithPath(packagePath, tsconfigEsmPath);

    // link this package for usage in local development in other .ts files
    if (this.getIsLocalDevelopment()) {
      console.log(`Package [ ${packageJson.name} ]: npm link package ${packageJson.name} for local usage with other`);
      this.runCommandLine(packagePath, `npm link`, false);
    }

    // building simple .js files to use in example.hml via <script src="...js"
    console.log(`Package [ ${packageJson.name} ]: building simple .js for usage in .html in script tag as src`);
    this.buildSimple(packageJson, packagePath);
  }

  installPackageDependencies(packageJson: any, packagePath: string): void {
    let dependencyCatalogPath: string = '';
    let localDependency: IDependency|null = null;

    const dependencies: IDependency[]|null = packageJson["dependencies"];
    if (dependencies && dependencies.length > 0) {
      console.log(`Package [ ${packageJson.name} ]: Installing npm dependencies at ${packagePath}...`);

      if (this.getIsLocalDevelopment()) {
        console.log(`Package [ ${packageJson.name} ]: Local dev mode npm link method chosen`);

        const localDependenciesNames: string[] = [];
        for (localDependency of dependencies) {
          dependencyCatalogPath = this.absolutePathFromRootWww + '/' + localDependency.path;

          console.log(`cd && npm link in catalog: [ ${dependencyCatalogPath} ]`);
          this.runCommandLine(dependencyCatalogPath, `cd "${dependencyCatalogPath}" && npm link`, false);
          localDependenciesNames.push(localDependency.name);
        }

        const packagesToLinkJoined: string = localDependenciesNames.join(" ");
        const npmLinkCommand: string = `cd "${packagePath}" && npm link ${packagesToLinkJoined}`;
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

  buildSimple(packageJson: any, packagePath: string): void {
    //let buildFileName: string = '';
    let buildCatalogPath: string = '';
    //let buildFilePath: string = '';
    let buildSimpleCatalogPath: string = '';
    //let buildSimpleFilePath: string = '';

    const buildFiles: string[]|undefined = packageJson["build-files"];
    if (!buildFiles || (0 === buildFiles.length)) {
      throw new Error(`Package [ ${packageJson.name} ]: You forgot to set "build-files" array, You wish to provide for Simple Build!`);
    }

    buildCatalogPath    = packagePath + '/' + this.buildEsmCatalogName;
    if (false === fs.existsSync(buildCatalogPath)) {
      throw new Error(`Package [ ${packageJson.name} ]: build catalog not found: ${buildCatalogPath}`);
    }
    buildSimpleCatalogPath = packagePath + '/' + this.buildSimpleCatalogName;
    if (false === fs.existsSync(buildSimpleCatalogPath)) {
      this.runCommandLine(packagePath, `mkdir -p "${buildSimpleCatalogPath}"`, false);
    }

    for (const buildFileName of buildFiles) {
      const buildFilePath: string        = buildCatalogPath + '/' + buildFileName;
      const buildSimpleFilePath: string  = buildSimpleCatalogPath + '/' + buildFileName;

      if (true === fs.existsSync(buildSimpleFilePath)) {
        this.runCommandLine(packagePath, `rm "${buildSimpleFilePath}"`, false);
      }

      const fileSimplePathDir: string = path.parse(buildSimpleFilePath).dir;
      if (false === fs.existsSync(fileSimplePathDir) ) {
        this.runCommandLine(packagePath, `mkdir -p "${fileSimplePathDir}"`, false);
      }

      this.runCommandLine(packagePath, `cp "${buildFilePath}" "${buildSimpleFilePath}"`, false);

      // @ts-ignore
      this.prettifyWithEslint(this.absolutePathToProjectRoot, buildSimpleFilePath, false);
    }
  }

  transpileTypeScriptSources(
    tsconfigCatalogPath: string, 
    tsconfigFileName: string,
    logToConsole: boolean
  ): any {
    const consoleCommand: string = `cd "${tsconfigCatalogPath}" && tsc -p "${tsconfigFileName}"`;
    return this.runCommandLine(tsconfigCatalogPath, consoleCommand, logToConsole);
  }

  transpileTypescriptSourcesWithPath(packagePath: string, tsconfigPath: string): any {
    const tsconfig: any = require(tsconfigPath);
    const compilerOptions: any = tsconfig["compilerOptions"];
    const transpileOptions: string[] = [];
    for (let compilerOptonName in compilerOptions) {
      const compilerOptionValue: any = compilerOptions[compilerOptonName];
      transpileOptions.push(`--${compilerOptonName} ${compilerOptionValue}`);
    }

    const filesAndCatalogsList: string[] = fs.readdirSync(`${packagePath}/src`, {recursive: true})  as string[];
    if (!filesAndCatalogsList || filesAndCatalogsList.length === 0) {
      return null;
    }

    const filesList: string[] = filesAndCatalogsList.filter((filePath) => {
      const absPath: string = `${packagePath}/src/${filePath}`;
      return fs.lstatSync(absPath).isFile(); 
    });

    const filesListJoinedString: string = "src/" + filesList.join(" src/");
    const transpileOptionsString: string = transpileOptions.join(" ");
    const transpileCommand: string = `cd "${packagePath}" && tsc ${filesListJoinedString} ${transpileOptionsString}`;
    return this.runCommandLine(`${packagePath}`, transpileCommand, true);
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





