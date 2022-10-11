/**
 * This script ships a URL api based object to access the location.hash
 * It attachs `$router` to window, so can accessd via window.$router
 * It extends `path` property so can access location.hash via $router.path
 * Just listen the router by hashchange event
 **/

function removeHeadHash(str) {
    return str.startsWith("#") ? str.slice(1) : str;
}

function getCurrentRoute() {
    const base = location.origin;
    const hash = removeHeadHash(location.hash);
    const url = new URL(hash, base);
    return url;
}

const $router = new Proxy(getCurrentRoute(), {
    set(target, p, newValue, receiver) {
        if (p === "path") {
            location.hash = newValue;
            target = getCurrentRoute();
            return;
        }
        const triedURL = getCurrentRoute();
        triedURL[p] = newValue;
        const unneeded = target.origin + target.pathname;
        location.hash = triedURL.href.replace(unneeded, "");
        target = getCurrentRoute();
    },
    get(target, p, receiver) {
        if (p === "path") return removeHeadHash(location.hash);
        return target[p];
    },
});
