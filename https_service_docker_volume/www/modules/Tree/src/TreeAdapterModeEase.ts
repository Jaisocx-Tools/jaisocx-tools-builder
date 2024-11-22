import { ArrayOrObjectPackage } from "./ArrayOrObjectPackage";
import { Tree } from "./Tree";
import { TreeConstants } from "./TreeConstants";
import { IRenderTemplateRendererData, ITreeAdapter } from "./Types";

export class TreeAdapterModeEase implements ITreeAdapter {

  getSubtreeNodeToRender(
    loopPropertyValue: any, 
    loopPropertyKey: any
  ): any {
    const subtreeJsonNode: object = {[loopPropertyKey]: loopPropertyValue};

    return subtreeJsonNode;
  }

  checkDataNodeSubtree (
    node: any
  ): { 
    isArray: number, 
    subtreeNodeDataType: number, 
    subtreeNodeDataTypeString: string,
    hasSubtree: boolean, 
    subtreeJsonNodes: any 
  } {

    const subtreeJsonNodes: any = Object.values(node)[0];
    const { dataTypeString, dataType } = ArrayOrObjectPackage.getDataTypeStringAndConst(subtreeJsonNodes);
    const isArray: number = ( ( dataType === ArrayOrObjectPackage.JsonDataType.ARRAY ) ? 1 : 0 );
    const { itemsAmount, objectKeys } = ArrayOrObjectPackage.getArrayOrObjectItemsAmount (
      isArray,
      subtreeJsonNodes
    );
    const hasSubtree: boolean = (itemsAmount !== 0);

    return { 
      isArray, 
      subtreeNodeDataType: dataType, 
      subtreeNodeDataTypeString: dataTypeString,
      hasSubtree, 
      subtreeJsonNodes 
    };
  }

  getDataForRendering (
    node: any, 
    dataTypeString: string,
    nodeHasSubtree: boolean
  ): IRenderTemplateRendererData {
    const key: string = Object.keys(node)[0];
    const value: any = node[key];

    let openButtonClassName: string = '';
    let labelText: string = `"${key}"`;
    if ( !nodeHasSubtree ) {
      openButtonClassName = TreeConstants.TreeCssClassNames.CLASS_WITHOUT_SUBTREE;
      const serializedJsonValue: string = this.escapeHTMLForAttribute(JSON.stringify(value));
      labelText = `"${key}": ${serializedJsonValue}`;

    } else if (
      node[this.metadata.NODE__OPENED] === true ||
      this.nodesAllOpened === true
    ) {
      openButtonClassName = TreeConstants.TreeCssClassNames.CLASS_OPENED;
    }

    const cssClasses: string = ( this.dataTypesCssClassesEnabled === true ) ? this.getTreeNodeCssClasses(dataTypeString, value) : '';

    const dataForRendering: IRenderTemplateRendererData = {
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

  getTreeNodeCssClasses__dataTypesCssClassesEnabled (
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

  getTreeNodeCssClasses__dataTypesCssClassesDisabled(dataTypeString: string, node: any): string {
    throw new Error("Method not implemented.");
  }
}