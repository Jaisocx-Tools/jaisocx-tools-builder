class ExampleTree {
    constructor() {
    this.tree = null;
    this.debug = true;
  }

  setDebug(debug) {
    let _a;
    this.debug = debug;
    (_a = this.tree) === null || _a === void 0 ? void 0 : _a.setDebug(debug);
    return this;
  }

  init(treeData, renderingMode) {
    this.tree = new Tree();
    this.tree
      .setDebug(this.debug)
      .setMainHtmlNodeId("example-tree-holder-01")
    // .setUrl("JsonDataExamples/tree-data.json")
      .setModifiable(false)
      .setRenderingMode(renderingMode)
      .render(treeData);
    // .load();
    return this;
  }
}
