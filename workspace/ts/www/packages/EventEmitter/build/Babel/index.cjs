"use strict";

// src/EventEmitter/index.ts
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LargeDomEventEmitter = exports.EventEmitter = void 0;
var EventEmitter_js_1 = require("./EventEmitter.js");
Object.defineProperty(exports, "EventEmitter", {
  enumerable: true,
  get: function () {
    return EventEmitter_js_1.EventEmitter;
  }
});
var LargeDomEventEmitter_js_1 = require("./LargeDomEventEmitter.js");
Object.defineProperty(exports, "LargeDomEventEmitter", {
  enumerable: true,
  get: function () {
    return LargeDomEventEmitter_js_1.LargeDomEventEmitter;
  }
});