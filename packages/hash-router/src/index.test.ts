import test from "node:test";
import assert from "node:assert";
import { createHashedURL } from "./index.ts";

// @ts-ignore
const ancestorOrigins: DOMStringList = [];
ancestorOrigins.item = () => null;
ancestorOrigins.contains = () => false;

/**
 * DummyLocation class for testing purposes, fully implements the Location interface
 * Can simulate browser location object behavior
 */
export class DummyLocation implements Location {
  #url: URL;

  constructor(href: string | URL) {
    this.#url = new URL(href);
  }

  // read/write properties
  get hash(): string {
    return this.#url.hash;
  }

  set hash(value: string) {
    this.#url.hash = value;
  }

  get host(): string {
    return this.#url.host;
  }
  set host(value: string) {
    this.#url.host = value;
  }

  get hostname(): string {
    return this.#url.hostname;
  }
  set hostname(value: string) {
    this.#url.hostname = value;
  }

  get href(): string {
    return this.#url.href;
  }
  set href(value: string) {
    this.#url = new URL(value);
  }

  get pathname(): string {
    return this.#url.pathname;
  }
  set pathname(value: string) {
    this.#url.pathname = value;
  }

  get port(): string {
    return this.#url.port;
  }

  set port(value: string) {
    this.#url.port = value;
  }
  get protocol(): string {
    return this.#url.protocol;
  }

  set protocol(value: string) {
    this.#url.protocol = value;
  }

  get search(): string {
    return this.#url.search;
  }

  set search(value: string) {
    this.#url.search = value;
  }

  // readonly properties
  get origin(): string {
    return this.#url.origin;
  }

  get ancestorOrigins(): DOMStringList {
    return ancestorOrigins;
  }

  assign(url: string | URL): void {
    this.#url = new URL(url.toString());
  }

  reload(): void {
    // nothing
  }

  replace(url: string | URL): void {
    this.#url = new URL(url.toString());
  }

  toString(): string {
    return this.href;
  }

  valueOf(): string {
    return this.href;
  }
}

test("should modify searchParams and update href correctly", () => {
  const url = createHashedURL(new DummyLocation("https://example.net/pathname?query#hash?q=a#extra"));
  url.searchParams.set("q", "b");
  assert.strictEqual(url.href, "https://example.net/hash?q=b#extra");
});

test("should extract searchParams from hash fragment", () => {
  const url = createHashedURL(new DummyLocation("https://example.net/pathname?query#hash?q=a#extra"));
  assert.strictEqual(url.searchParams.get("q"), "a");
});

test("should update searchParams and reflect in href", () => {
  const url = createHashedURL(new DummyLocation("https://example.net/pathname?query#hash?q=a#extra"));
  url.searchParams.set("q", "1");
  assert.strictEqual(url.href, "https://example.net/hash?q=1#extra");
});

// Test basic URL property access
test("basic property access - hash", () => {
  const url = createHashedURL(new DummyLocation("https://example.com/page#/home?tab=1#section"));
  assert.strictEqual(url.hash, "#section");
});

test("basic property access - pathname", () => {
  const url = createHashedURL(new DummyLocation("https://example.com/page#/home?tab=1#section"));
  assert.strictEqual(url.pathname, "/home");
});

test("basic property access - search", () => {
  const url = createHashedURL(new DummyLocation("https://example.com/page#/home?tab=1#section"));
  assert.strictEqual(url.search, "?tab=1");
});

test("basic property access - href", () => {
  const url = createHashedURL(new DummyLocation("https://example.com/page#/home?tab=1#section"));
  assert.strictEqual(url.href, "https://example.com/home?tab=1#section");
});

// Test properties inherited from source URL
test("inherited source URL properties - protocol", () => {
  const url = createHashedURL(new DummyLocation("https://example.com/page#/home"));
  assert.strictEqual(url.protocol, "https:");
});

test("inherited source URL properties - hostname", () => {
  const url = createHashedURL(new DummyLocation("https://example.com:8080/page#/home"));
  assert.strictEqual(url.hostname, "example.com");
});

test("inherited source URL properties - port", () => {
  const url = createHashedURL(new DummyLocation("https://example.com:8080/page#/home"));
  assert.strictEqual(url.port, "8080");
});

test("inherited source URL properties - origin", () => {
  const url = createHashedURL(new DummyLocation("https://example.com:8080/page#/home"));
  assert.strictEqual(url.origin, "https://example.com:8080");
});

// Test various searchParams methods
test("searchParams.size", () => {
  const location = new DummyLocation("https://example.com/page#/home?existing=value");
  const url = createHashedURL(location);
  assert.strictEqual(url.searchParams.size, 1);
});

test("searchParams.append() method", () => {
  const location = new DummyLocation("https://example.com/page#/home?existing=value");
  const url = createHashedURL(location);

  url.searchParams.append("new", "param");
  assert.strictEqual(url.search, "?existing=value&new=param");
  assert.strictEqual(location.hash, "#/home?existing=value&new=param");
});

test("searchParams.delete() method", () => {
  const location = new DummyLocation("https://example.com/page#/home?param1=value1&param2=value2");
  const url = createHashedURL(location);

  url.searchParams.delete("param1");
  assert.strictEqual(url.search, "?param2=value2");
  assert.strictEqual(location.hash, "#/home?param2=value2");
});

test("searchParams.sort() method", () => {
  const location = new DummyLocation("https://example.com/page#/home?z=1&a=2&m=3");
  const url = createHashedURL(location);

  url.searchParams.sort();
  assert.strictEqual(url.search, "?a=2&m=3&z=1");
  assert.strictEqual(location.hash, "#/home?a=2&m=3&z=1");
});

test("searchParams.get() method", () => {
  const url = createHashedURL(new DummyLocation("https://example.com/page#/home?param=value"));
  assert.strictEqual(url.searchParams.get("param"), "value");
  assert.strictEqual(url.searchParams.get("nonexistent"), null);
});

// Tests for destructured searchParams methods throwing TypeError
test("should throw error when using destructured searchParams.set", () => {
  const url = createHashedURL(new DummyLocation("https://example.net/pathname?query#hash?q=a#extra"));
  const { set } = url.searchParams;
  assert.throws(() => set("k", "v"), {
    name: "TypeError",
    message: 'Value of "this" must be of type URLSearchParams',
  });
});

test("should throw error when using destructured searchParams.append", () => {
  const url = createHashedURL(new DummyLocation("https://example.net/pathname?query#hash?q=a#extra"));
  const { append } = url.searchParams;
  assert.throws(() => append("k", "v"), {
    name: "TypeError",
    message: 'Value of "this" must be of type URLSearchParams',
  });
});

test("should throw error when using destructured searchParams.delete", () => {
  const url = createHashedURL(new DummyLocation("https://example.net/pathname?query#hash?q=a#extra"));
  const { delete: del } = url.searchParams;
  assert.throws(() => del("k"), {
    name: "TypeError",
    message: 'Value of "this" must be of type URLSearchParams',
  });
});

test("should throw error when using destructured searchParams.get", () => {
  const url = createHashedURL(new DummyLocation("https://example.net/pathname?query#hash?q=a#extra"));
  const { get } = url.searchParams;
  assert.throws(() => get("k"), {
    name: "TypeError",
    message: 'Value of "this" must be of type URLSearchParams',
  });
});

test("should throw error when using destructured searchParams.getAll", () => {
  const url = createHashedURL(new DummyLocation("https://example.net/pathname?query#hash?q=a#extra"));
  const { getAll } = url.searchParams;
  assert.throws(() => getAll("k"), {
    name: "TypeError",
    message: 'Value of "this" must be of type URLSearchParams',
  });
});

test("should throw error when using destructured searchParams.has", () => {
  const url = createHashedURL(new DummyLocation("https://example.net/pathname?query#hash?q=a#extra"));
  const { has } = url.searchParams;
  assert.throws(() => has("k"), {
    name: "TypeError",
    message: 'Value of "this" must be of type URLSearchParams',
  });
});

test("should throw error when using destructured searchParams.sort", () => {
  const url = createHashedURL(new DummyLocation("https://example.net/pathname?query#hash?q=a#extra"));
  const { sort } = url.searchParams;
  assert.throws(() => sort(), {
    name: "TypeError",
    message: 'Value of "this" must be of type URLSearchParams',
  });
});

test("should throw error when using destructured searchParams.keys", () => {
  const url = createHashedURL(new DummyLocation("https://example.net/pathname?query#hash?q=a#extra"));
  const { keys } = url.searchParams;
  assert.throws(() => keys(), {
    name: "TypeError",
    message: 'Value of "this" must be of type URLSearchParams',
  });
});

test("should throw error when using destructured searchParams.values", () => {
  const url = createHashedURL(new DummyLocation("https://example.net/pathname?query#hash?q=a#extra"));
  const { values } = url.searchParams;
  assert.throws(() => values(), {
    name: "TypeError",
    message: 'Value of "this" must be of type URLSearchParams',
  });
});

test("should throw error when using destructured searchParams.entries", () => {
  const url = createHashedURL(new DummyLocation("https://example.net/pathname?query#hash?q=a#extra"));
  const { entries } = url.searchParams;
  assert.throws(() => entries(), {
    name: "TypeError",
    message: 'Value of "this" must be of type URLSearchParams',
  });
});

test("should throw error when using destructured searchParams.forEach", () => {
  const url = createHashedURL(new DummyLocation("https://example.net/pathname?query#hash?q=a#extra"));
  const { forEach } = url.searchParams;
  assert.throws(() => forEach(() => {}), {
    name: "TypeError",
    message: 'Value of "this" must be of type URLSearchParams',
  });
});

test("should throw error when using destructured searchParams.toString", () => {
  const url = createHashedURL(new DummyLocation("https://example.net/pathname?query#hash?q=a#extra"));
  const { toString } = url.searchParams;
  assert.throws(() => toString(), {
    name: "TypeError",
    message: 'Value of "this" must be of type URLSearchParams',
  });
});

test("searchParams.has() method", () => {
  const url = createHashedURL(new DummyLocation("https://example.com/page#/home?param=value"));
  assert.strictEqual(url.searchParams.has("param"), true);
  assert.strictEqual(url.searchParams.has("nonexistent"), false);
});

test("searchParams.getAll() method", () => {
  const url = createHashedURL(new DummyLocation("https://example.com/page#/home?param=value1&param=value2"));
  const values = url.searchParams.getAll("param");
  assert.deepStrictEqual(values, ["value1", "value2"]);
});

// Test URL property setting
test("setting pathname", () => {
  const location = new DummyLocation("https://example.com/page#/home?param=value#section");
  const url = createHashedURL(location);

  url.pathname = "/new-path";
  assert.strictEqual(url.pathname, "/new-path");
  assert.strictEqual(location.hash, "#/new-path?param=value#section");
});

test("setting search", () => {
  const location = new DummyLocation("https://example.com/page#/home?old=param#section");
  const url = createHashedURL(location);

  url.search = "?new=param&another=value";
  assert.strictEqual(url.search, "?new=param&another=value");
  assert.strictEqual(location.hash, "#/home?new=param&another=value#section");
});

test("setting hash", () => {
  const location = new DummyLocation("https://example.com/page#/home?param=value#old-section");
  const url = createHashedURL(location);

  url.hash = "#new-section";
  assert.strictEqual(url.hash, "#new-section");
  assert.strictEqual(location.hash, "#/home?param=value#new-section");
});

test("setting href", () => {
  const location = new DummyLocation("https://example.com/page#/home");
  const url = createHashedURL(location);
  url.href = "https://example.com/new-path?param=value#section";
  assert.strictEqual(url.href, "https://example.com/new-path?param=value#section");
  assert.strictEqual(location.hash, "#/new-path?param=value#section");
});

// Test edge cases
test("empty hash handling", () => {
  const url = createHashedURL(new DummyLocation("https://example.com/page"));
  assert.strictEqual(url.pathname, "/");
  assert.strictEqual(url.search, "");
  assert.strictEqual(url.hash, "");
});

test("hash symbol only", () => {
  const url = createHashedURL(new DummyLocation("https://example.com/page#"));
  assert.strictEqual(url.pathname, "/");
  assert.strictEqual(url.search, "");
  assert.strictEqual(url.hash, "");
});

test("hash without path separator", () => {
  const url = createHashedURL(new DummyLocation("https://example.com/page#home"));
  assert.strictEqual(url.pathname, "/home");
  assert.strictEqual(url.search, "");
  assert.strictEqual(url.hash, "");
});

test("hash with backslash paths", () => {
  const url = createHashedURL(new DummyLocation("https://example.com/page#\\home\\path"));
  assert.strictEqual(url.pathname, "/home/path");
});

test("complex hash structure", () => {
  const url = createHashedURL(
    new DummyLocation("https://example.com/page#/path/to/resource?param1=value1&param2=value2#anchor")
  );
  assert.strictEqual(url.pathname, "/path/to/resource");
  assert.strictEqual(url.search, "?param1=value1&param2=value2");
  assert.strictEqual(url.hash, "#anchor");
});

// Test toString and toJSON methods
test("toString() method", () => {
  const url = createHashedURL(new DummyLocation("https://example.com/page#/home?param=value#section"));
  assert.strictEqual(url.toString(), "https://example.com/home?param=value#section");
});

test("toJSON() method", () => {
  const url = createHashedURL(new DummyLocation("https://example.com/page#/home?param=value#section"));
  assert.strictEqual(url.toJSON(), "https://example.com/home?param=value#section");
});

// Tests for destructured toString and toJSON methods on the url object
test("should throw error when using destructured url.toString", () => {
  const url = createHashedURL(new DummyLocation("https://example.com/page#/home?param=value#section"));
  const { toString } = url;
  assert.throws(() => toString(), {
    name: "TypeError",
    message: "Cannot read properties of undefined (reading 'URL')",
  });
});

test("should throw error when using destructured url.toJSON", () => {
  const url = createHashedURL(new DummyLocation("https://example.com/page#/home?param=value#section"));
  const { toJSON } = url;
  assert.throws(() => toJSON(), {
    name: "TypeError",
    message: "Cannot read properties of undefined (reading 'URL')",
  });
});

// Test searchParams iterators
test("searchParams iterator", () => {
  const url = createHashedURL(new DummyLocation("https://example.com/page#/home?a=1&b=2"));
  const entries = Array.from(url.searchParams.entries());
  assert.deepStrictEqual(entries, [
    ["a", "1"],
    ["b", "2"],
  ]);
});

test("searchParams keys() iterator", () => {
  const url = createHashedURL(new DummyLocation("https://example.com/page#/home?a=1&b=2"));
  const keys = Array.from(url.searchParams.keys());
  assert.deepStrictEqual(keys, ["a", "b"]);
});

test("searchParams values() iterator", () => {
  const url = createHashedURL(new DummyLocation("https://example.com/page#/home?a=1&b=2"));
  const values = Array.from(url.searchParams.values());
  assert.deepStrictEqual(values, ["1", "2"]);
});

// Test searchParams as readonly property
test("searchParams is readonly property", () => {
  const url = createHashedURL(new DummyLocation("https://example.com/page#/home"));
  const originalSearchParams = url.searchParams; // readonly, cannot assign

  assert.strictEqual(url.searchParams, originalSearchParams);
  assert.strictEqual(url.searchParams, url.searchParams);
});

// Test multiple method calls
test("multiple searchParams modifications", () => {
  const location = new DummyLocation("https://example.com/page#/home");
  const url = createHashedURL(location);
  url.searchParams.set("step", "1");
  assert.strictEqual(location.hash, "#/home?step=1");

  url.searchParams.set("step", "2");
  assert.strictEqual(location.hash, "#/home?step=2");

  url.searchParams.append("extra", "info");
  assert.strictEqual(location.hash, "#/home?step=2&extra=info");
});

// Test URL encoding
test("URL encoding handling", () => {
  const location = new DummyLocation("https://example.com/page#/home");
  const url = createHashedURL(location);
  url.searchParams.set("query", "hello world");
  assert.strictEqual(url.search, "?query=hello+world");
  assert.strictEqual(location.hash, "#/home?query=hello+world");
});

test("special characters in path", () => {
  const url = createHashedURL(new DummyLocation("https://example.com/page#/path with spaces"));
  assert.strictEqual(url.pathname, new URL("/path with spaces", "http://localhost").pathname);
});
