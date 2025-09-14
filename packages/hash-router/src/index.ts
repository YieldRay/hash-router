/**
 * @param [source] A function that returns the URL string to be used as the source.
 * @returns A Proxy object that behaves like a URL object, but with the pathname derived from the hash fragment of the source URL.
 */
export function createHashedURL(location = window.location) {
  const SOURCE_URL = new URL(location.href);

  return new Proxy(Object.create(null) as URL, {
    apply: (_, thisArg, args) => Reflect.apply(SOURCE_URL as any, thisArg, args),
    construct: (_, args, newTarget) => Reflect.construct(SOURCE_URL as any, args, newTarget),
    defineProperty: (_, p, attributes) => Reflect.defineProperty(SOURCE_URL, p, attributes),
    deleteProperty: (_, p) => Reflect.deleteProperty(SOURCE_URL, p),
    getOwnPropertyDescriptor: (_, p) => Reflect.getOwnPropertyDescriptor(SOURCE_URL, p),
    getPrototypeOf: (_) => Reflect.getPrototypeOf(SOURCE_URL),
    has: (_, p) => Reflect.has(SOURCE_URL, p),
    isExtensible: (_) => Reflect.isExtensible(SOURCE_URL),
    ownKeys: (_) => Reflect.ownKeys(SOURCE_URL),
    preventExtensions: (_) => Reflect.preventExtensions(SOURCE_URL),
    setPrototypeOf: (_, v) => Reflect.setPrototypeOf(SOURCE_URL, v),
    // other Proxy trap will be forwarded to SOURCE_URL

    get(_, prop, receiver) {
      const k = prop as keyof URL;
      const sourceURL = new URL(location.href);
      const path = withPrefixSlash(normalizePath(withoutPrefixHash(sourceURL.hash)));
      const url = new URL(path, sourceURL);

      // @ts-ignore
      if (!_.searchParams)
        // @ts-ignore
        _.searchParams = new Proxy(url.searchParams, {
          get(_, prop, receiver) {
            switch (prop) {
              case "size":
                return url.searchParams.size;
              // intercept the common methods that will change the state of URLSearchParams
              case "append":
              case "delete":
              case "set":
              case "sort":
                const fn = Reflect.get(url.searchParams, prop, receiver) as URLSearchParams[typeof prop];
                const modifiedFn: typeof fn = function (this: any, ...args: Parameters<typeof fn>) {
                  let result: ReturnType<typeof fn>;
                  if (this === receiver) {
                    // receiver is a Proxy, proxy for url.searchParams
                    // if we use a Proxy, it will throw `Value of "this" must be of type URLSearchParams`
                    result = fn.apply(url.searchParams, args as any);
                  } else {
                    result = fn.apply(this, args as any);
                  }
                  //! reactively update the URL hash
                  location.hash = url.pathname + url.search + url.hash;
                  return result;
                };
                return modifiedFn;
              default:
                const value = Reflect.get(url.searchParams, prop, receiver);
                if (typeof value === "function")
                  return function (this: any, ...args: any[]) {
                    if (this === receiver) {
                      // receiver is a Proxy, proxy for url.searchParams
                      // if we use a Proxy, it will throw `Value of "this" must be of type URLSearchParams`
                      return value.apply(url.searchParams, args);
                    }
                    return value.apply(this, args);
                  };
                return value;
            }
          },
        });

      switch (k) {
        case "hash":
        case "href":
        case "search":
        case "pathname":
          return Reflect.get(url, k);
        case /** readonly */ "searchParams":
          // this ensure that we always return the same searchParams every time
          return _.searchParams;
        case "toString":
        case "toJSON":
          const fn = Reflect.get(url, k, receiver);
          return function (this: any, ...args: any) {
            if (this === receiver) {
              // this is the Proxy, so we need to use the real URL object here, which is equivalent to url
              return fn.apply(url, args);
            }
            return fn.apply(this, args);
          };
        default:
          return sourceURL[k];
      }
    },
    set(_, prop, newValue) {
      const k = prop as keyof URL;
      const sourceURL = new URL(location.href);
      const path = withPrefixSlash(normalizePath(withoutPrefixHash(sourceURL.hash)));
      const url = new URL(path, sourceURL);

      switch (k) {
        case "hash":
        case "href":
        case "search":
        case "pathname":
          Reflect.set(url, k, newValue);
          location.hash = url.pathname + url.search + url.hash;
          return true;
        case /** readonly */ "searchParams":
          return true;
        default:
          return Reflect.set(location, prop, newValue);
      }
    },
  });
}

function withPrefixSlash(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

function withoutPrefixHash(path: string) {
  return path.startsWith("#") ? path.slice(1) : path;
}

function normalizePath(path: string) {
  return path.replace(/\\/g, "/");
}
