"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLedgerDevices = exports.isSupported = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.requestLedgerDevice = requestLedgerDevice;

var _devices = require("@ledgerhq/devices");

var ledgerDevices = [{ vendorId: _devices.ledgerUSBVendorId }];

function requestLedgerDevice() {
  return Promise.resolve().then(function () {
    return (
      // $FlowFixMe
      navigator.usb.requestDevice({ filters: ledgerDevices })
    );
  });
}

var isSupported = exports.isSupported = function isSupported() {
  return Promise.resolve((typeof navigator === "undefined" ? "undefined" : _typeof(navigator)) === "object" &&
  // $FlowFixMe
  _typeof(navigator.usb) === "object");
};

var getLedgerDevices = exports.getLedgerDevices = function getLedgerDevices() {
  return Promise.resolve().then(function () {
    return (
      // $FlowFixMe
      navigator.usb.getDevices()
    );
  }).then(function (devices) {
    return devices.filter(function (d) {
      return d.vendorId === _devices.ledgerUSBVendorId;
    });
  });
};
//# sourceMappingURL=webusb.js.map