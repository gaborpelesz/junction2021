import cv2
import numpy as np
import utils

sample_data = {
  'pitch': -0.018804220482707024, # y
  'yaw': -1.517913818359375, # z
  'roll': 0.009052981622517109, # x
  'accX': 0,
  'accY': 0,
  'accZ': 0
}

floorplan = cv2.imread('business_floor1.jpeg', 1)
window_data = {
    'initial_location': (0, 0), # x, y of initial position (in pixels)
    'calibrated': False,
    'original_image': floorplan,
    'canvas': floorplan.copy(),
    'current_location': (0, 0)
}

prev_position = np.array([0, 0, 0], dtype=np.float64)
prev_velocity = np.array([0, 0, 0], dtype=np.float64)
dt = 1 / 16.6666

def update_current_location(incoming_data):
    global prev_position, prev_velocity

    orientation = incoming_data['roll'], incoming_data['pitch'], incoming_data['yaw']
    orientation = np.array(orientation)

    lin_acc_mobile = incoming_data['accX'], incoming_data['accY'], incoming_data['accZ']
    lin_acc_mobile = np.array(lin_acc_mobile)

    # transforming acceleration from mobile to world
    wTm = utils.getRotation(orientation[0], orientation[1], orientation[2], isdegree=False)
    mTw = np.linalg.inv(wTm)
    lin_acc_world = np.dot(mTw, lin_acc_mobile)

    new_position = prev_position + prev_velocity * dt
    prev_velocity += lin_acc_world * dt

    # DRAW
    p1 = utils.to_pixel(prev_position, translation=window_data['initial_location'])
    p2 = utils.to_pixel(new_position, translation=window_data['initial_location'])

    cv2.line(window_data['canvas'], p1, p2, (0,0,255), 5)

    prev_position = new_position

def mouse_handler(event, x, y, flags, window_data):
    if window_data['calibrated'] == False:
        if event == cv2.EVENT_LBUTTONDOWN:
            window_data['initial_location'] = x,y
            window_data['calibrated'] = True
            cv2.circle(window_data['canvas'], (x,y), 10, (0,0,255), -1)
            print(f"Initial position calibrated at: ({x}, {y})")


def main():
    wn = "Floorplan"
    cv2.namedWindow(wn, cv2.WINDOW_NORMAL)
    cv2.resizeWindow(wn, 1920, 1080)
    cv2.setMouseCallback(wn, mouse_handler, window_data)

    i = 0
    while True:
        cv2.imshow(wn, window_data['canvas'])

        key = cv2.waitKey(5)

        if window_data['calibrated'] and i < 5:
            sample_data['accX'] = 0.01
            i+=1
        update_current_location(sample_data)

        if key == ord('r'): # R
            window_data['initial_location'] = 0,0
            window_data['calibrated'] = False
            window_data['canvas'] = floorplan.copy()

        if key == 27: # ESC
            break

    cv2.destroyAllWindows()

if __name__ == '__main__':
    main()