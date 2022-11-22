import { match, type MatchFunction, Match, MatchResult } from "path-to-regexp";
import $router from "./proxy";
export { $router };

interface Route {
    // use `path-to-regexp` to match
    path: string;
    // the component is simply html string which will set to innerHTML
    component: string | Node | ((matched: Match) => string | Node);
    // component can also be a function
    // if is matched, the component function always receive object
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

function renderToContainer(containerElement: Element, component: Route["component"], result: MatchResult | false) {
    switch (typeof component) {
        case "string": {
            containerElement.innerHTML = component;
            break;
        }
        case "function": {
            const html = component(result);
            if (typeof html === "string") {
                containerElement.innerHTML = html;
            } else if (html instanceof Node) {
                containerElement.innerHTML = "";
                containerElement.appendChild(html);
            } else {
                throw new Error("the component function should return html string or Node");
            }
            break;
        }
        default: {
            if (component instanceof Node) {
                containerElement.innerHTML = "";
                containerElement.appendChild(component);
            } else {
                throw new Error("component is not defined or invalid");
            }
        }
    }
}

interface CreateRouterFunction {
    (containerElement: Element, routes: Array<Route>): void;
    result: Match;
}
/**
 *
 * @param containerElement The container element where the component is rendered
 * @param routes Route Array
 */
export const createHashRouter: CreateRouterFunction = function (containerElement: Element, routes: Array<Route>) {
    if (!Array.isArray(routes)) throw new Error("routes should be an array");
    const matcher = createMatchRoute(routes);

    const matchOne = () => {
        const hash = $router.pathname; //! use $router.pathname
        let isMatched = false;
        for (const route of matcher) {
            const result = route._fn(hash);
            if (result) {
                createHashRouter.result = result; // add result
                renderToContainer(containerElement, route.component, result);
                isMatched = true;
                break;
            }
        }
        if (!isMatched) {
            const result = false;
            createHashRouter.result = result;
            const notFoundRoute = routes.find((r) => r.path == "404");
            if (notFoundRoute) {
                renderToContainer(containerElement, notFoundRoute.component, result);
            } else {
                containerElement.innerHTML = `404 Not Found`;
            }
        }
    };

    window.addEventListener("hashchange", matchOne);
    matchOne();
} as CreateRouterFunction;
