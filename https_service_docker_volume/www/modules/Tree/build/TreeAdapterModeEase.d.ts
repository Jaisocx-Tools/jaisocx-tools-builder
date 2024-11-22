import { Tree } from "./Tree";
import { IRenderTemplateRendererData, ITreeAdapter } from "./Types";
export declare class TreeAdapterModeEase extends Tree implements ITreeAdapter {
    getSubtreeNodeToRender(loopPropertyValue: any, loopPropertyKey: any): any;
    checkDataNodeSubtree(node: any): {
        isArray: number;
        subtreeNodeDataType: number;
        subtreeNodeDataTypeString: string;
        hasSubtree: boolean;
        subtreeJsonNodes: any;
    };
    getDataForRendering(node: any, dataTypeString: string, nodeHasSubtree: boolean): IRenderTemplateRendererData;
    getTreeNodeCssClasses__dataTypesCssClassesEnabled(dataTypeString: string, node: any): string;
    getTreeNodeCssClasses__dataTypesCssClassesDisabled(dataTypeString: string, node: any): string;
}
