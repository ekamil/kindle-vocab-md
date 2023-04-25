import esbuild from "esbuild";
import process from "process";
import metadata from "./package.json" assert { type: "json" };


esbuild.build({
    entryPoints: ["src/main.ts"],
    outfile: "dist/main.js",
    bundle: true,
    external: Object.keys(metadata.dependencies).concat(Object.keys(metadata.devDependencies)),
    packages: "external",
    format: "ecm",
    target: "esnext",
    platform: "node",
    sourcemap: true,
    minify: false,
    treeShaking: true,
    logLevel: "debug"
}).catch(() => process.exit(1));