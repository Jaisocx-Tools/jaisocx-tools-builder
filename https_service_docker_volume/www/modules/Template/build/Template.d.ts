import { EventEmitter } from '@jaisocx/event-emitter';
export declare class Template extends EventEmitter {
    EVENT_NAME__AFTER_RENDER: string;
    data: Object;
    template: string;
    constructor();
    setData(data: Object): Template;
    setTemplate(template: string): Template;
    render(): string;
    replaceTemplateWithDataForRendering(template: string, dataForRendering: Object): string;
}
