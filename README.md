# JAISOCX TS TOOLS BUILDER

## STATUS OF THE PROJECT

The Project is under development now, 2024-11-23.

However the infrastructure for building a multi submodules .ts libraries is ready to use.

- Assets feature for css and images files to enable a .ts lib to work after *npm install <of Your .ts lib>* is not started.

- Tree class is under development.




## AIM OF THE PROJECT

### typescript modules development, local and synched to npm registry
The project was started to provide the modular typescript development,
with the ability to keep source code well structured in npm registry,
however being able to develop a new typescript tool,
and at once fix bugs or add new features in other own typescript modules, published on npm registry,
keeping dependencies not broken and centralized.

### js files use in .html files the easiest way
Another aim of the project is to prettify the transpiled .js results of typescript sources,
and being able to use the prettified .js builds both for web ui tools in .html pages without any additional builds required,
when published at a http server,
and when in files explorer context menu over an .html file "Open with ..." =&gt; browser.

Why? to be able to test a .js tool in each environment, 
to be able at once to check out modifying possibilities in the .js code,
to reduce for customers the entry level, by mimizing the need of software and dependencies install, when intending a use of a js tool.


## How to define local dependencies in a new module

"@jaisocx/" is used here like the example for a npm registry name for .ts modules,
Feel free to use Your own.

- *1. in module's package.json, like this:*
```
  "optionalDependencies": {
    "@jaisocx/event-emitter": "^1.0.x",
    "@jaisocx/template": "^1.0.x"
  },
```

the dependency line, e.g. "@jaisocx/event-emitter": "^1.0.x", 
You get from the local linked submodule catalog's package.json:

https_service_docker_volume/www/modules/EventEmitter/package.json

```
{
  "name": "@jaisocx/event-emitter",
  "version": "1.0.1",
  ...
```


- 2. in the `https_service_docker_volume/BuildData.json`

add new json entry for Your new .ts module

- *3. in the "dependencies" array, set every local dependency*, these You will use with npm link feature, 
 .i.e building from local sources here in this project

```
{
  "npm-registry-name": "@jaisocx",
  "modules": [
    {
      "path": "modules/Tree",
      "name": "tree",
      "build": true,
      "dependencies": [
        {
          "name": "@jaisocx/event-emitter",
          "path": "modules/EventEmitter"
        },
        {
          "name": "@jaisocx/template",
          "path": "modules/Template"
        }
      ],
      "build-files": [
        "Tree.js",
        "TreeMetadata.js",
        "TreeConstants.js"
      ]
    },
```

- *4. in the catalog https_service_docker_volume,* start build .ts files to .js

```
npm run build
```

## how to prettify .ts soures:

in terminal change to `https_service_docker_volume`

the eslint config `.eslintrc.js` is in this catalog.

then, run eslint
```
npx eslint www/modules/<YourModule>/src/**/*.ts --fix 
```

## how to develop eslint modules:

here is the path, where some custom eslint rules within one custom plugin were developed.

Plugin "jaisocx":
`https_service_docker_volume/build_tools/src/EslintPlugins/EslintPluginJaisocxJS`

eslint rules files:

`https_service_docker_volume/build_tools/src/EslintPlugins/EslintPluginJaisocxJS/lib/rules`

## how to customize .js builds and other tasks, by customizing the ProjectBuilder:

In the terminal change to 

`https_service_docker_volume/build_tools`

this is the root catalog of ProjectBuilder tool.

Here resides .ts code:

`https_service_docker_volume/build_tools/src/ProjectBuilder`

to transpile ProjectBuilder typescript code, if modified it,

```
cd "https_service_docker_volume/build_tools"
npm run build
```

Then, You can use Your new ProjectBuilder version to build Your packages in this project:

```
cd https_service_docker_volume
npm run build
```