import { TreeMetadata, TreeConstants, ITreeRenderRetValue, IRenderingMode, IRenderTemplateRendererData, Tree } from "@jaisocx/tree";


// Tree main class
export class ExampleTree
{
  tree: Tree|null;
  debug: boolean;

  constructor() {
    this.tree = null;
    this.debug = true;
  }

  setDebug(debug: boolean): ExampleTree {
    this.debug = debug;
    this.tree?.setDebug(debug);

    return this;
  }

  init(treeData: any, renderingMode: number): ExampleTree {
    this.tree = new Tree();
    this.tree
      .setDebug(this.debug)
      .setMainHtmlNodeId("example-tree-holder-01")
      //.setUrl("JsonDataExamples/tree-data.json")
      .setModifiable(false)
      .setRenderingMode(renderingMode)
      .render(treeData);
      //.load();
      return this;
  }
}

