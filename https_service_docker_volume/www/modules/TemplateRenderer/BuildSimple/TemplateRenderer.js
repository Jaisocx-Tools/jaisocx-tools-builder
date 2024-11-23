class TemplateRenderer extends EventEmitter {
  constructor() {
    super();
    this.EVENT_NAME__AFTER_RENDER = "afterRender";
    this.data = {};
    this.template = "";
  }

  setDebug(debug) {
    this.debug = debug;

    return this;
  }

  setData(data) {
    this.data = data;

    return this;
  }

  setTemplate(template) {
    this.template = template;

    return this;
  }

  render() {
    let renderedHtml = this.replaceTemplateRendererWithDataForRendering(
      this.template,
      this.data
    );

    if (this.debug) {
      console.log(
        "renderedHtml before afterRender event emitted",
        renderedHtml
      );
    }

    const eventResult = this.emitEvent(
      this.EVENT_NAME__AFTER_RENDER,
      {
        html: renderedHtml,
        data: this.data
      }
    );

    if (eventResult.length > 0) {
      const last = eventResult.length - 1;
      renderedHtml = eventResult[last].result.payloadReturned.html;

      if (this.debug) {
        console.log(
          "renderedHtml before afterRender event emitted",
          eventResult,
          renderedHtml
        );
      }
    } else if (this.debug) {
      console.log("afterRender event did not change html");
    }

    return renderedHtml;
  }

  replaceTemplateRendererWithDataForRendering(
    template,
    dataForRendering
  ) {
    let renderedHtml = template;

    for (const placeholderName in dataForRendering) {
      const stringToReplace = `{{ ${placeholderName} }}`;
      // @ts-ignore
      let valueToSet = dataForRendering[placeholderName];

      if (!valueToSet) {
        valueToSet = "";
      }

      renderedHtml = renderedHtml.replace(
        stringToReplace,
        valueToSet
      );
    }

    return renderedHtml;
  }
}
