# on.js

simple, safe, fast events

### Usage

```javascript
var On = require('on');
var thing = { on: On('click') };

thing.on.click(function() { console.log('click!'); });
thing.on.click.fire(); // => 'click!'
```

## API

### `On('event', 'names')`

creates an `on` instance with methods for each of the passed event names

```javascript
var On = require('on');
var thing = { on: On('click', 'change') };

thing.on.click(function() { console.log('click!'); });
thing.on.change(function() { console.log('change!'); });
```

### `on.{{name}}`

adds a listener to be notified when the {{name}} event occurs

```javascript
thing.on.click(function() { console.log("click!"); });
```

### `on.{{name}}.fire`

notifies all listeners the {{name}} event has occurred

```javascript
thing.on.click.fire(); // "click!"
thing.on.click.fire(); // "click!" (again)
```

### `on.{{name}}.clear`

notifies listeners the {{name}} event has occurred, then removes all
listeners

```javascript
thing.on.click.fire();  // "click!"
thing.on.click.fire();  // "click!"

thing.on.click.clear(); // "click!"
thing.on.click.fire();  // nothing
```

### `on.{{name}}.trip`

notifies listeners that {{name}} event has occurred, and additionally
immediately notifies any new listeners that event has already occurred

```javascript
thing.on.ready(function() { console.log("ready1"); });
thing.on.ready(function() { console.log("ready2"); });

thing.on.ready.trip() // 'ready1', 'ready2'
thing.on.ready(function() { console.log("ready3"); }); // 'ready3'
```
