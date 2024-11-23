import { EventEmitter, EventEmitResult, EventHandlerReturnValue } from "@jaisocx/event-emitter";

export class TemplateRenderer extends EventEmitter {
  EVENT_NAME__AFTER_RENDER: string;

  data: object;

  template: string;

  constructor() {
    super();

    this.EVENT_NAME__AFTER_RENDER = "afterRender";

    this.data = {};
    this.template = "";
  }

  setDebug(debug: boolean): TemplateRenderer {
    this.debug = debug;
    return this;
  }

  setData(data: object): TemplateRenderer {
    this.data = data;
    return this;
  }

  setTemplate(template: string): TemplateRenderer {
    this.template = template;
    return this;
  }

  render(): string {
    let renderedHtml = this.replaceTemplateRendererWithDataForRendering(
      this.template,
      this.data,
    );

    if (this.debug) {
      console.log("renderedHtml before afterRender event emitted", renderedHtml);
    }

    const eventResult: EventEmitResult[] = this.emitEvent(
      this.EVENT_NAME__AFTER_RENDER,
      {
        html: renderedHtml,
        data: this.data,
      },
    );

    if (eventResult.length > 0) {
      const last: number = eventResult.length - 1;
      renderedHtml = eventResult[last].result.payloadReturned.html;

      if (this.debug) {
        console.log("renderedHtml before afterRender event emitted", eventResult, renderedHtml);
      }
    } else if (this.debug) {
      console.log("afterRender event did not change html");
    }

    return renderedHtml;
  }

  replaceTemplateRendererWithDataForRendering(template: string, dataForRendering: object): string {
    let renderedHtml = template;

    for (const placeholderName in dataForRendering) {
      const stringToReplace = `{{ ${placeholderName} }}`;

      // @ts-ignore
      let valueToSet = dataForRendering[placeholderName];
      if (!valueToSet) {
        valueToSet = "";
      }

      renderedHtml = renderedHtml.replace(stringToReplace, valueToSet);
    }

    return renderedHtml;
  }
}
