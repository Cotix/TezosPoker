from flask import Flask, request, send_from_directory
from flask_socketio import SocketIO, emit, join_room, leave_room
app = Flask(__name__)

socketio = SocketIO(app)

@app.route('/static/<path:path>')
def send_static(path):
    mimetype = 'text/html'
    if path.endswith('.js'):
        mimetype = 'text/javascript'
    return send_from_directory('static', path, mimetype=mimetype)

@socketio.on('join')
def on_join(data):
    #username = data['username']
    channel = data['channel']
    join_room(channel)
    #send(username + ' has entered the room.', channel=channel)

@socketio.on('leave')
def on_leave(data):
    #username = data['username']
    room = data['room']
    leave_room(room)
    #send(username + ' has left the room.', room=room)

@socketio.on("send message")
def message(data):
    room = data['channel']
    emit('broadcast message', data['message'], room=room)

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')


if __name__ == "__main__":
    socketio.run(app, debug=True)