# hash-router

A simple hash router for vanillaJS and web-components  
Use path-to-regexp

## Usage

```js
import { createHashRouter, $router } from "./router.js";
```

```js
createHashRouter(document.body, [
    {
        path: "/",
        component: `<h1>Home</h1>`,
    },
    {
        path: "/user/:id", // path, except from special handler, should always starts with a slash
        component: `<h1>User</h1>`,
    },
    {
        path: "404", // special handler
        component: `<h1>404</h1>`,
    },
    {
        path: "/node",
        // component can also be Node
        component: (() => {
            const a = document.createElement("a");
            a.innerText = `Node`;
            return a;
        })(),
    },
    {
        path: "/color/:color",
        // component can also be a function, which returns html string
        component({ params }) {
            return `<h1 style="color:${params.color}">Color!</h1>`;
        },
    },

    {
        path: "/div/:color?",
        // component can also be a function, which returns Node
        component({ params }) {
            const div = document.createElement("div");
            div.innerText = `<div>DIV</div>`;
            div.style.color = params.color;
            return div;
        },
    },
]);
```

```js
// you can get params from `createHashRouter.result`, if any path is matched, except from 404 handler
console.log(createHashRouter.result?.params);
// the result is same as the one passed to the component function

// $router is a helper URL object, notice that the hashChange listener just depend on the pathname,
// rather than the entire hash
$router.path = "/";
$router.pathname = "/color/red";
$router.searchParams.set("key", "value");
```
