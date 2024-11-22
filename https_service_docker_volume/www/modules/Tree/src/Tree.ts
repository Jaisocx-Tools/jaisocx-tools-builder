import { EventEmitter, LargeDomEventEmitter, EventEmitResult, EventHandlerReturnValue } from '@jaisocx/event-emitter';
import { TemplateRenderer } from "@jaisocx/template-renderer";

import { ITreeRenderRetValue, IRenderingMode, IRenderTemplateRendererData, IRenderSubtreeResult, ITreeAdapter } from './Types';
import { TreeConstants } from './TreeConstants';
import { TreeMetadata } from './TreeMetadata';
import { TreeAdapterModeMetadata } from './TreeAdapterModeMetadata';
import { TreeAdapterModeEase } from './TreeAdapterModeEase';
import { ArrayOrObjectPackage } from './ArrayOrObjectPackage';


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

  nodesWithIcons: boolean;
  nodesAllOpened: boolean;

  dataTypesCssClassesEnabled: boolean;

  adapter: ITreeAdapter;
  
  constructor() {
        super();

        this.debug = TreeConstants.Defaults.debug;

        this.mainHtmlNodeId = '';
        this.mainHolderHtmlNode = null;

        this.url = '';

        this.data = null;
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

        // DEFAULT VALUES ARE FROM CONSTANTS CLASS
        this.setDebug(TreeConstants.Defaults.debug);
        this.renderingMode = TreeConstants.Defaults.renderingMode;
        this.nodesWithIcons = TreeConstants.Defaults.nodesWithIcons;
        this.nodesAllOpened = TreeConstants.Defaults.nodesAllOpened;
        this.isModifiable = TreeConstants.Defaults.isModifiable;
        this.dataTypesCssClassesEnabled = TreeConstants.Defaults.dataTypesCssClassesEnabled;
        this.adapter = new TreeAdapterModeEase();
    }

    setDebug(debug: boolean): Tree {
      // optional method
      super.setDebug(debug);
      this.templateRenderer.setDebug(debug);
      this.debug = debug;
      return this;
    }

    setNodesWithIcons(withIcons: boolean): Tree {
      // optional method
      this.nodesWithIcons = withIcons;
      return this;
    }

    setNodesAllOpened(opened: boolean): Tree {
      // optional method
      this.nodesAllOpened = opened;
      return this;
    }

    setUrl(url: string|null): Tree {
        // optional method
        this.url = url;
        return this;
    }

    setMainHtmlNodeId(mainHtmlNodeId: string): Tree {
      // required method
      this.mainHtmlNodeId = mainHtmlNodeId;
        return this;
    }

    setMetadata(metadata: TreeMetadata): Tree {
        // optional method
        this.metadata = metadata;
        return this;
    }

    setModifiable(isModifiable: boolean): Tree {
      // optional method
      this.isModifiable = isModifiable;
        return this;
    }


    setRenderingMode(mode: number): Tree {
      // optional method
      this.renderingMode = mode;
      return this;
    }

    setDataTypesCssClassesEnabled(dataTypesCssEnabled: boolean): Tree {
      this.dataTypesCssClassesEnabled = dataTypesCssEnabled;
      return this;
    }

    load(url: string|null): Tree {
      if (url && url.length) {
        this.url = url;
      }

      if(!this.url || !this.mainHtmlNodeId){
          throw new Error("No url set");
      }

        fetch(this.url)
            .then(response => response.json())
            .then(json => {
                this.render(json);
            });
        
        return this;
    }

    adaptRenderingModeSubcalls(): void {
      if ( this.renderingMode === TreeConstants.RenderingMode.Metadata ) {
        this.adapter = new TreeAdapterModeMetadata();

        if ( this.dataTypesCssClassesEnabled === true ) {
          this.getTreeNodeCssClasses = this.adapter.getTreeNodeCssClasses__dataTypesCssClassesEnabled.bind(this);
        } else {
          this.getTreeNodeCssClasses = this.adapter.getTreeNodeCssClasses__dataTypesCssClassesDisabled.bind(this);
        }


      } else if ( this.renderingMode === TreeConstants.RenderingMode.Ease ) {
        this.adapter = new TreeAdapterModeEase();

        if ( this.dataTypesCssClassesEnabled === true ) {
          this.getTreeNodeCssClasses = this.adapter.getTreeNodeCssClasses__dataTypesCssClassesEnabled.bind(this);
        } else {
          //this.getTreeNodeCssClasses = this.getTreeNodeCssClasses__dataTypesCssClassesDisabled__renderingModeMetadata.bind(this);
        }

      }

      this.getSubtreeNodeToRender = this.adapter.getSubtreeNodeToRender.bind(this);
      this.checkDataNodeSubtree = this.adapter.checkDataNodeSubtree.bind(this);
      this.getDataForRendering = this.adapter.getDataForRendering.bind(this);

    }

    reRender(): Tree {
      this.render(this.data);
      return this;
    }

    render(nodes: any): Tree {
        this.mainHolderHtmlNode = document.getElementById(this.mainHtmlNodeId);

        if (!this.mainHolderHtmlNode) {
          throw new Error("Tree holder html node ID did not match any html node in this html doc.");
        }

        if (this.metadata === null) {
          throw new Error("TreeMetdata is null");
        }

        this.adaptRenderingModeSubcalls();

        // set main css class name to the main tree holder html node
        if (
          this.mainHolderHtmlNode.classList && 
          !this.mainHolderHtmlNode.classList.contains(
            TreeConstants.TreeCssClassNames.MAIN_CLASS_NAME
          )
        ) {
          this.mainHolderHtmlNode.classList.add(TreeConstants.TreeCssClassNames.MAIN_CLASS_NAME);
        } else if (!this.mainHolderHtmlNode.classList) {
          this.mainHolderHtmlNode.className = (TreeConstants.TreeCssClassNames.MAIN_CLASS_NAME);
        }

        if ( this.nodesWithIcons === true ) {
          this.mainHolderHtmlNode.classList.add(TreeConstants.TreeCssClassNames.CLASS_NAME_WITH_ICONS);
        } else {
          this.mainHolderHtmlNode.classList.remove(TreeConstants.TreeCssClassNames.CLASS_NAME_WITH_ICONS);
        }

        // add an html holder node for subtree html nodes
        let ul = document.createElement('UL');
        this.mainHolderHtmlNode.append(ul);


        // get datatype of the main json data node
        const dataType: number = ArrayOrObjectPackage.getDataType(nodes);

        let isArray: number = 0;

        if ( dataType === ArrayOrObjectPackage.JsonDataType.ARRAY ) {
          isArray = 1;

        } else if ( dataType !== ArrayOrObjectPackage.JsonDataType.OBJECT ) {
          throw new Error("Arrays or Objects supported. This JSON Data is not iterable.");

        }

        // get info on subtree nodes amount
        const { itemsAmount, objectKeys } = ArrayOrObjectPackage.getArrayOrObjectItemsAmount(isArray, nodes);
        let subtreeNodesCount: number = itemsAmount;

        // exit throwing exception, if the tree json data is empty
        if (subtreeNodesCount === 0) {
          throw new Error("Tree json data is empty.");
        }

        let subtreeRenderResult: any;
        if (this.renderingMode === TreeConstants.RenderingMode.Metadata) {
          if ( isArray === 1 ) {
            subtreeRenderResult = this.renderSubtree(
              isArray,
              this.data, 
              ul
            );

            // @ts-ignore
            this.subtreeLength = subtreeNodesCount;
            // @ts-ignore
            this.subtreeLengthDeep = subtreeRenderResult;

          } else if ( isArray === 0 ) {

            const isTreeItem: boolean = this.getInModeMetadataDataNodeIsTreeItem(this.data);

            // the root json data node is the tree item data node
            if (isTreeItem) {
              const renderResult: any = this.renderOneTreeNode(this.data, ul);
              const currentNodeSubtreeLength: number = renderResult.currentNodeSubtreeLength;
              this.data = renderResult.node;
              // @ts-ignore
              this.subtreeLength = subtreeNodesCount;
              // @ts-ignore
              this.subtreeLengthDeep = currentNodeSubtreeLength;

            } else {
              // the root json data node is the associative array of tree item data nodes, suggested, if not so, then will not be rendered.
              subtreeRenderResult = this.renderSubtree(
                isArray,
                this.data, 
                ul
              );

              // @ts-ignore
              this.subtreeLength = subtreeNodesCount;
              // @ts-ignore
              this.subtreeLengthDeep = subtreeRenderResult;

            }
          }
        } else if (this.renderingMode === TreeConstants.RenderingMode.Ease) {

          const renderResult: any = this.renderOneTreeNode({ "Json Root": this.data }, ul);

          const currentNodeSubtreeLength: number = renderResult.currentNodeSubtreeLength;
          this.data = renderResult.node[0];

          // @ts-ignore
          this.subtreeLength = subtreeNodesCount;
          // @ts-ignore
          this.subtreeLengthDeep = currentNodeSubtreeLength;
        }
        
        if (this.debug) {
          console.log('Tree.data', this.data);
        }

        // all eventsHandlers, assigned with addJSTreeEventListener, 
        // here will be attached to single DOM event listener
        this.addJSTreeEventListeners();

        return this;
    }

    renderSubtree(
      isArray: number,
      subtreeNodes: any,
      subtreeHtmlHolder: HTMLElement
    ): number {

      const { itemsAmount, objectKeys } = ArrayOrObjectPackage.getArrayOrObjectItemsAmount(isArray, subtreeNodes);

      const renderSubtreeResult: any = ArrayOrObjectPackage.iterateOverArrayOrObjectDefined(
        isArray,
        subtreeNodes,
        this.renderSubtreeCallback.bind(this),
        subtreeHtmlHolder,
        objectKeys
      );

      return renderSubtreeResult;
    }

    renderSubtreeCallback (
      isArray: number,
      loopCounter: number, 
      loopPropertyValue: any, 
      loopPropertyKey: any, 
      arrayOrObject: any,
      previousCallbackResult: number|null,
      callbackPayload: any
    ): number {

      let currentNodeSubtreeLength: number = (previousCallbackResult) ? previousCallbackResult : 0;
      const subtreeHtmlHolder: HTMLElement = callbackPayload;

      let subtreeJsonNode: object = this.getSubtreeNodeToRender(
        loopPropertyValue,
        loopPropertyKey
      );

      // RENDERING ONE TREE NODE
      const renderResult: ITreeRenderRetValue = this.renderOneTreeNode(
        subtreeJsonNode, 
        subtreeHtmlHolder
      );

      currentNodeSubtreeLength += renderResult.currentNodeSubtreeLength;

      if ( this.renderingMode === TreeConstants.RenderingMode.Metadata ) {
        arrayOrObject[loopPropertyKey] = renderResult.node;
      } else {
        arrayOrObject[loopPropertyKey] = renderResult.node[loopPropertyKey];
      }

      return currentNodeSubtreeLength;
    }

    // FINISH ADAPTIVE renderSubtree() AND IT'S IMPLS BLOCK
    // FINISH ADAPTIVE METHODS AND THEIR IMPLS BLOCK


    renderOneTreeNode(
      node: any, 
      holder: HTMLElement
    ): ITreeRenderRetValue {

        if (this.debug) {
          console.log(node);
        }

        let nodeClone: any = {...node};

        // UNDER DEVELOPMENT OPTION, TO USE FOR MODIFYING TREE AND SYNCHING JSON DATA
        if ( this.isModifiable === true ) {
          nodeClone = this.updateDataNodeIdAndPath(nodeClone, holder);
        }

        // TODO: ADAPTER ?
        let { isArray, subtreeNodeDataType, subtreeNodeDataTypeString, hasSubtree, subtreeJsonNodes }: { 
          isArray: number;
          subtreeNodeDataType: number; 
          subtreeNodeDataTypeString: string;
          hasSubtree: boolean; 
          subtreeJsonNodes: any; 
        } = this.checkDataNodeSubtree(nodeClone);


        // TODO: ADAPTER, EXTENSIBILITY FEATURE
        let dataForRendering: IRenderTemplateRendererData|null = this.getDataForRendering(nodeClone, subtreeNodeDataTypeString, hasSubtree);
        
        const nodeHtml: string = this.templateRenderer
            .setTemplate(TreeConstants.TEMPLATE__TREE_HTML_NODE)
            // @ts-ignore
            .setData(dataForRendering)
            .render();

        holder.insertAdjacentHTML (
            'beforeend',
            nodeHtml
        );
    
        // @ts-ignore
        const holderLiItems: HTMLCollection = holder.getElementsByTagName("LI");
        const li: HTMLElement|null = holderLiItems.item(holderLiItems.length - 1) as HTMLElement;
        if (li === null) {
          throw new Error("Rendiring broken, wrong html structure built.");
        }

        // @ts-ignore
        const datanodeDefinedCssClassName: string|undefined|null = nodeClone[this.metadata.NODE__CSS_CLASS_NAME];
        if (datanodeDefinedCssClassName && datanodeDefinedCssClassName.length !== 0) {
            li.className = datanodeDefinedCssClassName;
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
    
            return { currentNodeSubtreeLength: 0, node: nodeClone};
        }
    
        let ul: HTMLElement|null = li.getElementsByTagName('UL')[0] as HTMLElement;
    
        // @ts-ignore
        if (nodeClone[this.metadata.NODE__OPENED] === true) {
          ul.style.display = 'block';
        } else if (this.nodesAllOpened === true) {
          ul.style.display = 'block';
        } else {
          ul.style.display = 'none';
        }

        const subtreeRenderResult: any = this.renderSubtree(subtreeJsonNodes, subtreeNodeDataType, ul);
        
        // @ts-ignore
        nodeClone.subtreeLength = subtreeRenderResult.subtreeJsonNodesLength;
        // @ts-ignore
        nodeClone.subtreeLengthDeep = subtreeRenderResult.currentNodeSubtreeLength;

        if (this.renderingMode === TreeConstants.RenderingMode.Metadata) {
          nodeClone[this.metadata.SUBTREE] = subtreeRenderResult.subtreeNodes;
        } else if (this.renderingMode === TreeConstants.RenderingMode.Ease) {
          const propName: string = Object.keys(nodeClone)[0];
          nodeClone[propName] = subtreeRenderResult.subtreeNodes;
        }
    
        this.emitEvent (
          TreeConstants.TreeEventsNames.EVENT_NAME__AFTER_RENDER_ONE_NODE, 
          eventAfterRenderOneNodePayload
        );
    
        return { 
          currentNodeSubtreeLength: subtreeRenderResult.currentNodeSubtreeLength, 
          node: nodeClone
        };
    }



    // TEMPORARY IMPL TO KEEP POINTERS TO JSON DATA NODES IN HTML TREE NODES IN HTML NODE DATA ATTRIBUTES
    updateDataNodeIdAndPath(node: any, holder: HTMLElement): any {
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

      return node;
    }


    // ADAPTIVE PLACEHOLDERS
    getSubtreeNodeToRender(
      loopPropertyValue: any, 
      loopPropertyKey: any
    ): any {
      return null;
    }

    checkDataNodeSubtree (
      node: any
    ): {isArray: number, subtreeNodeDataType: number, subtreeNodeDataTypeString: string, hasSubtree: boolean, subtreeJsonNodes: any} {
      return {isArray: 0, subtreeNodeDataType: 1, subtreeNodeDataTypeString: '', hasSubtree: true, subtreeJsonNodes: null};
    }

    getDataForRendering (
      node: any,
      dataTypeString: string,
      hasSubtree: boolean
    ): IRenderTemplateRendererData {
      return {
        iconSrc: '',
        iconShowClassName: '',
        labelText: '',
        hyperlink: '',
        cssClasses: '',
        dataId: '',
        dataHolderId: '',
        dataOrder: '',
        dataJson: '',
        openButtonStateClassName: '',
        hasSubtree: true
      };
    }

    getTreeNodeCssClasses (
      dataType: string,
      node: any
    ): string {
      return '';
    }

    // FINISH BLOCK ADAPTIVE PLACEHOLDERS



    // EVENTS BLOCK
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
    // END EVENTS BLOCK


    getInModeMetadataDataNodeIsTreeItem(node: object): boolean {
      // @ts-ignore
      const nodeLabelTextPropertyValue: any = node[this.metadata.NODE_LABEL__TEXT];

      // the main metadata required dsts json field is label text. and it cannot be an object, but a string or number.
      const isTreeItem: boolean = ( nodeLabelTextPropertyValue && ((nodeLabelTextPropertyValue) !== 'object') );

      return isTreeItem;
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

