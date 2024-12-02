"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TreeConstants = void 0;
class TreeConstants {}
exports.TreeConstants = TreeConstants;
TreeConstants.RenderingMode = {
  Ease: 1,
  Metadata: 2
};
TreeConstants.NodesOpenedMode = {
  ALL_SHOWN: 1,
  JSON_DATA_DEFINED: 2,
  ALL_HIDDEN: 3
};
TreeConstants.TreeCssClassNames = {
  MAIN_CLASS_NAME: "tree",
  CLASS_NAME_WITH_ICONS: "with-icons",
  CLASS_OPENED: "toggle-with-subtree-opened",
  CLASS_WITHOUT_SUBTREE: "toggle-without-subtree",
  CLASS_ICON_SHOW: "icon-show",
  CLASS_ICON_HIDE: "icon-hide",
  CLASS_AND_ID__CONTEXT_MENU: "context-menu-container",
  CLASS_DATATYPE_OBJECT: "holder-datatype--object",
  CLASS_DATATYPE_ARRAY: "holder-datatype--array",
  CLASS_DATATYPE_STRING: "holder-datatype--string",
  CLASS_DATATYPE_NUMBER: "holder-datatype--number",
  CLASS_DATATYPE_BOOLEAN: "holder-datatype--boolean",
  PREFIX__CLASS_DATATYPE: "holder-datatype--"
};
TreeConstants.TreeEventsNames = {
  EVENT_NAME__AFTER_RENDER_ONE_NODE: "afterRenderOneNode",
  EVENT_NAME__TREE_NODE_EXPAND_BUTTON__CLICK: "openButtonClick",
  EVENT_NAME__TREE_NODE_LABEL__CLICK: "treeNodeLabelClick"
};
TreeConstants.TEMPLATE__TREE_HTML_NODE = `
<li 
    data-id="{{ dataId }}" 
    data-holder-id="{{ dataHolderId }}" 
    data-order="{{ dataOrder }}"
    {{ cssClasses }}>

    <pre class="jstree-html-node" data-json="{{ dataJson }}">
        <pre class="open-button  {{ openButtonStateClassName }}">
            <pre class="opened"></pre>
            <pre class="closed"></pre>
            <pre class="without-subtree"></pre>
            <pre class="animated"></pre>
        </pre>

        <pre class="jstree-html-node-holder-icon {{ iconShowClassName }}">
            <img src="{{ iconSrc }}" />
        </pre>

        <a href="{{ hyperlink }}" class="jstree-html-node-label">{{ labelText }}</a>
    </pre>
    
    <ul></ul>
</li>        
        `;
TreeConstants.Defaults = {
  debug: false,
  renderingMode: TreeConstants.RenderingMode.Ease,
  nodesWithIcons: true,
  nodesOpenedMode: TreeConstants.NodesOpenedMode.ALL_HIDDEN,
  isModifiable: false,
  dataTypesCssClassesEnabled: true
};