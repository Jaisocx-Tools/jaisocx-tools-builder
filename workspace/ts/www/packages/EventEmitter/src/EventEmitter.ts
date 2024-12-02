import { EventHandlerReturnValue, EventEmitResult } from "./Types.js";

export class EventEmitter {
  eventsHandlersSetThisClass: any;

  debug: boolean;

  EventArtJSEvent: string;

  constructor() {
    this.eventsHandlersSetThisClass = {};
    this.debug = true;

    this.EventArtJSEvent = "JSEvent";
  }

  setDebug(toDebug: boolean): EventEmitter {
    this.debug = toDebug;
    return this;
  }

  isObjectEmpty(obj: object): boolean {
    // Check if the object is null or undefined
    if (obj === undefined || obj === null) {
      return true;
    }

    // Check if the object is an actual object and not another type
    if (typeof obj !== "object") {
      return false;
    }

    // Check if the object has any own properties
    if (Object.keys(obj).length === 0) {
      return true;
    }

    // If all checks pass, the object is not undefined, null, or empty
    return false;
  }

  // this method just sets an event handler function by event name to an object,
  // and then all event handlers are executed on this.emitEvent method call.
  // this.emitEvent method call You can place inside Your js code,
  // where You wish to provide the interface of optional adding a custom event listener in Your JS class.
  addThisClassEventListener(
    eventName: string,
    eventHandler: CallableFunction
  ): EventEmitter {
    if (!this.eventsHandlersSetThisClass[eventName]) {
      this.eventsHandlersSetThisClass[eventName] = [];
    }

    this.eventsHandlersSetThisClass[eventName].push(eventHandler);

    return this;
  }

  // this.emitEvent method call You can place inside Your js code,
  // where You wish to provide the interface of optional adding a custom event listener in Your JS class.
  emitEvent(
    eventName: string,
    payload: any
  ): EventEmitResult[] {
    const results: EventEmitResult[] = [];

    if (this.debug) {
      console.log(
        "event emitted",
        eventName
      );
    }

    if (this.isObjectEmpty(this.eventsHandlersSetThisClass)) {
      return results;
    }

    const eventHandlers = this.eventsHandlersSetThisClass[eventName];
    if (!eventHandlers || eventHandlers.length === 0) {
      if (this.debug) {
        console.log(
          "no event handler for this event",
          eventName
        );
      }

      return results;
    }

    for (const eventHandler of eventHandlers) {
      if (this.debug) {
        console.log(
          "got event handler",
          eventName
        );
      }

      if (!eventHandler || typeof eventHandler !== "function") {
        if (this.debug) {
          console.log(
            "event handler is not a function",
            eventName,
            eventHandler
          );
        }
        continue;
      }

      if (this.debug) {
        console.log(
          "calling event handler",
          eventName,
          eventHandler
        );
      }

      const result: any = eventHandler.call(
        this,
        payload
      );

      const thisClass: EventEmitter = this;
      results.push((new class implements EventEmitResult {
        eventArt: string = thisClass.EventArtJSEvent;

        eventName: string = eventName;

        selector: string|null = null;

        payload: any = payload;

        result: any = result;
      }()));

      if (result && result.payloadReturned) {
        // @ts-ignore

        payload = result.payloadReturned;
      }
    }

    return results;
  }
}
