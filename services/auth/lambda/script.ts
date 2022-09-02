import glob from "glob";
import { join, dirname, basename } from "path";
import { mkdirSync, writeFileSync } from "fs";
import { last } from "lodash";
import { path } from "pdfkit";
const ncc = require("@vercel/ncc");

glob("**/*.js", {}, function (er, files) {
	files.forEach((file) => {
		console.log(file);
		if (last(dirname(file).split("/")) == basename(file, ".js")) {
			ncc(join(process.cwd(), file), {
				sourceMap: true,
				sourceMapRegister: true,
			}).then(
				({
					code,
					map,
					assets,
				}: {
					code: any;
					map: any;
					assets: any;
				}) => {
					var outDir = join(process.cwd(), dirname(file), "ncc");
					mkdirSync(outDir, { recursive: true });
					writeFileSync(join(outDir, "index.js"), code);
					writeFileSync(join(outDir, "index.js.map"), map);
					for (var [assetName, assetCode] of Object.entries(assets)) {
						writeFileSync(
							join(outDir, assetName),
							(assetCode as any).source.toString("utf8")
						);
					}
				}
			);
		}
	});
});
// ncc("/path/to/input", {
// 	// provide a custom cache path or disable caching
// 	cache: "./custom/cache/path" | false,
// 	// externals to leave as requires of the build
// 	externals: ["externalpackage"],
// 	// directory outside of which never to emit assets
// 	filterAssetBase: process.cwd(), // default
// 	minify: false, // default
// 	sourceMap: false, // default
// 	assetBuilds: false, // default
// 	sourceMapBasePrefix: "../", // default treats sources as output-relative
// 	// when outputting a sourcemap, automatically include
// 	// source-map-support in the output file (increases output by 32kB).
// 	sourceMapRegister: true, // default
// 	watch: false, // default
// 	license: "", // default does not generate a license file
// 	v8cache: false, // default
// 	quiet: false, // default
// 	debugLog: false, // default
// }).then(({ code, map, assets }) => {
// 	console.log(code);
// 	// Assets is an object of asset file names to { source, permissions, symlinks }
// 	// expected relative to the output code (if any)
// });
