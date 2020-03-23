from flask import Flask, request, send_from_directory
import random, string
from flask_socketio import SocketIO, emit, join_room, leave_room
app = Flask(__name__)

socketio = SocketIO(app)

current_room = None


@app.route('/static/<path:path>')
def send_static(path):
    mimetype = 'text/html'
    if path.endswith('.js'):
        mimetype = 'text/javascript'
    return send_from_directory('static', path, mimetype=mimetype)


@socketio.on('join')
def on_join():
    global current_room
    if not current_room:
        channel = ''.join(random.choice(string.ascii_letters) for i in range(10))
        current_room = channel
        join_room(channel)
        emit('lobby', {'room': channel}, room=channel)
    else:
        channel = current_room
        current_room = None
        join_room(channel)
        emit('start', {'room': channel}, room=channel)


@socketio.on('message')
def message(data):
    print(data)
    if not 'room' in data:
        return
    emit('message', data, room=data['room'])


@app.route('/')
def index():
    return send_from_directory('static', 'index.html')


if __name__ == "__main__":
    socketio.run(app, debug=True)