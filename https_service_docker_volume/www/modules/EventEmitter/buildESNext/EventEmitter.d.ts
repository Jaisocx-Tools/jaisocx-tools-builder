import { EventEmitResult } from "./Types";
export declare class EventEmitter {
    eventsHandlersSetThisClass: any;
    debug: boolean;
    EventArtJSEvent: string;
    constructor();
    setDebug(toDebug: boolean): EventEmitter;
    isObjectEmpty(obj: object): boolean;
    addThisClassEventListener(eventName: string, eventHandler: CallableFunction): EventEmitter;
    emitEvent(eventName: string, payload: any): EventEmitResult[];
}
//# sourceMappingURL=EventEmitter.d.ts.map