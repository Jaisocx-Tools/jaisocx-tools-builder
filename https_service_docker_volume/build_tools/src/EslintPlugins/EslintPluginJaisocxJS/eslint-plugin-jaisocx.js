// eslint-plugin-jaisocx.js

const plugin = { 
  rules: { 
    "line-delimiters": require("./lib/rules/line-delimiters"),
    "multiline-args": require("./lib/rules/multiline-args"),
    "class-statement-cleanup": require("./lib/rules/class-statement-cleanup"),
  } 
};
module.exports = plugin;

