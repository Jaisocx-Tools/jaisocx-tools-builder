import { TreeConstants } from "./TreeConstants.js";
import { TreeMetadata } from "./TreeMetadata.js";

export class TreeAdapter {
  metadata: TreeMetadata;

  nodesWithIcons: boolean;

  nodesOpenedMode: number;

  dataTypesCssClassesEnabled: boolean;

  constructor() {
    this.metadata = new TreeMetadata();
    this.nodesWithIcons = TreeConstants.Defaults.nodesWithIcons;
    this.nodesOpenedMode = TreeConstants.Defaults.nodesOpenedMode;
    this.dataTypesCssClassesEnabled = TreeConstants.Defaults.dataTypesCssClassesEnabled;
  }
}
