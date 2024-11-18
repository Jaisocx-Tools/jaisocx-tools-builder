import { LargeDomEventEmitter } from '@jaisocx/event-emitter';
import { TemplateRenderer } from "@jaisocx/template-renderer";
import { TreeConstants } from './TreeConstants';
import { TreeMetadata } from './TreeMetadata';
// Tree main class
export class Tree extends LargeDomEventEmitter {
    constructor() {
        super();
        this.mainHtmlNodeId = '';
        this.mainHolderHtmlNode = null;
        this.url = '';
        this.isModifiable = false;
        this.data = null;
        this.renderingMode = TreeConstants.RenderingMode.Ease;
        this.metadata = new TreeMetadata();
        this.subtreeLength = 0;
        this.subtreeLengthDeep = 0;
        this.templateRenderer = new TemplateRenderer();
        /*this.templateRenderer
            .addThisClassEventListener (
                this.templateRenderer.EVENT_NAME__AFTER_RENDER,
                // @ts-ignore
                (payload: {html, data}) => {
                    let renderedHtml: string = payload.html;
                    let value: any = null;

                    if (!payload.data.hasSubtree) {
                        renderedHtml = payload.html.replace('<ul></ul>', '');
                        value = 'html modified';
                    }

                    const payloadReturned: any = {...payload, html: renderedHtml};
                    return {payloadReturned, value};
                }
            );*/
        this.contextMenuJSClass = null;
    }
    setDebug(debug) {
        this.debug = debug;
        return this;
    }
    setUrl(url) {
        this.url = url;
        return this;
    }
    setMainHtmlNodeId(mainHtmlNodeId) {
        this.mainHtmlNodeId = mainHtmlNodeId;
        return this;
    }
    setMetadata(metadata) {
        this.metadata = metadata;
        return this;
    }
    setModifiable(isModifiable) {
        this.isModifiable = isModifiable;
        return this;
    }
    setRenderingMode(mode) {
        this.renderingMode = mode;
        return this;
    }
    load() {
        if (!this.url || !this.mainHtmlNodeId) {
            return;
        }
        fetch(this.url)
            .then(response => response.json())
            .then(json => {
            this.render(json);
        });
    }
    getDataType(value) {
        return Array.isArray(value) ? 'array' : (typeof value);
    }
    render(nodes) {
        this.mainHolderHtmlNode = document.getElementById(this.mainHtmlNodeId);
        if (!this.mainHolderHtmlNode) {
            throw new Error("Tree holder html node ID did not match any html node in this html doc.");
        }
        this.mainHolderHtmlNode.className = 'tree';
        let ul = document.createElement('UL');
        this.mainHolderHtmlNode.append(ul);
        const dataType = this.getDataType(nodes);
        let subtreeNodesCount = 0;
        if (dataType === 'object') {
            this.data = Object.assign({}, nodes);
            subtreeNodesCount = Object.keys(this.data).length;
        }
        else if (dataType === 'array') {
            this.data = [...nodes];
            subtreeNodesCount = this.data.length;
        }
        if (subtreeNodesCount === 0) {
            throw new Error("Tree json data is empty.");
        }
        let subtreeRenderResult;
        if (this.renderingMode === TreeConstants.RenderingMode.Metadata) {
            if (dataType === 'array') {
                subtreeRenderResult = this.callRenderForSubtree(this.data, dataType, ul);
                // @ts-ignore
                this.subtreeLength = subtreeRenderResult.subtreeJsonNodesLength;
                // @ts-ignore
                this.subtreeLengthDeep = subtreeRenderResult.currentNodeSubtreeLength;
            }
            else if (dataType === 'object') {
                const renderResult = this.renderOneTreeNode(this.data, ul);
                const currentNodeSubtreeLength = renderResult.currentNodeSubtreeLength;
                this.data = Object.assign({}, renderResult.node);
                // @ts-ignore
                this.subtreeLength = subtreeNodesCount;
                // @ts-ignore
                this.subtreeLengthDeep = currentNodeSubtreeLength;
            }
        }
        else if (this.renderingMode === TreeConstants.RenderingMode.Ease) {
            console.log(dataType);
            if (dataType === 'array') {
                const renderResult = this.renderOneTreeNode({ "Json Root": this.data }, ul);
                const currentNodeSubtreeLength = renderResult.currentNodeSubtreeLength;
                this.data = Object.assign({}, renderResult.node);
                // @ts-ignore
                this.subtreeLength = subtreeNodesCount;
                // @ts-ignore
                this.subtreeLengthDeep = currentNodeSubtreeLength;
            }
            else if (dataType === 'object') {
                const renderResult = this.renderOneTreeNode(this.data, ul);
                const currentNodeSubtreeLength = renderResult.currentNodeSubtreeLength;
                this.data = Object.assign({}, renderResult.node);
                // @ts-ignore
                this.subtreeLength = subtreeNodesCount;
                // @ts-ignore
                this.subtreeLengthDeep = currentNodeSubtreeLength;
            }
        }
        if (this.debug) {
            console.log('Tree.data', this.data);
        }
        this.addJSTreeEventListeners();
        return this;
    }
    callRenderForSubtree(subtreeNodes, subtreeNodesHolderDataType, subtreeHtmlHolder) {
        const ul = subtreeHtmlHolder;
        let subtreeJsonNodesLength = 0;
        if (subtreeNodesHolderDataType === 'array') {
            subtreeJsonNodesLength = subtreeNodes.length;
        }
        else if (subtreeNodesHolderDataType === 'object') {
            subtreeJsonNodesLength = Object.keys(subtreeNodes).length;
        }
        let subtreeJsonNode = null;
        let currentNodeSubtreeLength = 0;
        let renderResult = null;
        if (this.renderingMode === TreeConstants.RenderingMode.Metadata) {
            if (subtreeNodesHolderDataType === 'object') {
                for (let propertyName in subtreeNodes) {
                    subtreeJsonNode = subtreeNodes[propertyName];
                    renderResult = this.renderOneTreeNode(subtreeJsonNode, ul);
                    currentNodeSubtreeLength += renderResult.currentNodeSubtreeLength;
                    subtreeNodes[propertyName] = Object.assign({}, renderResult.node);
                }
            }
            else if (subtreeNodesHolderDataType === 'array') {
                for (let i = 0; i < subtreeJsonNodesLength; i++) {
                    subtreeJsonNode = subtreeNodes[i];
                    renderResult = this.renderOneTreeNode(subtreeJsonNode, ul);
                    currentNodeSubtreeLength += renderResult.currentNodeSubtreeLength;
                    // @ts-ignore
                    subtreeNodes[i] = Object.assign({}, renderResult.node);
                }
            }
        }
        else if (this.renderingMode === TreeConstants.RenderingMode.Ease) {
            if (subtreeNodesHolderDataType === 'object') {
                console.log("========= 1 ===========");
                for (let propertyName in subtreeNodes) {
                    console.log("========= 2 ===========");
                    const propertyVale = subtreeNodes[propertyName];
                    const dataTypeElem = this.getDataType(propertyVale);
                    if (dataTypeElem === 'object') {
                        subtreeJsonNode = propertyVale;
                    }
                    else {
                        subtreeJsonNode = { [propertyName]: propertyVale };
                    }
                    renderResult = this.renderOneTreeNode(subtreeJsonNode, ul);
                    currentNodeSubtreeLength += renderResult.currentNodeSubtreeLength;
                    subtreeNodes[propertyName] = Object.assign({}, renderResult.node);
                }
            }
            else if (subtreeNodesHolderDataType === 'array') {
                console.log("========= 3 ===========");
                for (let i = 0; i < subtreeJsonNodesLength; i++) {
                    console.log("========= 4 ===========");
                    const arrayElement = subtreeNodes[i];
                    const dataTypeElem = this.getDataType(arrayElement);
                    /*if (dataTypeElem === 'object') {
                      subtreeJsonNode = arrayElement;
                    } else {*/
                    subtreeJsonNode = { [i]: arrayElement };
                    //}
                    renderResult = this.renderOneTreeNode(subtreeJsonNode, ul);
                    currentNodeSubtreeLength += renderResult.currentNodeSubtreeLength;
                    // @ts-ignore
                    subtreeNodes[i] = Object.assign({}, renderResult.node);
                }
            }
        }
        currentNodeSubtreeLength += subtreeJsonNodesLength;
        return { currentNodeSubtreeLength, subtreeJsonNodesLength };
    }
    renderOneTreeNode(node, holder) {
        console.log("========= 5 ===========");
        console.log(node);
        if (this.metadata === null) {
            throw new Error("TreeMetdata is null");
        }
        let id = node[this.metadata.NODE__ID];
        let holderId = node[this.metadata.NODE__HOLDER_ID];
        let holderJson = null;
        if (!holderId) {
            const holderLiNode = holder.closest('li');
            if (holderLiNode) {
                holderJson = this.getTreeHtmlNodeDatasetJson(holderLiNode.querySelector('.jstree-html-node'));
                holderId = holderJson[this.metadata.NODE__ID];
            }
            else {
                holderId = this.mainHtmlNodeId + 'Main';
                holderJson = {};
            }
            node[this.metadata.NODE__HOLDER_ID] = holderId;
        }
        if (!holderJson[this.metadata.NODE__PATH]) {
            holderJson[this.metadata.NODE__PATH] = [holderId];
        }
        if (!id) {
            id = holderId + '_' + holder.getElementsByTagName('li').length;
            node[this.metadata.NODE__ID] = id;
        }
        node[this.metadata.NODE__PATH] = [
            ...holderJson[this.metadata.NODE__PATH],
            id
        ];
        let subtreeJsonNodes = null;
        let hasSubtree = false;
        let nodeValueDataType = '';
        if (this.renderingMode === TreeConstants.RenderingMode.Metadata) {
            console.log("========= 6 ===========");
            subtreeJsonNodes = node[this.metadata.SUBTREE];
            hasSubtree = !!subtreeJsonNodes;
            nodeValueDataType = this.getDataType(subtreeJsonNodes);
            if (hasSubtree && nodeValueDataType === 'object') {
                console.log("========= 7 ===========");
                hasSubtree = Object.keys(subtreeJsonNodes).length !== 0;
            }
            else if (hasSubtree && nodeValueDataType === 'array') {
                console.log("========= 8 ===========");
                hasSubtree = subtreeJsonNodes.length !== 0;
            }
        }
        else if (this.renderingMode === TreeConstants.RenderingMode.Ease) {
            const nodeValue = Object.values(node)[0];
            nodeValueDataType = this.getDataType(nodeValue);
            if (nodeValueDataType === 'array') {
                hasSubtree = (nodeValue.length !== 0);
            }
            else if (nodeValueDataType === 'object') {
                hasSubtree = (Object.keys(nodeValue).length !== 0);
            }
            else {
                hasSubtree = false;
            }
            if (hasSubtree) {
                subtreeJsonNodes = nodeValue;
            }
        }
        const nodeClone = Object.assign({}, node);
        // @ts-ignore
        delete (nodeClone[this.metadata.SUBTREE]);
        // @ts-ignore
        nodeClone.hasSubtree = hasSubtree;
        let dataForRendering = null;
        if (this.renderingMode === TreeConstants.RenderingMode.Metadata) {
            dataForRendering = this.getDataForRendering(nodeClone);
        }
        else if (this.renderingMode === TreeConstants.RenderingMode.Ease) {
            dataForRendering = this.getDataForRenderingEase(nodeClone);
        }
        const nodeHtml = this.templateRenderer
            .setTemplate(TreeConstants.TEMPLATE__TREE_HTML_NODE)
            // @ts-ignore
            .setData(dataForRendering)
            .render();
        holder.insertAdjacentHTML('beforeend', nodeHtml);
        const li = holder.querySelector('li:last-of-type');
        if (li === null) {
            throw new Error("Rendiring broken, wrong html structure built.");
        }
        // @ts-ignore
        const className = node[this.metadata.NODE__CSS_CLASS_NAME];
        if (className) {
            li.className = className;
        }
        const eventAfterRenderOneNodePayload = {
            "eventName": TreeConstants.TreeEventsNames.EVENT_NAME__AFTER_RENDER_ONE_NODE,
            "treeHtmlNode": li,
            "treeItemJson": nodeClone
        };
        if (!hasSubtree) {
            this.emitEvent(TreeConstants.TreeEventsNames.EVENT_NAME__AFTER_RENDER_ONE_NODE, eventAfterRenderOneNodePayload);
            return { currentNodeSubtreeLength: 0, node: Object.assign({}, node) };
        }
        let ul = li.getElementsByTagName('UL')[0];
        // @ts-ignore
        if (node[this.metadata.NODE__OPENED] === true) {
            ul.style.display = 'block';
        }
        else {
            ul.style.display = 'none';
        }
        const subtreeRenderResult = this.callRenderForSubtree(subtreeJsonNodes, nodeValueDataType, ul);
        // @ts-ignore
        nodeClone.subtreeLength = subtreeRenderResult.subtreeJsonNodesLength;
        // @ts-ignore
        nodeClone.subtreeLengthDeep = subtreeRenderResult.currentNodeSubtreeLength;
        this.emitEvent(TreeConstants.TreeEventsNames.EVENT_NAME__AFTER_RENDER_ONE_NODE, eventAfterRenderOneNodePayload);
        return {
            currentNodeSubtreeLength: subtreeRenderResult.currentNodeSubtreeLength,
            node: Object.assign({}, node)
        };
    }
    getDataForRendering(node) {
        var _a;
        let openButtonClassName = '';
        if (!node.hasSubtree) {
            openButtonClassName = TreeConstants.TreeCssClassNames.CLASS_WITHOUT_SUBTREE;
            // @ts-ignore
        }
        else if (node[this.metadata.NODE__OPENED]) {
            openButtonClassName = TreeConstants.TreeCssClassNames.CLASS_OPENED;
        }
        const dataForRendering = {
            dataId: node[this.metadata.NODE__ID],
            dataHolderId: node[this.metadata.NODE__HOLDER_ID],
            dataOrder: node[this.metadata.NODE__ORDER],
            dataJson: this.escapeHTMLForAttribute(JSON.stringify(node)),
            openButtonStateClassName: openButtonClassName,
            iconSrc: node[this.metadata.NODE_ICON__SRC],
            iconShowClassName: (node[this.metadata.NODE_ICON__SRC]) ? "icon-show" : "icon-hide",
            labelText: node[this.metadata.NODE_LABEL__TEXT],
            hyperlink: (_a = node[this.metadata.NODE__HYPERLINK]) !== null && _a !== void 0 ? _a : 'javascript: void(0);',
            hasSubtree: node.hasSubtree,
        };
        return dataForRendering;
    }
    getDataForRenderingEase(node) {
        const key = Object.keys(node)[0];
        const value = node[key];
        //const typeNode: string = typeof value;
        let nodeHasSubtree = node.hasSubtree;
        let openButtonClassName = '';
        let labelText = '';
        if (nodeHasSubtree) {
            openButtonClassName = TreeConstants.TreeCssClassNames.CLASS_OPENED;
            labelText = `"${key}"`;
            // @ts-ignore
        }
        else {
            openButtonClassName = TreeConstants.TreeCssClassNames.CLASS_WITHOUT_SUBTREE;
            const serializedJsonValue = this.escapeHTMLForAttribute(JSON.stringify(value));
            labelText = `"${key}": ${serializedJsonValue}`;
        }
        const dataForRendering = {
            dataId: '',
            dataHolderId: '',
            dataOrder: '',
            dataJson: this.escapeHTMLForAttribute(JSON.stringify(node)),
            openButtonStateClassName: openButtonClassName,
            iconSrc: '',
            iconShowClassName: "icon-hide", // iconSrc ? "icon-show" : "icon-hide",
            labelText: labelText,
            hyperlink: 'javascript: void(0);',
            hasSubtree: nodeHasSubtree,
        };
        return dataForRendering;
    }
    escapeHTMLForAttribute(str) {
        return str
            .replace(/"/g, "&quot;") // Replace double quotes
            .replace(/'/g, "&#39;") // Replace single quotes
            .replace(/</g, "&lt;") // Replace <
            .replace(/>/g, "&gt;"); // Replace >
    }
    unescapeHTMLFromAttribute(str) {
        if (!str) {
            return '';
        }
        return str
            .replace(/&quot;/g, "\"") // Replace double quotes
            .replace(/&#39;/g, "'") // Replace single quotes
            .replace(/&lt;/g, "<") // Replace <
            .replace(/&gt;/g, ">"); // Replace >
    }
    getTreeHtmlNodeDatasetJson(htmlNode) {
        if (htmlNode === null) {
            return '';
        }
        return JSON.parse(this.unescapeHTMLFromAttribute(htmlNode.dataset.json));
    }
    addJSTreeEventListener(eventName, eventHandler) {
        // the holder class LargeDomEventListenersOverheadOptimizer method call
        this.addThisClassEventListener(eventName, eventHandler);
        return this;
    }
    // the predefined events handlers
    addJSTreeEventListeners() {
        // the holder class LargeDomEventListenersOverheadOptimizer method call
        // Here is the predefined open button handler,
        // In Your custom code, this way You can define event handlers for heavy tree json data,
        // and the tree will not be overloaded of large number of events listeners on many html nodes. 
        this.addDomEventListener('click', '.open-button', this.openButtonClickHandler.bind(this));
        this.addDomEventListener('click', '.jstree-html-node-label', this.treeNodeLableClickHandler.bind(this));
        if (this.isModifiable) {
            this.addDomEventListener('dblclick', '.jstree-html-node-holder-icon', this.contextMenuRender);
        }
        // the holder class LargeDomEventListenersOverheadOptimizer method call
        this.addDomEventListeners();
        return this;
    }
    // the predefined events handlers
    openButtonClickHandler(eventPayload) {
        const toggleButton = eventPayload.eventTarget;
        if (toggleButton.classList.contains(TreeConstants.TreeCssClassNames.CLASS_WITHOUT_SUBTREE)) {
            return;
        }
        eventPayload.event.preventDefault();
        eventPayload.event.stopPropagation();
        let subtreeContainer = toggleButton.closest('li').getElementsByTagName('ul')[0];
        const isOpened = toggleButton.classList.contains(TreeConstants.TreeCssClassNames.CLASS_OPENED);
        if (isOpened) {
            toggleButton.classList.remove(TreeConstants.TreeCssClassNames.CLASS_OPENED);
            subtreeContainer.style.display = 'none';
        }
        else {
            toggleButton.classList.add(TreeConstants.TreeCssClassNames.CLASS_OPENED);
            subtreeContainer.style.display = 'block';
        }
        this.emitEvent(TreeConstants.TreeEventsNames.EVENT_NAME__TREE_NODE_EXPAND_BUTTON__CLICK, eventPayload);
    }
    // the predefined events handlers
    treeNodeLableClickHandler(eventPayload) {
        const treeHtmlNode = eventPayload.eventTarget.closest('.jstree-html-node');
        const jsonNode = JSON.parse(this.unescapeHTMLFromAttribute(treeHtmlNode.dataset.json));
        if (this.debug === true) {
            console.log(eventPayload.event.type, treeHtmlNode, jsonNode);
        }
        this.emitEvent(TreeConstants.TreeEventsNames.EVENT_NAME__TREE_NODE_LABEL__CLICK, Object.assign(Object.assign({}, eventPayload), { jsonNode,
            treeHtmlNode, treeHtmlNodeHolder: treeHtmlNode.closest('li') }));
    }
    contextMenuRender(eventPayload) {
        /*if (!this.contextMenuJSClass) {
            this.contextMenuJSClass = new JSONContextMenu();
        }

        const treeHtmlNode = eventPayload.eventTarget.closest('li').querySelector('.jstree-html-node');
        
        const contextMenuHtmlNode = this.contextMenuJSClass
            .render(treeHtmlNode, this.mainHtmlNodeId, contextMenuJson);
        
        contextMenuHtmlNode.style.display = 'block';*/
    }
}
