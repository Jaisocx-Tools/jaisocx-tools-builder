export interface ITreeDefaults {
    debug: boolean;
    renderingMode: number;
    nodesWithIcons: boolean;
    nodesAllOpened: boolean;
    isModifiable: boolean;
}
export interface ITreeRenderRetValue {
    currentNodeSubtreeLength: number;
    node: any;
}
export interface IRenderingMode {
    Ease: number;
    Metadata: number;
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
