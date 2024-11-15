import { EventEmitter, EventEmitResult, EventHandlerReturnValue } from '@jaisocx/event-emitter';


export class Template extends EventEmitter {
  EVENT_NAME__AFTER_RENDER: string;

  data: Object;
  template: string;
  
  constructor() {
      super();

      this.EVENT_NAME__AFTER_RENDER = 'afterRender';

      this.data = {};
      this.template = '';
  }

  setData(data: Object): Template {
      this.data = data;
      return this;
  }
  setTemplate(template: string): Template {
      this.template = template;
      return this;
  }

  render(): string {
      let renderedHtml = this.replaceTemplateWithDataForRendering (
          this.template,
          this.data
      );

      if (this.debug) {
          console.log('renderedHtml before afterRender event emitted', renderedHtml);
      }

      const eventResult: EventEmitResult[] = this.emitEvent (
          this.EVENT_NAME__AFTER_RENDER,
          {
              html: renderedHtml,
              data: this.data
          }
      );

      if (eventResult.length > 0) {
          const last: number = eventResult.length - 1;
          renderedHtml = eventResult[last].result.payloadReturned.html;

          if (this.debug) {
              console.log('renderedHtml before afterRender event emitted', eventResult, renderedHtml);
          }
      } else {
          if (this.debug) {
              console.log('afterRender event did not change html');
          }
      }

      return renderedHtml;
  }

  replaceTemplateWithDataForRendering(template: string, dataForRendering: Object): string {
      let renderedHtml = template;

      for (let placeholderName in dataForRendering) {
          
          const stringToReplace = `{{ ${placeholderName} }}`;
          
          // @ts-ignore
          let valueToSet = dataForRendering[placeholderName];
          if (!valueToSet) {
              valueToSet = '';
          }

          renderedHtml = renderedHtml.replace(stringToReplace, valueToSet);
      }

      return renderedHtml;
  }
}
