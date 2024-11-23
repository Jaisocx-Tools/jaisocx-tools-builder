"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeAdapterModeMetadata = void 0;
const TreeAdapter_1 = require("./TreeAdapter");
const TreeConstants_1 = require("./TreeConstants");
class TreeAdapterModeMetadata extends TreeAdapter_1.TreeAdapter {
    getSubtreeNodeToRender(loopPropertyValue, loopPropertyKey) {
        return loopPropertyValue;
    }
    getDataForRendering(node, flatNodeClone, dataTypeString, hasSubtree) {
        var _a;
        let openButtonClassName = "";
        if (!hasSubtree) {
            openButtonClassName = TreeConstants_1.TreeConstants.TreeCssClassNames.CLASS_WITHOUT_SUBTREE;
            // @ts-ignore
        }
        else if (node[this.metadata.NODE__OPENED] === true
            || this.nodesAllOpened === true) {
            openButtonClassName = TreeConstants_1.TreeConstants.TreeCssClassNames.CLASS_OPENED;
        }
        const cssClasses = this.getTreeNodeCssClasses(dataTypeString, node);
        const dataForRendering = {
            dataId: node[this.metadata.NODE__ID],
            dataHolderId: node[this.metadata.NODE__HOLDER_ID],
            dataOrder: node[this.metadata.NODE__ORDER],
            dataJson: this.escapeHTMLForAttribute(JSON.stringify(flatNodeClone)),
            openButtonStateClassName: openButtonClassName,
            cssClasses,
            iconSrc: node[this.metadata.NODE_ICON__SRC],
            iconShowClassName: (this.nodesWithIcons || node[this.metadata.NODE_ICON__SRC]) ? "icon-show" : "icon-hide",
            labelText: node[this.metadata.NODE_LABEL__TEXT],
            hyperlink: (_a = node[this.metadata.NODE__HYPERLINK]) !== null && _a !== void 0 ? _a : "javascript: void(0);",
            hasSubtree,
        };
        return dataForRendering;
    }
    getTreeNodeCssClasses__dataTypesCssClassesEnabled(dataTypeString, node) {
        const cssClassesNodeValue = node[this.metadata.NODE__CSS_CLASS_NAME];
        const cssClassesArray = [
            ("class=\""),
            (cssClassesNodeValue),
            (" "),
            (TreeConstants_1.TreeConstants.TreeCssClassNames.PREFIX__CLASS_DATATYPE),
            (dataTypeString),
            ("\""),
        ];
        const cssClasses = cssClassesArray.join("");
        return cssClasses;
    }
    getTreeNodeCssClasses__dataTypesCssClassesDisabled(dataTypeString, node) {
        const cssClassesNodeValue = node[this.metadata.NODE__CSS_CLASS_NAME];
        const cssClassesArray = [
            ("class=\""),
            (cssClassesNodeValue),
            ("\""),
        ];
        const cssClasses = cssClassesArray.join("");
        return cssClasses;
    }
    // dummy placeholders
    escapeHTMLForAttribute(arg) {
        throw new Error("Method not implemented.");
    }
    getTreeNodeCssClasses(dataTypeString, value) {
        throw new Error("Method not implemented.");
    }
}
exports.TreeAdapterModeMetadata = TreeAdapterModeMetadata;
