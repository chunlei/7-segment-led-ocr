#!/usr/bin/env python

import numpy
import cv2
import win32api
import win32con
import time
from pytesseract import image_to_string
from PIL import Image, ImageGrab

LANG = 'token'
CTL_BTN_CENTER = (1220, 1024)
TOKEN_AREA = (1520, 850, 1703, 914)
INTERVAL = 20

def recognize(digital):
    cv2.imwrite('threshold.png', digital)
    ret = image_to_string(Image.fromarray(digital), lang=LANG, config="-psm 7 nobatch token").replace(' ', '')
    f = file('token.txt', 'w')
    f.write(ret)
    print 'ret:' + ret

def clickPlay():
    win32api.SetCursorPos(CTL_BTN_CENTER)
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)
    time.sleep(0.5)

def main():
    btnX, btnY = CTL_BTN_CENTER
    controlBtn = ImageGrab.grab((btnX, btnY, btnX + 1, btnY + 1))
    pause = (255, 144, 29) == controlBtn.getpixel((0,0))
    if (pause):
        clickPlay()

    pic = ImageGrab.grab(TOKEN_AREA)
    pic.save('token.png')

    display = numpy.array(pic.convert('RGB'))

    display = cv2.cvtColor(display, cv2.COLOR_BGR2GRAY)
    display = cv2.adaptiveThreshold(display, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    display = cv2.medianBlur(display, 5)

    recognize(display)

if __name__ == '__main__':
    while True:
        main()
        time.sleep(INTERVAL)
