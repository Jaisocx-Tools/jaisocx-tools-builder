"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeAdapterModeEase = void 0;
const ArrayOrObjectPackage_1 = require("./ArrayOrObjectPackage");
const Tree_1 = require("./Tree");
const TreeConstants_1 = require("./TreeConstants");
class TreeAdapterModeEase extends Tree_1.Tree {
    getSubtreeNodeToRender(loopPropertyValue, loopPropertyKey) {
        const subtreeJsonNode = { [loopPropertyKey]: loopPropertyValue };
        return subtreeJsonNode;
    }
    checkDataNodeSubtree(node) {
        const subtreeJsonNodes = Object.values(node)[0];
        const { dataTypeString, dataType } = ArrayOrObjectPackage_1.ArrayOrObjectPackage.getDataTypeStringAndConst(subtreeJsonNodes);
        const isArray = ((dataType === ArrayOrObjectPackage_1.ArrayOrObjectPackage.JsonDataType.ARRAY) ? 1 : 0);
        const { itemsAmount, objectKeys } = ArrayOrObjectPackage_1.ArrayOrObjectPackage.getArrayOrObjectItemsAmount(isArray, subtreeJsonNodes);
        const hasSubtree = (itemsAmount !== 0);
        return {
            isArray,
            subtreeNodeDataType: dataType,
            subtreeNodeDataTypeString: dataTypeString,
            hasSubtree,
            subtreeJsonNodes
        };
    }
    getDataForRendering(node, dataTypeString, nodeHasSubtree) {
        const key = Object.keys(node)[0];
        const value = node[key];
        let openButtonClassName = '';
        let labelText = `"${key}"`;
        if (!nodeHasSubtree) {
            openButtonClassName = TreeConstants_1.TreeConstants.TreeCssClassNames.CLASS_WITHOUT_SUBTREE;
            const serializedJsonValue = this.escapeHTMLForAttribute(JSON.stringify(value));
            labelText = `"${key}": ${serializedJsonValue}`;
        }
        else if (node[this.metadata.NODE__OPENED] === true ||
            this.nodesAllOpened === true) {
            openButtonClassName = TreeConstants_1.TreeConstants.TreeCssClassNames.CLASS_OPENED;
        }
        const cssClasses = (this.dataTypesCssClassesEnabled === true) ? this.getTreeNodeCssClasses(dataTypeString, value) : '';
        const dataForRendering = {
            iconSrc: '',
            iconShowClassName: this.nodesWithIcons ? "icon-show" : "icon-hide",
            labelText: labelText,
            hyperlink: 'javascript: void(0);',
            cssClasses: cssClasses,
            dataId: '',
            dataHolderId: '',
            dataOrder: '',
            dataJson: this.escapeHTMLForAttribute(JSON.stringify(node)),
            openButtonStateClassName: openButtonClassName,
            hasSubtree: nodeHasSubtree,
        };
        return dataForRendering;
    }
    getTreeNodeCssClasses__dataTypesCssClassesEnabled(dataTypeString, node) {
        const cssClassesArray = [
            ("class=\""),
            (TreeConstants_1.TreeConstants.TreeCssClassNames.PREFIX__CLASS_DATATYPE),
            (dataTypeString),
            ("\""),
        ];
        const cssClasses = cssClassesArray.join("");
        return cssClasses;
    }
    getTreeNodeCssClasses__dataTypesCssClassesDisabled(dataTypeString, node) {
        throw new Error("Method not implemented.");
    }
}
exports.TreeAdapterModeEase = TreeAdapterModeEase;
