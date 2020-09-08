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

获取预期路径名

```javascript
$router.get(); // 等于$router.pathname
$router.get([null, null, 'ddd']); // aaa/bbb/ddd
```

### \$router.set()

设置路径以预期

```javascript
$router.set('a/b/c');
$router.set(['a', 'b', 'c']);
$router.set('a', 'b', 'c');
$router.set([null, null, 'ddd']); // to aaa/bbb/ddd
```

### \$router.modify()

解析一些参数

```javascript
$router.modify('array', 'a/b/c'); // ['a', 'b', 'c']
$router.modify('string', ['a', 'b', 'c']); // 'a/b/c'
$router.modify('string', 'a', 'b', 'c'); // 'a/b/c'
```

### \$router.parseSearch()

将查询字符串解析为一个对象

```javascript
$router.parseSearch($router.search); // {"x":"1","y":["2","3"],"z":""}
```

### \$router.stringifySearch()

将对象编码为查询字符串

```javascript
$router.stringifySearch({ a: '1', b: '2' }); // a=1&b=2
```

### \$router.bind()

为路径绑定处理函数。第一个参数为正则表达式，第二个参数为一个函数。路径更新时，若正则表达式匹配成功，则执行该函数

```javascript
$router.bind(/test/, () => alert('hi~')).bind(/test2/, () => alert('hey~'));
/* 匹配路径 'cat/tech/page/1/' 然后输出 Array ["cat/tech", "tech"] */
$router.bind(/cat\/(.[^\/]+)/, matched => console.log(matched));
```

### \$router.unbind()

解除绑定。注意：该正则表达式需与绑定时一致。

```javascript
$router.unbind(/test/).unbind(/test2/);
```

### \$router.unbindAll()

解绑所有处理函数

```javascript
$router.unbindAll();
```

### \$router.getCachedXhr()

```javascript
$router.getCachedXhr('https://example.net/').then(/* do something */);
```
