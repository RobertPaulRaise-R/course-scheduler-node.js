const fs = require("fs/promises");
const path = require("path");

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

async function getVideosFromDirectories(dirPath) {
  const arrayOfFiles = [];
  const dirsToExplore = [dirPath]; // Stack to explore directories

  while (dirsToExplore.length) {
    const currentDir = dirsToExplore.pop();

    try {
      const files = await fs.readdir(currentDir);

      // Create an array of promises for each file's stat
      const filePromises = files.map(async (file) => {
        const fullPath = path.join(currentDir, file);
        const stats = await fs.stat(fullPath);

        if (stats.isDirectory()) {
          dirsToExplore.push(fullPath); // Add directories to stack
        } else if (file.endsWith(".mp4")) {
          arrayOfFiles.push(fullPath); // Collect video files
        }
      });

      await Promise.all(filePromises); // Wait for all promises in the current directory
    } catch (error) {
      console.error(`Error reading directory: ${currentDir}`, error);
    }
  }

  // Sort the arrayOfFiles to ensure consistent ordering
  return arrayOfFiles.sort((a, b) => naturalSort(a, b));
}

module.exports = getVideosFromDirectories;
