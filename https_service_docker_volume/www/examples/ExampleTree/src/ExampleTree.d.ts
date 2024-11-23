import { Tree } from "@jaisocx/tree";
export declare class ExampleTree {
    tree: Tree | null;
    debug: boolean;
    constructor();
    setDebug(debug: boolean): ExampleTree;
    init(treeData: any, renderingMode: number): ExampleTree;
}
