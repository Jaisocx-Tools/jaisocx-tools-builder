class LargeDomEventEmitter extends EventEmitter {
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

      this.mainHolderHtmlNode.addEventListener(eventName, this.optimizedDomEventHandler.bind(this));
    }

    return this;
  }

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
                if (!eventHandler || (typeof eventHandler) !== "function") {
          continue;
        }

        const result = eventHandler.call(this, payload);
        results.push({
          eventArt: this.EventArtDOMEventOptimized, eventName, selector, payload, result,
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

    if (eventTarget
            && eventTarget.nodeName === "A"
            && eventTarget.getAttribute("HREF") !== "javascript: void(0);") {
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

    this.emitDomEvent(eventName, { event });
  }
}
