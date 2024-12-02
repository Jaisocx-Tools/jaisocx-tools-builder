import { EventEmitter } from "./EventEmitter.js";
import { EventHandlerReturnValue, EventEmitResult } from "./Types.js";

// This class is used with JSTree to keep browser working with ease, even with several tens of MBs JSON data file.
export class LargeDomEventEmitter extends EventEmitter {
  eventsHandlersSetDom: any;

  mainHolderHtmlNode: HTMLElement|null;

  EventArtDOMEventOptimized: string;

  constructor() {
    super();

    this.eventsHandlersSetDom = {};
    this.mainHolderHtmlNode = null;

    this.EventArtDOMEventOptimized = "DOMEventOptimized";
  }

  setDebug(debug: boolean): LargeDomEventEmitter {
    this.debug = debug;
    return this;
  }

  addDomEventListeners(): LargeDomEventEmitter {
    // here is just the right assignment of few dom event listeners.
    // Don't edit here, please!
    for (const eventName in this.eventsHandlersSetDom) {
      const eventHandlers = this.eventsHandlersSetDom[eventName];
      if (this.isObjectEmpty(eventHandlers)) {
        continue;
      }

      // here we add one dom event listener for each event, like click, contextmenu, dblcick and others, when any
      // @ts-ignore
      this.mainHolderHtmlNode.addEventListener(
        eventName,
        this.optimizedDomEventHandler.bind(this)
      );
    }

    return this;
  }

  // this method just sets an event handler function by event name and a holder elem selector to an object,
  // and then all event handlers are executed on this.emitDomEvent method call.
  // The difference is, that we addEventListener once to the main html node,
  // and not to each html node, it is best, when the html tool is populated with a larger json data file of several tens or hundreds MBs, for example.
  addDomEventListener(
    eventName: string,
    selector: string,
    eventHandler: CallableFunction
  ): LargeDomEventEmitter {
    if (!this.eventsHandlersSetDom[eventName]) {
      this.eventsHandlersSetDom[eventName] = {};
    }

    if (!this.eventsHandlersSetDom[eventName][selector]) {
      this.eventsHandlersSetDom[eventName][selector] = [];
    }

    this.eventsHandlersSetDom[eventName][selector].push(eventHandler);

    return this;
  }

  // Don't edit here, please
  emitDomEvent(
    eventName: string,
    payload: any
  ): EventEmitResult[] {
    const results: EventEmitResult[] = [];

    const eventHandlersBySelectors = this.eventsHandlersSetDom[eventName];
    if (this.isObjectEmpty(eventHandlersBySelectors)) {
      return results;
    }

    for (const selector in eventHandlersBySelectors) {
      const eventHandlers = eventHandlersBySelectors[selector];
      if (!eventHandlers || eventHandlers.length === 0) {
        continue;
      }

      const eventTarget = payload.event.target.closest(selector);
      if (!eventTarget) {
        continue;
      }

      payload.eventTarget = eventTarget;

      for (const eventHandler of eventHandlers) {
        if (!eventHandler || (typeof eventHandler) !== "function") {
          continue;
        }

        const result: EventHandlerReturnValue|undefined = eventHandler.call(
          this,
          payload
        );
        results.push({
          eventArt: this.EventArtDOMEventOptimized,
          eventName,
          selector,
          payload,
          result,
        });
        if (result && result.payloadReturned) {
          payload = result.payloadReturned;
        }
      }
    }

    return results;
  }

  optimizedDomEventHandler(event: Event): void {
    const eventTarget: HTMLElement|null = event.target as HTMLElement;
    if (
      eventTarget
            && eventTarget.nodeName === "A"
            && eventTarget.getAttribute("HREF") !== "javascript: void(0);"
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (this.isObjectEmpty(this.eventsHandlersSetDom)) {
      return;
    }

    const eventName: string = event.type;
    const eventHandlers: any = this.eventsHandlersSetDom[eventName];
    if (this.isObjectEmpty(eventHandlers)) {
      return;
    }

    if (this.debug === true) {
      console.log("optimized event handler");
    }

    this.emitDomEvent(
      eventName,
      { event, }
    );
  }
}
