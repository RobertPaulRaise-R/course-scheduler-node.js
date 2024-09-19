const fs = require("fs/promises");
const path = require("path");
const VideoLength = require("video-length");

async function getVideoLength(video) {
  try {
    const length = await VideoLength(video);
    return length;
  } catch (err) {
    console.error(`Error getting length for ${video}:`, err);
    return 0;
  }
}

module.exports = getVideoLength;
