# Sortify – Interactive Sorting Visualizer

A light-theme web application that executes six sorting algorithms in C and visualizes the execution trace in the browser.

## Features
- Bubble, Selection, Insertion, Merge, Quick and Heap Sort in C
- Custom integer input, random arrays, ascending/descending order
- Step-by-step playback: play, pause, previous, next, restart, speed
- Animated array bars and event messages
- C source-code panel with current-line highlighting
- Live variable values and comparison/swap/write counters
- Execution time measured around the C process invocation

## Requirements
- Python 3.9+
- GCC available as `gcc` in PATH
- A terminal

## Run on Windows (PowerShell)
```powershell
cd Sortify
py -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python backend/app.py
```

## Run on Git Bash
```bash
cd Sortify
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
python backend/app.py
```

Open http://127.0.0.1:5000

## Notes
- The C source is compiled by Flask when a sorting request is made.
- If GCC is not found, install MSYS2 MinGW-w64 UCRT64 GCC and add `C:\msys64\ucrt64\bin` to PATH, then restart the terminal.
- Input is limited to 100 integers between -1,000,000 and 1,000,000.
- The code panel loads the actual `algorithms/sortify.c` source file. Trace events carry C source line numbers, so the corresponding line is highlighted during playback.
- Execution time includes process startup and trace output, so it is a teaching/demo metric, not a rigorous benchmark. Use repeated runs and larger input sizes for benchmarking.
