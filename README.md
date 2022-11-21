# hash-router

A simple hash router for vanillaJS and web-components  
Use path-to-regexp

## Usage

```js
createHashRouter(
    document.body, // target element, the component (html string) will be injected into this element
    [
        {
            path: "/",
            component: `<h1>Home</h1>`,
            callback: console.log,
        },
        {
            path: "/user/:id", // path, except from special handler, should always starts with a slash
            component: `<h1>id</h1>`,
            callback: ({ params, path, index }) => {
                // this function called before component redered
                console.log(Number(params.id));
            },
        },
        {
            path: "/color/:color",
            component({ params }) {
                // component can also be a function
                return `<h1 style="color:${params.color}">Color!</h1>`;
            },
        },
        {
            path: "404", // special handler
            component: `<h1>404</h1>`,
            callback: console.log,
        },
    ]
);
```

creating an global param object

```js
const ref = Object.create(null);
createHashRouter(document.body, [], ref);

// you can get params from this ref object, if any path is matched, except from 404 handler
console.log(ref?.params);
```
