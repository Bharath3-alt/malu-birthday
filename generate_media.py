import math
import os
import struct
import wave

import numpy as np
import imageio.v3 as iio

os.makedirs("media/childhood", exist_ok=True)
os.makedirs("media/music", exist_ok=True)

# Create a simple animated placeholder video for the childhood gallery
fps = 12
frames = []
for i in range(fps * 3):
    height, width = 720, 1280
    frame = np.full((height, width, 3), (248, 219, 232), dtype=np.uint8)
    yy, xx = np.ogrid[:height, :width]
    center_x = 640 + int(28 * math.sin(i / fps * 2 * math.pi))
    center_y = 360 + int(18 * math.cos(i / fps * 2 * math.pi))
    radius = 160
    mask = (xx - center_x) ** 2 + (yy - center_y) ** 2 < radius ** 2
    frame[:, :, 0] = np.where(mask, 255, frame[:, :, 0])
    frame[:, :, 1] = np.where(mask, 207, frame[:, :, 1])
    frame[:, :, 2] = np.where(mask, 223, frame[:, :, 2])
    frames.append(frame)

video_path = "media/childhood/childhood-video.mp4"
iio.imwrite(video_path, np.array(frames), fps=fps, quality=8)

# Create a soft looping birthday melody in WAV format
sample_rate = 22050
duration_seconds = 8
samples = []
for i in range(int(sample_rate * duration_seconds)):
    t = i / sample_rate
    base = 0.30 * math.sin(2 * math.pi * 220 * t) + 0.20 * math.sin(2 * math.pi * 294 * t)
    melody = 0.12 * math.sin(2 * math.pi * 330 * t)
    value = max(-1.0, min(1.0, base + melody))
    samples.append(struct.pack("<h", int(value * 32767)))

with wave.open("media/music/birthday-soft.wav", "wb") as wav_file:
    wav_file.setnchannels(1)
    wav_file.setsampwidth(2)
    wav_file.setframerate(sample_rate)
    wav_file.writeframes(b"".join(samples))

print("Created media/childhood/childhood-video.mp4 and media/music/birthday-soft.wav")
