import { TemplateRenderer } from '@jaisocx/template-renderer';


export class ExampleTemplateRenderer {
  TemplateRenderer: TemplateRenderer;
  holderHtmlNodeSelector: string|null;
  data: Object;
  template: string;
  
  constructor() {
      this.data = {
        "message": "Hello World!",
      };
      this.template = `
<h3>{{ message }}</h3>      
      `;

      this.TemplateRenderer = new TemplateRenderer();
      this.holderHtmlNodeSelector = null;
  }

  init(): void {
    let holderHtmlNode: HTMLElement|null = null;
    if (!this.holderHtmlNodeSelector) {
        this.holderHtmlNodeSelector = 'body';
    }
    holderHtmlNode = document.querySelector(this.holderHtmlNodeSelector);
    if (!holderHtmlNode) {
        return;
    }

    const html = this.TemplateRenderer
        .setTemplate(this.template)
        .setData(this.data)
        .render();
    holderHtmlNode.insertAdjacentHTML("afterbegin", html);
    
    return;
  }
}
