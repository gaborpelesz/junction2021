import numpy as np

corridor_top = np.array([108, 230])
corridor_bottom = np.array([531, 676])
corridor_distance_pixels = np.linalg.norm(corridor_top - corridor_bottom)
corridor_distance_meters = (200*8 + 199*100 + 50) / 1000
one_pixel_in_meters =  corridor_distance_meters / corridor_distance_pixels

def degToRad(degree):
    if degree is None: return 0
    return degree * np.pi /180

def getRotation(gamma, beta, alpha, isdegree=True):
    if isdegree:
        alpha, beta, gamma = degToRad(alpha), degToRad(beta), degToRad(gamma)

    if not alpha is None and not beta is None and not gamma is None:
        Rz = np.array([[np.cos(alpha), -np.sin(alpha), 0],
                    [np.sin(alpha),  np.cos(alpha), 0],
                    [0, 0, 1]])
        Ry = np.array([[np.cos(beta), 0, np.sin(beta)],
                    [0, 1, 0],
                    [-np.sin(beta), 0, np.cos(beta)]])
        Rx = np.array([[1, 0, 0],
                    [0, np.cos(gamma), -np.sin(gamma)],
                    [0, np.sin(gamma), np.cos(gamma)]])
    
        return Rz @ Ry @ Rx

    return np.eye(3)

def to_pixel(p, translation=(0,0)):
    p_pixel = p * (1 / one_pixel_in_meters)
    return (int(p_pixel[0]) + translation[0], int(p_pixel[1]) + translation[1])