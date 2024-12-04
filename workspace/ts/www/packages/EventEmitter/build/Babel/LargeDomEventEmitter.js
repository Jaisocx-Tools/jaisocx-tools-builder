"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LargeDomEventEmitter = void 0;
const EventEmitter_js_1 = require("./EventEmitter.js");
// This class is used with JSTree to keep browser working with ease, even with several tens of MBs JSON data file.
class LargeDomEventEmitter extends EventEmitter_js_1.EventEmitter {
  constructor() {
    super();
    this.eventsHandlersSetDom = {};
    this.mainHolderHtmlNode = null;
    this.EventArtDOMEventOptimized = "DOMEventOptimized";
  }
  setDebug(debug) {
    this.debug = debug;
    return this;
  }
  addDomEventListeners() {
    // here is just the right assignment of few dom event listeners.
    // Don't edit here, please!
    for (const eventName in this.eventsHandlersSetDom) {
      const eventHandlers = this.eventsHandlersSetDom[eventName];
      if (this.isObjectEmpty(eventHandlers)) {
        continue;
      }
      // here we add one dom event listener for each event, like click, contextmenu, dblcick and others, when any
      // @ts-ignore
      this.mainHolderHtmlNode.addEventListener(eventName, this.optimizedDomEventHandler.bind(this));
    }
    return this;
  }
  // this method just sets an event handler function by event name and a holder elem selector to an object,
  // and then all event handlers are executed on this.emitDomEvent method call.
  // The difference is, that we addEventListener once to the main html node,
  // and not to each html node, it is best, when the html tool is populated with a larger json data file of several tens or hundreds MBs, for example.
  addDomEventListener(eventName, selector, eventHandler) {
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
  emitDomEvent(eventName, payload) {
    const results = [];
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
        if (!eventHandler || typeof eventHandler !== "function") {
          continue;
        }
        const result = eventHandler.call(this, payload);
        results.push({
          eventArt: this.EventArtDOMEventOptimized,
          eventName,
          selector,
          payload,
          result
        });
        if (result && result.payloadReturned) {
          payload = result.payloadReturned;
        }
      }
    }
    return results;
  }
  optimizedDomEventHandler(event) {
    const eventTarget = event.target;
    if (eventTarget && eventTarget.nodeName === "A" && eventTarget.getAttribute("HREF") !== "javascript: void(0);") {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (this.isObjectEmpty(this.eventsHandlersSetDom)) {
      return;
    }
    const eventName = event.type;
    const eventHandlers = this.eventsHandlersSetDom[eventName];
    if (this.isObjectEmpty(eventHandlers)) {
      return;
    }
    if (this.debug === true) {
      console.log("optimized event handler");
    }
    this.emitDomEvent(eventName, {
      event
    });
  }
}
exports.LargeDomEventEmitter = LargeDomEventEmitter;