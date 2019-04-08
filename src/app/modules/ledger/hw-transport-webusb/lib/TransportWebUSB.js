"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _hwTransport = require("@ledgerhq/hw-transport");

var _hwTransport2 = _interopRequireDefault(_hwTransport);

var _hidFraming = require("@ledgerhq/devices/lib/hid-framing");

var _hidFraming2 = _interopRequireDefault(_hidFraming);

var _devices = require("@ledgerhq/devices");

var _errors = require("@ledgerhq/errors");

var _webusb = require("./webusb");

var regeneratorRuntime = require("@babel/runtime/regenerator");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var configurationValue = 1;
var interfaceNumber = 2;
var endpointNumber = 3;

/**
 * WebUSB Transport implementation
 * @example
 * import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
 * ...
 * TransportWebUSB.create().then(transport => ...)
 */

var TransportWebUSB = function (_Transport) {
  _inherits(TransportWebUSB, _Transport);

  function TransportWebUSB(device) {
    _classCallCheck(this, TransportWebUSB);

    var _this = _possibleConstructorReturn(this, (TransportWebUSB.__proto__ || Object.getPrototypeOf(TransportWebUSB)).call(this));

    _initialiseProps.call(_this);

    _this.device = device;
    return _this;
  }

  /**
   * Check if WebUSB transport is supported.
   */


  /**
   * List the WebUSB devices that was previously authorized.
   */


  /**
   * Actively listen to WebUSB devices and emit ONE device that was selected by the native permission UI.
   *
   * Important: it must be called in the context of a UI click!
   */


  _createClass(TransportWebUSB, [{
    key: "close",


    /**
     * Release the transport device
     */
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.exchangeBusyPromise;

              case 2:
                _context.next = 4;
                return this.device.releaseInterface(interfaceNumber);

              case 4:
                _context.next = 6;
                return this.device.reset();

              case 6:
                _context.next = 8;
                return this.device.close();

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function close() {
        return _ref.apply(this, arguments);
      }

      return close;
    }()

    /**
     * Exchange with the device using APDU protocol.
     * @param apdu
     * @returns a promise of apdu response
     */

  }, {
    key: "setScrambleKey",
    value: function setScrambleKey() {}
  }], [{
    key: "open",


    /**
     * Create a Ledger transport with a USBDevice
     */
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(device) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return device.open();

              case 2:
                if (!(device.configuration === null)) {
                  _context2.next = 5;
                  break;
                }

                _context2.next = 5;
                return device.selectConfiguration(configurationValue);

              case 5:
                _context2.next = 7;
                return device.reset();

              case 7:
                _context2.prev = 7;
                _context2.next = 10;
                return device.claimInterface(interfaceNumber);

              case 10:
                _context2.next = 17;
                break;

              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2["catch"](7);
                _context2.next = 16;
                return device.close();

              case 16:
                throw new _errors.TransportInterfaceNotAvailable(_context2.t0.message);

              case 17:
                return _context2.abrupt("return", new TransportWebUSB(device));

              case 18:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[7, 12]]);
      }));

      function open(_x) {
        return _ref2.apply(this, arguments);
      }

      return open;
    }()
  }]);

  return TransportWebUSB;
}(_hwTransport2.default);

TransportWebUSB.isSupported = _webusb.isSupported;
TransportWebUSB.list = _webusb.getLedgerDevices;

TransportWebUSB.listen = function (observer) {
  var unsubscribed = false;
  (0, _webusb.requestLedgerDevice)().then(function (device) {
    if (!unsubscribed) {
      var deviceModel = (0, _devices.identifyUSBProductId)(device.productId);
      observer.next({ type: "add", descriptor: device, deviceModel: deviceModel });
      observer.complete();
    }
  }, function (error) {
    observer.error(new _errors.TransportOpenUserCancelled(error.message));
  });
  function unsubscribe() {
    unsubscribed = true;
  }
  return { unsubscribe: unsubscribe };
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.channel = Math.floor(Math.random() * 0xffff);
  this.packetSize = 64;

  this.exchange = function (apdu) {
    return _this2.exchangeAtomicImpl(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var debug, channel, packetSize, framing, blocks, i, result, acc, r;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              debug = _this2.debug, channel = _this2.channel, packetSize = _this2.packetSize;

              if (debug) {
                debug("=>" + apdu.toString("hex"));
              }

              framing = (0, _hidFraming2.default)(channel, packetSize);

              // Write...

              blocks = framing.makeBlocks(apdu);
              i = 0;

            case 5:
              if (!(i < blocks.length)) {
                _context3.next = 11;
                break;
              }

              _context3.next = 8;
              return _this2.device.transferOut(endpointNumber, blocks[i]);

            case 8:
              i++;
              _context3.next = 5;
              break;

            case 11:

              // Read...
              result = void 0;
              acc = void 0;

            case 13:
              if (result = framing.getReducedResult(acc)) {
                _context3.next = 20;
                break;
              }

              _context3.next = 16;
              return _this2.device.transferIn(endpointNumber, packetSize);

            case 16:
              r = _context3.sent;

              acc = framing.reduceResponse(acc, Buffer.from(r.data.buffer));
              _context3.next = 13;
              break;

            case 20:

              if (debug) {
                debug("<=" + result.toString("hex"));
              }
              return _context3.abrupt("return", result);

            case 22:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, _this2);
    })));
  };
};

exports.default = TransportWebUSB;
//# sourceMappingURL=TransportWebUSB.js.map