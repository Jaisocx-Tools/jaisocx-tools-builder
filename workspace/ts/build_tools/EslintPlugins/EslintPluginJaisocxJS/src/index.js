// eslint-plugin-jaisocx.js

import { LineDelimiters } from "./rules/line-delimiters.js";
import { MultilineArgs } from "./rules/multiline-args.js";
import { ClassStatementCleanup } from "./rules/class-statement-cleanup.js";

const plugin = { 
  rules: { 
    "line-delimiters": LineDelimiters,
    "multiline-args": MultilineArgs,
    "class-statement-cleanup": ClassStatementCleanup,
  } 
};

export default plugin;
