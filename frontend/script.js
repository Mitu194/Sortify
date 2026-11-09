const $ = (id) => document.getElementById(id);
const info = {
    bubble:
    {
        name: "Bubble Sort",
        desc: "Bubble Sort repeatedly compares adjacent elements and swaps them when they are in the wrong order. After each pass, the largest remaining element settles at the end.",
        steps: ["Start at the first element.",
            "Compare each pair of adjacent elements.",
            "Swap the pair if they are in the wrong order.",
            "Repeat passes until no swaps are needed."],
        best: "O(n)", average: "O(n²)", worst: "O(n²)",
        space: "O(1)",
        code: ["void bubbleSort(int arr[], int n) {",
            "    for (int i = 0; i < n - 1; i++) {",
            "        bool swapped = false;",
            "        for (int j = 0; j < n - i - 1; j++) {",
            "            if (arr[j] > arr[j + 1]) {",
            "                swap(&arr[j], &arr[j + 1]);",
            "                swapped = true;",
            "            }",
            "        }",
            "        if (!swapped) break;",
            "    }",
            "}"],
        lines: { 3: 3, 4: 4, 5: 5 }
    },


    selection:
    {
        name: "Selection Sort",
        desc: "Selection Sort divides the array into sorted and unsorted parts. It repeatedly finds the smallest element in the unsorted part and places it at the beginning of that part.",
        steps: ["Assume the first unsorted element is the minimum.", "Scan the remaining unsorted elements.", "Update the minimum when a smaller element is found.", "Swap the minimum with the first unsorted element.", "Move the boundary one position right."],
        best: "O(n²)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)",
        code: [
            "void selectionSort(int arr[], int n) {",
            "    for (int i = 0; i < n - 1; i++) {",
            "        int min = i;",
            "        for (int j = i + 1; j < n; j++) {",
            "            if (arr[j] < arr[min]) {",
            "                min = j;",
            "            }",
            "        }",
            "        swap(&arr[i], &arr[min]);",
            "    }",
            "}"
        ],
        lines: { 3: 3, 5: 6, 6: 6 }
    },


    insertion: {
        name: "Insertion Sort",
        desc: "Insertion Sort builds a sorted prefix one element at a time. It stores the current value as a key, shifts larger values to the right, and inserts the key into its correct position.",
        steps: ["Treat the first element as a sorted section.", "Take the next element as the key.", "Compare the key with elements to its left.", "Shift larger elements one position right.", "Insert the key in the empty position."],
        best: "O(n)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)",
        code: [
            "void insertionSort(int arr[], int n) {",
            "    for (int i = 1; i < n; i++) {",
            "        int key = arr[i];",
            "        int j = i - 1;",
            "        while (j >= 0 && arr[j] > key) {",
            "            arr[j + 1] = arr[j];",
            "            j--;",
            "        }",
            "        arr[j + 1] = key;",
            "    }",
            "}"
        ],
        lines: { 2: 2, 3: 4, 4: 5, 5: 8, 6: 9 }
    },


    merge:
    {
        name: "Merge Sort",
        desc: "Merge Sort uses divide and conquer. It recursively divides the array into smaller halves, sorts each half, and merges the sorted halves into one ordered array.", steps: ["Divide the current range into two halves.", "Recursively divide each half.", "Continue until each subarray has one element.", "Compare front elements of the two halves.", "Copy the smaller element into the merged range.", "Copy remaining elements and return."],
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n log n)",
        space: "O(n)",
        code: [
            "void mergeSort(int arr[], int l, int r) {",
            "    if (l < r) {",
            "        int mid = l + (r - l) / 2;",
            "        mergeSort(arr, l, mid);",
            "        mergeSort(arr, mid + 1, r);",
            "        merge(arr, l, mid, r);",
            "    }",
            "}"
        ],
        lines: { 2: 2, 5: 10, 7: 12, 8: 13 }
    },

    quick: {
        name: "Quick Sort",
        desc: "Quick Sort selects a pivot and partitions the array so values on one side belong before the pivot and values on the other side belong after it. It then recursively sorts both partitions.", steps: ["Choose a pivot element.", "Scan the range and compare each value with the pivot.", "Move values belonging before the pivot to the left.", "Place the pivot in its final position.", "Recursively sort the left and right partitions."], best: "O(n log n)", average: "O(n log n)", worst: "O(n²)", space: "O(log n) average",
        code: [
            "int partition(int arr[], int low, int high) {",
            "    int pivot = arr[high];",
            "    int i = low - 1;",
            "    for (int j = low; j < high; j++) {",
            "        if (arr[j] <= pivot) {",
            "            i++;",
            "            swap(&arr[i], &arr[j]);",
            "        }",
            "    }",
            "    swap(&arr[i + 1], &arr[high]);",
            "    return i + 1;",
            "}"
        ], lines: { 2: 2, 3: 3, 4: 4, 5: 6, 6: 7 }
    },
    heap: {
        name: "Heap Sort", 
        desc: "Heap Sort first builds a binary heap. It repeatedly moves the root (the largest value for ascending order) to the end of the unsorted section and restores the heap property.", 
        steps: ["Build a max heap from the array for ascending order.", "Compare the parent with its left and right children.", "Swap the parent with the largest child when needed.", "Move the root to the end of the unsorted section.", "Heapify the reduced heap and repeat."], 
        best: "O(n log n)", 
        average: "O(n log n)", 
        worst: "O(n log n)", 
        space: "O(1)",
        code: [
            "void heapSort(int arr[], int n) {",
            "    for (int i = n / 2 - 1; i >= 0; i--)",
            "        heapify(arr, n, i);",
            "    for (int i = n - 1; i > 0; i--) {",
            "        swap(&arr[0], &arr[i]);",
            "        heapify(arr, i, 0);",
            "    }",
            "}"
        ],
        lines: { 2: 3, 3: 4, 4: 5, 5: 6, 6: 7 }
    }
};
let events = [], cursor = 0, timer = null, elapsed = 0, finalArray = [];
let visualizationMode = "array";
function parseInput() { const raw = $("arrayInput").value.trim(); if (!raw) throw Error("Enter at least one integer."); const parts = raw.split(/[,\s]+/); if (parts.length > 100) throw Error("Maximum array size is 100."); const nums = parts.map(x => { if (!/^-?\d+$/.test(x)) throw Error(`"${x}" is not a valid integer.`); const n = Number(x); if (!Number.isSafeInteger(n) || Math.abs(n) > 1000000) throw Error("Values must be between -1,000,000 and 1,000,000."); return n; }); return nums; }
function showAlgorithm() { const key = $("algorithm").value, d = info[key]; $("visualTitle").textContent = d.name; $("algorithmDescription").textContent = d.desc; $("algorithmSteps").innerHTML = d.steps.map(s => `<li>${s}</li>`).join(""); $("bestCase").textContent = d.best; $("averageCase").textContent = d.average; $("worstCase").textContent = d.worst; $("spaceCase").textContent = d.space; loadSource(); }
function loadSource() {
    const key = $("algorithm").value;
    const code = info[key].code;

    $("codeDisplay").innerHTML = code.map((line, i) =>
        `<span class="code-line" data-line="${i + 1}">
            <span class="line-no">${i + 1}</span>${escapeHtml(line)}
        </span>`
    ).join("");
}
function escapeHtml(s) { return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"); }
function draw(values, ev = {}) {
    const container = $("bars");
    const compare = [ev.i, ev.j].filter(x => Number.isInteger(x) && x >= 0 && x < values.length);
    const moved = ev.type === "swap" ? [ev.i, ev.j] : ev.type === "write" ? [ev.i] : [];
    const isDone = cursor === events.length - 1 && events.length > 0 && ev.message === "Sorting completed";
    const max = Math.max(1, ...values.map(v => Math.abs(v)));

    container.classList.toggle("array-view", visualizationMode === "array");
    container.classList.toggle("bar-view", visualizationMode === "bars");
    container.setAttribute("aria-label", visualizationMode === "array" ? "Array cell visualization" : "Bar chart visualization");

    container.innerHTML = values.map((value, index) => {
        const state = isDone ? "sorted" : moved.includes(index) ? "swap" : compare.includes(index) ? "compare" : "";
        if (visualizationMode === "array") {
            return `<div class="array-item ${state}">
                <span class="array-index">${index}</span>
                <span class="array-value">${value}</span>
            </div>`;
        }

        // Use a shared zero baseline so negative values are represented correctly.
        const height = Math.max(3, (Math.abs(value) / max) * 88);
        return `<div class="bar-wrap ${state}">
            <span class="bar-value">${value}</span>
            <div class="bar ${state}" style="height:${height}%" title="Index ${index}: ${value}"></div>
            <span class="bar-index">${index}</span>
        </div>`;
    }).join("");
}

function setVisualizationMode(mode) {
    visualizationMode = mode;
    $("arrayViewBtn").classList.toggle("active", mode === "array");
    $("barViewBtn").classList.toggle("active", mode === "bars");
    $("arrayViewBtn").setAttribute("aria-pressed", String(mode === "array"));
    $("barViewBtn").setAttribute("aria-pressed", String(mode === "bars"));
    $("viewHint").textContent = mode === "array"
        ? "Values shown in indexed cells"
        : "Bar height represents value size";

    // Redraw the current event only; the sorting trace and playback position stay unchanged.
    if (events.length) draw(events[cursor].values, events[cursor]);
    else {
        try { draw(parseInput()); }
        catch { draw([45, 12, 89, 23, 5]); }
    }
}

function render() {
    if (!events.length) return; const ev = events[cursor]; draw(ev.values, ev); $("stepLabel").textContent = `Step ${cursor + 1} / ${events.length}`; $("eventMessage").textContent = ev.message; $("comparisons").textContent = ev.counts.comparisons; $("swaps").textContent = ev.counts.swaps; $("writes").textContent = ev.counts.writes; $("time").textContent = cursor === events.length - 1 ? `${elapsed.toFixed(3)} ms` : "—";
    document.querySelectorAll(".code-line").forEach(el => el.classList.toggle("active", Number(el.dataset.line) === ev.line));
    const v = ev.vars || {}; $("variables").innerHTML = Object.entries(v).map(([k, val]) => `<span>${k} = ${val}</span>`).join(""); $("prevBtn").disabled = cursor === 0; $("nextBtn").disabled = cursor === events.length - 1; $("playBtn").textContent = timer ? "Ⅱ Pause" : "▶ Play"; $("restartBtn").disabled = false;
    $("passes").textContent = ev.counts.passes ?? 0;
}
function stop() { if (timer) { clearInterval(timer); timer = null; } if (events.length) $("playBtn").textContent = "▶ Play"; }
function next() { if (cursor < events.length - 1) { cursor++; render(); } else stop(); }
function play() { if (timer) { stop(); return; } if (!events.length || cursor === events.length - 1) return; timer = setInterval(() => { if (cursor < events.length - 1) { cursor++; render(); } else stop(); }, Number($("speed").value)); $("playBtn").textContent = "Ⅱ Pause"; }
async function start() {
    stop(); $("error").textContent = ""; let array; try { array = parseInput(); } catch (e) { $("error").textContent = e.message; return; } const btn = $("startBtn"); btn.disabled = true; btn.textContent = "Running C algorithm…";
    try { const res = await fetch("/api/sort", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ array, algorithm: $("algorithm").value, order: $("order").value }) }); const data = await res.json(); if (!res.ok) throw Error(data.error || "Could not execute sorting program."); events = data.events; elapsed = data.elapsed_ms; finalArray = data.final_array; cursor = 0; if (!events.length) throw Error("The C program returned no trace events.");["prevBtn", "playBtn", "nextBtn", "restartBtn"].forEach(id => $(id).disabled = false); render(); } catch (e) { $("error").textContent = e.message; } finally { btn.disabled = false; btn.textContent = "▶ Visualize sorting"; }
}
function reset() {
    stop();
    events = [];
    cursor = 0;
    try {
        draw(parseInput());
    }
    catch {
        draw([45, 12, 89, 23, 5]);
    }
    $("stepLabel").textContent = "Ready to start";
    $("eventMessage").textContent = "Enter an array and select Visualize sorting to begin.";
    $("comparisons").textContent = "0";
    $("swaps").textContent = "0";
    $("writes").textContent = "0";
    $("time").textContent = "—";
    $("passes").textContent = "0";
    $("variables").innerHTML = '<span class="empty">Run the algorithm to inspect variables.</span>';
    document.querySelectorAll(".code-line").forEach(el => el.classList.remove("active"));
    ["prevBtn", "playBtn", "nextBtn", "restartBtn"].forEach(id => $(id).disabled = true);
}
$("algorithm").addEventListener("change", () => { showAlgorithm(); reset(); }); $("startBtn").addEventListener("click", start); $("playBtn").addEventListener("click", play); $("nextBtn").addEventListener("click", () => { stop(); next(); }); $("prevBtn").addEventListener("click", () => { stop(); if (cursor > 0) { cursor--; render(); } }); $("restartBtn").addEventListener("click", () => { stop(); cursor = 0; render(); }); $("resetBtn").addEventListener("click", reset); $("randomBtn").addEventListener("click", () => { $("arrayInput").value = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10).join(", "); reset(); }); $("speed").addEventListener("change", () => { if (timer) { stop(); play(); } });
$("arrayViewBtn").addEventListener("click", () => setVisualizationMode("array"));
$("barViewBtn").addEventListener("click", () => setVisualizationMode("bars"));
showAlgorithm(); reset();