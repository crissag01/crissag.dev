import pygame
import ctypes
import ctypes.wintypes as w
import cv2
import sys
import time

user32 = ctypes.windll.user32
GetSystemMetrics = user32.GetSystemMetrics

# ── Config ───────────────────────────────────────────────────────────────────
VIDEO_PATH = r"C:\Users\criss\Videos\meme1.mp4"

W = GetSystemMetrics(0)
H = GetSystemMetrics(1)

pygame.init()
screen = pygame.display.set_mode((W, H), pygame.NOFRAME)
pygame.display.set_caption("wallpaper")

hwnd = pygame.display.get_wm_info()["window"]

HWND_BOTTOM = 1
user32.SetWindowPos(hwnd, HWND_BOTTOM, 0, 0, W, H, 0x0040)

# ── Video ─────────────────────────────────────────────────────────────────────
cap = cv2.VideoCapture(VIDEO_PATH)
if not cap.isOpened():
    print(f"ERROR: No se pudo abrir: {VIDEO_PATH}")
    pygame.quit()
    sys.exit(1)

fps   = cap.get(cv2.CAP_PROP_FPS) or 30
vid_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
vid_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
ratio = min(W / vid_w, H / vid_h)
new_w = int(vid_w * ratio)
new_h = int(vid_h * ratio)
pos_x = (W - new_w) // 2
pos_y = (H - new_h) // 2

print(f"Video: {vid_w}x{vid_h} @ {fps:.1f}fps")

clock = pygame.time.Clock()

# ── Loop ──────────────────────────────────────────────────────────────────────
try:
    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                raise SystemExit

        ret, frame = cap.read()
        if not ret:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue

        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame = cv2.resize(frame, (new_w, new_h), interpolation=cv2.INTER_LINEAR)

        screen.fill((0, 0, 0))
        surface = pygame.surfarray.make_surface(frame.transpose(1, 0, 2))
        screen.blit(surface, (pos_x, pos_y))
        pygame.display.flip()

        # Mantener al fondo continuamente
        user32.SetWindowPos(hwnd, HWND_BOTTOM, 0, 0, 0, 0, 0x0001 | 0x0002)

        clock.tick(fps)

except (KeyboardInterrupt, SystemExit):
    pass
finally:
    cap.release()
    pygame.quit()
    sys.exit(0)