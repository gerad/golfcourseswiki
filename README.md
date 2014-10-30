# Golf Courses Wiki

A free database of golf courses that anyone can edit.

### Getting Started

1. Install mongodb.
2. Install node.
3. Install dependencies: `npm install`.
4. Start the server: `npm start`.
5. Visit <http://localhost:6018/>.

### Commands

* `npm start` - to install dependencies and run the server
* `npm install --save` - to install server-side dependencies
* `bower install --save` - to install client-side dependencies
  - client-side dependencies can be included using `require("angular")`
    syntax thanks to `browserify` and `debowerify`

### File Structure

* `server.js` - root server file
* `client/` - html5 thick client
* `lib/` - client, server, and shared javascript code
  * `lib/angular-app` - angular-specific javascript code
  * `lib/express-app` - express-specific javascript code
  * other `lib/` files and directories are generalized modules useful
    for client or server (or wider distribution)

NOTE: `lib/` files are symlinked into `node_modules/gcw` so instead of
`require("../../../../lib/module")` you can do `require("gcw/module")`.

Thanks to browserify, `require` works on both the front- and back-ends.

### Technologies

* front:
  * angular
  * bootstrap
* back:
  * node
  * express
  * mongodb
  * browserify

### Licence

TBD
