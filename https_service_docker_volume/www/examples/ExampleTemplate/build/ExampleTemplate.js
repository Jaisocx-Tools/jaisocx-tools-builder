"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleTemplate = void 0;
const template_1 = require("@jaisocx/template");
class ExampleTemplate {
    constructor() {
        this.data = {
            "message": "Hello World!",
        };
        this.template = `
<h3>{{ message }}</h3>      
      `;
        this.Template = new template_1.Template();
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
exports.ExampleTemplate = ExampleTemplate;
