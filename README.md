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

```javascript
```

### \$router.set()

```javascript
```

### \$router.modify()

```javascript
```

### \$router.parseSearch()

```javascript
```

### \$router.stringifySearch()

```javascript
```

### \$router.bind()

```javascript
```

### \$router.unbind()

```javascript
```

### \$router.unbindAll()

```javascript
```

### \$router.getCachedXhr()

```javascript
```
