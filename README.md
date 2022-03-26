# hashRouter

A router for location.hash

# Doc

example url: http://127.0.0.1/test/index.html#/aaa/bbb/ccc?x=1&y=2&y=3&z  
keep in mind that our path is not started with '/'

### \$router.path

```js
console.log($router.path); // aaa/bbb/ccc?x=1&y=2&y=3&z
$router.path = 'ccc/ddd';
console.log($router.path); // ccc/ddd
```

### \$router.pathname

```js
console.log($router.pathname); // aaa/bbb/ccc
$router.pathname = 'ccc/ddd';
console.log($router.path); // ccc/ddd?x=1&y=2&y=3&z
```

### \$router.search

```js
console.log($router.search); // x=1&y=2&y=3&z
$router.search = 'm=1&n=2';
console.log($router.path); // aaa/bbb/ccc?m=1&n=2
```

### \$router.array

```js
console.log($router.array); // ['aaa', 'bbb', 'ccc']
$router.array = ['a', 'b'];
console.log($router.path); // a/b
$router.array = ['a', 'b', ''];
console.log($router.path); // a/b/
```

### \$router.get()

Get the expected pathname

```js
$router.get(); // equal to $router.pathname
$router.get([null, null, 'ddd']); // aaa/bbb/ddd
```

### \$router.set()

Set the path to expected

```js
$router.set('a/b/c');
$router.set(['a', 'b', 'c']);
$router.set('a', 'b', 'c');
$router.set([null, null, 'ddd']); // to aaa/bbb/ddd
```

### \$router.modify()

Format some parameters

```js
$router.modify('array', 'a/b/c'); // ['a', 'b', 'c']
$router.modify('string', ['a', 'b', 'c']); // 'a/b/c'
$router.modify('string', 'a', 'b', 'c'); // 'a/b/c'
```

### \$router.parseSearch()

Parse the query string as a object

```js
$router.parseSearch($router.search); // {"x":"1","y":["2","3"],"z":""}
```

### \$router.stringifySearch()

Encodes the object as a query string

```js
$router.stringifySearch({ a: '1', b: '2' }); // a=1&b=2
```

### \$router.encodeURI()

```js
$router.encodeURI('你好'); // %E4%BD%A0%E5%A5%BD
```

### \$router.decodeURI()

```js
$router.decodeURI('%E4%BD%A0%E5%A5%BD'); // 你好
```

### \$router.bind()

Binds the handler function for the path. The first argument is a regular expression, and the second is a function. When the path is updated, the function executes if the regular expression matches successfully

```js
$router.bind(/test/, () => alert('hi~')).bind(/test2/, () => alert('hey~'));
/* match path like 'cat/tech/page/1/' and log "tech" */
$router.bind(/^cat\/(.[^\/]*)/, matched => console.log(matched));
```

### \$router.unbind()

Remove the binding. Notice: The regular expression should be the same as that used in \$router.bind()

```js
$router.unbind(/test/).unbind(/test2/);
```

### \$router.unbindAll()

Unbind all

```js
$router.unbindAll();
```
