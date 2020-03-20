from flask import Flask, request, send_from_directory
from flask_socketio import SocketIO
app = Flask(__name__)

socketio = SocketIO(app)

@app.route('/static/<path:path>')
def send_static(path):
    mimetype = 'text/html'
    if path.endswith('.js'):
        mimetype = 'text/javascript'
    return send_from_directory('static', path, mimetype=mimetype)


@app.route('/')
def index():
    return send_from_directory('static', 'index.html')


if __name__ == "__main__":
    socketio.run(app, debug=True)