#!/data/data/com.termux/files/usr/bin/bash
echo ">>> إعداد مشروع CyberAI Weep على Termux"
pkg update -y && pkg upgrade -y
pkg install -y python git wget
pip install fastapi uvicorn llama-cpp-python
mkdir -p model
echo "[تم] لتشغيل الخادم: python3 mistral_api_server.py"
