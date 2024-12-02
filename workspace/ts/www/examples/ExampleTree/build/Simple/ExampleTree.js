class ExampleTree {
  holderId;
  url;

  constructor(
    id, 
    url) {
    this.holderId = id;
    this.url = url;
    this.render(
      id, 
      url);
  }

  render(
    id, 
    url) {
    const tree = new Tree();
    tree
      .setDebug(false)
      .setMainHtmlNodeId(id)
      .setDataTypesCssClassesEnabled(true)
      .setNodesWithIcons(true)
      .setNodesOpenedMode(TreeConstants.NodesOpenedMode.ALL_HIDDEN)
      .setRenderingMode(TreeConstants.RenderingMode.Ease)
      .setModifiable(false)
      .addJSTreeEventListener(
        TreeConstants.TreeEventsNames.EVENT_NAME__TREE_NODE_LABEL__CLICK, 
        (evt) => {
          console.log(evt);
        })
      .load(url);
  }
}
//# sourceMappingURL=ExampleTree.js.map