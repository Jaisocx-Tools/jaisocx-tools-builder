export class TreeMetadata {
  NODE_ICON__SRC: string;
  NODE_LABEL__TEXT: string;
  SUBTREE: string;

  NODE__ID: string;
  NODE__HOLDER_ID: string;
  NODE__PATH: string;
  NODE__ORDER: string;

  NODE__HYPERLINK: string;
  NODE__OPENED: string;
  NODE__CSS_CLASS_NAME: string;
  NODE__ART: string;

  constructor() {
    this.NODE_ICON__SRC = 'icon';
    this.NODE_LABEL__TEXT = 'label';
    this.SUBTREE = 'subtree';

    this.NODE__ID = 'id';
    this.NODE__HOLDER_ID = 'holderId';
    this.NODE__PATH = 'PATH';
    this.NODE__ORDER = 'order';

    this.NODE__HYPERLINK = 'href';
    this.NODE__OPENED = 'opened';
    this.NODE__CSS_CLASS_NAME = 'cssClassName';
    this.NODE__ART = 'art';
  }
}
