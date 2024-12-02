import jaisocxPlugin from "eslint-plugin-jaisocx";
import { resolve } from "path";
import { fileURLToPath } from "url";

const MAX_LINE_LENGTH = 128;
const INDENT = 2;

// Resolve paths for tsconfig in an ESM context
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");
const tsconfig = resolve(__dirname, "tsconfig.ESNext.json");

export default [
  {
    ignores: ["node_modules/**"],
    rules: {
      indent: ["error", INDENT, { SwitchCase: 1 }], // INDENT number spaces per indentation level
      "no-mixed-spaces-and-tabs": "error",
      quotes: ["error", "double"],
    },
  },
  {
    files: ["*.json"],
    rules: {
      "quote-props": ["error", "always"],
      quotes: ["error", "double"],
      "comma-dangle": [
        "error",
        {
          arrays: "never",
          objects: "never",
          imports: "never",
          exports: "never",
          functions: "never",
        },
      ],
    },
  },
  {
    files: ["www/**/src/**/*.ts"],
    plugins: {
      "@typescript-eslint": import("@typescript-eslint/eslint-plugin"),
      jaisocx: jaisocxPlugin,
    },
    rules: {
      "max-len": ["error", { code: MAX_LINE_LENGTH }],
      semi: ["error", "always"],
      "no-extra-semi": "error",
      "jaisocx/line-delimiters": "error",
      "jaisocx/multiline-args": "error",
      "comma-dangle": [
        "error",
        {
          arrays: "always",
          objects: "always",
          imports: "never",
          exports: "never",
          functions: "never",
        },
      ],
    },
  },
  {
    files: ["www/**/build/Simple/**/*.js"],
    plugins: {
      jaisocx: jaisocxPlugin,
    },
    rules: {
      "jaisocx/class-statement-cleanup": "error",
      "jaisocx/line-delimiters": "error",
      "jaisocx/multiline-args": "error",
      "comma-dangle": [
        "error", {
          arrays: "always",
          objects: "always",
          imports: "never",
          exports: "never",
          functions: "never",
        },
      ],
      "max-len": ["error", { code: MAX_LINE_LENGTH }],
      semi: ["error", "always"],
      "no-extra-semi": "error",
    },
  },
];
