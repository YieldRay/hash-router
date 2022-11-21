import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
    input: "src/router.ts",
    output: {
        dir: "dist",
        format: "umd",
        name: "hashRouter",
        sourcemap: true,
    },
    plugins: [typescript(), nodeResolve()],
};
