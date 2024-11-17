import { Template } from '@jaisocx/template';
export class ExampleTemplate {
    constructor() {
        this.data = {
            "message": "Hello World!",
        };
        this.template = `
<h3>{{ message }}</h3>      
      `;
        this.Template = new Template();
        this.holderHtmlNodeSelector = null;
    }
    init() {
        let holderHtmlNode = null;
        if (!this.holderHtmlNodeSelector) {
            this.holderHtmlNodeSelector = 'body';
        }
        holderHtmlNode = document.querySelector(this.holderHtmlNodeSelector);
        if (!holderHtmlNode) {
            return;
        }
        const html = this.Template
            .setTemplate(this.template)
            .setData(this.data)
            .render();
        holderHtmlNode.insertAdjacentHTML("afterbegin", html);
        return;
    }
}
