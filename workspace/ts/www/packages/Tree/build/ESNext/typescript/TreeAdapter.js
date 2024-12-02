import { TreeConstants } from "./TreeConstants.js";
import { TreeMetadata } from "./TreeMetadata.js";
export class TreeAdapter {
    metadata;
    nodesWithIcons;
    nodesOpenedMode;
    dataTypesCssClassesEnabled;
    constructor() {
        this.metadata = new TreeMetadata();
        this.nodesWithIcons = TreeConstants.Defaults.nodesWithIcons;
        this.nodesOpenedMode = TreeConstants.Defaults.nodesOpenedMode;
        this.dataTypesCssClassesEnabled = TreeConstants.Defaults.dataTypesCssClassesEnabled;
    }
}
//# sourceMappingURL=TreeAdapter.js.map