import { createHashedURL } from "hash-router";

const app = document.getElementById("app")!;

const url = createHashedURL();

function render() {
  app.innerHTML = /*html*/ `\
<pre style="font-family: 'Fira Mono', 'Consolas', 'Menlo', 'Monaco', 'Liberation Mono', 'Courier New', monospace;">
URL { 
  hash: '${url.hash}'
  host: '${url.host}',
  hostname: '${url.hostname}',
  href: '${url.href}',
  origin: '${url.origin}',
  password: '${url.password}',
  pathname: '${url.pathname}',
  port: '${url.port}',
  protocol: '${url.protocol}',
  search: '${url.search}',
  searchParams: SearchParams {
${[...url.searchParams].map(([k, v]) => `    '${k}' => '${v}'`).join(",\n")},
    size: ${url.searchParams.size}
  }
  username: '${url.username}'
}
</pre>`;
}

render();

window.addEventListener("hashchange", () => {
  render();
});
