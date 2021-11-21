import socketio
import numpy as np

sio = socketio.Client()

update_current_location_cb = None
mapping_sensor_cb = None

def start_server(update_cb, map_cb):
    global update_current_location_cb

    update_current_location_cb = update_cb
    mapping_sensor_cb = map_cb
    sio.connect('http://10.100.31.190:5000', {'client':'server'})

def close_server():
    sio.disconnect()

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
    if not update_current_location_cb is None:
        update_current_location_cb(data)

# button pressed pairing over event with coordinates
@sio.on('pairing_over')
def on_message(data):
    if not mapping_sensor_cb is None:
        mapping_sensor_cb(data)

@sio.on('pairing_reset')
def on_message(data):
    print("Resetting!")


if __name__ == "__main__":
    start_server(None)