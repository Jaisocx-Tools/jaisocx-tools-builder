import { LargeDomEventEmitter } from "@jaisocx/event-emitter";
import { TemplateRenderer } from "@jaisocx/template-renderer";
import { ITreeRenderRetValue, IRenderTemplateRendererData, ITreeAdapter } from "./Types.js";
import { TreeMetadata } from "./TreeMetadata.js";
import "@jaisocx-tree-assets/tree-styles-main-node_modules.css";
export declare class Tree extends LargeDomEventEmitter {
    debug: boolean;
    mainHtmlNodeId: string;
    mainHolderHtmlNode: HTMLElement | null;
    url: string | null;
    data: any | null;
    metadata: TreeMetadata;
    subtreeLength: number;
    subtreeLengthDeep: number;
    templateRenderer: TemplateRenderer;
    contextMenuJSClass: any;
    renderingMode: number;
    nodesWithIcons: boolean;
    nodesOpenedMode: number;
    isModifiable: boolean;
    dataTypesCssClassesEnabled: boolean;
    adapter: ITreeAdapter;
    constructor();
    setDebug(debug: boolean): Tree;
    setNodesWithIcons(withIcons: boolean): Tree;
    setNodesOpenedMode(openedMode: number): Tree;
    setUrl(url: string | null): Tree;
    setMainHtmlNodeId(mainHtmlNodeId: string): Tree;
    setMetadata(metadata: TreeMetadata): Tree;
    setModifiable(isModifiable: boolean): Tree;
    setRenderingMode(mode: number): Tree;
    setDataTypesCssClassesEnabled(dataTypesCssEnabled: boolean): Tree;
    load(url: string | null): Tree;
    adaptRenderingModeSubcalls(): void;
    reRender(): Tree;
    render(nodes: any): Tree;
    checkDataNodeSubtree(node: any): {
        isArray: number;
        subtreeNodeDataType: number;
        subtreeNodeDataTypeString: string;
        hasSubtree: boolean;
        subtreeJsonNodes: any;
        objectKeys: string[] | null;
    };
    renderSubtree(isArray: number, subtreeNodes: any, flatNodeHolderClone: any, objectKeys: string[] | null, subtreeHtmlHolder: HTMLElement): number;
    renderSubtreeCallback(isArray: number, loopCounter: number, loopPropertyValue: any, loopPropertyKey: any, arrayOrObject: any, previousCallbackResult: number | null, callbackPayload: any): number;
    renderOneTreeNode(node: any, nodePosition: number, nodeKey: any, flatNodeHolderClone: any, holder: HTMLElement): ITreeRenderRetValue;
    updateDataNodeIdAndPath(node: any, nodePosition: number, nodeKey: any, flatNodeHolderClone: any, holder: HTMLElement): any;
    getSubtreeNodeToRender(loopPropertyValue: any, loopPropertyKey: any): any;
    getDataForRendering(node: any, flatNodeClone: any, dataTypeString: string, hasSubtree: boolean): IRenderTemplateRendererData;
    getTreeNodeCssClasses(dataType: string, node: any): string;
    addJSTreeEventListener(eventName: string, eventHandler: CallableFunction): Tree;
    addJSTreeEventListeners(): Tree;
    openButtonClickHandler(eventPayload: any): void;
    treeNodeLableClickHandler(eventPayload: any): void;
    getInModeMetadataDataNodeIsTreeItem(node: object): boolean;
    escapeHTMLForAttribute(str: string): string;
    unescapeHTMLFromAttribute(str: string | undefined): string;
    getTreeHtmlNodeDatasetJson(htmlNode: HTMLElement | null): string;
}
//# sourceMappingURL=Tree.d.ts.map