const { spawn } = require('child_process');

const rtmpUrl = 'rtmps://fa723fc1b171.global-contribute.live-video.net/sk_us-west-2_zn6w1wJJ6Zvd_wjGoMi8oUp4K3xuPZPTJWVxXGjIPmh';
const videoUrl = process.env.VIDEO_URL || 'رابط_فيديو_mp4_هنا';

function startStream() {
    const ffmpeg = spawn('ffmpeg', [
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

    ffmpeg.stdout.on('data', (data) => console.log(`stdout: ${data}`));
    ffmpeg.stderr.on('data', (data) => console.error(`stderr: ${data}`));

    ffmpeg.on('close', (code) => {
        console.log(`FFmpeg exited with code ${code}, restarting...`);
        setTimeout(startStream, 5000);
    });
}

startStream();
