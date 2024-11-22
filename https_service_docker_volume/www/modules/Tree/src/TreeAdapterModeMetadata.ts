import { ArrayOrObjectPackage } from "./ArrayOrObjectPackage";
import { Tree } from "./Tree";
import { TreeConstants } from "./TreeConstants";
import { IRenderTemplateRendererData, ITreeAdapter } from "./Types";

export class TreeAdapterModeMetadata implements ITreeAdapter {
  
  getSubtreeNodeToRender (
    loopPropertyValue: any, 
    loopPropertyKey: any
  ): any {
    return loopPropertyValue;
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

    const subtreeJsonNodes: any = node[this.metadata.SUBTREE];

    const { dataTypeString, dataType } = ArrayOrObjectPackage.getDataTypeStringAndConst(subtreeJsonNodes);
    const isArray: number = ( ( dataType === ArrayOrObjectPackage.JsonDataType.ARRAY ) ? 1 : 0 );
    const { itemsAmount, objectKeys } = ArrayOrObjectPackage.getArrayOrObjectItemsAmount (
      isArray,
      subtreeJsonNodes
    );

    const hasSubtree: boolean = (itemsAmount !== 0);

    // @ts-ignore
    delete(node[this.metadata.SUBTREE]);
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

  getDataForRendering (
    node: any,
    dataTypeString: string,
    hasSubtree: boolean
  ): IRenderTemplateRendererData {
      let openButtonClassName = '';
      if ( !node.hasSubtree ) {
          openButtonClassName = TreeConstants.TreeCssClassNames.CLASS_WITHOUT_SUBTREE;

      // @ts-ignore
      } else if (
        node[this.metadata.NODE__OPENED] === true ||
        this.nodesAllOpened === true
      ) {
        openButtonClassName = TreeConstants.TreeCssClassNames.CLASS_OPENED;
      }

      const cssClasses: string = this.getTreeNodeCssClasses(dataTypeString, node);

      const dataForRendering: IRenderTemplateRendererData = {
          dataId: node[this.metadata.NODE__ID],
          dataHolderId: node[this.metadata.NODE__HOLDER_ID],
          dataOrder: node[this.metadata.NODE__ORDER],
          dataJson: this.escapeHTMLForAttribute(JSON.stringify(node)),
          openButtonStateClassName: openButtonClassName,
          cssClasses: cssClasses,
          iconSrc: node[this.metadata.NODE_ICON__SRC],
          iconShowClassName: (this.nodesWithIcons || node[this.metadata.NODE_ICON__SRC]) ? "icon-show" : "icon-hide",
          labelText: node[this.metadata.NODE_LABEL__TEXT],
          hyperlink: node[this.metadata.NODE__HYPERLINK] ?? 'javascript: void(0);',
          hasSubtree: node.hasSubtree,
      };

      return dataForRendering;
  }

  getTreeNodeCssClasses__dataTypesCssClassesEnabled (
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

  getTreeNodeCssClasses__dataTypesCssClassesDisabled (
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

}