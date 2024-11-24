import { ArrayOrObjectPackage } from "./ArrayOrObjectPackage";
import { TreeConstants } from "./TreeConstants";
import { TreeMetadata } from "./TreeMetadata";

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
