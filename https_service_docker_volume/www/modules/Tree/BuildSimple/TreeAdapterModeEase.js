class TreeAdapterModeEase extends Tree {
    getSubtreeNodeToRender(loopPropertyValue, loopPropertyKey) {
    const subtreeJsonNode = { [loopPropertyKey]: loopPropertyValue };

    return subtreeJsonNode;
  }

  checkDataNodeSubtree(node) {
    const subtreeJsonNodes = Object.values(node)[0];
    const { dataTypeString, dataType } = ArrayOrObjectPackage.getDataTypeStringAndConst(subtreeJsonNodes);
    const isArray = ((dataType === ArrayOrObjectPackage.JsonDataType.ARRAY) ? 1 : 0);
    const { itemsAmount, objectKeys } = ArrayOrObjectPackage.getArrayOrObjectItemsAmount(isArray, subtreeJsonNodes);
    const hasSubtree = (itemsAmount !== 0);

    return {
      isArray,
      subtreeNodeDataType: dataType,
      subtreeNodeDataTypeString: dataTypeString,
      hasSubtree,
      subtreeJsonNodes,
    };
  }

  getDataForRendering(node, dataTypeString, nodeHasSubtree) {
    const key = Object.keys(node)[0];
    const value = node[key];
    let openButtonClassName = "";
    let labelText = `"${key}"`;

    if (!nodeHasSubtree) {
      openButtonClassName = TreeConstants.TreeCssClassNames.CLASS_WITHOUT_SUBTREE;
      const serializedJsonValue = this.escapeHTMLForAttribute(JSON.stringify(value));
      labelText = `"${key}": ${serializedJsonValue}`;
    } else if (node[this.metadata.NODE__OPENED] === true
            || this.nodesAllOpened === true) {
      openButtonClassName = TreeConstants.TreeCssClassNames.CLASS_OPENED;
    }

    const cssClasses = (this.dataTypesCssClassesEnabled === true) ? this.getTreeNodeCssClasses(dataTypeString, value) : "";
    const dataForRendering = {
      iconSrc: "",
      iconShowClassName: this.nodesWithIcons ? "icon-show" : "icon-hide",
      labelText,
      hyperlink: "javascript: void(0);",
      cssClasses,
      dataId: "",
      dataHolderId: "",
      dataOrder: "",
      dataJson: this.escapeHTMLForAttribute(JSON.stringify(node)),
      openButtonStateClassName: openButtonClassName,
      hasSubtree: nodeHasSubtree,
    };

    return dataForRendering;
  }

  getTreeNodeCssClasses__dataTypesCssClassesEnabled(dataTypeString, node) {
    const cssClassesArray = [
      ("class=\""),
      (TreeConstants.TreeCssClassNames.PREFIX__CLASS_DATATYPE),
      (dataTypeString),
      ("\""),
    ];
    const cssClasses = cssClassesArray.join("");

    return cssClasses;
  }

  getTreeNodeCssClasses__dataTypesCssClassesDisabled(dataTypeString, node) {
    throw new Error("Method not implemented.");
  }
}
