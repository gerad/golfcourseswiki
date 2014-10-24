/*
 * # on.js
 * 
 * simple, safe, fast events
 * 
 * ### Usage
 * 
 * ```javascript
 * var On = require('on');
 * var thing = { on: On('ready') };
 * 
 * thing.on.ready(function() { console.log('ready!'); });
 * thing.on.ready.fire(); // => 'ready!'
 * ```
 * 
 * ## API
 * 
 * ### `on.<name>`
 * 
 * adds a callback to be notified when the <name> event occurs
 * 
 * ```javascript
 * thing.on.ready(function() { console.log("hi"); });
 * ```
 * 
 * ### `on.<name>.fire`
 * 
 * notifies all callbacks the <name> event has occurred
 * 
 * ```javascript
 * thing.on.ready.fire() // "hi"
 * ```
 * 
 * ### `on.<name>.trip`
 * 
 * notifies callbacks that <name> event has occurred, and additionally
 * immediately notifies new listeners that event has occurred
 * 
 * ```javascript
 * thing.on.ready.trip()
 * thing.on.ready(function() { console.log("hi"); }) // 'hi'
 * ```
 */
function On() {
  var listeners = {};
  var self = {};

  for (var i = 0, l = arguments.length; i < l; i++) {
    add(arguments[i]);
  }

  function add(name) {
    if (!(name in listeners)) { listeners[name] = []; }

    // add
    self[name] = function(cb) { listeners[name].push(cb); }

    // fire - notifies all listeners
    self[name].fire = function() {
      for (var i = 0, l = listeners[name].length; i < l; i++) {
        var cb = listeners[name][i];
        cb.apply(void 0, arguments);
      }
    }

    // clear - fires, then clears all listeners
    self[name].clear = function() {
      self[name].fire.apply(void 0, arguments);
      listeners[name] = [];
    }

    // trip - clears, subsequently immediately invokes when called
    self[name].trip = function() {
      self[name].clear.apply(void 0, arguments);

      // copy arguments to avoid performance issues
      var args = [];
      for (var i = 0, l = arguments.length; i < l; i++) {
        args[i] = arguments[i];
      }

      // subsequent listeners are notified immediately
      self[name] = function(cb) { cb.apply(void 0, args); }
    };

  }

  return self;
}

module.exports = On;
