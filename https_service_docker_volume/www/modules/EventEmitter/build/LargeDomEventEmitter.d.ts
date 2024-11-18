import { EventEmitter } from "./EventEmitter";
import { EventEmitResult } from "./Types";
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
