import esbuild from "esbuild";
import process from "process";


// "build": "esbuild src/main.ts --bundle --outfile=dist/main.js --loader:.njk=text --sourcemap --platform=node --packages=external",


esbuild.build({
    entryPoints: ["src/main.ts"],
    outfile: "dist/main.js",
    bundle: true,
    external: [
        "commander",
    ],
    loader: {
        ".njk": "text"
    },
    packages: "external",
    format: "cjs",
    target: "es2018",
    platform: "node",
    logLevel: "info",
    sourcemap: true,
    treeShaking: true,
}).catch(() => process.exit(1));