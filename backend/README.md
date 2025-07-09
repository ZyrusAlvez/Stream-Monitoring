# 📡 Stream Monitoring Backend

This backend monitors and scrapes streaming sources such as TV Garden, Radio Garden, and IPTV using FastAPI and Playwright.

---

## ⚠️ Python Compatibility

> ❗ **This project only supports Python 3.11**

---

### ❓ Why Python 3.11 only?

Playwright uses `asyncio.create_subprocess_exec()` internally for browser control.

However, in **Python 3.13 on Windows**, this function raises a `NotImplementedError`, making Playwright crash on startup.

> 🔧 Python 3.11 is fully compatible and stable with Playwright on all platforms.

---

## ✅ Recommended Setup

1. **Install Python 3.11**
   - Download from: https://www.python.org/downloads/release/python-3110/
   - ✅ During installation, check “Add Python to PATH”

2. **Create and activate a virtual environment**
   ```bash
   python3.11 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate