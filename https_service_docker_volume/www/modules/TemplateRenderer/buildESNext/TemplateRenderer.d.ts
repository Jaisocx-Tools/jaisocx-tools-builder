import { EventEmitter } from '@jaisocx/event-emitter';
export declare class TemplateRenderer extends EventEmitter {
    EVENT_NAME__AFTER_RENDER: string;
    data: Object;
    template: string;
    constructor();
    setDebug(debug: boolean): TemplateRenderer;
    setData(data: Object): TemplateRenderer;
    setTemplate(template: string): TemplateRenderer;
    render(): string;
    replaceTemplateRendererWithDataForRendering(template: string, dataForRendering: Object): string;
}
