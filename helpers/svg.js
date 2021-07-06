const fs = require("fs");
const handlebars = require("handlebars");
const ltx = require("ltx");
const resolve = require("resolve");

const path = "../svg/";
const nameToModule = {};
const cache = {};

module.exports = function (name, opts) {
	name = path + name;

	const mod =
		nameToModule[name] ||
		(nameToModule[name] = resolve.sync(name, {
			extensions: [".svg"],
		}));

	const content =
		cache[name] || (cache[name] = fs.readFileSync(mod, "utf-8"));

	const svg = parse(content);

	Object.assign(svg.attrs, opts.hash);

	return new handlebars.SafeString(svg.root().toString());
};

module.exports.cache = cache;

function parse(xml, mod) {
	const svg = ltx.parse(xml);
	if (svg.name != "svg") {
		throw new TypeError("Input must be an SVG");
	}

	delete svg.attrs.xmlns;
	delete svg.attrs["xmlns:xlink"];

	return svg;
}
