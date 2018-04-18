(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function transition(el, obj, duration, easing) {
  return new Promise(function(resolve, reject) {
    if (obj.transform) {
      obj['-webkit-transform'] = obj.transform;
    }

    var objKeys = Object.keys(obj);

    if (duration) {
      el.style.transitionProperty = objKeys.join();
      if (easing) el.style.transitionTimingFunction = easing;
      el.style.transitionDuration = duration + 's';
      el.offsetLeft; // style recalc

      el.addEventListener('transitionend', function te() {
        el.style.transitionProperty = '';
        el.style.transitionTimingFunction = '';
        el.style.transitionDuration = '';
        resolve();
        el.removeEventListener('transitionend', te);
      });
    }
    else {
      resolve();
    }

    objKeys.forEach(function(key) {
      el.style.setProperty(key, obj[key]);
    });
  });
};

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _mdlTextfield = require('./mdl/textfield');

var _mdlTextfield2 = _interopRequireDefault(_mdlTextfield);

var _simpleTransition = require('simple-transition');

var _simpleTransition2 = _interopRequireDefault(_simpleTransition);

var _viewsSpinner = require('./views/spinner');

var _viewsSpinner2 = _interopRequireDefault(_viewsSpinner);

var _tests = require('./tests');

var _tests2 = _interopRequireDefault(_tests);

var TestController = (function () {
  function TestController(container) {
    var _this = this;

    _classCallCheck(this, TestController);

    this._memeContainer = container.querySelector('.meme-container');
    this._memeImgContainer = container.querySelector('.meme-img-container');
    this._feedbackText = container.querySelector('.feedback-text');
    this._form = container.querySelector('.test-form');
    this._currentMemeImg = null;
    this._spinner = new _viewsSpinner2['default']();

    this._memeContainer.appendChild(this._spinner.container);

    new _mdlTextfield2['default'](container.querySelector('.mdl-js-textfield'));
    this._form.addEventListener('submit', function (e) {
      return _this._onSubmit(e);
    });
    this._form.testId.addEventListener('input', function (e) {
      return _this._onInput(e);
    });
  }

  _createClass(TestController, [{
    key: '_onInput',
    value: function _onInput(event) {
      if (!this._form.testId.value.trim()) {
        this._removeCurrentFeedback();
      }
    }
  }, {
    key: '_onSubmit',
    value: function _onSubmit(event) {
      var _this2 = this;

      event.preventDefault();
      var val = this._form.testId.value.trim().toLowerCase();
      this._form.testId.blur();

      this._removeCurrentFeedback();
      (0, _simpleTransition2['default'])(this._memeContainer, { opacity: 1 }, 0.3);
      this._spinner.show(800);

      if (!_tests2['default'][val]) {
        this._displayFeedback("Didn't recognise that test ID", 'mistake.gif', false);
        return;
      }

      _tests2['default'][val]().then(function (args) {
        _this2._displayFeedback.apply(_this2, _toConsumableArray(args));
      })['catch'](function (err) {
        _this2._displayFeedback("Oh dear, something went really wrong", 'mistake.gif', false);
        throw err;
      });
    }
  }, {
    key: '_removeCurrentFeedback',
    value: function _removeCurrentFeedback() {
      this._feedbackText.textContent = '';
      this._memeContainer.style.opacity = '';
      this._spinner.hide();

      if (this._currentMemeImg) {
        URL.revokeObjectURL(this._currentMemeImg.href);
        this._memeImgContainer.removeChild(this._currentMemeImg);
        this._currentMemeImg = undefined;
      }
    }
  }, {
    key: '_displayFeedback',
    value: function _displayFeedback(text, url, winning) {
      var _this3 = this;

      this._feedbackText.textContent = text;
      this._spinner.hide();

      if (winning) {
        this._feedbackText.classList.remove('fail');
      } else {
        this._feedbackText.classList.add('fail');
      }

      return fetch('/imgs/test-memes/' + url).then(function (r) {
        return r.blob();
      }).then(function (blob) {
        _this3._currentMemeImg = new Image();
        // hahaha, yes, I know
        _this3._currentMemeImg.src = URL.createObjectURL(blob.slice(1));
        _this3._memeImgContainer.appendChild(_this3._currentMemeImg);
      });
    }
  }]);

  return TestController;
})();

exports['default'] = TestController;
module.exports = exports['default'];

},{"./mdl/textfield":4,"./tests":6,"./views/spinner":7,"simple-transition":1}],3:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _TestController = require('./TestController');

var _TestController2 = _interopRequireDefault(_TestController);

var settingsForm = document.querySelector('.settings-form');

settingsForm.addEventListener('change', function () {
  fetch(settingsForm.action, {
    method: settingsForm.method,
    body: new FormData(settingsForm)
  });
});

if (!self.fetch) {
  document.querySelector('.warning').style.display = 'block';
}

new _TestController2['default'](document.querySelector('.tester'));

},{"./TestController":2}],4:[function(require,module,exports){
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * Class constructor for Textfield MDL component.
 * Implements MDL component design pattern defined at:
 * https://github.com/jasonmayes/mdl-component-design-pattern
 *
 * @constructor
 * @param {HTMLElement} element The element that will be upgraded.
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = MaterialTextfield;

function MaterialTextfield(element) {
  this.element_ = element;
  this.maxRows = this.Constant_.NO_MAX_ROWS;
  // Initialize instance.
  this.init();
}

/**
 * Store constants in one place so they can be updated easily.
 *
 * @enum {string | number}
 * @private
 */
MaterialTextfield.prototype.Constant_ = {
  NO_MAX_ROWS: -1,
  MAX_ROWS_ATTRIBUTE: 'maxrows'
};

/**
 * Store strings for class names defined by this component that are used in
 * JavaScript. This allows us to simply change it in one place should we
 * decide to modify at a later date.
 *
 * @enum {string}
 * @private
 */
MaterialTextfield.prototype.CssClasses_ = {
  LABEL: 'mdl-textfield__label',
  INPUT: 'mdl-textfield__input',
  IS_DIRTY: 'is-dirty',
  IS_FOCUSED: 'is-focused',
  IS_DISABLED: 'is-disabled',
  IS_INVALID: 'is-invalid',
  IS_UPGRADED: 'is-upgraded'
};

/**
 * Handle input being entered.
 *
 * @param {Event} event The event that fired.
 * @private
 */
MaterialTextfield.prototype.onKeyDown_ = function (event) {
  var currentRowCount = event.target.value.split('\n').length;
  if (event.keyCode === 13) {
    if (currentRowCount >= this.maxRows) {
      event.preventDefault();
    }
  }
};

/**
 * Handle focus.
 *
 * @param {Event} event The event that fired.
 * @private
 */
MaterialTextfield.prototype.onFocus_ = function (event) {
  this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
};

/**
 * Handle lost focus.
 *
 * @param {Event} event The event that fired.
 * @private
 */
MaterialTextfield.prototype.onBlur_ = function (event) {
  this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
};

/**
 * Handle reset event from out side.
 *
 * @param {Event} event The event that fired.
 * @private
 */
MaterialTextfield.prototype.onReset_ = function (event) {
  this.updateClasses_();
};

/**
 * Handle class updates.
 *
 * @private
 */
MaterialTextfield.prototype.updateClasses_ = function () {
  this.checkDisabled();
  this.checkValidity();
  this.checkDirty();
};

// Public methods.

/**
 * Check the disabled state and update field accordingly.
 *
 * @public
 */
MaterialTextfield.prototype.checkDisabled = function () {
  if (this.input_.disabled) {
    this.element_.classList.add(this.CssClasses_.IS_DISABLED);
  } else {
    this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
  }
};
MaterialTextfield.prototype['checkDisabled'] = MaterialTextfield.prototype.checkDisabled;

/**
 * Check the validity state and update field accordingly.
 *
 * @public
 */
MaterialTextfield.prototype.checkValidity = function () {
  if (this.input_.validity) {
    if (this.input_.validity.valid) {
      this.element_.classList.remove(this.CssClasses_.IS_INVALID);
    } else {
      this.element_.classList.add(this.CssClasses_.IS_INVALID);
    }
  }
};
MaterialTextfield.prototype['checkValidity'] = MaterialTextfield.prototype.checkValidity;

/**
 * Check the dirty state and update field accordingly.
 *
 * @public
 */
MaterialTextfield.prototype.checkDirty = function () {
  if (this.input_.value && this.input_.value.length > 0) {
    this.element_.classList.add(this.CssClasses_.IS_DIRTY);
  } else {
    this.element_.classList.remove(this.CssClasses_.IS_DIRTY);
  }
};
MaterialTextfield.prototype['checkDirty'] = MaterialTextfield.prototype.checkDirty;

/**
 * Disable text field.
 *
 * @public
 */
MaterialTextfield.prototype.disable = function () {
  this.input_.disabled = true;
  this.updateClasses_();
};
MaterialTextfield.prototype['disable'] = MaterialTextfield.prototype.disable;

/**
 * Enable text field.
 *
 * @public
 */
MaterialTextfield.prototype.enable = function () {
  this.input_.disabled = false;
  this.updateClasses_();
};
MaterialTextfield.prototype['enable'] = MaterialTextfield.prototype.enable;

/**
 * Update text field value.
 *
 * @param {string} value The value to which to set the control (optional).
 * @public
 */
MaterialTextfield.prototype.change = function (value) {

  if (value) {
    this.input_.value = value;
  } else {
    this.input_.value = '';
  }
  this.updateClasses_();
};
MaterialTextfield.prototype['change'] = MaterialTextfield.prototype.change;

/**
 * Initialize element.
 */
MaterialTextfield.prototype.init = function () {

  if (this.element_) {
    this.label_ = this.element_.querySelector('.' + this.CssClasses_.LABEL);
    this.input_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);

    if (this.input_) {
      if (this.input_.hasAttribute(
      /** @type {string} */this.Constant_.MAX_ROWS_ATTRIBUTE)) {
        this.maxRows = parseInt(this.input_.getAttribute(
        /** @type {string} */this.Constant_.MAX_ROWS_ATTRIBUTE), 10);
        if (isNaN(this.maxRows)) {
          this.maxRows = this.Constant_.NO_MAX_ROWS;
        }
      }

      this.boundUpdateClassesHandler = this.updateClasses_.bind(this);
      this.boundFocusHandler = this.onFocus_.bind(this);
      this.boundBlurHandler = this.onBlur_.bind(this);
      this.boundResetHandler = this.onReset_.bind(this);
      this.input_.addEventListener('input', this.boundUpdateClassesHandler);
      this.input_.addEventListener('focus', this.boundFocusHandler);
      this.input_.addEventListener('blur', this.boundBlurHandler);
      this.input_.addEventListener('reset', this.boundResetHandler);

      if (this.maxRows !== this.Constant_.NO_MAX_ROWS) {
        // TODO: This should handle pasting multi line text.
        // Currently doesn't.
        this.boundKeyDownHandler = this.onKeyDown_.bind(this);
        this.input_.addEventListener('keydown', this.boundKeyDownHandler);
      }

      this.updateClasses_();
      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  }
};

/**
 * Downgrade the component
 *
 * @private
 */
MaterialTextfield.prototype.mdlDowngrade_ = function () {
  this.input_.removeEventListener('input', this.boundUpdateClassesHandler);
  this.input_.removeEventListener('focus', this.boundFocusHandler);
  this.input_.removeEventListener('blur', this.boundBlurHandler);
  this.input_.removeEventListener('reset', this.boundResetHandler);
  if (this.boundKeyDownHandler) {
    this.input_.removeEventListener('keydown', this.boundKeyDownHandler);
  }
};
module.exports = exports['default'];

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var WindowMessenger = (function () {
  function WindowMessenger(url) {
    var _this = this;

    _classCallCheck(this, WindowMessenger);

    this._requestId = 0;

    this._iframe = document.createElement('iframe');
    this._iframe.className = 'hidden-tester';
    this._ready = new Promise(function (resolve, reject) {
      var listener = function listener(e) {
        resolve();
        _this._iframe.removeEventListener('load', listener);
        _this._iframe.removeEventListener('error', errorListener);
      };
      var errorListener = function errorListener(e) {
        reject(Error("Iframe load failed"));
        _this._iframe.removeEventListener('load', listener);
        _this._iframe.removeEventListener('error', errorListener);
      };
      _this._iframe.addEventListener('load', listener);
      _this._iframe.addEventListener('error', errorListener);
      _this._iframe.src = url;
    });
    document.body.appendChild(this._iframe);

    this._targetOrigin = new URL(url).origin;

    this._windowListener = function (event) {
      return _this._onMessage(event);
    };
    self.addEventListener('message', this._windowListener);

    // message jobs awaiting response {callId: [resolve, reject]}
    this._pending = {};
  }

  _createClass(WindowMessenger, [{
    key: 'destruct',
    value: function destruct() {
      document.body.removeChild(this._iframe);
      self.removeEventListener('message', this._windowListener);
    }
  }, {
    key: '_onMessage',
    value: function _onMessage(event) {
      if (event.origin != this._targetOrigin) return;

      if (!event.data.id) {
        console.log("Unexpected message", event);
        return;
      }

      var resolver = this._pending[event.data.id];

      if (!resolver) {
        console.log("No resolver for", event);
        return;
      }

      delete this._pending[event.data.id];

      if (event.data.error) {
        resolver[1](new Error(event.data.error));
        return;
      }

      resolver[0](event.data.result);
    }
  }, {
    key: 'message',
    value: function message(_message) {
      var _this2 = this;

      return this._ready.then(function (_) {
        var requestId = ++_this2._requestId;
        _message.id = requestId;

        return new Promise(function (resolve, reject) {
          _this2._pending[requestId] = [resolve, reject];
          _this2._iframe.contentWindow.postMessage(_message, _this2._targetOrigin);
        });
      });
    }
  }]);

  return WindowMessenger;
})();

exports['default'] = WindowMessenger;
module.exports = exports['default'];

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lieFi$registered$swWaiting$swActive$htmlResponse$gifResponse$gif404$installCached$cacheServed$newCacheReady$newCacheUsed$updateNotify$updateReload$serveSkeleton$idbAnimal$idbAge$idbStore$idbShow$idbClean$cachePhotos$cacheClean$cacheAvatars;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _WindowMessenger = require('./WindowMessenger');

var _WindowMessenger2 = _interopRequireDefault(_WindowMessenger);

var appOrigin = new URL(location.href);
appOrigin.port = self.config.appPort;
var executorUrl = new URL('/remote?bypass-sw', appOrigin);

function remoteEval(js) {
  var messenger = new _WindowMessenger2['default'](executorUrl);
  var error = undefined;

  if (typeof js === 'function') {
    js = '(' + js.toString() + ')()';
  }

  return figureOutConnectionType().then(function (type) {
    if (type === 'offline') return ["Looks like the server is offline", 'sad.gif', false];

    return messenger.message({
      eval: js
    })['catch'](function (err) {
      error = err;
    }).then(function (val) {
      messenger.destruct();
      if (error) throw error;
      return val;
    });
  });
}

function figureOutConnectionType() {
  var start = performance.now();

  return Promise.race([fetch(new URL('/ping', appOrigin)), new Promise(function (r) {
    return setTimeout(r, 4000);
  })]).then(function (_) {
    var duration = performance.now() - start;

    if (duration < 3000) {
      return 'perfect';
    }
    if (duration < 3500) {
      return 'slow';
    }
    return 'lie-fi';
  }, function (_) {
    return 'offline';
  });
}

exports['default'] = (_lieFi$registered$swWaiting$swActive$htmlResponse$gifResponse$gif404$installCached$cacheServed$newCacheReady$newCacheUsed$updateNotify$updateReload$serveSkeleton$idbAnimal$idbAge$idbStore$idbShow$idbClean$cachePhotos$cacheClean$cacheAvatars = {
  demo: function demo() {
    return Promise.resolve(["Yep, the demo's working!", 'demo.gif', true]);
  },
  offline: function offline() {
    return figureOutConnectionType().then(function (type) {
      if (type == 'offline') {
        return ["Yep! The server is totally dead!", '1.gif', true];
      }
      return ["Hmm, no, looks like the server is still up", 'nope.gif', false];
    });
  }
}, _defineProperty(_lieFi$registered$swWaiting$swActive$htmlResponse$gifResponse$gif404$installCached$cacheServed$newCacheReady$newCacheUsed$updateNotify$updateReload$serveSkeleton$idbAnimal$idbAge$idbStore$idbShow$idbClean$cachePhotos$cacheClean$cacheAvatars, 'lie-fi', function lieFi() {
  return figureOutConnectionType().then(function (type) {
    switch (type) {
      case "lie-fi":
        return ["Yeeeep, that's lie-fi alright.", '2.gif', true];
      case "offline":
        return ["Hmm, no, looks like the server is down.", 'nope.gif', false];
      default:
        return ["The server responded way too fast for lie-fi.", 'not-quite.gif', false];
    }
  });
}), _defineProperty(_lieFi$registered$swWaiting$swActive$htmlResponse$gifResponse$gif404$installCached$cacheServed$newCacheReady$newCacheUsed$updateNotify$updateReload$serveSkeleton$idbAnimal$idbAge$idbStore$idbShow$idbClean$cachePhotos$cacheClean$cacheAvatars, 'registered', function registered() {
  return remoteEval(function () {
    if (navigator.serviceWorker.controller) return ["Service worker successfully registered!", '3.gif', true];
    return ["Doesn't look like there's a service worker registered :(", 'nope.gif', false];
  });
}), _defineProperty(_lieFi$registered$swWaiting$swActive$htmlResponse$gifResponse$gif404$installCached$cacheServed$newCacheReady$newCacheUsed$updateNotify$updateReload$serveSkeleton$idbAnimal$idbAge$idbStore$idbShow$idbClean$cachePhotos$cacheClean$cacheAvatars, 'sw-waiting', function swWaiting() {
  return remoteEval(function () {
    return navigator.serviceWorker.getRegistration('/').then(function (reg) {
      if (!reg) return ["Doesn't look like there's a service worker registered at all!", 'sad.gif', false];
      if (!reg.waiting) return ["There's no service worker waiting", 'nope.gif', false];
      return ["Yey! There's a service worker waiting!", "4.gif", true];
    });
  });
}), _defineProperty(_lieFi$registered$swWaiting$swActive$htmlResponse$gifResponse$gif404$installCached$cacheServed$newCacheReady$newCacheUsed$updateNotify$updateReload$serveSkeleton$idbAnimal$idbAge$idbStore$idbShow$idbClean$cachePhotos$cacheClean$cacheAvatars, 'sw-active', function swActive() {
  return remoteEval(function () {
    return navigator.serviceWorker.getRegistration('/').then(function (reg) {
      if (!reg) return ["Doesn't look like there's a service worker registered at all!", 'sad.gif', false];
      if (reg.waiting) return ["There's still a service worker waiting", 'nope.gif', false];
      return ["No service worker waiting! Yay!", "5.gif", true];
    });
  });
}), _defineProperty(_lieFi$registered$swWaiting$swActive$htmlResponse$gifResponse$gif404$installCached$cacheServed$newCacheReady$newCacheUsed$updateNotify$updateReload$serveSkeleton$idbAnimal$idbAge$idbStore$idbShow$idbClean$cachePhotos$cacheClean$cacheAvatars, 'html-response', function htmlResponse() {
  return remoteEval(function () {
    return fetch('/').then(function (response) {
      var type = response.headers.get('content-type');

      if (!type || type.toLowerCase() != 'text/html' && !type.toLowerCase().startsWith('text/html')) {
        return ["The response doesn't have the 'Content-Type: text/html' header", 'nope.gif', false];
      }

      return response.text().then(function (text) {
        return new DOMParser().parseFromString(text, 'text/html');
      }).then(function (doc) {
        if (doc.body.querySelector('.a-winner-is-me')) {
          return ["Custom HTML response found! Yay!", "6.gif", true];
        }
        return ["Can't find an element with class 'a-winner-is-me'", 'nope.gif', false];
      });
    });
  });
}), _defineProperty(_lieFi$registered$swWaiting$swActive$htmlResponse$gifResponse$gif404$installCached$cacheServed$newCacheReady$newCacheUsed$updateNotify$updateReload$serveSkeleton$idbAnimal$idbAge$idbStore$idbShow$idbClean$cachePhotos$cacheClean$cacheAvatars, 'gif-response', function gifResponse() {
  return remoteEval(function () {
    return fetch('/').then(function (response) {
      var type = response.headers.get('content-type');

      if (!type || !type.toLowerCase().startsWith('text/html')) {
        return ["Looks like it isn't just URLs ending with .jpg that are being intercepted", 'not-quite.gif', false];
      }

      return fetch('/blah.jpg').then(function (response) {
        var type = response.headers.get('content-type');

        if (!type || !type.toLowerCase().startsWith('image/gif')) {
          return ["Doesn't look like urls ending .jpg are getting a gif in response", 'no-cry.gif', false];
        }

        return ["Images are being intercepted!", "7.gif", true];
      });
    });
  });
}), _defineProperty(_lieFi$registered$swWaiting$swActive$htmlResponse$gifResponse$gif404$installCached$cacheServed$newCacheReady$newCacheUsed$updateNotify$updateReload$serveSkeleton$idbAnimal$idbAge$idbStore$idbShow$idbClean$cachePhotos$cacheClean$cacheAvatars, 'gif-404', function gif404() {
  return remoteEval(function () {
    return Promise.all([fetch('/'), fetch('/imgs/dr-evil.gif?bypass-sw'), fetch('/' + Math.random())]).then(function (responses) {
      var pageType = responses[0].headers.get('content-type');

      if (!pageType || !pageType.toLowerCase().startsWith('text/html')) {
        return ["Looks like non-404 pages are getting the gif too", 'not-quite.gif', false];
      }

      var type = responses[2].headers.get('content-type');

      if (!type || !type.toLowerCase().startsWith('image/gif')) {
        return ["Doesn't look like 404 responses are getting a gif in return", 'nope.gif', false];
      }

      return Promise.all(responses.slice(1).map(function (r) {
        return r.arrayBuffer().then(function (b) {
          return new Uint8Array(b);
        });
      })).then(function (arrays) {
        var itemsToCheck = 2000;
        var a1 = arrays[0];
        var a2 = arrays[1];

        for (var i = 0; i < itemsToCheck; i++) {
          if (a1[i] !== a2[i]) {
            return ["Doesn't look like 404 responses are getting the dr-evil gif in return", 'not-quite.gif', false];
          }
        }
        return ["Yay! 404 pages get gifs!", "8.gif", true];
      });
    });
  });
}), _defineProperty(_lieFi$registered$swWaiting$swActive$htmlResponse$gifResponse$gif404$installCached$cacheServed$newCacheReady$newCacheUsed$updateNotify$updateReload$serveSkeleton$idbAnimal$idbAge$idbStore$idbShow$idbClean$cachePhotos$cacheClean$cacheAvatars, 'install-cached', function installCached() {
  return remoteEval(function () {
    var expectedUrls = ['/', '/js/main.js', '/css/main.css', '/imgs/icon.png', 'https://fonts.gstatic.com/s/roboto/v15/2UX7WLTfW3W8TclTUvlFyQ.woff', 'https://fonts.gstatic.com/s/roboto/v15/d-6IYplOFocCacKzxwXSOD8E0i7KZn-EPnyo3HZu7kw.woff'].map(function (url) {
      return new URL(url, location).href;
    });

    return caches.has('wittr-static-v1').then(function (has) {
      if (!has) return ["Can't find a cache named wittr-static-v1", 'nope.gif', false];

      return caches.open('wittr-static-v1').then(function (c) {
        return c.keys();
      }).then(function (reqs) {
        var urls = reqs.map(function (r) {
          return r.url;
        });
        var allAccountedFor = expectedUrls.every(function (url) {
          return urls.includes(url);
        });

        if (allAccountedFor) {
          return ["Yay! The cache is ready to go!", "9.gif", true];
        }
        return ["The cache is there, but it's missing some things", 'not-quite.gif', false];
      });
    });
  });
}), _defineProperty(_lieFi$registered$swWaiting$swActive$htmlResponse$gifResponse$gif404$installCached$cacheServed$newCacheReady$newCacheUsed$updateNotify$updateReload$serveSkeleton$idbAnimal$idbAge$idbStore$idbShow$idbClean$cachePhotos$cacheClean$cacheAvatars, 'cache-served', function cacheServed() {
  return remoteEval(function () {
    return Promise.all([fetch('/'), fetch('/ping').then(function (r) {
      return r.json();
    })['catch'](function (e) {
      return { ok: false };
    })]).then(function (responses) {
      var cachedResponse = responses[0];
      var jsonResponse = responses[1];

      if (!jsonResponse.ok) return ["Doesn't look like non-cached requests are getting through", 'not-quite.gif', false];

      return new Promise(function (r) {
        return setTimeout(r, 2000);
      }).then(function (_) {
        return fetch('/');
      }).then(function (response) {
        if (cachedResponse.headers.get('Date') === response.headers.get('Date')) {
          return ["Yay! Cached responses are being returned!", "10.gif", true];
        }
        return ["Doesn't look like responses are returned from the cache", 'nope.gif', false];
      });
    });
  });
}), _defineProperty(_lieFi$registered$swWaiting$swActive$htmlResponse$gifResponse$gif404$installCached$cacheServed$newCacheReady$newCacheUsed$updateNotify$updateReload$serveSkeleton$idbAnimal$idbAge$idbStore$idbShow$idbClean$cachePhotos$cacheClean$cacheAvatars, 'new-cache-ready', function newCacheReady() {
  return remoteEval(function () {
    return Promise.all([caches.has('wittr-static-v1'), caches.has('wittr-static-v2')]).then(function (hasCaches) {
      if (!hasCaches[0]) return ["Looks like the v1 cache has already gone", 'sad.gif', false];
      if (!hasCaches[1]) return ["Can't find the wittr-static-v2 cache", 'sad.gif', false];

      return Promise.all(['wittr-static-v1', 'wittr-static-v2'].map(function (name) {
        return caches.open(name).then(function (c) {
          return c.match('/css/main.css');
        }).then(function (r) {
          return r && r.text();
        });
      })).then(function (cssTexts) {
        if (!cssTexts[0]) return ["Can't find CSS in the v1 cache", 'sad.gif', false];
        if (!cssTexts[1]) return ["Can't find CSS in the v2 cache", 'sad.gif', false];

        if (cssTexts[0] === cssTexts[1]) {
          return ["There's a new cache, but the CSS looks the same", 'nope.gif', false];
        }
        return ["Yay! The new cache is ready, but isn't disrupting current pages", "11.gif", true];
      });
    });
  });
}), _defineProperty(_lieFi$registered$swWaiting$swActive$htmlResponse$gifResponse$gif404$installCached$cacheServed$newCacheReady$newCacheUsed$updateNotify$updateReload$serveSkeleton$idbAnimal$idbAge$idbStore$idbShow$idbClean$cachePhotos$cacheClean$cacheAvatars, 'new-cache-used', function newCacheUsed() {
  return remoteEval(function () {
    return Promise.all([caches.has('wittr-static-v1'), caches.has('wittr-static-v2')]).then(function (hasCaches) {
      if (hasCaches[0]) return ["Looks like the v1 cache is still there", 'not-quite.gif', false];
      if (!hasCaches[1]) return ["Can't find the wittr-static-v2 cache", 'sad.gif', false];

      return Promise.all([fetch('/css/main.css'), new Promise(function (r) {
        return setTimeout(r, 2000);
      }).then(function (_) {
        return fetch('/css/main.css');
      })]).then(function (responses) {
        if (responses[0].headers.get('Date') != responses[1].headers.get('Date')) {
          return ["Doesn't look like the CSS is being served from the cache", 'mistake.gif', false];
        }

        return openIframe('/').then(function (iframe) {
          var win = iframe.contentWindow;
          var doc = win.document;
          var bg = win.getComputedStyle(doc.querySelector('.toolbar')).backgroundColor;

          if (bg == 'rgb(63, 81, 181)') {
            return ["Doesn't look like the header color has changed", 'no-cry.gif', false];
          }
          return ["Yay! You safely updated the CSS!", "12.gif", true];
        });
      });
    });
  });
}), _defineProperty(_lieFi$registered$swWaiting$swActive$htmlResponse$gifResponse$gif404$installCached$cacheServed$newCacheReady$newCacheUsed$updateNotify$updateReload$serveSkeleton$idbAnimal$idbAge$idbStore$idbShow$idbClean$cachePhotos$cacheClean$cacheAvatars, 'update-notify', function updateNotify() {
  return remoteEval(function () {
    return navigator.serviceWorker.getRegistration().then(function (reg) {
      if (!reg.waiting) return ["Doesn't look like there's a waiting worker", 'nope.gif', false];

      return openIframe('/').then(function (iframe) {
        var win = iframe.contentWindow;
        var doc = win.document;

        return new Promise(function (r) {
          return setTimeout(r, 500);
        }).then(function (_) {
          if (doc.querySelector('.toast')) {
            return ["Yay! There are notifications!", "13.gif", true];
          }
          return ["Doesn't look like there's a notification being triggered", 'sad.gif', false];
        });
      });
    });
  });
}), _defineProperty(_lieFi$registered$swWaiting$swActive$htmlResponse$gifResponse$gif404$installCached$cacheServed$newCacheReady$newCacheUsed$updateNotify$updateReload$serveSkeleton$idbAnimal$idbAge$idbStore$idbShow$idbClean$cachePhotos$cacheClean$cacheAvatars, 'update-reload', function updateReload() {
  return remoteEval(function () {
    return navigator.serviceWorker.getRegistration().then(function (reg) {
      if (!reg.waiting) return ["Doesn't look like there's a waiting worker", 'nope.gif', false];

      return openIframe('/').then(function (iframe) {
        var win = iframe.contentWindow;
        var doc = win.document;

        return new Promise(function (resolve) {
          setTimeout(function (_) {
            return resolve(["Didn't detect the page being reloaded :(", 'sad.gif', false]);
          }, 8000);
          iframe.addEventListener('load', function (_) {
            resolve(["Yay! The page reloaded!", "14.gif", true]);
          });
        });
      });
    });
  });
}), _defineProperty(_lieFi$registered$swWaiting$swActive$htmlResponse$gifResponse$gif404$installCached$cacheServed$newCacheReady$newCacheUsed$updateNotify$updateReload$serveSkeleton$idbAnimal$idbAge$idbStore$idbShow$idbClean$cachePhotos$cacheClean$cacheAvatars, 'serve-skeleton', function serveSkeleton() {
  return remoteEval(function () {
    return fetch('/').then(function (r) {
      return r.text();
    }).then(function (text) {
      if (text.includes('post-content')) {
        return ["Doesn't look like the page skeleton is being served", 'nope.gif', false];
      }

      return fetch('https://google.com/').then(function (r) {
        return r.text();
      })['catch'](function (e) {
        return '';
      }).then(function (gText) {
        if (gText == text) {
          return ["Looks like you're serving the skeleton for https://google.com/ too!", 'not-quite.gif', false];
        }
        return ["Yay! The page skeleton is being served!", "15.gif", true];
      });
    });
  });
}), _defineProperty(_lieFi$registered$swWaiting$swActive$htmlResponse$gifResponse$gif404$installCached$cacheServed$newCacheReady$newCacheUsed$updateNotify$updateReload$serveSkeleton$idbAnimal$idbAge$idbStore$idbShow$idbClean$cachePhotos$cacheClean$cacheAvatars, 'idb-animal', function idbAnimal() {
  return remoteEval(function () {
    return openDb('test-db').then(function (db) {
      var tx = db.transaction('keyval');
      return tx.objectStore('keyval').get('favoriteAnimal').then(function (animal) {
        if (!animal) return ["Can't find favoriteAnimal in keyval", 'nope.gif', false];
        return ["Yay! Your favorite animal is \"" + animal + "\"", "16.gif", true];
      });
    }, function (err) {
      return ["Couldn't open the test-db database at all :(", 'sad.gif', false];
    });
  });
}), _defineProperty(_lieFi$registered$swWaiting$swActive$htmlResponse$gifResponse$gif404$installCached$cacheServed$newCacheReady$newCacheUsed$updateNotify$updateReload$serveSkeleton$idbAnimal$idbAge$idbStore$idbShow$idbClean$cachePhotos$cacheClean$cacheAvatars, 'idb-age', function idbAge() {
  return remoteEval(function () {
    return openDb('test-db').then(function (db) {
      if (!Array.from(db.objectStoreNames).includes('people')) {
        return ["Can't find the 'people' objectStore", 'mistake.gif', false];
      }

      var tx = db.transaction('people');
      var store = tx.objectStore('people');

      if (!Array.from(store.indexNames).includes('age')) {
        return ["Can't find the 'age' index in the 'people' objectStore", 'sad.gif', false];
      }

      var index = store.index('age');

      if (index.keyPath == 'age') {
        return ["Yay! The age index is working", "17.gif", true];
      }

      return ["The age index isn't indexed by age", 'nope.gif', false];
    }, function (err) {
      return ["Couldn't open the test-db database at all :(", 'sad.gif', false];
    });
  });
}), _defineProperty(_lieFi$registered$swWaiting$swActive$htmlResponse$gifResponse$gif404$installCached$cacheServed$newCacheReady$newCacheUsed$updateNotify$updateReload$serveSkeleton$idbAnimal$idbAge$idbStore$idbShow$idbClean$cachePhotos$cacheClean$cacheAvatars, 'idb-store', function idbStore() {
  return remoteEval(function () {
    return openDb('wittr').then(function (db) {
      if (!Array.from(db.objectStoreNames).includes('wittrs')) {
        return ["There isn't a 'wittrs' objectStore", 'sad.gif', false];
      }

      var tx = db.transaction('wittrs');
      var store = tx.objectStore('wittrs');

      if (store.keyPath != 'id') {
        return ["'wittrs' objectStore doesn't use 'id' as its primary key", 'nope.gif', false];
      }

      if (!Array.from(store.indexNames).includes('by-date')) {
        return ["There isn't a 'by-date' index on the 'wittrs' objectStore", 'nope.gif', false];
      }

      var index = store.index('by-date');

      if (index.keyPath != 'time') {
        return ["The 'by-date' index isn't using 'time' as its key", 'nope.gif', false];
      }

      return store.getAll().then(function (messages) {
        if (!messages.length) {
          return ["The objectStore is there, but it's empty", 'sad.gif', false];
        }

        var looksMessagey = messages.every(function (message) {
          return message.id && message.avatar && message.name && message.time && message.body;
        });

        if (looksMessagey) {
          return ["The database is set up and populated!", "18.gif", true];
        }

        return ["Looks like some incorrect data is in the database", 'not-quite.gif', false];
      });
    }, function () {
      return ["Couldn't open the 'wittr' database at all :(", 'sad.gif', false];
    });
  });
}), _defineProperty(_lieFi$registered$swWaiting$swActive$htmlResponse$gifResponse$gif404$installCached$cacheServed$newCacheReady$newCacheUsed$updateNotify$updateReload$serveSkeleton$idbAnimal$idbAge$idbStore$idbShow$idbClean$cachePhotos$cacheClean$cacheAvatars, 'idb-show', function idbShow() {
  return remoteEval(function () {
    return openDb('wittr').then(function (db) {
      return openIframe('/?no-socket').then(function (iframe) {
        var win = iframe.contentWindow;
        var doc = win.document;

        return new Promise(function (r) {
          return setTimeout(r, 500);
        }).then(function () {
          var times = Array.from(doc.querySelectorAll('.post-content time'));
          if (!times.length) return ["Page looks empty without the web socket", 'nope.gif', false];

          var inOrder = times.map(function (t) {
            return new Date(t.getAttribute('datetime'));
          }).every(function (time, i, arr) {
            var nextTime = arr[i + 1];
            if (!nextTime) return true;
            return time >= nextTime;
          });

          if (!inOrder) return ["So close! But the newest post should appear at the top", 'not-quite.gif', false];
          return ["Page populated from IDB!", "19.gif", true];
        });
      });
    }, function () {
      return ["Couldn't open the 'wittr' database at all :(", 'sad.gif', false];
    });
  });
}), _defineProperty(_lieFi$registered$swWaiting$swActive$htmlResponse$gifResponse$gif404$installCached$cacheServed$newCacheReady$newCacheUsed$updateNotify$updateReload$serveSkeleton$idbAnimal$idbAge$idbStore$idbShow$idbClean$cachePhotos$cacheClean$cacheAvatars, 'idb-clean', function idbClean() {
  return remoteEval(function () {
    return openDb('wittr').then(function (db) {
      var tx = db.transaction('wittrs');
      var store = tx.objectStore('wittrs');

      return store.count().then(function (num) {
        if (num > 30) {
          return ["There are more than 30 items in the store", 'nope.gif', false];
        }

        if (num < 30) {
          return ["There are less than 30 items in the store, so it isn't clear if this is working", 'not-quite.gif', false];
        }

        return ["Looks like the database is being cleaned!", "20.gif", true];
      });
    }, function () {
      return ["Couldn't open the 'wittr' database at all :(", 'sad.gif', false];
    });
  });
}), _defineProperty(_lieFi$registered$swWaiting$swActive$htmlResponse$gifResponse$gif404$installCached$cacheServed$newCacheReady$newCacheUsed$updateNotify$updateReload$serveSkeleton$idbAnimal$idbAge$idbStore$idbShow$idbClean$cachePhotos$cacheClean$cacheAvatars, 'cache-photos', function cachePhotos() {
  return remoteEval(function () {
    return caches.has('wittr-content-imgs').then(function (hasCache) {
      if (!hasCache) return ["There isn't a 'wittr-content-imgs' cache", 'sad.gif', false];

      // clear cache
      return caches['delete']('wittr-content-imgs').then(function () {
        var imageUrlSmall = '/photos/4-3087-2918949798-865f134ef3-320px.jpg';
        var imageUrlMedium = '/photos/4-3087-2918949798-865f134ef3-640px.jpg';

        return fetch(imageUrlMedium).then(function (medResponse) {
          return new Promise(function (r) {
            return setTimeout(r, 2000);
          }).then(function () {
            return fetch(imageUrlMedium);
          }).then(function (anotherMedResponse) {
            if (medResponse.headers.get('Date') != anotherMedResponse.headers.get('Date')) {
              return ["Doesn't look like images are being returned from the cache", 'nope.gif', false];
            }

            return fetch(imageUrlSmall).then(function (smallResponse) {
              return Promise.all([smallResponse.blob(), medResponse.blob()]);
            }).then(function (blobs) {
              if (blobs[0].size != blobs[1].size) {
                return ["The originally cached image isn't being returned for different sizes", 'nope.gif', false];
              }
              return ["Photos are being cached and served correctly!", "21.gif", true];
            });
          });
        });
      });
    });
  });
}), _defineProperty(_lieFi$registered$swWaiting$swActive$htmlResponse$gifResponse$gif404$installCached$cacheServed$newCacheReady$newCacheUsed$updateNotify$updateReload$serveSkeleton$idbAnimal$idbAge$idbStore$idbShow$idbClean$cachePhotos$cacheClean$cacheAvatars, 'cache-clean', function cacheClean() {
  return remoteEval(function () {
    return caches.open('wittr-content-imgs').then(function (cache) {
      var imageUrlMedium = '/photos/4-3087-2918949798-865f134ef3-640px.jpg';

      return fetch(imageUrlMedium).then(function (r) {
        return r.blob();
      }).then(function () {
        return new Promise(function (r) {
          return setTimeout(r, 500);
        });
      }).then(function () {
        return cache.match('/photos/4-3087-2918949798-865f134ef3').then(function (response) {
          if (!response) return ["Photos aren't appearing in the cache where we'd expect", 'not-quite.gif', false];

          var start = Date.now();

          return Promise.resolve().then(function checkCache() {
            if (Date.now() - start > 8000) {
              return ["The image cache doesn't seem to be getting cleaned", 'nope.gif', false];
            }

            return cache.match('/photos/4-3087-2918949798-865f134ef3').then(function (response) {
              if (!response) {
                return ["Yay! The image cache is being cleaned!", '22.gif', true];
              }
              return new Promise(function (r) {
                return setTimeout(r, 100);
              }).then(checkCache);
            });
          });
        });
      });
    });
  });
}), _defineProperty(_lieFi$registered$swWaiting$swActive$htmlResponse$gifResponse$gif404$installCached$cacheServed$newCacheReady$newCacheUsed$updateNotify$updateReload$serveSkeleton$idbAnimal$idbAge$idbStore$idbShow$idbClean$cachePhotos$cacheClean$cacheAvatars, 'cache-avatars', function cacheAvatars() {
  return remoteEval(function () {
    return caches['delete']('wittr-content-imgs').then(function () {
      var imageUrlSmall = '/avatars/marc-1x.jpg';
      var imageUrlMedium = '/avatars/marc-2x.jpg';

      return fetch(imageUrlSmall).then(function (smallResponse) {
        return new Promise(function (r) {
          return setTimeout(r, 2000);
        }).then(function () {
          return fetch(imageUrlMedium);
        }).then(function (medResponse) {
          if (smallResponse.headers.get('Date') != medResponse.headers.get('Date')) {
            return ["Doesn't look like avatars are being returned from the cache, even if the request is for a different size", 'nope.gif', false];
          }

          return new Promise(function (r) {
            return setTimeout(r, 2000);
          }).then(function () {
            return fetch(imageUrlMedium);
          }).then(function (anotherMedResponse) {
            if (medResponse.headers.get('Date') == anotherMedResponse.headers.get('Date')) {
              return ["Doesn't look like avatars are being updated after being returned from the cache", 'nope.gif', false];
            }
            return ["Avatars are being cached, served and updated correctly!", "23.gif", true];
          });
        });
      });
    });
  });
}), _lieFi$registered$swWaiting$swActive$htmlResponse$gifResponse$gif404$installCached$cacheServed$newCacheReady$newCacheUsed$updateNotify$updateReload$serveSkeleton$idbAnimal$idbAge$idbStore$idbShow$idbClean$cachePhotos$cacheClean$cacheAvatars);
module.exports = exports['default'];

},{"./WindowMessenger":5}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilsParseHTML = require('../../utils/parseHTML');

var _utilsParseHTML2 = _interopRequireDefault(_utilsParseHTML);

var Spinner = (function () {
  function Spinner() {
    var _this = this;

    _classCallCheck(this, Spinner);

    this.container = (0, _utilsParseHTML2['default'])('<div class="spinner">' + '<div class="spinner-container">' + '<div class="spinner-layer">' + '<div class="circle-clipper left">' + '<div class="circle"></div>' + '</div>' + '<div class="gap-patch">' + '<div class="circle"></div>' + '</div>' + '<div class="circle-clipper right">' + '<div class="circle"></div>' + '</div>' + '</div>' + '</div>' + '</div>' + '').firstChild;

    this._showTimeout = null;
    this.container.style.display = 'none';

    var animEndListener = function animEndListener(event) {
      if (event.target == _this.container) {
        _this.container.style.display = 'none';
      }
    };

    this.container.addEventListener('webkitAnimationEnd', animEndListener);
    this.container.addEventListener('animationend', animEndListener);
  }

  _createClass(Spinner, [{
    key: 'show',
    value: function show() {
      var _this2 = this;

      var delay = arguments.length <= 0 || arguments[0] === undefined ? 300 : arguments[0];

      clearTimeout(this._showTimeout);
      this.container.style.display = 'none';
      this.container.classList.remove('cooldown');
      this._showTimeout = setTimeout(function (_) {
        _this2.container.style.display = '';
      }, delay);
    }
  }, {
    key: 'hide',
    value: function hide() {
      clearTimeout(this._showTimeout);
      this.container.classList.add('cooldown');
    }
  }]);

  return Spinner;
})();

exports['default'] = Spinner;
module.exports = exports['default'];

},{"../../utils/parseHTML":8}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = strToEls;
var contextRange = document.createRange();
contextRange.setStart(document.body, 0);

function strToEls(str) {
  return contextRange.createContextualFragment(str);
}

module.exports = exports["default"];

},{}]},{},[3])

//# sourceMappingURL=settings.js.map
