function On() {
  var listeners = {};
  var self = {};

  // add an on.{{name}} for each of the arguments
  for (var i = 0, l = arguments.length; i < l; i++) {
    add(arguments[i]);
  }

  // add - create an on.{{name}} function for the provided name
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
