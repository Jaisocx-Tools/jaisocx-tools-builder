export class TreeConstants {
}
TreeConstants.RenderingMode = {
    Ease: 1,
    Metadata: 2,
};
TreeConstants.TreeCssClassNames = {
    CLASS_OPENED: 'toggle-with-subtree-opened',
    CLASS_WITHOUT_SUBTREE: 'toggle-without-subtree',
    CLASS_ICON_SHOW: 'icon-show',
    CLASS_ICON_HIDE: 'icon-hide',
    CLASS_AND_ID__CONTEXT_MENU: 'context-menu-container',
};
TreeConstants.TreeEventsNames = {
    EVENT_NAME__AFTER_RENDER_ONE_NODE: 'afterRenderOneNode',
    EVENT_NAME__TREE_NODE_EXPAND_BUTTON__CLICK: 'openButtonClick',
    EVENT_NAME__TREE_NODE_LABEL__CLICK: 'treeNodeLabelClick',
};
TreeConstants.TEMPLATE__TREE_HTML_NODE = `
<li 
    data-id="{{ data-id }}" 
    data-holder-id="{{ data-holder-id }}" 
    data-order="{{ data-order }}">

    <pre class="jstree-html-node" data-json="{{ data-json }}">
        <pre class="open-button  {{ openButtonStateClassName }}">
            <pre class="opened"></pre>
            <pre class="closed"></pre>
            <pre class="without-subtree"></pre>
            <pre class="animated"></pre>
        </pre>

        <pre class="jstree-html-node-holder-icon {{ iconShow-className }}">
            <img src="{{ icon-src }}" />
        </pre>

        <a href="{{ hyperlink }}" class="jstree-html-node-label">{{ label-text }}</a>
    </pre>
    
    <ul></ul>
</li>        
        `;
