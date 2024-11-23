import { EventEmitter } from "@jaisocx/event-emitter";
export declare class TemplateRenderer extends EventEmitter {
    EVENT_NAME__AFTER_RENDER: string;
    data: object;
    template: string;
    constructor();
    setDebug(debug: boolean): TemplateRenderer;
    setData(data: object): TemplateRenderer;
    setTemplate(template: string): TemplateRenderer;
    render(): string;
    replaceTemplateRendererWithDataForRendering(template: string, dataForRendering: object): string;
}
//# sourceMappingURL=TemplateRenderer.d.ts.map