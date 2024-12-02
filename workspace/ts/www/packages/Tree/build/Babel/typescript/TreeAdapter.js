"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TreeAdapter = void 0;
const TreeConstants_js_1 = require("./TreeConstants.js");
const TreeMetadata_js_1 = require("./TreeMetadata.js");
class TreeAdapter {
  constructor() {
    this.metadata = new TreeMetadata_js_1.TreeMetadata();
    this.nodesWithIcons = TreeConstants_js_1.TreeConstants.Defaults.nodesWithIcons;
    this.nodesOpenedMode = TreeConstants_js_1.TreeConstants.Defaults.nodesOpenedMode;
    this.dataTypesCssClassesEnabled = TreeConstants_js_1.TreeConstants.Defaults.dataTypesCssClassesEnabled;
  }
}
exports.TreeAdapter = TreeAdapter;