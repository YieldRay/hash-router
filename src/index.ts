/**
 * @param [source] A function that returns the URL string to be used as the source.
 * @returns A Proxy object that behaves like a URL object, but with the pathname derived from the hash fragment of the source URL.
 */
export function createHashedURL(location = window.location) {
  return new Proxy(Object.create(null) as URL, {
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
              // methods that will change the state of URLSearchParams
              case "append":
              case "delete":
              case "set":
              case "sort":
                const fn = Reflect.get(url.searchParams, prop, receiver) as URLSearchParams[typeof prop];
                const modifiedFn = function (this: any, ...args: Parameters<typeof fn>) {
                  let result;
                  if (this === receiver) {
                    // receiver is a Proxy, proxy for url.searchParams
                    // if we use a Proxy, it will throw `Value of "this" must be of type URLSearchParams`
                    result = fn.apply(url.searchParams, args as any);
                  } else {
                    result = fn.apply(this, args as any);
                  }
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
          return function toJSON(this: any, ...args: any) {
            if (this === receiver) {
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
