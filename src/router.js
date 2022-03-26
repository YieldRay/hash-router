'use strict';
const $router = {
    /**
     * @function fix
     */
    fix: function () {
        if (location.hash[1] !== '/') location.hash = '/' + location.hash.slice(1);
        location.hash = location.hash.slice(1).replace(/\/{2,}/g, '/');
    },
    /**
     * @function encode - safe URI encode
     */
    encodeURI: function (str) {
        return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
            return '%' + c.charCodeAt(0).toString(16);
        });
    },
    /**
     * @function decode - URI decode
     */
    decodeURI: decodeURIComponent,
    /**
     * @function get
     * @param {String|Array|null} after - input 'a/b/c' or ['a','b','c']
     * @return {String} - expected hash
     */
    get: function (...after) {
        this.fix();
        // use slice(2) to leave hash after [url]#/
        // for example, url 'http://localhost/index.html#/test/abc' will leave 'test/abc'
        // thus, make sure the first string after [url]# is '/'
        // we need initialize the page with location.hash='/'
        if (after.length === 0) return this.pathname;
        else if (after.length === 1) after = after[0];
        if (typeof after === 'string' || typeof after === 'number') after = after.split('/');
        // things above, can make sure 'after' is an array
        if (!Array.isArray(after)) throw new TypeError('incoming parameters must be String or Array or Multiple Parameters');
        const before = this.array;
        let i;
        let newPath = '/';
        for (i = 0; i < after.length - 1; i++) {
            if (after[i] == undefined || after[i] == '') {
                if (before[i] == undefined) throw new TypeError(`past path[${i}] is missing`);
                newPath += before[i] + '/';
            } else {
                newPath += after[i] + '/';
            }
        }

        if (after[i] == undefined) {
            if (before[i] == undefined) throw new TypeError(`past path[${i}] is missing`);
            newPath += before[i];
        } else {
            newPath += after[i];
        } // last path do not add '/'

        return newPath.slice(1);
    },
    /**
     * @function set
     * @param {String|Array|multi-params} args - go to hash want to go
     */
    set: function (...args) {
        let arr = args;
        if (args.length === 1) arr = args[0];
        this.path = this.get(arr);
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

Object.defineProperty($router, 'pathname', {
    /**
     * @member pathname - string getter/setter
     */
    get() {
        const path = this.path;
        const pos = path.indexOf('?');
        if (pos > -1) return path.slice(0, pos);
        return path;
    },
    set(str) {
        this.path = str.replace(/\?/g, '%3F').replace(/\#/g, '%23');
    },
});

Object.defineProperty($router, 'search', {
    /**
     * @member search - some string after '?' of hash
     */
    get() {
        const path = this.path;
        const pos = path.indexOf('?');
        if (pos > -1) return path.slice(pos + 1, path.length);
        return '';
    },
    set(str) {
        this.path = this.pathname + '?' + String(str);
    },
});

Object.defineProperty($router, 'array', {
    /**
     * @member array - array getter/setter
     */
    get() {
        return this.pathname.split('/');
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

            case 'string':
            case 'String':
                return tmp.join('/');

            default:
                throw new TypeError(`Wrong type: ${type}`);
        }
    },
    params: [],
});

Object.assign($router, {
    parseSearch(s) {
        const usp = new URLSearchParams(s);
        const params = {};
        for (const [key, value] of usp) {
            params[key] = value;
        }
        return params;
    },
    stringifySearch(p) {
        const usp = new URLSearchParams();
        for (const key in p) {
            usp.append(key, p[key]);
        }
        return usp.toString();
    },
});

Object.assign($router, {
    /**
     * @protected {Map} _bound
     */
    _bound: new Map(),
    /**
     * @function bind - $router.bind(/regexp/,'#hash')
     * @param {RegExp|String} re - to match a new-found $router.pathname
     * @param {function} func - if matched, call this function with matced array
     * @return {Object} - return this, allowing chain calls
     */
    bind(re, func, force = false) {
        // regexp:Object str:String
        let regexp, str;
        if (typeof re === 'string') {
            regexp = new RegExp(re);
        } else {
            if (!(typeof re === 'object' && String(re).startsWith('/'))) throw new TypeError('incoming parameters must be RegExp or String');
            regexp = re;
        }
        str = String(regexp);
        // prevent twice bind
        if (this._bound.has(str)) {
            if (force) this._bound.delete(str);
            else throw new TypeError('One hash can only bind one function');
        }
        this._bound.set(str, function () {
            const matched = $router.path.match(regexp);
            if (matched) {
                $router.params = matched;
                func && func(...matched.slice(1));
            } else {
                $router.params.length = 0;
            }
        });
        window.addEventListener('hashchange', this._bound.get(str));
        return this;
    },
    /**
     * @function unbind
     * @param {RegExp|String} regexp - to match a new-found hash, first word is '#' !
     * @return {Object} - return this, allowing chain calls
     */
    unbind(re) {
        let regexp, str;
        if (typeof re === 'string') {
            regexp = new RegExp(re);
        } else {
            if (!(typeof re === 'object' && String(re).startsWith('/'))) throw new TypeError('incoming parameters must be RegExp or String');
            regexp = re;
        }
        str = String(regexp);

        window.removeEventListener('hashchange', this._bound.get(str));
        if (!this._bound.delete(str)) throw new Error(`Unbind ${str} failed`);
        return this;
    },
    /**
     * @function unbindAll
     * @static {Object} - return this, allowing chain calls
     */
    unbindAll() {
        for (let key of this_.bound) {
            window.removeEventListener('hashchange', this._bound.get(key));
            // if(!this._bound.delete(key)) throw new Error(`Unbind ${key} failed`)
        }
        this_.bound.clear();
        return this;
    },
});

window.$router = Object.seal($router);
