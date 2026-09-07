@echo off
cd /d "%~dp0"
echo Open http://127.0.0.1:5178/ in your browser.
echo Keep this window open. Press Ctrl+C to stop.
python -m http.server 5178 --bind 127.0.0.1
pause
