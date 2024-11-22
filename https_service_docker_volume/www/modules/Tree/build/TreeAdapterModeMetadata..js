"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeAdapterModeMetadata = void 0;
const ArrayOrObjectPackage_1 = require("./ArrayOrObjectPackage");
const Tree_1 = require("./Tree");
const TreeConstants_1 = require("./TreeConstants");
class TreeAdapterModeMetadata extends Tree_1.Tree {
    getSubtreeNodeToRender(loopPropertyValue, loopPropertyKey) {
        return loopPropertyValue;
    }
    checkDataNodeSubtree(node) {
        const subtreeJsonNodes = node[this.metadata.SUBTREE];
        const { dataTypeString, dataType } = ArrayOrObjectPackage_1.ArrayOrObjectPackage.getDataTypeStringAndConst(subtreeJsonNodes);
        const isArray = ((dataType === ArrayOrObjectPackage_1.ArrayOrObjectPackage.JsonDataType.ARRAY) ? 1 : 0);
        const { itemsAmount, objectKeys } = ArrayOrObjectPackage_1.ArrayOrObjectPackage.getArrayOrObjectItemsAmount(isArray, subtreeJsonNodes);
        const hasSubtree = (itemsAmount !== 0);
        // @ts-ignore
        delete (node[this.metadata.SUBTREE]);
        // @ts-ignore
        node.hasSubtree = hasSubtree;
        return {
            isArray,
            subtreeNodeDataType: dataType,
            subtreeNodeDataTypeString: dataTypeString,
            hasSubtree,
            subtreeJsonNodes
        };
    }
    getDataForRendering(node, dataTypeString, hasSubtree) {
        var _a;
        let openButtonClassName = '';
        if (!node.hasSubtree) {
            openButtonClassName = TreeConstants_1.TreeConstants.TreeCssClassNames.CLASS_WITHOUT_SUBTREE;
            // @ts-ignore
        }
        else if (node[this.metadata.NODE__OPENED] === true ||
            this.nodesAllOpened === true) {
            openButtonClassName = TreeConstants_1.TreeConstants.TreeCssClassNames.CLASS_OPENED;
        }
        const cssClasses = this.getTreeNodeCssClasses(dataTypeString, node);
        const dataForRendering = {
            dataId: node[this.metadata.NODE__ID],
            dataHolderId: node[this.metadata.NODE__HOLDER_ID],
            dataOrder: node[this.metadata.NODE__ORDER],
            dataJson: this.escapeHTMLForAttribute(JSON.stringify(node)),
            openButtonStateClassName: openButtonClassName,
            cssClasses: cssClasses,
            iconSrc: node[this.metadata.NODE_ICON__SRC],
            iconShowClassName: (this.nodesWithIcons || node[this.metadata.NODE_ICON__SRC]) ? "icon-show" : "icon-hide",
            labelText: node[this.metadata.NODE_LABEL__TEXT],
            hyperlink: (_a = node[this.metadata.NODE__HYPERLINK]) !== null && _a !== void 0 ? _a : 'javascript: void(0);',
            hasSubtree: node.hasSubtree,
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
}
exports.TreeAdapterModeMetadata = TreeAdapterModeMetadata;
