"""
LectureAI — Flask backend
- In locale: avvia Flask + icona nel system tray + apre il browser
- Su Render (o altri hosting cloud): avvia solo Flask (niente tray)
- La rilevazione avviene automaticamente tramite variabili d'ambiente
"""

from flask import Flask, render_template, request, jsonify, Response
import requests
import threading
import webbrowser
import time
import os
import sys

app = Flask(__name__, static_folder='assets', static_url_path='/assets')

# ── Rileva se stiamo girando in cloud ─────────────────────────────────────────
# Render imposta RENDER=true; altri provider hanno variabili simili.
# Se siamo in cloud, NON carichiamo pystray/PIL (che richiedono un display).
IS_CLOUD = bool(
    os.environ.get('RENDER') or
    os.environ.get('DYNO') or           # Heroku
    os.environ.get('FLY_APP_NAME') or   # Fly.io
    os.environ.get('RAILWAY_ENVIRONMENT')  # Railway
)

# ── Import tray (solo se siamo in locale) ─────────────────────────────────────
if not IS_CLOUD:
    try:
        import pystray
        from PIL import Image, ImageDraw
        HAS_TRAY = True
    except ImportError:
        HAS_TRAY = False
        print("[LectureAI] pystray/PIL non installati — avvio senza icona tray.")
else:
    HAS_TRAY = False

# ── CORS headers su tutte le risposte ─────────────────────────────────────────
@app.after_request
def add_cors(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = (
        'Content-Type, Authorization, X-Api-Key, anthropic-version'
    )
    return response

@app.route('/api/<path:p>', methods=['OPTIONS'])
def options_handler(p):
    return '', 204

# ── Ping (keepalive) ──────────────────────────────────────────────────────────
@app.route('/api/ping', methods=['POST'])
def ping():
    return '', 204

# ── Proxy Gemini ──────────────────────────────────────────────────────────────
@app.route('/api/gemini/<path:model_path>', methods=['POST'])
def proxy_gemini(model_path):
    api_key = request.args.get('key', '')
    url = f'https://generativelanguage.googleapis.com/v1beta/models/{model_path}?key={api_key}'
    try:
        resp = requests.post(url, json=request.get_json(), timeout=120)
        return Response(
            resp.content,
            status=resp.status_code,
            content_type=resp.headers.get('Content-Type', 'application/json')
        )
    except requests.exceptions.ConnectionError:
        return jsonify({'error': {'message': 'Nessuna connessione internet o host irraggiungibile.'}}), 503
    except requests.exceptions.Timeout:
        return jsonify({'error': {'message': 'Timeout: il server Gemini non ha risposto in tempo.'}}), 504
    except Exception as e:
        return jsonify({'error': {'message': str(e)}}), 500

@app.route('/api/gemini-models', methods=['GET'])
def proxy_gemini_models():
    api_key = request.args.get('key', '')
    url = f'https://generativelanguage.googleapis.com/v1beta/models?key={api_key}'
    try:
        resp = requests.get(url, timeout=30)
        return Response(
            resp.content,
            status=resp.status_code,
            content_type=resp.headers.get('Content-Type', 'application/json')
        )
    except requests.exceptions.ConnectionError:
        return jsonify({'error': 'Nessuna connessione internet.'}), 503
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ── Proxy Anthropic ───────────────────────────────────────────────────────────
@app.route('/api/anthropic/messages', methods=['POST'])
def proxy_anthropic():
    api_key = request.headers.get('X-Api-Key', '') or request.headers.get('x-api-key', '')
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': api_key,
        'anthropic-version': '2023-06-01',
    }
    try:
        resp = requests.post(
            'https://api.anthropic.com/v1/messages',
            json=request.get_json(),
            headers=headers,
            timeout=120
        )
        return Response(
            resp.content,
            status=resp.status_code,
            content_type=resp.headers.get('Content-Type', 'application/json')
        )
    except requests.exceptions.ConnectionError:
        return jsonify({'error': {'message': 'Nessuna connessione internet o host irraggiungibile.'}}), 503
    except requests.exceptions.Timeout:
        return jsonify({'error': {'message': 'Timeout: il server Anthropic non ha risposto in tempo.'}}), 504
    except Exception as e:
        return jsonify({'error': {'message': str(e)}}), 500

# ── Proxy OpenAI ──────────────────────────────────────────────────────────────
@app.route('/api/openai/chat/completions', methods=['POST'])
def proxy_openai():
    auth = request.headers.get('Authorization', '')
    headers = {'Content-Type': 'application/json', 'Authorization': auth}
    try:
        resp = requests.post(
            'https://api.openai.com/v1/chat/completions',
            json=request.get_json(), headers=headers, timeout=120
        )
        return Response(resp.content, status=resp.status_code,
                        content_type=resp.headers.get('Content-Type', 'application/json'))
    except requests.exceptions.ConnectionError:
        return jsonify({'error': {'message': 'Nessuna connessione internet.'}}), 503
    except requests.exceptions.Timeout:
        return jsonify({'error': {'message': 'Timeout OpenAI.'}}), 504
    except Exception as e:
        return jsonify({'error': {'message': str(e)}}), 500

# ── Proxy DeepSeek ────────────────────────────────────────────────────────────
@app.route('/api/deepseek/chat/completions', methods=['POST'])
def proxy_deepseek():
    auth = request.headers.get('Authorization', '').strip()
    if not auth:
        key = request.headers.get('X-Api-Key', '').strip()
        if key:
            auth = f'Bearer {key}'
    if not auth:
        return jsonify({'error': {'message': 'API key DeepSeek mancante.'}}), 401

    headers = {'Content-Type': 'application/json', 'Authorization': auth}
    try:
        resp = requests.post(
            'https://api.deepseek.com/v1/chat/completions',
            json=request.get_json(), headers=headers, timeout=180
        )
        return Response(resp.content, status=resp.status_code,
                        content_type=resp.headers.get('Content-Type', 'application/json'))
    except requests.exceptions.ConnectionError:
        return jsonify({'error': {'message': 'Nessuna connessione internet o host irraggiungibile.'}}), 503
    except requests.exceptions.Timeout:
        return jsonify({'error': {'message': 'Timeout: DeepSeek non ha risposto in tempo.'}}), 504
    except Exception as e:
        return jsonify({'error': {'message': str(e)}}), 500

# ── Frontend ──────────────────────────────────────────────────────────────────
@app.route('/')
def index():
    return render_template('index.html')

# ── System Tray (solo in locale) ──────────────────────────────────────────────
def _load_icon_image():
    try:
        from PIL import Image
        base = os.path.dirname(os.path.abspath(__file__))
        for name in ('icon.png', 'icon_32.png', 'icon_256.png', 'icon.ico'):
            path = os.path.join(base, 'assets', name)
            if os.path.exists(path):
                img = Image.open(path).convert('RGBA')
                img = img.resize((64, 64), Image.LANCZOS)
                return img
    except Exception:
        pass
    try:
        from PIL import Image, ImageDraw
        img = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        draw.ellipse([2, 2, 62, 62], fill=(196, 68, 10, 255))
        draw.rectangle([20, 16, 28, 48], fill=(255, 255, 255, 255))
        draw.rectangle([20, 40, 44, 48], fill=(255, 255, 255, 255))
        return img
    except Exception:
        return None

def _run_flask_local():
    app.run(debug=False, host='localhost', port=5000, use_reloader=False)

def _open_browser():
    webbrowser.open('http://localhost:5000')

def _setup_tray():
    """Blocca il thread principale (richiesto da pystray su Windows)."""
    if not HAS_TRAY:
        # Nessun tray disponibile: mantieni vivo il processo
        threading.Event().wait()
        return

    icon_image = _load_icon_image()
    if icon_image is None:
        try:
            from PIL import Image
            icon_image = Image.new('RGBA', (64, 64), (196, 68, 10, 255))
        except Exception:
            threading.Event().wait()
            return

    def on_open(icon, item):
        _open_browser()

    def on_quit(icon, item):
        icon.stop()
        os._exit(0)

    menu = pystray.Menu(
        pystray.MenuItem('Apri LectureAI', on_open, default=True),
        pystray.Menu.SEPARATOR,
        pystray.MenuItem('Esci', on_quit),
    )

    tray = pystray.Icon(
        name='LectureAI',
        icon=icon_image,
        title='LectureAI — in esecuzione',
        menu=menu,
    )
    tray.run()

# ── Avvio ─────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    if IS_CLOUD:
        # Modalità server (Render, Railway, Fly.io, Heroku)
        # Gunicorn di solito importa `app` direttamente, questo blocco
        # viene eseguito solo se qualcuno lancia `python app.py` in cloud.
        port = int(os.environ.get('PORT', 5000))
        app.run(host='0.0.0.0', port=port, debug=False)
    else:
        # Modalità desktop: Flask in thread + browser + tray
        threading.Thread(target=_run_flask_local, daemon=True).start()

        # Aspetta che Flask sia pronto (max 6 secondi)
        for _ in range(20):
            time.sleep(0.3)
            try:
                requests.get('http://localhost:5000/', timeout=1)
                break
            except Exception:
                pass

        # Apri il browser
        threading.Thread(target=_open_browser, daemon=True).start()

        # Tray sul thread principale (obbligatorio su Windows con pystray)
        _setup_tray()