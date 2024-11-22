import { EventEmitter, LargeDomEventEmitter, EventEmitResult, EventHandlerReturnValue } from '@jaisocx/event-emitter';
import { TemplateRenderer } from "@jaisocx/template-renderer";

import { ITreeRenderRetValue, IRenderingMode, IRenderTemplateRendererData, IRenderSubtreeResult } from './Types';
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

  nodesWithIcons: boolean;
  nodesAllOpened: boolean;

  dataTypesCssClassesEnabled: boolean;
  
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
        this.getSubtreeNodeToRender = this.getSubtreeNodeToRender__renderingModeMetadata.bind(this);
        this.checkDataNodeSubtree = this.checkDataNodeSubtree__renderingModeMetadata.bind(this);
        this.getDataForRendering = this.getDataForRendering__renderingModeMetadata.bind(this);

        if ( this.dataTypesCssClassesEnabled === true ) {
          this.getTreeNodeCssClasses = this.getTreeNodeCssClasses__dataTypesCssClassesEnabled__renderingModeMetadata.bind(this);
        } else {
          this.getTreeNodeCssClasses = this.getTreeNodeCssClasses__dataTypesCssClassesDisabled__renderingModeMetadata.bind(this);
        }


      } else if ( this.renderingMode === TreeConstants.RenderingMode.Ease ) {
        this.getSubtreeNodeToRender = this.getSubtreeNodeToRender__renderingModeEase.bind(this);
        this.checkDataNodeSubtree = this.checkDataNodeSubtree__renderingModeEase.bind(this);
        this.getDataForRendering = this.getDataForRendering__renderingModeEase.bind(this);

        if ( this.dataTypesCssClassesEnabled === true ) {
          this.getTreeNodeCssClasses = this.getTreeNodeCssClasses__dataTypesCssClassesEnabled__renderingModeEase.bind(this);
        } else {
          //this.getTreeNodeCssClasses = this.getTreeNodeCssClasses__dataTypesCssClassesDisabled__renderingModeMetadata.bind(this);
        }

      }
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
        const dataType: number = this.getDataType(nodes);

        let isArray: number = 0;

        if ( dataType === TreeConstants.DataType.ARRAY ) {
          isArray = 1;

        } else if ( dataType !== TreeConstants.DataType.OBJECT ) {
          throw new Error("Arrays or Objects supported. This JSON Data is not iterable.");

        }

        // get info on subtree nodes amount
        const { itemsAmount, objectKeys } = this.getArrayOrObjectItemsAmount(isArray, nodes);
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

      const { itemsAmount, objectKeys } = this.getArrayOrObjectItemsAmount(isArray, subtreeNodes);

      const renderSubtreeResult: any = this.iterateOverArrayOrObjectDefined(
        isArray,
        subtreeNodes,
        this.renderSubtreeCallback.bind(this),
        subtreeHtmlHolder,
        objectKeys
      );

      return renderSubtreeResult;
    }

    // ADAPTIVE METHODS AND THEIR IMPLS BLOCK

    // ADAPTIVE getSubtreeNodeToRender() AND IT'S IMPLS BLOCK
    getSubtreeNodeToRender(
      loopPropertyValue: any, 
      loopPropertyKey: any
    ): any {
      return null;
    }

    getSubtreeNodeToRender__renderingModeMetadata(
      loopPropertyValue: any, 
      loopPropertyKey: any
    ): any {
      return loopPropertyValue;
    }

    getSubtreeNodeToRender__renderingModeEase(
      loopPropertyValue: any, 
      loopPropertyKey: any
    ): any {
      const subtreeJsonNode: object = {[loopPropertyKey]: loopPropertyValue};

      return subtreeJsonNode;
    }
    // FINISH ADAPTIVE getSubtreeNodeToRender() AND IT'S IMPLS BLOCK
    

    renderSubtreeCallback(
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

        let nodeClone: object = {...node};

        // UNDER DEVELOPMENT OPTION, TO USE FOR MODIFYING TREE AND SYNCHING JSON DATA
        if ( this.isModifiable === true ) {
          nodeClone = this.updateDataNodeIdAndPath(nodeClone, holder);
        }

        // TODO: ADAPTER ?
        let { subtreeNodeDataType, hasSubtree, subtreeJsonNodes }: { 
          subtreeNodeDataType: number; 
          hasSubtree: boolean; 
          subtreeJsonNodes: any; 
        } = this.checkDataNodeSubtree(nodeClone);


        // TODO: ADAPTER, EXTENSIBILITY FEATURE
        let dataForRendering: IRenderTemplateRendererData|null = this.getDataForRendering(nodeClone, hasSubtree);
        
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


    // GET INFO ON JSON DATA NODE SUBTREE 
    checkDataNodeSubtree (
      node: any
    ): {subtreeNodeDataType: number, hasSubtree: boolean, subtreeJsonNodes: any} {
      return {subtreeNodeDataType: 1, hasSubtree: true, subtreeJsonNodes: null};
    }

    checkDataNodeSubtree__renderingModeMetadata (
      node: any
    ): { 
      isArray: number, 
      subtreeNodeDataType: number, 
      hasSubtree: boolean, 
      subtreeJsonNodes: any 
    } {

      const subtreeJsonNodes: any = node[this.metadata.SUBTREE];

      const subtreeNodeDataType: number = this.getDataType(subtreeJsonNodes);
      const isArray: number = ( ( subtreeNodeDataType === TreeConstants.DataType.ARRAY ) ? 1 : 0 );
      const { itemsAmount, objectKeys } = this.getArrayOrObjectItemsAmount (
        isArray,
        subtreeJsonNodes
      );

      const hasSubtree: boolean = (itemsAmount !== 0);

      // @ts-ignore
      delete(node[this.metadata.SUBTREE]);
      // @ts-ignore
      node.hasSubtree = hasSubtree;

      return { 
        isArray, 
        subtreeNodeDataType, 
        hasSubtree, 
        subtreeJsonNodes
     };
    }

    checkDataNodeSubtree__renderingModeEase (
      node: any
    ): { 
      isArray: number, 
      subtreeNodeDataType: number, 
      hasSubtree: boolean, 
      subtreeJsonNodes: any 
    } {

      const subtreeJsonNodes: any = Object.values(node)[0];
      const subtreeNodeDataType: number = this.getDataType(subtreeJsonNodes);
      const isArray: number = ( ( subtreeNodeDataType === TreeConstants.DataType.ARRAY ) ? 1 : 0 );
      const { itemsAmount, objectKeys } = this.getArrayOrObjectItemsAmount (
        isArray,
        subtreeJsonNodes
      );
      const hasSubtree: boolean = (itemsAmount !== 0);

      return { isArray, subtreeNodeDataType, hasSubtree, subtreeJsonNodes };
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


    // TEMPLATE RENDERING HELPERS BLOCK
    getDataForRendering (
      node: any,
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

    getDataForRendering__renderingModeMetadata (
      node: any,
      hasSubtree: boolean
    ): IRenderTemplateRendererData {
        let openButtonClassName = '';
        if ( !node.hasSubtree ) {
            openButtonClassName = TreeConstants.TreeCssClassNames.CLASS_WITHOUT_SUBTREE;

        // @ts-ignore
        } else if (
          node[this.metadata.NODE__OPENED] === true ||
          this.nodesAllOpened === true
        ) {
          openButtonClassName = TreeConstants.TreeCssClassNames.CLASS_OPENED;
        }

        const cssClasses: string = this.getTreeNodeCssClasses(node);

        const dataForRendering: IRenderTemplateRendererData = {
            dataId: node[this.metadata.NODE__ID],
            dataHolderId: node[this.metadata.NODE__HOLDER_ID],
            dataOrder: node[this.metadata.NODE__ORDER],
            dataJson: this.escapeHTMLForAttribute(JSON.stringify(node)),
            openButtonStateClassName: openButtonClassName,
            cssClasses: cssClasses,
            iconSrc: node[this.metadata.NODE_ICON__SRC],
            iconShowClassName: (this.nodesWithIcons || node[this.metadata.NODE_ICON__SRC]) ? "icon-show" : "icon-hide",
            labelText: node[this.metadata.NODE_LABEL__TEXT],
            hyperlink: node[this.metadata.NODE__HYPERLINK] ?? 'javascript: void(0);',
            hasSubtree: node.hasSubtree,
        };

        return dataForRendering;
    }

    getDataForRendering__renderingModeEase(
      node: any, 
      nodeHasSubtree: boolean
    ): IRenderTemplateRendererData {
      const key: string = Object.keys(node)[0];
      const value: any = node[key];

      let openButtonClassName: string = '';
      let labelText: string = `"${key}"`;
      if ( !nodeHasSubtree ) {
        openButtonClassName = TreeConstants.TreeCssClassNames.CLASS_WITHOUT_SUBTREE;
        const serializedJsonValue: string = this.escapeHTMLForAttribute(JSON.stringify(value));
        labelText = `"${key}": ${serializedJsonValue}`;

      } else if (
        node[this.metadata.NODE__OPENED] === true ||
        this.nodesAllOpened === true
      ) {
        openButtonClassName = TreeConstants.TreeCssClassNames.CLASS_OPENED;
      }

      const cssClasses: string = ( this.dataTypesCssClassesEnabled === true ) ? this.getTreeNodeCssClasses(value) : '';

      const dataForRendering: IRenderTemplateRendererData = {
        iconSrc: '',
        iconShowClassName: this.nodesWithIcons ? "icon-show" : "icon-hide",
        labelText: labelText,
        hyperlink: 'javascript: void(0);',
        cssClasses: cssClasses,
        dataId: '',
        dataHolderId: '',
        dataOrder: '',
        dataJson: this.escapeHTMLForAttribute(JSON.stringify(node)),
        openButtonStateClassName: openButtonClassName,
        hasSubtree: nodeHasSubtree,
      };

      return dataForRendering;
    }

    // adapt block css classes
    getTreeNodeCssClasses (
      dataType: string,
      node: any
    ): string {
      return '';
    }

    getTreeNodeCssClasses__dataTypesCssClassesDisabled__renderingModeMetadata (
      dataType: string,
      node: any
    ): string {

      const cssClassesNodeValue: string = node[this.metadata.NODE__CSS_CLASS_NAME];
      
      const cssClassesArray: string[] = [
        ("class=\""),
        (cssClassesNodeValue),
        ("\""),
      ];

      const cssClasses: string = cssClassesArray.join("");

      return cssClasses;
    }

    getTreeNodeCssClasses__dataTypesCssClassesEnabled__renderingModeMetadata (
      dataType: string,
      node: any
    ): string {

      const cssClassesNodeValue: string = node[this.metadata.NODE__CSS_CLASS_NAME];
      
      const cssClassesArray: string[] = [
        ("class=\""),
        (cssClassesNodeValue),
        (" "),
        (TreeConstants.TreeCssClassNames.PREFIX__CLASS_DATATYPE),
        (dataType),
        ("\""),
      ];

      const cssClasses: string = cssClassesArray.join("");

      return cssClasses;
    }

    // adapt block renderingMode ease, datatypes css classes enabled
    getTreeNodeCssClasses__dataTypesCssClassesEnabled__renderingModeEase (
      dataType: string,
      node: any
    ): string {

      const cssClassesArray: string[] = [
        ("class=\""),
        (TreeConstants.TreeCssClassNames.PREFIX__CLASS_DATATYPE),
        (dataType),
        ("\""),
      ];

      const cssClasses: string = cssClassesArray.join("");

      return cssClasses;
    }
    // end adapt block renderingMode ease, datatypes css classes enabled
    // end adapt block css classes

    // END TEMPLATE RENDERING HELPERS BLOCK



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


    // HELPERS METHODS BLOCK

    getDataTypeStringAndConst(value: any): { dataTypeString: string, dataType: number } {
      const dataTypeString: string = Array.isArray(value) ? 'array' : (typeof value);
      const dataType: number = TreeConstants.DataType[dataTypeString.toUpperCase()];

      return {
        dataTypeString,
        dataType
      };
    }

    getDataType(value: any): number {
      const dataTypeString: string = Array.isArray(value) ? 'array' : (typeof value);
      const dataType: number = TreeConstants.DataType[dataTypeString.toUpperCase()];

      return dataType;
    }

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

    getArrayOrObjectItemsAmount(
      isArray: number,
      arrayOrObject: any
    ): {itemsAmount: number, objectKeys: string[]|null} {
      let itemsAmount: number = 0;
      let objectKeys: string[]|null = null;

      if (isArray === 1) {
        itemsAmount = arrayOrObject.length;
      } else {
        objectKeys = Object.keys(arrayOrObject);
        itemsAmount = objectKeys.length;
      }

      return {
        itemsAmount, 
        objectKeys
      };
    }

    iterateOverArrayOrObject(
      dataType: number,
      arrayOrObject: any,
      callback: CallableFunction,
      callbackPayload: any,
      objectKeys: string[]|null
    ): any {
      const isArray: number = (( dataType === TreeConstants.DataType.ARRAY ) ? 1 : 0);
      const callbackResult: any = this.iterateOverArrayOrObjectDefined(
        isArray,
        arrayOrObject,
        callback,
        callbackPayload,
        objectKeys
      );

      return callbackResult;
    }

    iterateOverArrayOrObjectDefined(
      isArray: number,
      arrayOrObject: any,
      callback: CallableFunction,
      callbackPayload: any,
      objectKeys: string[]|null
    ): any {
      // expects isArray = 1 true

      let loopCounter: number = 0;
      let arrayElement: any = {};

      let subtreeNodesKeys: string[] = [];
      let subtreeNodesValues: any[] = [];
      let loopPropertyName: string = '';
      let loopPropertyValue: any = {};

      let arrayOrObjectItemsAmount: number = 1;

      let callbackResult: any = null;

      if (isArray === 1) {
        // subtree type is array
        
        loopPropertyName = '';
        arrayOrObjectItemsAmount = arrayOrObject.length;
        for ( loopCounter = 0; loopCounter < arrayOrObjectItemsAmount; loopCounter++ ) {

          arrayElement = arrayOrObject[loopCounter];

          callbackResult = callback(isArray, loopCounter, arrayElement, loopCounter, arrayOrObject, callbackResult, callbackPayload);
        }

      } else {
        // subtree type is object

        subtreeNodesKeys = ( objectKeys !== null ) ? objectKeys : Object.keys(arrayOrObject);
        subtreeNodesValues = Object.values(arrayOrObject);

        arrayOrObjectItemsAmount = subtreeNodesKeys.length;
        for ( loopCounter = 0; loopCounter < arrayOrObjectItemsAmount; loopCounter++ ) {

          loopPropertyName  = subtreeNodesKeys[loopCounter];
          loopPropertyValue = subtreeNodesValues[loopCounter];

          callbackResult = callback(isArray, loopCounter, loopPropertyValue, loopPropertyName, arrayOrObject, callbackResult, callbackPayload);
        }

      }

      return callbackResult;
    }    
}

