import { TreeAdapter } from "./TreeAdapter.js";
import { TreeConstants } from "./TreeConstants.js";
import { IRenderTemplateRendererData, ITreeAdapter } from "./Types.js";

export class TreeAdapterModeMetadata extends TreeAdapter implements ITreeAdapter {
  getSubtreeNodeToRender(
    loopPropertyValue: any,
    loopPropertyKey: any
  ): any {
    return loopPropertyValue;
  }

  getDataForRendering(
    node: any,
    flatNodeClone: any,
    dataTypeString: string,
    hasSubtree: boolean
  ): IRenderTemplateRendererData {
    let openButtonClassName: string = "";

    if (!hasSubtree) {
      openButtonClassName = TreeConstants.TreeCssClassNames.CLASS_WITHOUT_SUBTREE;

      // @ts-ignore
    } else if (
      (this.nodesOpenedMode === TreeConstants.NodesOpenedMode.ALL_SHOWN)
    ) {
      openButtonClassName = TreeConstants.TreeCssClassNames.CLASS_OPENED;
    } else if (
      (node[this.metadata.NODE__OPENED] === true)
      && (this.nodesOpenedMode === TreeConstants.NodesOpenedMode.JSON_DATA_DEFINED)
    ) {
      openButtonClassName = TreeConstants.TreeCssClassNames.CLASS_OPENED;
    }

    const cssClasses: string = this.getTreeNodeCssClasses(
      dataTypeString,
      node
    );

    const dataForRendering: IRenderTemplateRendererData = {
      dataId: node[this.metadata.NODE__ID],
      dataHolderId: node[this.metadata.NODE__HOLDER_ID],
      dataOrder: node[this.metadata.NODE__ORDER],
      dataJson: this.escapeHTMLForAttribute(JSON.stringify(flatNodeClone)),
      openButtonStateClassName: openButtonClassName,
      cssClasses,
      iconSrc: node[this.metadata.NODE_ICON__SRC],
      iconShowClassName: (this.nodesWithIcons || node[this.metadata.NODE_ICON__SRC]) ? "icon-show" : "icon-hide",
      labelText: node[this.metadata.NODE_LABEL__TEXT],
      hyperlink: node[this.metadata.NODE__HYPERLINK] ?? "javascript: void(0);",
      hasSubtree,
    };

    return dataForRendering;
  }

  getTreeNodeCssClasses__dataTypesCssClassesEnabled(
    dataTypeString: string,
    node: any
  ): string {
    const cssClassesNodeValue: string = node[this.metadata.NODE__CSS_CLASS_NAME];

    const cssClassesArray: string[] = [
      ("class=\""),
      (cssClassesNodeValue),
      (" "),
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
    const cssClassesNodeValue: string = node[this.metadata.NODE__CSS_CLASS_NAME];

    const cssClassesArray: string[] = [
      ("class=\""),
      (cssClassesNodeValue),
      ("\""),
    ];

    const cssClasses: string = cssClassesArray.join("");

    return cssClasses;
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
