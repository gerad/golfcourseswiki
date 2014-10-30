# mongo-middleware

Express 4 middleware for transparent database connections.

### Usage

```javascript

var app = express();

app.use(mongoMiddleware("mongodb://localhost:27017/mydatabase"));

app.get('/', function(req, res, next) {
  var people = req.db.collection('people');

  people.find({}).toArray(function(err, array) {
    if (err) { return next(err); }
    res.json(array);
  });
});
```

## API

### `mongoMiddleware(mongoUrl)`

Connects to mongodb during the request, exposes the connection as
`req.db` to downstream route handlers.

```javascript
var app = express();

app.use(mongoMiddleware("mongodb://localhost:27017/mydatabase"));

app.get('/', function() {
  console.log(req.db);
  res.json('Ok');
});
```
