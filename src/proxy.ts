/**
 * This script ships a URL api based object to access the location.hash
 * It attachs `$router` to window, so can accessd via window.$router
 * It extends `path` property so can access location.hash via $router.path
 * Just listen the router by hashchange event
 **/

export function removeHeadHash(hash: string): string {
    const removeHash = hash.startsWith("#") ? hash.slice(1) : hash;
    return removeHash.startsWith("/") ? removeHash : "/" + removeHash;
}

export function getCurrentRoute() {
    const base = location.origin;
    const hash = removeHeadHash(location.hash);
    const url = new URL(hash, base);
    return url;
}

export default new Proxy(Object.create(null), {
    set(target, p, newValue, receiver) {
        if (p === "path") {
            const path = String(newValue);
            location.hash = path.startsWith("/") ? path : "/" + path;
            return true;
        }

        const triedURL = getCurrentRoute(); // use a triedURL to calc the result
        Reflect.set(triedURL, p, newValue);
        location.hash = triedURL.href.replace(triedURL.origin, ""); // change hash, then triedURL can be GC
        return true;
    },
    get(target, p, receiver) {
        if (p === "path") return removeHeadHash(location.hash);
        const hashURL = getCurrentRoute(); // re-compute
        return Reflect.get(hashURL, p);
    },
});
