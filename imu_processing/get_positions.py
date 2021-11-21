import numpy as np

data = np.zeros((3, 30))
prev_position = np.array([0,0])
prev_velocity = np.array([0,0])
dt = 1 / 16.6666

positions = np.zeros((data.shape[0], 2))

for i in range(data):
    positions[i] = prev_position

    current_acceleration = data[i]

    prev_position += prev_velocity * dt
    prev_velocity += current_acceleration * dt