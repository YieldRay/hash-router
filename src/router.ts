import { match, type MatchFunction, Match, MatchResult } from "path-to-regexp";
import { removeHeadHash } from "./utils";

interface Route {
    // use `path-to-regexp` to match
    path: string;
    // the component is simply html string which will set to innerHTML
    component?: string | ((matched: Match) => string);
    callback?: (matched: Match) => void;
    // callback is called before component is rendered
    // if is matched, the callback function always receive object
    // so except from 404 route, it can never be false
}

function createMatchRoute(routes: Array<Route>) {
    interface MatchRoute extends Route {
        _fn: MatchFunction;
    }

    // append match fn
    const definedMatcher: MatchRoute[] = [];
    for (const route of routes)
        definedMatcher.push({ ...route, _fn: match(route.path, { decode: decodeURIComponent }) });

    return definedMatcher;
}

/**
 *
 * @param containerElement The container element where the component is rendered
 * @param routes Route Array
 * @param refObj Given a reference Object, whenever router matches, the matched result will assigned to it
 */
export function createHashRouter(containerElement: Element, routes: Array<Route>, refObj?: object) {
    const matcher = createMatchRoute(routes);

    const matchOne = () => {
        const hash = removeHeadHash(location.hash);
        let isMatched = false;
        for (const route of matcher) {
            const result = route._fn(hash);
            if (result) {
                if (refObj) Object.assign(refObj, result);
                route.callback?.(result);
                switch (typeof route.component) {
                    case "string":
                        containerElement.innerHTML = route.component;
                        break;
                    case "function":
                        containerElement.innerHTML = route.component(result);
                        break;
                    default:
                        containerElement.innerHTML = "Error: component is not defined";
                }
                isMatched = true;
                break;
            }
        }
        if (!isMatched) {
            const notFoundRoute = routes.find((r) => r.path == "404");
            notFoundRoute?.callback?.(false);
            if (notFoundRoute)
                switch (typeof notFoundRoute.component) {
                    case "string":
                        containerElement.innerHTML = notFoundRoute.component;
                        break;
                    case "function":
                        containerElement.innerHTML = notFoundRoute.component(false);
                        break;
                    default:
                        containerElement.innerHTML = "Error: component is not defined";
                }
            else {
                containerElement.innerHTML = `404 Not Found`;
            }
            if (refObj) for (const key of Object.keys(refObj)) Reflect.deleteProperty(refObj, key);
        }
    };

    window.addEventListener("hashchange", matchOne);
    matchOne();
}

export { $router } from "./proxy";
