import { TreeAdapter } from "./TreeAdapter.js";
import { TreeConstants } from "./TreeConstants.js";
export class TreeAdapterModeEase extends TreeAdapter {
    getSubtreeNodeToRender(loopPropertyValue, loopPropertyKey) {
        const subtreeJsonNode = { [loopPropertyKey]: loopPropertyValue, };
        return subtreeJsonNode;
    }
    getDataForRendering(node, flatNodeClone, dataTypeString, nodeHasSubtree) {
        const key = Object.keys(node)[0];
        const value = node[key] ?? "";
        let openButtonClassName = "";
        let labelText = `"${key}"`;
        if (!nodeHasSubtree) {
            openButtonClassName = TreeConstants.TreeCssClassNames.CLASS_WITHOUT_SUBTREE;
            const serializedJsonValue = this.escapeHTMLForAttribute(JSON.stringify(value));
            labelText = `"${key}": ${serializedJsonValue}`;
        }
        else if (this.nodesOpenedMode === TreeConstants.NodesOpenedMode.ALL_SHOWN) {
            openButtonClassName = TreeConstants.TreeCssClassNames.CLASS_OPENED;
        }
        const cssClasses = (this.dataTypesCssClassesEnabled === true) ? this.getTreeNodeCssClasses(dataTypeString, value) : "";
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
            hasSubtree: nodeHasSubtree,
        };
        return dataForRendering;
    }
    getTreeNodeCssClasses__dataTypesCssClassesEnabled(dataTypeString, node) {
        const cssClassesArray = [
            ("class=\""),
            (TreeConstants.TreeCssClassNames.PREFIX__CLASS_DATATYPE),
            (dataTypeString),
            ("\""),
        ];
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
//# sourceMappingURL=TreeAdapterModeEase.js.map