var http = require('http');
var app = require('./server/express-app');
var port = (process.env.NODE_ENV === 'production') ? 80 : 6018;

http.createServer(app).listen(port, function(err) {
  if (err) { console.error(err); process.exit(-1); }

  // if run as root, downgrade to the owner of this file
  if (process.getuid() === 0) {
    require('fs').stat(__filename, function(err, stats) {
      if (err) { return console.error(err); }
      process.setuid(stats.uid);
      process.setgroups(stats.uid);
    });
  }

  console.log('Server running at http://0.0.0.0:' + port + '/');
});
