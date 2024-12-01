export declare class ProjectBuilder {
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
    constructor();
    getIsLocalDevelopment(): number;
    setIsLocalDevelopment(isLocalDevelopment: number): ProjectBuilder;
    setAbsolutePathToProjectRoot(projectRoot: string): ProjectBuilder;
    setAbsolutePath(propertyName: string, relativePath: string): ProjectBuilder;
    setRelativePathFromRootTsConfigCatalogPath(relativePath: string): ProjectBuilder;
    setRelativePathFromRootLintCatalog(relativePath: string): ProjectBuilder;
    setRelativePathFromRootWww(relativePath: string): ProjectBuilder;
    setBuildCjsCatalogName(catalogName: string): ProjectBuilder;
    setBuildEsmCatalogName(catalogName: string): ProjectBuilder;
    setBuildSimpleCatalogName(catalogName: string): ProjectBuilder;
    getSpawnSyncPayload(contextRoot: string): any;
    build(dataJson: any): any;
    buildModule(moduleJson: any, rootPath: string): void;
    installModuleDependencies(moduleJson: any, modulePath: string): void;
    buildSimple(moduleJson: any, modulePath: string): void;
    transpileTypeScriptSources(tsconfigCatalogPath: string, tsconfigFileName: string, logToConsole: boolean): any;
    transpileTypescriptSourcesWithPath(modulePath: string, tsconfigPath: string): any;
    prettifyWithEslint(eslintConfigCatalogPath: string, pathToFileToPrettify: string, logToConsole: boolean): any;
    runCommandLine(configCatalogPath: string, consoleCommand: string, logToConsole: boolean): any;
}
//# sourceMappingURL=ProjectBuilder.d.ts.map