from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import subprocess, time
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
FRONTEND = BASE / "frontend"
SOURCE = BASE / "algorithms" / "sortify.c"
BINARY = BASE / "algorithms" / ("sortify.exe" if __import__("os").name == "nt" else "sortify")
app = Flask(__name__, static_folder=str(FRONTEND), static_url_path="")
CORS(app)

ALGORITHMS = {"bubble", "selection", "insertion", "merge", "quick", "heap"}

def compile_c():
    result = subprocess.run(["gcc", str(SOURCE), "-O2", "-o", str(BINARY)],
                            capture_output=True, text=True)
    if result.returncode:
        raise RuntimeError(result.stderr or "C compilation failed")

@app.get("/")
def home():
    return send_from_directory(FRONTEND, "index.html")

@app.get("/api/source")
def source_code():
    return jsonify(source=SOURCE.read_text(encoding="utf-8"))

@app.post("/api/sort")
def sort_array():
    data = request.get_json(silent=True) or {}
    algorithm = data.get("algorithm", "bubble")
    order = data.get("order", "asc")
    values = data.get("array", [])
    if algorithm not in ALGORITHMS:
        return jsonify(error="Unknown sorting algorithm"), 400
    if order not in ("asc", "desc"):
        return jsonify(error="Order must be asc or desc"), 400
    if not isinstance(values, list) or not 1 <= len(values) <= 100:
        return jsonify(error="Enter between 1 and 100 integers"), 400
    if any(type(v) is not int or abs(v) > 1000000 for v in values):
        return jsonify(error="Array values must be integers between -1,000,000 and 1,000,000"), 400

    try:
        compile_c()
        payload = f"{algorithm} {order} {len(values)} " + " ".join(map(str, values)) + "\n"
        start = time.perf_counter()
        result = subprocess.run([str(BINARY)], input=payload, capture_output=True,
                                text=True, timeout=5)
        elapsed = (time.perf_counter() - start) * 1000
        if result.returncode:
            return jsonify(error=result.stderr or "C program failed"), 500
        events = [__import__("json").loads(line) for line in result.stdout.splitlines() if line.strip()]
        return jsonify(events=events, elapsed_ms=round(elapsed, 4),
                       final_array=events[-1]["values"] if events else values)
    except FileNotFoundError:
        return jsonify(error="GCC was not found. Install GCC and add it to PATH."), 500
    except subprocess.TimeoutExpired:
        return jsonify(error="Sorting timed out. Try a smaller array."), 408
    except Exception as exc:
        return jsonify(error=str(exc)), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
