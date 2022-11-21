/**
 * This script ships a URL api based object to access the location.hash
 * It attachs `$router` to window, so can accessd via window.$router
 * It extends `path` property so can access location.hash via $router.path
 * Just listen the router by hashchange event
 **/

import { removeHeadHash } from "./utils";

function getCurrentRoute() {
    const base = location.origin;
    const hash = removeHeadHash(location.hash);
    const url = new URL(hash, base);
    return url;
}

export const $router = new Proxy(Object.create(null), {
    set(target, p, newValue, receiver) {
        if (p === "path") {
            location.hash = newValue;
            return true;
        }

        const triedURL = getCurrentRoute(); // use a triedURL to calc the result
        Reflect.set(triedURL, p, newValue);
        const unneeded = triedURL.origin + triedURL.pathname;
        location.hash = triedURL.href.replace(unneeded, ""); // change hash, then triedURL can be GC
        return true;
    },
    get(target, p, receiver) {
        if (p === "path") return removeHeadHash(location.hash);
        const hashURL = getCurrentRoute(); // re-compute
        return Reflect.get(hashURL, p);
    },
});
