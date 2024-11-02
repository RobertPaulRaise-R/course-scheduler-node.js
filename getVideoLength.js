const fs = require("fs/promises");
const path = require("path");
const VideoLength = require("video-length");
const ffmpeg = require("fluent-ffmpeg");

async function getVideoLengthLinux(path) {
  try {
    const duration = await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(path, (err, metadata) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(metadata.format.duration);
      });
    });
    return duration;
  } catch (error) {
    console.error(`Error getting video length: ${error.message}`);
  }
}

async function getVideoLengthWindows(video) {
  try {
    return await VideoLength(video);
  } catch (err) {
    console.error(`Error getting length for ${video}:`, err);
    return 0;
  }
}

module.exports = { getVideoLengthLinux, getVideoLengthWindows };
