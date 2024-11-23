import { ArrayOrObjectPackage } from "./ArrayOrObjectPackage";
import { TreeConstants } from "./TreeConstants";
import { TreeMetadata } from "./TreeMetadata";

export class TreeAdapter {
  metadata: TreeMetadata;

  nodesWithIcons: boolean;

  nodesAllOpened: boolean;

  dataTypesCssClassesEnabled: boolean;

  constructor() {
    this.metadata = new TreeMetadata();
    this.nodesWithIcons = TreeConstants.Defaults.nodesWithIcons;
    this.nodesAllOpened = TreeConstants.Defaults.nodesAllOpened;
    this.dataTypesCssClassesEnabled = TreeConstants.Defaults.dataTypesCssClassesEnabled;
  }
}
