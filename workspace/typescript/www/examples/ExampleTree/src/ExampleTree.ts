import { Tree, TreeConstants } from "@jaisocx/tree";

export class ExampleTree {
  holderId: string;

  url: string;

  constructor(
    id: string,
    url: string
  ) {
    this.holderId = id;
    this.url = url;

    this.render(
      id,
      url
    );
  }

  render(
    id: string,
    url: string
  ): void {
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
        (evt: any) => {
          console.log(evt);
        }
      )
      .load(url);
  }
}
