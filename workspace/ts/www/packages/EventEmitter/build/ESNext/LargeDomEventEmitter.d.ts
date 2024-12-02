import { EventEmitter } from "./EventEmitter.js";
import { EventEmitResult } from "./Types.js";
export declare class LargeDomEventEmitter extends EventEmitter {
    eventsHandlersSetDom: any;
    mainHolderHtmlNode: HTMLElement | null;
    EventArtDOMEventOptimized: string;
    constructor();
    setDebug(debug: boolean): LargeDomEventEmitter;
    addDomEventListeners(): LargeDomEventEmitter;
    addDomEventListener(eventName: string, selector: string, eventHandler: CallableFunction): LargeDomEventEmitter;
    emitDomEvent(eventName: string, payload: any): EventEmitResult[];
    optimizedDomEventHandler(event: Event): void;
}
//# sourceMappingURL=LargeDomEventEmitter.d.ts.map