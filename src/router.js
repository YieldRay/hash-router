const $router = {
  /**
   * @function fix
   */
  fix: function () {
    if (location.hash[1] !== '/') location.hash = '/' + location.hash.slice(1);
    location.hash = location.hash.slice(1).replace(/\/{2,}/g, '/');
  },
  /**
   * @function get
   * @param {String|Array|null} after - input 'a/b/c' or ['a','b','c']
   * @static {String} - current hash
   * @return {String} - expected hash
   */
  get: function (...after) {
    this.fix();
    // use slice(2) to leave hash after [url]#/
    // for example, url 'http://localhost/index.html#/test/abc' will leave 'test/abc'
    // thus, make sure the first string after [url]# is '/'
    // we need initialize the page with location.hash='/'
    if (after.length === 0) return this.path;
    else if (after.length === 1) after = after[0];
    if (typeof after === 'string') after = after.split('/');
    // things above, can make sure 'after' is an array
    if (!Array.isArray(after))
      throw new Error(
        'incoming parameters must be String or Array or Multiple Parameters'
      );
    const before = this.array;
    console.log(before, after);
    let i;
    let newPath = '/';
    for (i = 0; i < after.length - 1; i++) {
      if (after[i] == undefined || after[i] == '') {
        if (before[i] == undefined)
          throw new Error(`past path[${i}] is missing`);
        newPath += before[i] + '/';
      } else {
        newPath += after[i] + '/';
      }
    }

    if (after[i] == undefined) {
      if (before[i] == undefined) throw new Error(`past path[${i}] is missing`);
      newPath += before[i];
    } else {
      newPath += after[i];
    } // last path do not add '/'

    return newPath.slice(1);
  },
  /**
   * @function set
   * @param {String|Array|multi-params} args - go to hash want to go
   * @static {undefind}
   */
  set: function (...args) {
    if (args.length === 1) args = args[0];
    this.path = this.get(args);
  },
};

Object.defineProperty($router, 'path', {
  /**
   * @member path - string getter/setter
   */
  get() {
    this.fix();
    return location.hash.slice(2).replace(/\/{2,}/g, '/');
  },
  set(str) {
    this.fix();
    location.hash = '/' + str.replace(/\/{2,}/g, '/');
  },
});

Object.defineProperty($router, 'array', {
  /*
   * @member array - array getter/setter
   */
  get() {
    // FIXIT
    // last element, if include '?', remove it
    return this.path.split('/');
  },
  set(arr) {
    this.path = arr.join('/');
  },
});

Object.assign($router, {
  /**
   * @function modify
   * @param {String=[[A|a]rray,[S|s]tring]}
   * @param {String|Array|multi-params}
   */
  modify(type, ...args) {
    let tmp = args;
    if (typeof args[0] === 'array') tmp = args[0];
    if (typeof args[0] === 'string') tmp = args[0].split('/');
    switch (type) {
      case 'array':
      case 'Array':
        return tmp;
        break;

      case 'string':
      case 'String':
        return tmp.join('/');
        break;

      default:
        throw new Error(`Wrong type <${type}>`);
    }
  },
});

Object.assign($router, {
  /**
   * @function bind - $router.bind(/regexp/,'#hash')
   * @param {RegExp} regexp - to match a new-found hash, first word is '#' !
   * @param {function} func - if matched, call this function
   * @return {Object} - return this, allowing chain calls
   *
   * @function unbind
   * @param {RegExp} regexp - to match a new-found hash, first word is '#' !
   * @return {Object} - return this, allowing chain calls
   *
   * @function unbindAll
   * @static {Object} - return this, allowing chain calls
   *
   * @protected {Map} _bound
   */
  _bound: new Map(),
  bind(regexp, func, force) {
    // prevent twice bind
    const str = String(regexp);
    if (!(typeof regexp === 'object' && str.startsWith('/')))
      throw new Error('incoming parameters must be a RegExp');
    if (this._bound.has(str)) {
      if (force) this._bound.delete(str);
      else throw new Error('One hash can only bind one function');
    }
    this._bound.set(str, function () {
      if (regexp.test($router.path)) {
        func();
      }
    });
    window.addEventListener('hashchange', this._bound.get(str));
    return this;
  },
  unbind(regexp) {
    window.removeEventListener('hashchange', this._bound.get(String(regexp)));
    if (!this._bound.delete(String(regexp)))
      throw new Error(`Unbind ${regexp} failed`);
    return this;
  },
  unbindAll() {
    for (let key of this_.bound) {
      window.removeEventListener('hashchange', this._bound.get(key));
      // if(!this._bound.delete(key)) throw new Error(`Unbind ${key} failed`)
    }
    this_.bound.clear();
    return this;
  },
});

Object.assign($router, {
  /*
   * @function parseQuery
   * @param path {String} - if not string, return itself
   * @return {Object} - make 'a=1&b=2' to {a:'1', b:'2'}
   */
  parseQuery(path) {
    if (typeof path !== 'string') return path;
    const obj = Object.create(null);
    path
      .split('&')
      .filter((e) => e.length > 0)
      .forEach((e) => {
        let pos = e.indexOf('=');
        if (pos > -1) {
          obj[e.slice(0, pos)] = e.slice(pos + 1);
        } else {
          obj[e] = '';
        }
      });
    return obj;
  },
  /*
   * @function pushQuery
   * @param q {Object|String}
   */
  pushQuery(q) {
    this.query = { ...this.query, ...this.parseQuery(q) };
  },
});

Object.defineProperty($router, 'query', {
  /*
   * @member query - this query is some string after '?' of hash
   */
  get() {
    const path = this.path;
    if (!path.includes('?')) return Object.create(null);
    return this.parseQuery(path.slice(path.indexOf('?') + 1, path.length));
  },
  set(q) {
    let path = this.path;
    const pos = path.indexOf('?');
    let param = '?';
    switch (typeof q) {
      case 'object':
        for (k in q) {
          param += `${k}=${q[k]}&`;
        }
        param = param.slice(0, -1);
        break;
      case 'string':
        param += q;
        break;
      default:
        throw new Error('incoming parameters must be Object or String');
    }
    if (pos > -1) path = path.slice(0, pos);
    // path does not include '?'
    // because path includes '?'
    this.path = path + param;
  },
});

Object.assign($router, {
  /**
   * @function getCachedXhr - simple GET function, promise return XMLHTTPRequest Object
   * @param {String} url
   * @param {function} settings - (xhr)=>{// control xhr before xhr.send() }
   * @return {Object} - XMLHTTPRequest Object
   * @protected {Map} _cached - if someting wrong, operate it
   */
  _cached: new Map(),
  getCachedXhr: function (url, settings) {
    return new Promise((resolve, reject) => {
      if (this._cached.has(url)) {
        resolve(this._cached.get(url));
      } else {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = () => {
          this._cached.set(url, xhr);
          resolve(xhr);
        };
        xhr.onerror = () => reject(xhr);
        settings(xhr);
        xhr.send();
      }
    });
  },
});

window.$router = $router;
