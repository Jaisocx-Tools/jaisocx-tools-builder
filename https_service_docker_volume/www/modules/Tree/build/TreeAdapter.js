"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeAdapter = void 0;
const TreeConstants_1 = require("./TreeConstants");
const TreeMetadata_1 = require("./TreeMetadata");
class TreeAdapter {
    constructor() {
        this.metadata = new TreeMetadata_1.TreeMetadata();
        this.nodesWithIcons = TreeConstants_1.TreeConstants.Defaults.nodesWithIcons;
        this.nodesAllOpened = TreeConstants_1.TreeConstants.Defaults.nodesAllOpened;
        this.dataTypesCssClassesEnabled = TreeConstants_1.TreeConstants.Defaults.dataTypesCssClassesEnabled;
    }
}
exports.TreeAdapter = TreeAdapter;
