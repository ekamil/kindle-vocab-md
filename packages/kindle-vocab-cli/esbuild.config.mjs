import esbuild from "esbuild";
import process from "process";


esbuild.build({
    entryPoints: ["src/main.ts"],
    outfile: "dist/main.js",
    bundle: true,
    format: "esm",
    target: "es2016",
    platform: "node",
    sourcemap: true,
    minify: false,
    treeShaking: true,
    logLevel: "debug"
}).catch((error) => {
    console.log(error);
    process.exit(1);
});