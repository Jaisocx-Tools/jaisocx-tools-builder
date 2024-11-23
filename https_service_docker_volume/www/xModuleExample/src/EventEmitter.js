export class EventEmitter {
    constructor() {
        this.eventsHandlersSetThisClass = {};
        this.debug = true;
        this.EventArtJSEvent = 'JSEvent';
    }
    setDebug(toDebug) {
        this.debug = toDebug;
        return this;
    }
    isObjectEmpty(obj) {
        // Check if the object is null or undefined
        if (obj === undefined || obj === null) {
            return true;
        }
        // Check if the object is an actual object and not another type
        if (typeof obj !== 'object') {
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
    addThisClassEventListener(eventName, eventHandler) {
        if (!this.eventsHandlersSetThisClass[eventName]) {
            this.eventsHandlersSetThisClass[eventName] = [];
        }
        this.eventsHandlersSetThisClass[eventName].push(eventHandler);
        return this;
    }
    // this.emitEvent method call You can place inside Your js code,
    // where You wish to provide the interface of optional adding a custom event listener in Your JS class.
    emitEvent(eventName, payload) {
        const results = [];
        if (this.debug) {
            console.log('event emitted', eventName);
        }
        if (this.isObjectEmpty(this.eventsHandlersSetThisClass)) {
            return results;
        }
        const eventHandlers = this.eventsHandlersSetThisClass[eventName];
        if (!eventHandlers || eventHandlers.length === 0) {
            if (this.debug) {
                console.log('no event handler for this event', eventName);
            }
            return results;
        }
        for (let eventHandler of eventHandlers) {
            if (this.debug) {
                console.log('got event handler', eventName);
            }
            if (!eventHandler || typeof eventHandler !== 'function') {
                if (this.debug) {
                    console.log('event handler is not a function', eventName, eventHandler);
                }
                continue;
            }
            if (this.debug) {
                console.log('calling event handler', eventName, eventHandler);
            }
            let result = eventHandler.call(this, payload);
            const thisClass = this;
            results.push((new class {
                constructor() {
                    this.eventArt = thisClass.EventArtJSEvent;
                    this.eventName = eventName;
                    this.selector = null;
                    this.payload = payload;
                    this.result = result;
                }
            }));
            if (result && result.payloadReturned) {
                // @ts-ignore
                payload = result.payloadReturned;
            }
        }
        return results;
    }
}
