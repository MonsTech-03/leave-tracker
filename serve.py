from flask import Flask, send_from_directory
import os

DIST_DIR = os.path.join(os.path.dirname(__file__), 'dist', 'leave-tracker', 'browser')

app = Flask(__name__)

@app.route('/')
def index():
    return send_from_directory(DIST_DIR, 'index.html')

@app.route('/<path:path>')
def serve(path):
    # Try to serve the file, fall back to index.html for SPA routing
    full_path = os.path.join(DIST_DIR, path)
    if os.path.isfile(full_path):
        return send_from_directory(DIST_DIR, path)
    return send_from_directory(DIST_DIR, 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4200, debug=False)
