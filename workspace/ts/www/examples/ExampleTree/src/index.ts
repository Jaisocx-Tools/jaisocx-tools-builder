import { Tree, TreeConstants } from "@jaisocx/tree";
import { ExampleTree } from "./ExampleTree.js";

export { Tree, TreeConstants } from "@jaisocx/tree";
export { ExampleTree } from "./ExampleTree.js";

(window as any).Tree = Tree;
(window as any).TreeConstants = TreeConstants;

(window as any).ExampleTree = ExampleTree;
