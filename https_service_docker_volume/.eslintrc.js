"use strict";

const eslintPluginJsonFormat = require("eslint-plugin-json-format");
const eslintPluginJaisocx = require("eslint-plugin-jaisocx");

const MAX_LINE_LENGTH = 128;
const INDENT = 2;


module.exports = {
  "root": true,
  "extends": [
    "eslint:recommended",
    "airbnb"
  ],
  "env": {
    "browser": true,
    "node": true,
    "es6": true,
  },
  "rules": {
    "indent": ["error", INDENT, { "SwitchCase": 1 }], // INDENT number spaces per indentation level
    "no-mixed-spaces-and-tabs": "error", 
    "quotes": ["error", "double"],
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
        "comma-dangle": [
          "error", {
            "arrays": "never",
            "objects": "never",
            "imports": "never",
            "exports": "never",
            "functions": "never"
          }
        ],
      },
    },
    {
      "files": [
        "www/**/src/**/*.ts"
      ],
      "parser": "@typescript-eslint/parser",
      "parserOptions": {
        "ecmaVersion": 2020,
        "project": "./tsconfig.json"
      },
      "plugins": [
        "@typescript-eslint",
        "jaisocx"
      ],
      "extends": [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      rules: {
        "max-len": ["error", { code: MAX_LINE_LENGTH }],
        "semi": ["error", "always"],
        "no-extra-semi": "error",
        "jaisocx/line-delimiters": "error",
        "jaisocx/multiline-args": "error",
        "comma-dangle": [
          "error", {
            "arrays": "always",
            "objects": "always",
            "imports": "never",
            "exports": "never",
            "functions": "never"
          }
        ],
        //"@typescript-eslint/no-unused-vars": ["warn"],
        //"@typescript-eslint/no-explicit-any": ["warn"],
      },
    },
    {
      "files": [
        "www/**/BuildSimple/**/*.js"
      ],
      "extends": [
      ],
      "plugins": [
        "jaisocx",
      ],
      "rules": {
        "jaisocx/class-statement-cleanup": "error",
        "jaisocx/line-delimiters": "error",
        "jaisocx/multiline-args": "error",
        "comma-dangle": [
          "error", {
            "arrays": "always",
            "objects": "always",
            "imports": "never",
            "exports": "never",
            "functions": "never"
          }
        ],
        "max-len": ["error", { code: MAX_LINE_LENGTH }],
        "semi": ["error", "always"],
        "no-extra-semi": "error",
      },
    },
  ],
};



