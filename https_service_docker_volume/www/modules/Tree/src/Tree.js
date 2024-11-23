import { LargeDomEventEmitter } from "@jaisocx/event-emitter";
import { TemplateRenderer } from "@jaisocx/template-renderer";
import { TreeConstants } from "./TreeConstants";
import { TreeMetadata } from "./TreeMetadata";
import { TreeAdapterModeMetadata } from "./TreeAdapterModeMetadata";
import { TreeAdapterModeEase } from "./TreeAdapterModeEase";
import { ArrayOrObjectPackage } from "./ArrayOrObjectPackage";
// Tree main class
export class Tree extends LargeDomEventEmitter {
    constructor() {
        super();
        this.debug = TreeConstants.Defaults.debug;
        this.mainHtmlNodeId = "";
        this.mainHolderHtmlNode = null;
        this.url = "";
        this.data = null;
        this.metadata = new TreeMetadata();
        this.subtreeLength = 0;
        this.subtreeLengthDeep = 0;
        this.templateRenderer = new TemplateRenderer();
        /* this.templateRenderer
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
                ); */
        this.contextMenuJSClass = null;
        // DEFAULT VALUES ARE FROM CONSTANTS CLASS
        this.setDebug(TreeConstants.Defaults.debug);
        this.renderingMode = TreeConstants.Defaults.renderingMode;
        this.nodesWithIcons = TreeConstants.Defaults.nodesWithIcons;
        this.nodesAllOpened = TreeConstants.Defaults.nodesAllOpened;
        this.isModifiable = TreeConstants.Defaults.isModifiable;
        this.dataTypesCssClassesEnabled = TreeConstants.Defaults.dataTypesCssClassesEnabled;
        this.adapter = new TreeAdapterModeEase();
    }
    setDebug(debug) {
        // optional method
        super.setDebug(debug);
        this.templateRenderer.setDebug(debug);
        this.debug = debug;
        return this;
    }
    setNodesWithIcons(withIcons) {
        // optional method
        this.nodesWithIcons = withIcons;
        return this;
    }
    setNodesAllOpened(opened) {
        // optional method
        this.nodesAllOpened = opened;
        return this;
    }
    setUrl(url) {
        // optional method
        this.url = url;
        return this;
    }
    setMainHtmlNodeId(mainHtmlNodeId) {
        // required method
        this.mainHtmlNodeId = mainHtmlNodeId;
        return this;
    }
    setMetadata(metadata) {
        // optional method
        this.metadata = metadata;
        return this;
    }
    setModifiable(isModifiable) {
        // optional method
        this.isModifiable = isModifiable;
        return this;
    }
    setRenderingMode(mode) {
        // optional method
        this.renderingMode = mode;
        return this;
    }
    setDataTypesCssClassesEnabled(dataTypesCssEnabled) {
        this.dataTypesCssClassesEnabled = dataTypesCssEnabled;
        return this;
    }
    load(url) {
        if (url && url.length) {
            this.url = url;
        }
        if (!this.url || !this.mainHtmlNodeId) {
            throw new Error("No url set");
        }
        fetch(this.url)
            .then((response) => response.json())
            .then((json) => {
            this.render(json);
        });
        return this;
    }
    adaptRenderingModeSubcalls() {
        if (this.renderingMode === TreeConstants.RenderingMode.Metadata) {
            this.adapter = new TreeAdapterModeMetadata();
            if (this.dataTypesCssClassesEnabled === true) {
                this.getTreeNodeCssClasses = this.adapter.getTreeNodeCssClasses__dataTypesCssClassesEnabled.bind(this);
            }
            else {
                this.getTreeNodeCssClasses = this.adapter.getTreeNodeCssClasses__dataTypesCssClassesDisabled.bind(this);
            }
        }
        else if (this.renderingMode === TreeConstants.RenderingMode.Ease) {
            this.adapter = new TreeAdapterModeEase();
            if (this.dataTypesCssClassesEnabled === true) {
                this.getTreeNodeCssClasses = this.adapter.getTreeNodeCssClasses__dataTypesCssClassesEnabled.bind(this);
            }
            else {
                // this.getTreeNodeCssClasses = this.getTreeNodeCssClasses__dataTypesCssClassesDisabled__renderingModeMetadata.bind(this);
            }
        }
        this.getSubtreeNodeToRender = this.adapter.getSubtreeNodeToRender.bind(this);
        this.getDataForRendering = this.adapter.getDataForRendering.bind(this);
    }
    reRender() {
        this.render(this.data);
        return this;
    }
    render(nodes) {
        if (nodes) {
            this.data = nodes;
        }
        if (!this.data
            || !this.metadata) {
            throw new Error(`Empty: data ${this.data} or metadata ${this.metadata}`);
        }
        this.mainHolderHtmlNode = document.getElementById(this.mainHtmlNodeId);
        if (!this.mainHolderHtmlNode) {
            throw new Error("Tree holder html node ID did not match any html node in this html doc.");
        }
        this.adaptRenderingModeSubcalls();
        // set main css class name to the main tree holder html node
        if (this.mainHolderHtmlNode.classList
            && !this.mainHolderHtmlNode.classList.contains(TreeConstants.TreeCssClassNames.MAIN_CLASS_NAME)) {
            this.mainHolderHtmlNode.classList.add(TreeConstants.TreeCssClassNames.MAIN_CLASS_NAME);
        }
        else if (!this.mainHolderHtmlNode.classList) {
            this.mainHolderHtmlNode.className = (TreeConstants.TreeCssClassNames.MAIN_CLASS_NAME);
        }
        if (this.nodesWithIcons === true) {
            this.mainHolderHtmlNode.classList.add(TreeConstants.TreeCssClassNames.CLASS_NAME_WITH_ICONS);
        }
        else {
            this.mainHolderHtmlNode.classList.remove(TreeConstants.TreeCssClassNames.CLASS_NAME_WITH_ICONS);
        }
        // add an html holder node for subtree html nodes
        const ul = document.createElement("UL");
        this.mainHolderHtmlNode.append(ul);
        // get datatype of the main json data node
        const dataType = ArrayOrObjectPackage.getDataType(nodes);
        let isArray = 0;
        if (dataType === ArrayOrObjectPackage.JsonDataType.ARRAY) {
            isArray = 1;
        }
        else if (dataType !== ArrayOrObjectPackage.JsonDataType.OBJECT) {
            throw new Error("Arrays or Objects supported. This JSON Data is not iterable.");
        }
        // get info on subtree nodes amount
        const { itemsAmount, objectKeys, } = ArrayOrObjectPackage.getArrayOrObjectItemsAmount(isArray, this.data);
        const subtreeNodesCount = itemsAmount;
        // exit throwing exception, if the tree json data is empty
        if (subtreeNodesCount === 0) {
            throw new Error("Tree json data is empty.");
        }
        const flatNodeHolderClone = { _pathArray: ["this.data",], };
        let subtreeRenderResult;
        if (this.renderingMode === TreeConstants.RenderingMode.Metadata) {
            if (isArray === 1) {
                subtreeRenderResult = this.renderSubtree(isArray, this.data, flatNodeHolderClone, objectKeys, ul);
                // @ts-ignore
                this.subtreeLength = subtreeNodesCount;
                // @ts-ignore
                this.subtreeLengthDeep = subtreeRenderResult;
            }
            else if (isArray === 0) {
                const isTreeItem = this.getInModeMetadataDataNodeIsTreeItem(this.data);
                // the root json data node is the tree item data node
                if (isTreeItem) {
                    const renderResult = this.renderOneTreeNode(this.data, 0, "Top", { _pathArray: ["this.data",], }, ul);
                    const { currentNodeSubtreeLength, } = renderResult;
                    this.data = renderResult.node;
                    // @ts-ignore
                    this.subtreeLength = subtreeNodesCount;
                    // @ts-ignore
                    this.subtreeLengthDeep = currentNodeSubtreeLength;
                }
                else {
                    // the root json data node is the associative array of tree item data nodes, suggested, if not so, then will not be rendered.
                    subtreeRenderResult = this.renderSubtree(isArray, this.data, flatNodeHolderClone, objectKeys, ul);
                    // @ts-ignore
                    this.subtreeLength = subtreeNodesCount;
                    // @ts-ignore
                    this.subtreeLengthDeep = subtreeRenderResult;
                }
            }
        }
        else if (this.renderingMode === TreeConstants.RenderingMode.Ease) {
            const renderResult = this.renderOneTreeNode({ "Json Root": this.data, }, 0, "Top", { _pathArray: ["this.data",], }, ul);
            const { currentNodeSubtreeLength, } = renderResult;
            // this.data = renderResult.node[0];
            // @ts-ignore
            this.subtreeLength = subtreeNodesCount;
            // @ts-ignore
            this.subtreeLengthDeep = currentNodeSubtreeLength;
        }
        if (this.debug) {
            console.log("Tree.data", this.data);
        }
        // all eventsHandlers, assigned with addJSTreeEventListener,
        // here will be attached to single DOM event listener
        this.addJSTreeEventListeners();
        return this;
    }
    checkDataNodeSubtree(node) {
        let hasSubtree = false;
        let subtreeJsonNodes = null;
        if (this.renderingMode === TreeConstants.RenderingMode.Metadata) {
            subtreeJsonNodes = node[this.metadata.SUBTREE];
        }
        else if (this.renderingMode === TreeConstants.RenderingMode.Ease) {
            subtreeJsonNodes = Object.values(node)[0];
        }
        const { dataTypeString, dataType, } = ArrayOrObjectPackage.getDataTypeStringAndConst(subtreeJsonNodes);
        const isArray = ((dataType === ArrayOrObjectPackage.JsonDataType.ARRAY) ? 1 : 0);
        if ((!subtreeJsonNodes)
            || ((dataType !== ArrayOrObjectPackage.JsonDataType.ARRAY)
                && (dataType !== ArrayOrObjectPackage.JsonDataType.OBJECT))) {
            return {
                isArray,
                subtreeNodeDataType: dataType,
                subtreeNodeDataTypeString: dataTypeString,
                hasSubtree,
                subtreeJsonNodes,
                objectKeys: null,
            };
        }
        const { itemsAmount, objectKeys, } = ArrayOrObjectPackage.getArrayOrObjectItemsAmount(isArray, subtreeJsonNodes);
        hasSubtree = (itemsAmount !== 0);
        return {
            isArray,
            subtreeNodeDataType: dataType,
            subtreeNodeDataTypeString: dataTypeString,
            hasSubtree,
            subtreeJsonNodes,
            objectKeys,
        };
    }
    renderSubtree(isArray, subtreeNodes, flatNodeHolderClone, objectKeys, subtreeHtmlHolder) {
        const renderSubtreeResult = ArrayOrObjectPackage.iterateOverArrayOrObjectDefined(isArray, subtreeNodes, this.renderSubtreeCallback.bind(this), {
            subtreeHtmlHolder,
            flatNodeHolderClone,
        }, objectKeys);
        return renderSubtreeResult;
    }
    renderSubtreeCallback(isArray, loopCounter, loopPropertyValue, loopPropertyKey, arrayOrObject, previousCallbackResult, callbackPayload) {
        let currentNodeSubtreeLength = (previousCallbackResult) || 0;
        const { subtreeHtmlHolder, flatNodeHolderClone, } = callbackPayload;
        const subtreeJsonNode = this.getSubtreeNodeToRender(loopPropertyValue, loopPropertyKey);
        // RENDERING ONE TREE NODE
        const renderResult = this.renderOneTreeNode(subtreeJsonNode, loopCounter, loopPropertyKey, flatNodeHolderClone, subtreeHtmlHolder);
        currentNodeSubtreeLength += renderResult.currentNodeSubtreeLength;
        /* if ( this.renderingMode === TreeConstants.RenderingMode.Metadata ) {
            arrayOrObject[loopPropertyKey] = renderResult.node;
          } else {
            arrayOrObject[loopPropertyKey] = renderResult.node[loopPropertyKey];
          } */
        return currentNodeSubtreeLength;
    }
    renderOneTreeNode(node, nodePosition, nodeKey, flatNodeHolderClone, holder) {
        if (this.debug) {
            console.log(node);
        }
        const nodeClone = this.updateDataNodeIdAndPath(node, nodePosition, nodeKey, flatNodeHolderClone, holder);
        const { isArray, subtreeNodeDataType, subtreeNodeDataTypeString, hasSubtree, subtreeJsonNodes, objectKeys, } = this.checkDataNodeSubtree(node);
        // TODO: EXTENSIBILITY FEATURE
        const dataForRendering = this.getDataForRendering(node, nodeClone, subtreeNodeDataTypeString, hasSubtree);
        const nodeHtml = this.templateRenderer
            .setTemplate(TreeConstants.TEMPLATE__TREE_HTML_NODE)
            // @ts-ignore
            .setData(dataForRendering)
            .render();
        holder.insertAdjacentHTML("beforeend", nodeHtml);
        // @ts-ignore
        const holderLiItems = holder.getElementsByTagName("LI");
        const li = holderLiItems.item(holderLiItems.length - 1);
        if (li === null) {
            throw new Error("Rendiring broken, wrong html structure built.");
        }
        const eventAfterRenderOneNodePayload = {
            eventName: TreeConstants.TreeEventsNames.EVENT_NAME__AFTER_RENDER_ONE_NODE,
            treeHtmlNode: li,
            treeItemJson: nodeClone,
        };
        if (!hasSubtree) {
            this.emitEvent(TreeConstants.TreeEventsNames.EVENT_NAME__AFTER_RENDER_ONE_NODE, eventAfterRenderOneNodePayload);
            return {
                currentNodeSubtreeLength: 0,
                node: nodeClone,
            };
        }
        const ul = li.getElementsByTagName("UL")[0];
        // @ts-ignore
        if (node[this.metadata.NODE__OPENED] === true
            || this.nodesAllOpened === true) {
            ul.style.display = "block";
        }
        else {
            ul.style.display = "none";
        }
        const subtreeRenderResult = this.renderSubtree(isArray, subtreeJsonNodes, nodeClone, objectKeys, ul);
        this.emitEvent(TreeConstants.TreeEventsNames.EVENT_NAME__AFTER_RENDER_ONE_NODE, eventAfterRenderOneNodePayload);
        return {
            currentNodeSubtreeLength: subtreeRenderResult.currentNodeSubtreeLength,
            node: null, // CHECK OUT WHETHER BOKEN WHEN NOW NULL
        };
    }
    // TEMPORARY IMPL TO KEEP POINTERS TO JSON DATA NODES IN HTML TREE NODES IN HTML NODE DATA ATTRIBUTES
    updateDataNodeIdAndPath(node, nodePosition, nodeKey, flatNodeHolderClone, holder) {
        var _a, _b, _c;
        const id = (_a = node[this.metadata.NODE__ID]) !== null && _a !== void 0 ? _a : null;
        const holderId = (_b = node[this.metadata.NODE__HOLDER_ID]) !== null && _b !== void 0 ? _b : null;
        const flatCloneHolderId = flatNodeHolderClone._flatClone ? flatNodeHolderClone._flatClone[this.metadata.NODE__ID] : null;
        const pathInJsonOfNodeHolder = (_c = flatNodeHolderClone._pathArray) !== null && _c !== void 0 ? _c : ["ROOT-unhandled",];
        let pathKeyInNodeHolder = JSON.stringify(nodeKey);
        if ((pathInJsonOfNodeHolder.length > 1) && this.renderingMode === TreeConstants.RenderingMode.Metadata) {
            const subtreePropName = JSON.stringify(this.metadata.SUBTREE);
            pathKeyInNodeHolder = `[${subtreePropName}][${pathKeyInNodeHolder}]`;
        }
        else if (this.renderingMode === TreeConstants.RenderingMode.Ease) {
            pathKeyInNodeHolder = `[${pathKeyInNodeHolder}]`;
        }
        const pathInJsonArray = [
            ...pathInJsonOfNodeHolder,
            pathKeyInNodeHolder,
        ];
        const pathInJsonString = pathInJsonArray.join("");
        const flatNodeClone = {};
        for (const propName in node) {
            const propValue = node[propName];
            const dataType = (typeof propValue);
            if (dataType === "object") {
                continue;
            }
            flatNodeClone[propName] = propValue;
        }
        const technicFields = {
            [this.metadata.NODE__ID]: id,
            [this.metadata.NODE__HOLDER_ID]: holderId,
            _flatCloneHolderId: flatCloneHolderId,
            _id: nodePosition,
            _key: nodeKey,
            _flatClone: flatNodeClone,
            _pathArray: pathInJsonArray,
            _path: pathInJsonString,
        };
        const nodeClone = Object.assign({}, technicFields);
        return nodeClone;
    }
    // ADAPTIVE PLACEHOLDERS
    getSubtreeNodeToRender(loopPropertyValue, loopPropertyKey) {
        return null;
    }
    getDataForRendering(node, flatNodeClone, dataTypeString, hasSubtree) {
        return {
            iconSrc: "",
            iconShowClassName: "",
            labelText: "",
            hyperlink: "",
            cssClasses: "",
            dataId: "",
            dataHolderId: "",
            dataOrder: "",
            dataJson: "",
            openButtonStateClassName: "",
            hasSubtree: true,
        };
    }
    getTreeNodeCssClasses(dataType, node) {
        return "";
    }
    // FINISH BLOCK ADAPTIVE PLACEHOLDERS
    // EVENTS BLOCK
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
        this.addDomEventListener("click", ".open-button", this.openButtonClickHandler.bind(this));
        this.addDomEventListener("click", ".jstree-html-node-label", this.treeNodeLableClickHandler.bind(this));
        if (this.isModifiable) {
            this.addDomEventListener("dblclick", ".jstree-html-node-holder-icon", this.contextMenuRender);
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
        const subtreeContainer = toggleButton.closest("li").getElementsByTagName("ul")[0];
        const isOpened = toggleButton.classList.contains(TreeConstants.TreeCssClassNames.CLASS_OPENED);
        if (isOpened) {
            toggleButton.classList.remove(TreeConstants.TreeCssClassNames.CLASS_OPENED);
            subtreeContainer.style.display = "none";
        }
        else {
            toggleButton.classList.add(TreeConstants.TreeCssClassNames.CLASS_OPENED);
            subtreeContainer.style.display = "block";
        }
        this.emitEvent(TreeConstants.TreeEventsNames.EVENT_NAME__TREE_NODE_EXPAND_BUTTON__CLICK, eventPayload);
    }
    // the predefined events handlers
    treeNodeLableClickHandler(eventPayload) {
        const treeHtmlNode = eventPayload.eventTarget.closest(".jstree-html-node");
        const jsonNode = JSON.parse(this.unescapeHTMLFromAttribute(treeHtmlNode.dataset.json));
        if (this.debug === true) {
            console.log(eventPayload.event.type, treeHtmlNode, jsonNode);
        }
        this.emitEvent(TreeConstants.TreeEventsNames.EVENT_NAME__TREE_NODE_LABEL__CLICK, Object.assign(Object.assign({}, eventPayload), { jsonNode,
            treeHtmlNode, treeHtmlNodeHolder: treeHtmlNode.closest("li") }));
    }
    // END EVENTS BLOCK
    getInModeMetadataDataNodeIsTreeItem(node) {
        // @ts-ignore
        const nodeLabelTextPropertyValue = node[this.metadata.NODE_LABEL__TEXT];
        // the main metadata required dsts json field is label text. and it cannot be an object, but a string or number.
        const isTreeItem = (nodeLabelTextPropertyValue && ((nodeLabelTextPropertyValue) !== "object"));
        return isTreeItem;
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
            return "";
        }
        return str
            .replace(/&quot;/g, "\"") // Replace double quotes
            .replace(/&#39;/g, "'") // Replace single quotes
            .replace(/&lt;/g, "<") // Replace <
            .replace(/&gt;/g, ">"); // Replace >
    }
    getTreeHtmlNodeDatasetJson(htmlNode) {
        if (htmlNode === null) {
            return "";
        }
        return JSON.parse(this.unescapeHTMLFromAttribute(htmlNode.dataset.json));
    }
    contextMenuRender(eventPayload) {
        /* if (!this.contextMenuJSClass) {
                this.contextMenuJSClass = new JSONContextMenu();
            }
    
            const treeHtmlNode = eventPayload.eventTarget.closest('li').querySelector('.jstree-html-node');
    
            const contextMenuHtmlNode = this.contextMenuJSClass
                .render(treeHtmlNode, this.mainHtmlNodeId, contextMenuJson);
    
            contextMenuHtmlNode.style.display = 'block'; */
    }
}
