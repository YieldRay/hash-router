const $router = {
  /**
   * @function init
   */
  init: function () {
    if (!location.hash.slice(1).startsWith('/'))
      location.hash = '/' + location.hash.slice(1);
  },
  /**
   * @function get
   * @param {String|Array|null} after - input 'a/b/c' or ['a','b','c']
   * @static {String} - current hash
   * @return {String} - expected hash
   */
  get: function (...after) {
    this.init();
    // use slice(2) to leave hash after [url]#/
    // for example, url 'http://localhost/index.html#/test/abc' will leave 'test/abc'
    // thus, make sure the first string after [url]# is '/'
    // we need initialize the page with location.hash='/'
    if (after.length === 0 || after[1] == undefind)
      return location.hash.slice(2);
    if (after.length === 1) after = after[0];
    if (typeof after === 'string') after = after.split('/');
    // things above, can make sure 'after' is an array
    if (!Array.isArray(after))
      throw new Error(
        'incoming parameters must be String or Array or Multiple Parameters'
      );
    let before = location.hash.slice(2).split('/');
    let i;
    let newPath = '/';
    for (i = 0; i < after.length - 1; i++) {
      if (after[i] == undefined) {
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
    location.hash = this.get(args);
  },
};

Object.defineProperty($router, 'path', {
  /**
   * @member path - string getter/setter
   */
  get() {
    return this.get();
  },
  set(str) {
    this.set(str);
  },
});

Object.defineProperty($router, 'array', {
  /*
   * @member array - array getter/setter
   */
  get() {
    return this.get().split('/');
  },
  set(arr) {
    this.set(arr);
  },
});

Object.defindProperty($router, 'modify', {
  /**
   * @function modify
   * @param {String=[[A|a]rray,[S|s]tring]}
   * @param {String|Array|multi-params}
   */
  set(type, ...args) {
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
   * @param {RegExp|String} regexp - to match a new-found hash, first word is '#' !
   * @param {function} func - if matched, call this function
   * @return {Object} - return this, allowing chain calls
   *
   * @function unbind
   * @param {RegExp|String} regexp - to match a new-found hash, first word is '#' !
   * @return {Object} - return this, allowing chain calls
   *
   * @function unbindAll
   * @static {Object} - return this, allowing chain calls
   *
   * @protected {Map} _bound
   */
  _bound: new Map(),
  bind(regexp, func) {
    // prevent twice bind
    if (this._bound.has(regexp))
      throw new Error('One hash can only bind one function');
    this._bound.set(regexp, function () {
      if (regexp.test(location.href)) {
        func();
      }
    });
    window.addEventListener('hashchange', this._bound.get(regexp));
    return this;
  },
  unbind(regexp) {
    window.removeEventListener('hashchange', this._bound.get(regexp));
    if (!this._bound.delete(regexp)) throw new Error(`Unbind ${regexp} failed`);
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
