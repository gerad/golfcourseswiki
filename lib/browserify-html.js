// allow browserify to require `*.html` files
var through = require('through');

module.exports = function (file) {
  if (!/\.html$/.test(file)) { return through(); }

  var buf = new Buffer([]);
  function buffer(data) { buf = Buffer.concat([buf, data]); }
  function finish() {
    // TODO source maps
    this.queue("module.exports = " + JSON.stringify(buf.toString()) + ";");
    this.queue(null);
  }

  return through(buffer, finish);
};
