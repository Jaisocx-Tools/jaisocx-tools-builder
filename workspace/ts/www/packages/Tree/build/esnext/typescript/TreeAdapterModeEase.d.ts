import { TreeAdapter } from "./TreeAdapter";
import { IRenderTemplateRendererData, ITreeAdapter } from "./Types";
export declare class TreeAdapterModeEase extends TreeAdapter implements ITreeAdapter {
    getSubtreeNodeToRender(loopPropertyValue: any, loopPropertyKey: any): any;
    getDataForRendering(node: any, flatNodeClone: any, dataTypeString: string, nodeHasSubtree: boolean): IRenderTemplateRendererData;
    getTreeNodeCssClasses__dataTypesCssClassesEnabled(dataTypeString: string, node: any): string;
    getTreeNodeCssClasses__dataTypesCssClassesDisabled(dataTypeString: string, node: any): string;
    escapeHTMLForAttribute(arg: string): string;
    getTreeNodeCssClasses(dataTypeString: string, value: any): string;
}
//# sourceMappingURL=TreeAdapterModeEase.d.ts.map