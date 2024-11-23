import { TreeConstants } from "./TreeConstants";
import { TreeMetadata } from "./TreeMetadata";
export class TreeAdapter {
    constructor() {
        this.metadata = new TreeMetadata();
        this.nodesWithIcons = TreeConstants.Defaults.nodesWithIcons;
        this.nodesAllOpened = TreeConstants.Defaults.nodesAllOpened;
        this.dataTypesCssClassesEnabled = TreeConstants.Defaults.dataTypesCssClassesEnabled;
    }
}
