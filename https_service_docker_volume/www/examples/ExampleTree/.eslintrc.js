"use strict";

const eslintPluginJsonFormat = require("eslint-plugin-json-format");
const eslintPluginJaisocx = require("../../../build_tools/src/EslintPlugins/EslintPluginJaisocxJS/eslint-plugin-jaisocx");

module.exports = {
  "env": {
    "browser": true,
    "node": true,
    "es6": true,
  },
  "extends": [
    "airbnb"
  ],
  "plugins": [
    "jaisocx",
  ],
  "rules": {
    // Enforce indentation with 2 spaces
    "indent": ["error", 2, { "SwitchCase": 1 }], // 2 spaces per indentation level
    "no-mixed-spaces-and-tabs": "error",         // Disallow mixed spaces and tabs for indentation
  },
  "overrides": [
    {
      "files": ["*.json"],
      "plugins": [
        "json-format",
      ],
      "rules": {
        "json-format/sort-package-json": "error",  // Example: Ensures consistency in package.json
        "quote-props": ["error", "always"],
        "quotes": ["error", "double"],
      },
    },
    {
      "files": [
        "*.js"
      ],
      "env": {
        
      },
      "rules": {
        "jaisocx/class-statement-cleanup": "error",
        "jaisocx/line-delimiters": "error",
        //"jaisocx/multiline-args": "error",
        "max-len": ["error", { code: 80 }], // line length
        "semi": ["error", "always"], // Require semicolons
        "no-extra-semi": "error",  // Remove extra semicolons
        "quotes": ["error", "double"], // all quotes double
      },
    },
  ],
};



