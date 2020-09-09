# hashRouter

A router for location.hash

# Doc

example url: http://127.0.0.1/test/index.html#/aaa/bbb/ccc?x=1&y=2&y=3&z

### \$router.path

```javascript
console.log($router.path); // aaa/bbb/ccc?x=1&y=2&y=3&z
$router.path = 'ccc/ddd';
console.log($router.path); // ccc/ddd
```

### \$router.pathname

```javascript
console.log($router.pathname); // aaa/bbb/ccc
$router.pathname = 'ccc/ddd';
console.log($router.path); // ccc/ddd?x=1&y=2&y=3&z
```

### \$router.search

```javascript
console.log($router.search); // x=1&y=2&y=3&z
$router.search = 'm=1&n=2';
console.log($router.path); // aaa/bbb/ccc?m=1&n=2
```

### \$router.array

```javascript
console.log($router.array); // ['aaa', 'bbb', 'ccc']
$router.array = ['a', 'b'];
console.log($router.path); // a/b
$router.array = ['a', 'b', ''];
console.log($router.path); // a/b/
```

### \$router.get()

Get the expected pathname

```javascript
$router.get(); // equal to $router.pathname
$router.get([null, null, 'ddd']); // aaa/bbb/ddd
```

### \$router.set()

Set the path to expected

```javascript
$router.set('a/b/c');
$router.set(['a', 'b', 'c']);
$router.set('a', 'b', 'c');
$router.set([null, null, 'ddd']); // to aaa/bbb/ddd
```

### \$router.modify()

Format some parameters

```javascript
$router.modify('array', 'a/b/c'); // ['a', 'b', 'c']
$router.modify('string', ['a', 'b', 'c']); // 'a/b/c'
$router.modify('string', 'a', 'b', 'c'); // 'a/b/c'
```

### \$router.parseSearch()

Parse the query string as a object

```javascript
$router.parseSearch($router.search); // {"x":"1","y":["2","3"],"z":""}
```

### \$router.stringifySearch()

Encodes the object as a query string

```javascript
$router.stringifySearch({ a: '1', b: '2' }); // a=1&b=2
```

### \$router.bind()

Binds the handler function for the path. The first argument is a regular expression, and the second is a function. When the path is updated, the function executes if the regular expression matches successfully

```javascript
$router.bind(/test/, () => alert('hi~')).bind(/test2/, () => alert('hey~'));
/* match path like 'cat/tech/page/1/' and log "tech" */
$router.bind(/^cat\/(.[^\/]*)/, matched => console.log(matched));
```

### \$router.unbind()

Remove the binding. Notice: The regular expression should be the same as that used in \$router.bind()

```javascript
$router.unbind(/test/).unbind(/test2/);
```

### \$router.unbindAll()

Unbind all

```javascript
$router.unbindAll();
```

### \$router.getCachedXhr()

```javascript
$router.getCachedXhr('https://example.net/').then(/* do something */);
```
