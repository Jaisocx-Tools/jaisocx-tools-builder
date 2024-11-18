export interface ITreeRenderRetValue {
  currentNodeSubtreeLength: number;
  node: any;
}

export interface IRenderingMode {
  Ease: number;
  Metadata: number;
}

export interface IRenderTemplateRendererData {
  dataId: string;
  dataHolderId: string;
  dataOrder: string;
  dataJson: string;
  openButtonStateClassName: string;
  iconSrc: string;
  iconShowClassName: string;
  labelText: string;
  hyperlink: string;
  hasSubtree: boolean;
}

export interface ITreeCssClassNames {
  CLASS_OPENED: string;
  CLASS_WITHOUT_SUBTREE: string;
  CLASS_ICON_SHOW: string;
  CLASS_ICON_HIDE: string;

  CLASS_AND_ID__CONTEXT_MENU: string;
}

export interface ITreeEventsNames {
  EVENT_NAME__AFTER_RENDER_ONE_NODE: string;
  EVENT_NAME__TREE_NODE_EXPAND_BUTTON__CLICK: string;
  EVENT_NAME__TREE_NODE_LABEL__CLICK: string;
}

