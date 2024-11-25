import { TreeConstants } from "./TreeConstants";
import { TreeMetadata } from "./TreeMetadata";
export class TreeAdapter {
    constructor() {
        this.metadata = new TreeMetadata();
        this.nodesWithIcons = TreeConstants.Defaults.nodesWithIcons;
        this.nodesOpenedMode = TreeConstants.Defaults.nodesOpenedMode;
        this.dataTypesCssClassesEnabled = TreeConstants.Defaults.dataTypesCssClassesEnabled;
    }
}
//# sourceMappingURL=TreeAdapter.js.map