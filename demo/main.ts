import { imageToAscii, transform } from "../src/index.js";
import type { LayoutMode } from "../src/types.js";

// --- DOM elements ---
const dropZone = document.getElementById("dropZone") as HTMLDivElement;
const imageInput = document.getElementById("imageInput") as HTMLInputElement;
const codeInput = document.getElementById("codeInput") as HTMLTextAreaElement;
const modeSelect = document.getElementById("mode") as HTMLSelectElement;
const widthInput = document.getElementById("width") as HTMLInputElement;
const thresholdInput = document.getElementById("threshold") as HTMLInputElement;
const thresholdValue = document.getElementById(
	"thresholdValue",
) as HTMLSpanElement;
const contrastInput = document.getElementById("contrast") as HTMLInputElement;
const contrastValue = document.getElementById(
	"contrastValue",
) as HTMLSpanElement;
const brightnessInput = document.getElementById(
	"brightness",
) as HTMLInputElement;
const brightnessValue = document.getElementById(
	"brightnessValue",
) as HTMLSpanElement;
const invertCheck = document.getElementById("invert") as HTMLInputElement;
const ditherCheck = document.getElementById("dither") as HTMLInputElement;
const transformBtn = document.getElementById(
	"transformBtn",
) as HTMLButtonElement;
const statusEl = document.getElementById("status") as HTMLDivElement;
const outputEl = document.getElementById("output") as HTMLPreElement;
const outputInfo = document.getElementById("outputInfo") as HTMLSpanElement;
const copyBtn = document.getElementById("copyBtn") as HTMLButtonElement;
const runBtn = document.getElementById("runBtn") as HTMLButtonElement;
const consoleEl = document.getElementById("console") as HTMLDivElement;

// --- State ---
let imageData: Uint8Array | null = null;
let currentOutput = "";

// --- Image handling ---
function handleFile(file: File) {
	const reader = new FileReader();
	reader.onload = () => {
		imageData = new Uint8Array(reader.result as ArrayBuffer);
		transformBtn.disabled = false;

		// Show preview
		const blobUrl = URL.createObjectURL(file);
		dropZone.innerHTML = `<img src="${blobUrl}" alt="preview" /><input type="file" id="imageInput" accept="image/*" style="display:none" />`;
		dropZone.classList.add("has-image");

		// Re-bind file input
		const newInput = dropZone.querySelector("input") as HTMLInputElement;
		newInput.addEventListener("change", () => {
			if (newInput.files?.[0]) handleFile(newInput.files[0]);
		});
	};
	reader.readAsArrayBuffer(file);
}

dropZone.addEventListener("click", () => imageInput.click());
imageInput.addEventListener("change", () => {
	if (imageInput.files?.[0]) handleFile(imageInput.files[0]);
});

dropZone.addEventListener("dragover", (e) => {
	e.preventDefault();
	dropZone.classList.add("dragover");
});
dropZone.addEventListener("dragleave", () =>
	dropZone.classList.remove("dragover"),
);
dropZone.addEventListener("drop", (e) => {
	e.preventDefault();
	dropZone.classList.remove("dragover");
	if (e.dataTransfer?.files[0]) handleFile(e.dataTransfer.files[0]);
});

// --- Slider displays ---
thresholdInput.addEventListener("input", () => {
	thresholdValue.textContent = thresholdInput.value;
});
contrastInput.addEventListener("input", () => {
	contrastValue.textContent = (Number(contrastInput.value) / 100).toFixed(1);
});
brightnessInput.addEventListener("input", () => {
	brightnessValue.textContent = (Number(brightnessInput.value) / 100).toFixed(
		1,
	);
});

// --- Transform ---
transformBtn.addEventListener("click", async () => {
	if (!imageData) return;

	const code = codeInput.value.trim();
	const mode = modeSelect.value as LayoutMode;
	const width = Number(widthInput.value);
	const threshold = Number(thresholdInput.value);
	const contrast = Number(contrastInput.value) / 100;
	const brightness = Number(brightnessInput.value) / 100;
	const invert = invertCheck.checked;
	const dither = ditherCheck.checked;

	setStatus("processing", "Transforming...");
	transformBtn.disabled = true;
	consoleEl.style.display = "none";
	consoleEl.innerHTML = "";

	try {
		const t0 = performance.now();

		let result: string;
		if (code) {
			result = await transform(code, {
				image: imageData,
				mode,
				compress: false,
				ascii: { width, threshold, contrast, brightness, invert, dither },
			});
		} else {
			result = await imageToAscii(imageData, {
				width,
				threshold,
				contrast,
				brightness,
				invert,
				dither,
			});
		}

		const elapsed = (performance.now() - t0).toFixed(0);
		currentOutput = result;

		outputEl.textContent = result;
		const lines = result.split("\n").length;
		const bytes = new TextEncoder().encode(result).length;
		outputInfo.textContent = `${lines} lines | ${formatBytes(bytes)} | ${elapsed}ms`;

		copyBtn.disabled = false;
		runBtn.disabled = !code;
		setStatus("success", "Done");
	} catch (err) {
		setStatus("error", `Error: ${(err as Error).message}`);
	} finally {
		transformBtn.disabled = false;
	}
});

// --- Copy ---
copyBtn.addEventListener("click", async () => {
	if (!currentOutput) return;
	await navigator.clipboard.writeText(currentOutput);
	const orig = copyBtn.textContent;
	copyBtn.textContent = "Copied!";
	setTimeout(() => {
		copyBtn.textContent = orig;
	}, 1500);
});

// --- Run ---
runBtn.addEventListener("click", () => {
	if (!currentOutput) return;

	consoleEl.style.display = "block";
	consoleEl.innerHTML = "";

	// Intercept console.log for display
	const origLog = console.log;
	const origError = console.error;
	const origWarn = console.warn;

	const addLine = (cls: string, ...args: unknown[]) => {
		const div = document.createElement("div");
		div.className = cls;
		div.textContent = args
			.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
			.join(" ");
		consoleEl.appendChild(div);
	};

	console.log = (...args) => {
		origLog(...args);
		addLine("log", ...args);
	};
	console.error = (...args) => {
		origError(...args);
		addLine("error", ...args);
	};
	console.warn = (...args) => {
		origWarn(...args);
		addLine("log", ...args);
	};

	try {
		// The generated code uses eval(atob(...)) internally — indirect eval for global scope
		const indirectEval = eval;
		indirectEval(currentOutput);
		addLine("success", "--- executed successfully ---");
	} catch (err) {
		addLine("error", `Error: ${(err as Error).message}`);
	} finally {
		console.log = origLog;
		console.error = origError;
		console.warn = origWarn;
	}
});

// --- Helpers ---
function setStatus(type: "processing" | "error" | "success", message: string) {
	statusEl.className = `status ${type}`;
	statusEl.textContent = message;
}

function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	return `${(bytes / 1024).toFixed(1)} KB`;
}

// --- Keyboard shortcut ---
document.addEventListener("keydown", (e: KeyboardEvent) => {
	if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
		e.preventDefault();
		transformBtn.click();
	}
});
