# gcwTabIndexGroup

Overrides tab indexes on a group of elements without changing the tab index order of any elements in the dom outside the group.

### Usage

```html
<input id="one" autofocus>
<div gcw-tab-index-group>
  <input id="two" gcw-tab-index=0>
  <input id="three" gcw-tab-index=2>
  <input id="four" gcw-tab-index=1>
</div>
<input id="five">
<script>
  var app = angular.module('myApp', ['gcwTabIndexGroup']);
</script>
```

This results in the following behavior:

1. "input#one" is focused (hit tab)
2. (hit tab) "input#two" is focused (gcw-tab-index is 0)
3. (hit tab) "input#four" is focused (gcw-tab-index is 1)
4. (hit tab) "input#three" is focused (gcw-tab-index is 2)
5. (hit tab) "input#five" is focused

Shift+tab works correctly as well.
