import { EventEmitter, LargeDomEventEmitter, EventEmitResult, EventHandlerReturnValue } from '@jaisocx/event-emitter';
import { TemplateRenderer } from "@jaisocx/template-renderer";

import { ITreeRenderRetValue, IRenderingMode, IRenderTemplateRendererData, } from './Types';
import { TreeConstants } from './TreeConstants';
import { TreeMetadata } from './TreeMetadata';


// Tree main class
export class Tree extends LargeDomEventEmitter
{
  mainHtmlNodeId: string;
  mainHolderHtmlNode: HTMLElement|null;

  data: any|null;
  renderingMode: number;
  url: string|null;
  isModifiable: boolean;

  metadata: TreeMetadata;
  templateRenderer: TemplateRenderer;
  contextMenuJSClass: any;

  subtreeLength: number;
  subtreeLengthDeep: number;
  
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

    setDebug(debug: boolean): Tree {
      this.debug = debug;
      return this;
    }

    setUrl(url: string|null) {
        this.url = url;
        return this;
    }
    setMainHtmlNodeId(mainHtmlNodeId: string) {
        this.mainHtmlNodeId = mainHtmlNodeId;
        return this;
    }
    setMetadata(metadata: TreeMetadata) {
        this.metadata = metadata;
        return this;
    }
    setModifiable(isModifiable: boolean) {
        this.isModifiable = isModifiable;
        return this;
    }
    setRenderingMode(mode: number) {
      this.renderingMode = mode;
      return this;
    }

    load(){
        if(!this.url || !this.mainHtmlNodeId){
            return;
        }

        fetch(this.url)
            .then(response => response.json())
            .then(json => {
                this.render(json);
            });
    }

    getDataType(value: any): string {
      return Array.isArray(value) ? 'array' : (typeof value);
    }

    render(nodes: any){
        this.mainHolderHtmlNode = document.getElementById(this.mainHtmlNodeId);
        if (!this.mainHolderHtmlNode) {
          throw new Error("Tree holder html node ID did not match any html node in this html doc.");
        }

        this.mainHolderHtmlNode.className = 'tree';
        let ul = document.createElement('UL');
        this.mainHolderHtmlNode.append(ul);

        const dataType: string = this.getDataType(nodes);

        let subtreeNodesCount: number = 0;
        if (dataType === 'object') {
          this.data = {...nodes};
          subtreeNodesCount = Object.keys(this.data).length;

        } else if (dataType === 'array') {
          this.data = [...nodes];
          subtreeNodesCount = this.data.length;
        }

        if (subtreeNodesCount === 0) {
          throw new Error("Tree json data is empty.");
        }

        let subtreeRenderResult: any;
        if (this.renderingMode === TreeConstants.RenderingMode.Metadata) {
          if (dataType === 'array') {
            subtreeRenderResult = this.callRenderForSubtree(this.data, dataType, ul);

            // @ts-ignore
            this.subtreeLength = subtreeRenderResult.subtreeJsonNodesLength;
            // @ts-ignore
            this.subtreeLengthDeep = subtreeRenderResult.currentNodeSubtreeLength;

          } else if (dataType === 'object') {
            const renderResult: any = this.renderOneTreeNode(this.data, ul);
            const currentNodeSubtreeLength: number = renderResult.currentNodeSubtreeLength;
            this.data = {...renderResult.node};

            // @ts-ignore
            this.subtreeLength = subtreeNodesCount;
            // @ts-ignore
            this.subtreeLengthDeep = currentNodeSubtreeLength;
          }
        } else if (this.renderingMode === TreeConstants.RenderingMode.Ease) {
          console.log(dataType);
          if (dataType === 'array') {
            const renderResult: any = this.renderOneTreeNode({ "Json Root": this.data }, ul);
            const currentNodeSubtreeLength: number = renderResult.currentNodeSubtreeLength;
            this.data = {...renderResult.node};

            // @ts-ignore
            this.subtreeLength = subtreeNodesCount;
            // @ts-ignore
            this.subtreeLengthDeep = currentNodeSubtreeLength;

          } else if (dataType === 'object') {
            const renderResult: any = this.renderOneTreeNode(this.data, ul);
            const currentNodeSubtreeLength: number = renderResult.currentNodeSubtreeLength;
            this.data = {...renderResult.node};

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

    callRenderForSubtree(
      subtreeNodes: any, 
      subtreeNodesHolderDataType: string, 
      subtreeHtmlHolder: HTMLElement
    ): { currentNodeSubtreeLength: number, subtreeJsonNodesLength: number } {

      const ul: HTMLElement = subtreeHtmlHolder;
      let subtreeJsonNodesLength: number = 0;
      if (subtreeNodesHolderDataType === 'array') {
        subtreeJsonNodesLength = subtreeNodes.length;
      } else if (subtreeNodesHolderDataType === 'object') {
        subtreeJsonNodesLength = Object.keys(subtreeNodes).length;
      }

      let subtreeJsonNode = null;
      let currentNodeSubtreeLength = 0;
      let renderResult: any = null;
      if (this.renderingMode === TreeConstants.RenderingMode.Metadata) {
        if (subtreeNodesHolderDataType === 'object') {
          for(let propertyName in subtreeNodes) {
            subtreeJsonNode = subtreeNodes[propertyName];
            renderResult = this.renderOneTreeNode(subtreeJsonNode, ul);
            currentNodeSubtreeLength += renderResult.currentNodeSubtreeLength;
            subtreeNodes[propertyName] = {...renderResult.node};
          }
        } else if (subtreeNodesHolderDataType === 'array') {
          for(let i = 0; i < subtreeJsonNodesLength; i++){
            subtreeJsonNode = subtreeNodes[i];
            renderResult = this.renderOneTreeNode(subtreeJsonNode, ul);
            currentNodeSubtreeLength += renderResult.currentNodeSubtreeLength;
            // @ts-ignore
            subtreeNodes[i] = {...renderResult.node};
          }
        }
      } else if (this.renderingMode === TreeConstants.RenderingMode.Ease) {
        if (subtreeNodesHolderDataType === 'object') {
          console.log("========= 1 ===========");
          for(let propertyName in subtreeNodes) {
            console.log("========= 2 ===========");
            const propertyVale: any = subtreeNodes[propertyName];
            const dataTypeElem: string = this.getDataType(propertyVale);
            if (dataTypeElem === 'object') {
              subtreeJsonNode = propertyVale;
            } else {
              subtreeJsonNode = {[propertyName]: propertyVale};
            }
            renderResult = this.renderOneTreeNode(subtreeJsonNode, ul);
            currentNodeSubtreeLength += renderResult.currentNodeSubtreeLength;
            subtreeNodes[propertyName] = {...renderResult.node};
          }
        } else if (subtreeNodesHolderDataType === 'array') {
          console.log("========= 3 ===========");
          for(let i=0; i < subtreeJsonNodesLength; i++) {
            console.log("========= 4 ===========");
            const arrayElement: any = subtreeNodes[i];
            const dataTypeElem: string = this.getDataType(arrayElement);
            /*if (dataTypeElem === 'object') {
              subtreeJsonNode = arrayElement;
            } else {*/
              subtreeJsonNode = {[i]: arrayElement};
            //}
            renderResult = this.renderOneTreeNode(subtreeJsonNode, ul);
            currentNodeSubtreeLength += renderResult.currentNodeSubtreeLength;
            // @ts-ignore
            subtreeNodes[i] = {...renderResult.node};
          }
        }
      }
      currentNodeSubtreeLength += subtreeJsonNodesLength;
      return { currentNodeSubtreeLength, subtreeJsonNodesLength };
    }

    renderOneTreeNode(node: any, holder: HTMLElement): ITreeRenderRetValue {
        console.log("========= 5 ===========");
        console.log(node);
        if (this.metadata === null) {
          throw new Error("TreeMetdata is null");
        }

        let id: string = node[this.metadata.NODE__ID];
        let holderId: string = node[this.metadata.NODE__HOLDER_ID];
        let holderJson: any = null;

        if (!holderId) {
            const holderLiNode: HTMLElement|null = holder.closest('li');
            if (holderLiNode) {
                holderJson = this.getTreeHtmlNodeDatasetJson(holderLiNode.querySelector('.jstree-html-node'));
                holderId = holderJson[this.metadata.NODE__ID];
            } else {
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

        let subtreeJsonNodes: any = null;
        let hasSubtree: boolean = false;
        let nodeValueDataType: string = '';

        if (this.renderingMode === TreeConstants.RenderingMode.Metadata) {
          console.log("========= 6 ===========");
          subtreeJsonNodes = node[this.metadata.SUBTREE];
          hasSubtree = !!subtreeJsonNodes;

          nodeValueDataType = this.getDataType(subtreeJsonNodes);
          if (hasSubtree && nodeValueDataType === 'object') {
            console.log("========= 7 ===========");
            hasSubtree = Object.keys(subtreeJsonNodes).length !== 0;
          } else if (hasSubtree && nodeValueDataType === 'array') {
            console.log("========= 8 ===========");
            hasSubtree = subtreeJsonNodes.length !== 0;
          }
        } else if (this.renderingMode === TreeConstants.RenderingMode.Ease) {
          const nodeValue: any = Object.values(node)[0];
          nodeValueDataType = this.getDataType(nodeValue);
          if (nodeValueDataType === 'array') {
            hasSubtree = (nodeValue.length !== 0);
          } else if (nodeValueDataType === 'object') {
            hasSubtree = (Object.keys(nodeValue).length !== 0);
          } else {
            hasSubtree = false;
          }

          if (hasSubtree) {
            subtreeJsonNodes = nodeValue;
          }
        }

        const nodeClone: object = {...node};
        // @ts-ignore
        delete(nodeClone[this.metadata.SUBTREE]);
        // @ts-ignore
        nodeClone.hasSubtree = hasSubtree;

        let dataForRendering: IRenderTemplateRendererData|null = null;
        if ( this.renderingMode === TreeConstants.RenderingMode.Metadata ) {
          dataForRendering = this.getDataForRendering(nodeClone);
        } else if (this.renderingMode === TreeConstants.RenderingMode.Ease) {
          dataForRendering = this.getDataForRenderingEase(nodeClone);
        }
        
        const nodeHtml: string = this.templateRenderer
            .setTemplate(TreeConstants.TEMPLATE__TREE_HTML_NODE)
            // @ts-ignore
            .setData(dataForRendering)
            .render();

        holder.insertAdjacentHTML (
            'beforeend',
            nodeHtml
        );
    
        const li: HTMLElement|null = holder.querySelector('li:last-of-type');
        if (li === null) {
          throw new Error("Rendiring broken, wrong html structure built.");
        }

        // @ts-ignore
        const className: string|undefined|null = node[this.metadata.NODE__CSS_CLASS_NAME];
        if (className) {
            li.className = className;
        }
    
        const eventAfterRenderOneNodePayload: object = {
          "eventName": TreeConstants.TreeEventsNames.EVENT_NAME__AFTER_RENDER_ONE_NODE,
          "treeHtmlNode": li,
          "treeItemJson": nodeClone
        };
    
        if(!hasSubtree){
            this.emitEvent (
              TreeConstants.TreeEventsNames.EVENT_NAME__AFTER_RENDER_ONE_NODE, 
              eventAfterRenderOneNodePayload
            );
    
            return { currentNodeSubtreeLength: 0, node: {...node}};
        }
    
        let ul: HTMLElement|null = li.getElementsByTagName('UL')[0] as HTMLElement;
    
        // @ts-ignore
        if (node[this.metadata.NODE__OPENED] === true) {
            ul.style.display = 'block';
        } else {
            ul.style.display = 'none';
        }

        const subtreeRenderResult: any = this.callRenderForSubtree(subtreeJsonNodes, nodeValueDataType, ul);
        
        // @ts-ignore
        nodeClone.subtreeLength = subtreeRenderResult.subtreeJsonNodesLength;
        // @ts-ignore
        nodeClone.subtreeLengthDeep = subtreeRenderResult.currentNodeSubtreeLength;
    
        this.emitEvent (
          TreeConstants.TreeEventsNames.EVENT_NAME__AFTER_RENDER_ONE_NODE, 
          eventAfterRenderOneNodePayload
        );
    
        return { 
          currentNodeSubtreeLength: subtreeRenderResult.currentNodeSubtreeLength, 
          node: {...node}
        };
    }

    getDataForRendering(node: any): IRenderTemplateRendererData {
        let openButtonClassName = '';
        if ( !node.hasSubtree ) {
            openButtonClassName = TreeConstants.TreeCssClassNames.CLASS_WITHOUT_SUBTREE;

        // @ts-ignore
        } else if (node[this.metadata.NODE__OPENED]) {
            openButtonClassName = TreeConstants.TreeCssClassNames.CLASS_OPENED;
        }

        const dataForRendering: IRenderTemplateRendererData = {
            dataId: node[this.metadata.NODE__ID],
            dataHolderId: node[this.metadata.NODE__HOLDER_ID],
            dataOrder: node[this.metadata.NODE__ORDER],
            dataJson: this.escapeHTMLForAttribute(JSON.stringify(node)),
            openButtonStateClassName: openButtonClassName,
            iconSrc: node[this.metadata.NODE_ICON__SRC],
            iconShowClassName: (node[this.metadata.NODE_ICON__SRC]) ? "icon-show" : "icon-hide",
            labelText: node[this.metadata.NODE_LABEL__TEXT],
            hyperlink: node[this.metadata.NODE__HYPERLINK] ?? 'javascript: void(0);',
            hasSubtree: node.hasSubtree,
        };

        return dataForRendering;
    }

    getDataForRenderingEase(node: any): IRenderTemplateRendererData {
      const key: string = Object.keys(node)[0];
      const value: any = node[key];

      //const typeNode: string = typeof value;

      let nodeHasSubtree: boolean = node.hasSubtree;
      let openButtonClassName: string = '';
      let labelText: string = '';
      if ( nodeHasSubtree ) {
        openButtonClassName = TreeConstants.TreeCssClassNames.CLASS_OPENED;
        labelText = `"${key}"`;

      // @ts-ignore
      } else {
        openButtonClassName = TreeConstants.TreeCssClassNames.CLASS_WITHOUT_SUBTREE;
        const serializedJsonValue: string = this.escapeHTMLForAttribute(JSON.stringify(value));
        labelText = `"${key}": ${serializedJsonValue}`;
      }

      const dataForRendering: IRenderTemplateRendererData = {
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

    escapeHTMLForAttribute(str: string): string {
        return str
          .replace(/"/g, "&quot;")  // Replace double quotes
          .replace(/'/g, "&#39;")   // Replace single quotes
          .replace(/</g, "&lt;")    // Replace <
          .replace(/>/g, "&gt;");   // Replace >
    }

    unescapeHTMLFromAttribute(str: string|undefined): string {
        if (!str) {
          return '';
        }
        return str
          .replace(/&quot;/g, "\"")  // Replace double quotes
          .replace(/&#39;/g, "'")   // Replace single quotes
          .replace(/&lt;/g, "<")    // Replace <
          .replace(/&gt;/g, ">");   // Replace >
    }

    getTreeHtmlNodeDatasetJson(htmlNode: HTMLElement|null): string {
      if (htmlNode === null) {
        return '';
      }
      return JSON.parse(this.unescapeHTMLFromAttribute(htmlNode.dataset.json));
    }


    addJSTreeEventListener (eventName: string, eventHandler: CallableFunction): Tree {
        // the holder class LargeDomEventListenersOverheadOptimizer method call
        this.addThisClassEventListener(eventName, eventHandler);

        return this;
    }


    // the predefined events handlers
    addJSTreeEventListeners(): Tree {
        // the holder class LargeDomEventListenersOverheadOptimizer method call
        // Here is the predefined open button handler,
        // In Your custom code, this way You can define event handlers for heavy tree json data,
        // and the tree will not be overloaded of large number of events listeners on many html nodes. 
        this.addDomEventListener (
            'click',
            '.open-button',
            this.openButtonClickHandler.bind(this)
        );

        this.addDomEventListener (
            'click',
            '.jstree-html-node-label',
            this.treeNodeLableClickHandler.bind(this)
        );

        if (this.isModifiable) {
            this.addDomEventListener (
                'dblclick',
                '.jstree-html-node-holder-icon',
                this.contextMenuRender
            )
        }

        // the holder class LargeDomEventListenersOverheadOptimizer method call
        this.addDomEventListeners();
        
        return this;
    }


    // the predefined events handlers
    openButtonClickHandler(eventPayload: any) {
        const toggleButton = eventPayload.eventTarget;
        if (
            toggleButton.classList.contains(TreeConstants.TreeCssClassNames.CLASS_WITHOUT_SUBTREE)
        ) {
            return;
        }

        eventPayload.event.preventDefault();
        eventPayload.event.stopPropagation();

        let subtreeContainer = toggleButton.closest('li').getElementsByTagName('ul')[0];
        const isOpened = toggleButton.classList.contains(TreeConstants.TreeCssClassNames.CLASS_OPENED);
        if (isOpened) {
            toggleButton.classList.remove(TreeConstants.TreeCssClassNames.CLASS_OPENED);
            subtreeContainer.style.display = 'none';
        } else {
            toggleButton.classList.add(TreeConstants.TreeCssClassNames.CLASS_OPENED);
            subtreeContainer.style.display = 'block';
        }

        this.emitEvent (
            TreeConstants.TreeEventsNames.EVENT_NAME__TREE_NODE_EXPAND_BUTTON__CLICK,
            eventPayload
        );
    }

    // the predefined events handlers
    treeNodeLableClickHandler(eventPayload: any) {
        const treeHtmlNode = eventPayload.eventTarget.closest('.jstree-html-node');

        const jsonNode = JSON.parse(this.unescapeHTMLFromAttribute(treeHtmlNode.dataset.json));
        if (this.debug === true) {
            console.log(eventPayload.event.type, treeHtmlNode, jsonNode);
        }

        this.emitEvent (
            TreeConstants.TreeEventsNames.EVENT_NAME__TREE_NODE_LABEL__CLICK,
            {
                ...eventPayload,
                jsonNode,
                treeHtmlNode,
                treeHtmlNodeHolder: treeHtmlNode.closest('li'),
            }
        );
    }

    contextMenuRender(eventPayload: any) {
        /*if (!this.contextMenuJSClass) {
            this.contextMenuJSClass = new JSONContextMenu();
        }

        const treeHtmlNode = eventPayload.eventTarget.closest('li').querySelector('.jstree-html-node');
        
        const contextMenuHtmlNode = this.contextMenuJSClass
            .render(treeHtmlNode, this.mainHtmlNodeId, contextMenuJson);
        
        contextMenuHtmlNode.style.display = 'block';*/
    }
}
