const { spawn } = require('child_process');
const express = require('express');

const app = express();
app.use(express.static('public'));

// رابط مباشر ثابث ومستقر كيقبله FFmpeg 100% بدون أي مشاكل
const videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'; 
const rtmpUrl = 'rtmps://fa723fc1b171.global-contribute.live-video.net/sk_us-west-2_zn6w1wJJ6Zvd_wjGoMi8oUp4K3xuPZPTJWVxXGjIPmh';

function startStream() {
    console.log('Starting FFmpeg stream...');
    let ffmpeg = spawn('ffmpeg', [
        '-re',
        '-stream_loop', '-1',
        '-i', videoUrl,
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-b:v', '2500k',
        '-maxrate', '2500k',
        '-bufsize', '5000k',
        '-pix_fmt', 'yuv420p',
        '-g', '60',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-f', 'flv',
        rtmpUrl
    ]);

    ffmpeg.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    ffmpeg.on('close', (code) => {
        console.log(`FFmpeg process exited with code ${code}, restarting in 5 seconds...`);
        setTimeout(startStream, 5000);
    });
}

startStream();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Streaming Server is running on port ${PORT}`);
});
