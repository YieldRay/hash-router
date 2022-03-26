# hashRouter

一个方便处理 location.hash 的路由工具

# Doc

示例 url: http://127.0.0.1/test/index.html#/aaa/bbb/ccc?x=1&y=2&y=3&z  
注意 path 不是以'/'开头的

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

获取预期路径名

```js
$router.get(); // 等价于$router.pathname
$router.get([null, null, 'ddd']); // aaa/bbb/ddd
```

### \$router.set()

设置路径

```js
$router.set('a/b/c');
$router.set(['a', 'b', 'c']);
$router.set('a', 'b', 'c');
$router.set([null, null, 'ddd']); // to aaa/bbb/ddd
```

### \$router.modify()

解析一些参数

```js
$router.modify('array', 'a/b/c'); // ['a', 'b', 'c']
$router.modify('string', ['a', 'b', 'c']); // 'a/b/c'
$router.modify('string', 'a', 'b', 'c'); // 'a/b/c'
```

### \$router.parseSearch()

将查询字符串解析为一个对象

```js
$router.parseSearch($router.search); // {"x":"1","y":["2","3"],"z":""}
```

### \$router.stringifySearch()

将对象编码为查询字符串

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

为路径绑定处理函数。第一个参数为正则表达式，第二个参数为一个函数。路径更新时，若正则表达式匹配成功，则执行该函数

```js
$router.bind(/test/, () => alert('hi~')).bind(/test2/, () => alert('hey~'));
/* 匹配路径 'cat/tech/page/1/' 然后输出 Array "tech" */
$router.bind(/^cat\/(.[^\/]*)/, matched => console.log(matched));
```

### \$router.unbind()

解除绑定。注意：该正则表达式需与绑定时一致。

```js
$router.unbind(/test/).unbind(/test2/);
```

### \$router.unbindAll()

解绑所有处理函数

```js
$router.unbindAll();
```
