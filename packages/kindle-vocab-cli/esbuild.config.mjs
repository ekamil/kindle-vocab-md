import esbuild from "esbuild";
import process from "process";
import metadata from "./package.json" assert { type: "json" };


esbuild.build({
    entryPoints: ["src/main.ts"],
    outfile: "dist/main.js",
    bundle: true,
    external: Object.keys(metadata.dependencies).concat(Object.keys(metadata.devDependencies)),
    loader: {
        ".njk": "text"
    },
    packages: "external",
    format: "cjs",
    target: "es2018",
    platform: "node",
    sourcemap: true,
    minify: false,
    treeShaking: true,
    logLevel: "error"
}).catch(() => process.exit(1));