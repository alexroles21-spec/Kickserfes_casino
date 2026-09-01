const { spawn } = require('child_process');
const express = require('express');

const app = express();
app.use(express.static('public'));

// الرابط المباشر ديال الفيديو ديالك
const videoUrl = 'https://h.uguu.se/yvytkbeu.mp4'; 
const rtmpUrl = 'rtmps://fa723fc1b171.global-contribute.live-video.net/sk_us-west-2_zn6w1wJJ6Zvd_wjGoMi8oUp4K3xuPZPTJWVxXGjIPmh';

let currentStream = spawn('ffmpeg', [
    '-re',
    '-stream_loop', '-1',
    '-i', videoUrl,
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-b:v', '3000k',
    '-maxrate', '3000k',
    '-bufsize', '6000k',
    '-pix_fmt', 'yuv420p',
    '-g', '60',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-f', 'flv',
    rtmpUrl
]);

currentStream.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Streaming Server is running on port ${PORT}`);
});
