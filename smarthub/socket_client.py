import socketio

sio = socketio.Client()
sio.connect('http://localhost:5000', {'client':'server'})

@sio.event
def connect():
    print("I'm connected!")

@sio.event
def connect_error(data):
    print("The connection failed!")

@sio.event
def disconnect():
    print("I'm disconnected!")

# current IMU data from the phone streamed
@sio.on('data_transfer')
def on_message(data):
    print('Location Data ', data)

# button pressed pairing over event with coordinates
@sio.on('pairing_over')
def on_message(data):
    print('Paring over coordinates ', data)