import { TreeAdapter } from "./TreeAdapter.js";
import { TreeConstants } from "./TreeConstants.js";
import { IRenderTemplateRendererData, ITreeAdapter } from "./Types.js";

export class TreeAdapterModeEase extends TreeAdapter implements ITreeAdapter {
  getSubtreeNodeToRender(
    loopPropertyValue: any,
    loopPropertyKey: any
  ): any {
    const subtreeJsonNode: object = { [loopPropertyKey]: loopPropertyValue, };

    return subtreeJsonNode;
  }

  getDataForRendering(
    node: any,
    flatNodeClone: any,
    dataTypeString: string,
    nodeHasSubtree: boolean
  ): IRenderTemplateRendererData {
    const key: string = Object.keys(node)[0];
    const value: any = node[key] ?? "";

    let openButtonClassName: string = "";
    let labelText: string = `"${key}"`;

    if (!nodeHasSubtree) {
      openButtonClassName = TreeConstants.TreeCssClassNames.CLASS_WITHOUT_SUBTREE;
      const serializedJsonValue: string = this.escapeHTMLForAttribute(JSON.stringify(value));
      labelText = `"${key}": ${serializedJsonValue}`;
    } else if (this.nodesOpenedMode === TreeConstants.NodesOpenedMode.ALL_SHOWN) {
      openButtonClassName = TreeConstants.TreeCssClassNames.CLASS_OPENED;
    }

    const cssClasses: string = (this.dataTypesCssClassesEnabled === true) ? this.getTreeNodeCssClasses(
      dataTypeString,
      value
    ) : "";

    const dataForRendering: IRenderTemplateRendererData = {
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

  getTreeNodeCssClasses__dataTypesCssClassesEnabled(
    dataTypeString: string,
    node: any
  ): string {
    const cssClassesArray: string[] = [
      ("class=\""),
      (TreeConstants.TreeCssClassNames.PREFIX__CLASS_DATATYPE),
      (dataTypeString),
      ("\""),
    ];

    const cssClasses: string = cssClassesArray.join("");

    return cssClasses;
  }

  getTreeNodeCssClasses__dataTypesCssClassesDisabled(
    dataTypeString: string,
    node: any
  ): string {
    throw new Error("Method not implemented.");
  }

  // dummy placeholders
  escapeHTMLForAttribute(arg: string): string {
    throw new Error("Method not implemented.");
  }

  getTreeNodeCssClasses(
    dataTypeString: string,
    value: any
  ): string {
    throw new Error("Method not implemented.");
  }
  // finish dummy placeholders
}
