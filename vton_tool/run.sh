#!/bin/bash
cd "$(dirname "$0")"

echo "========================================="
echo "   AI Virtual Try-On (CatVTON) - Mac M2  "
echo "========================================="

if [ ! -d "venv" ]; then
    echo "[!] Virtual environment not found. Setting up..."
    /opt/homebrew/bin/python3.12 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

echo "[*] Launching Gradio Web UI..."
python app.py
