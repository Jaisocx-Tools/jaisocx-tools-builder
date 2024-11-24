import { Tree, TreeConstants } from "@jaisocx/tree";
var ExampleTree = /** @class */ (function () {
    function ExampleTree(id, url) {
        this.holderId = id;
        this.url = url;
        this.render(id, url);
    }
    ExampleTree.prototype.render = function (id, url) {
        var tree = new Tree();
        tree
            .setDebug(false)
            .setMainHtmlNodeId(id)
            .setDataTypesCssClassesEnabled(true)
            .setNodesWithIcons(true)
            .setNodesOpenedMode(TreeConstants.NodesOpenedMode.ALL_HIDDEN)
            .setRenderingMode(TreeConstants.RenderingMode.Ease)
            .setModifiable(false)
            .addJSTreeEventListener(TreeConstants.TreeEventsNames.EVENT_NAME__TREE_NODE_LABEL__CLICK, function (evt) {
            console.log(evt);
        })
            .load(url);
    };
    return ExampleTree;
}());
export { ExampleTree };
