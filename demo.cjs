const fs = require("node:fs");
const { transform } = require("./dist/index.cjs");

const code = fs.readFileSync("./src/index.ts", "utf-8");
console.log("Source length:", code.length, "chars\n");

async function demo() {
	const shaded = await transform(code, {
		image: "./backup/mask.jpeg",
		mode: "shaded",
		compress: true,
		ascii: { width: 140 },
	});
	console.log(shaded);

	console.log("\n--- stats ---");
	console.log("Output length:", shaded.length, "chars");
	console.log("Output lines:", shaded.split("\n").length);

	try {
		new Function(shaded);
		console.log("Valid JavaScript: YES");
	} catch (e) {
		console.log("Parse check:", e.message);
	}
}

demo().catch(console.error);
