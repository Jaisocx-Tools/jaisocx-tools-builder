"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TreeAdapterModeEase = void 0;
const TreeAdapter_js_1 = require("./TreeAdapter.js");
const TreeConstants_js_1 = require("./TreeConstants.js");
class TreeAdapterModeEase extends TreeAdapter_js_1.TreeAdapter {
  getSubtreeNodeToRender(loopPropertyValue, loopPropertyKey) {
    const subtreeJsonNode = {
      [loopPropertyKey]: loopPropertyValue
    };
    return subtreeJsonNode;
  }
  getDataForRendering(node, flatNodeClone, dataTypeString, nodeHasSubtree) {
    var _a;
    const key = Object.keys(node)[0];
    const value = (_a = node[key]) !== null && _a !== void 0 ? _a : "";
    let openButtonClassName = "";
    let labelText = `"${key}"`;
    if (!nodeHasSubtree) {
      openButtonClassName = TreeConstants_js_1.TreeConstants.TreeCssClassNames.CLASS_WITHOUT_SUBTREE;
      const serializedJsonValue = this.escapeHTMLForAttribute(JSON.stringify(value));
      labelText = `"${key}": ${serializedJsonValue}`;
    } else if (this.nodesOpenedMode === TreeConstants_js_1.TreeConstants.NodesOpenedMode.ALL_SHOWN) {
      openButtonClassName = TreeConstants_js_1.TreeConstants.TreeCssClassNames.CLASS_OPENED;
    }
    const cssClasses = this.dataTypesCssClassesEnabled === true ? this.getTreeNodeCssClasses(dataTypeString, value) : "";
    const dataForRendering = {
      iconSrc: "",
      iconShowClassName: this.nodesWithIcons ? "icon-show" : "icon-hide",
      labelText,
      hyperlink: "javascript: void(0);",
      cssClasses,
      dataId: "",
      dataHolderId: "",
      dataOrder: "",
      dataJson: this.escapeHTMLForAttribute(JSON.stringify(flatNodeClone)),
      openButtonStateClassName: openButtonClassName,
      hasSubtree: nodeHasSubtree
    };
    return dataForRendering;
  }
  getTreeNodeCssClasses__dataTypesCssClassesEnabled(dataTypeString, node) {
    const cssClassesArray = ["class=\"", TreeConstants_js_1.TreeConstants.TreeCssClassNames.PREFIX__CLASS_DATATYPE, dataTypeString, "\""];
    const cssClasses = cssClassesArray.join("");
    return cssClasses;
  }
  getTreeNodeCssClasses__dataTypesCssClassesDisabled(dataTypeString, node) {
    throw new Error("Method not implemented.");
  }
  // dummy placeholders
  escapeHTMLForAttribute(arg) {
    throw new Error("Method not implemented.");
  }
  getTreeNodeCssClasses(dataTypeString, value) {
    throw new Error("Method not implemented.");
  }
}
exports.TreeAdapterModeEase = TreeAdapterModeEase;