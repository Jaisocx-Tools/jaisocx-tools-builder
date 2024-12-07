export interface ITreeDefaults {
  debug: boolean;
  renderingMode: number;
  nodesWithIcons: boolean;
  nodesOpenedMode: number;
  isModifiable: boolean;
  dataTypesCssClassesEnabled: boolean;
}

export interface ITreeRenderRetValue {
  currentNodeSubtreeLength: number;
  node: any;
}

export interface IRenderSubtreeResult {
  currentNodeSubtreeLength: number;
  subtreeJsonNodesLength: number;
  // subtreeNodes: any;
}

export interface IRenderingMode {
  Ease: number;
  Metadata: number;
}

export interface INodesOpenedMode {
  ALL_SHOWN: number;
  JSON_DATA_DEFINED: number;
  ALL_HIDDEN: number;
}

export interface IRenderTemplateRendererData {
  iconSrc: string;
  iconShowClassName: string;
  labelText: string;
  hyperlink: string;
  cssClasses: string;
  dataId: string;
  dataHolderId: string;
  dataOrder: string;
  dataJson: string;
  openButtonStateClassName: string;
  hasSubtree: boolean;
}

export interface ITreeCssClassNames {
  MAIN_CLASS_NAME: string;

  CLASS_NAME_WITH_ICONS: string;

  CLASS_OPENED: string;
  CLASS_WITHOUT_SUBTREE: string;
  CLASS_ICON_SHOW: string;
  CLASS_ICON_HIDE: string;

  CLASS_AND_ID__CONTEXT_MENU: string;

  CLASS_DATATYPE_OBJECT: string;
  CLASS_DATATYPE_ARRAY: string;
  CLASS_DATATYPE_STRING: string;
  CLASS_DATATYPE_NUMBER: string;
  CLASS_DATATYPE_BOOLEAN: string;

  PREFIX__CLASS_DATATYPE: string;
}

export interface ITreeEventsNames {
  EVENT_NAME__AFTER_RENDER_ONE_NODE: string;
  EVENT_NAME__TREE_NODE_EXPAND_BUTTON__CLICK: string;
  EVENT_NAME__TREE_NODE_LABEL__CLICK: string;
}

export interface ITreeAdapter {

  getSubtreeNodeToRender (
    loopPropertyValue: any,
    loopPropertyKey: any
  ): any;

  getDataForRendering (
    node: any,
    flatNodeClone: any,
    dataTypeString: string,
    nodeHasSubtree: boolean
  ): IRenderTemplateRendererData;

  getTreeNodeCssClasses__dataTypesCssClassesEnabled (
    dataType: string,
    node: any
  ): string;

  getTreeNodeCssClasses__dataTypesCssClassesDisabled (
    dataType: string,
    node: any
  ): string;
}
