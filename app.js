const fs = require("fs/promises");
const path = require("path");
const getVideoFromDirectory = require("./getVideosFromDirectories");
const getVideoLength = require("./getVideoLength");

const courseDirectory =
  "D:[GigaCourse.Com] Udemy - The Ultimate React Course 2023 React, Redux & More/";
const minutes = 3600;

async function main() {
  try {
    console.time("Starting");
    // Call getVideoFromDirectory with await to resolve the promise
    const videosFromCourse = await getVideoFromDirectory(courseDirectory);

    // Normalize video paths
    const videoPaths = videosFromCourse.map((video) => path.normalize(video));
    // console.log(videoPaths);

    // Get all video lengths and organize them by day
    const videoLengths = await getAllVideoLength(videoPaths);

    console.timeEnd("Starting");
  } catch (error) {
    console.error("Error processing videos:", error);
  }
}

// Function to get all video lengths and write them to a file
async function getAllVideoLength(videos) {
  let videoLength = 0;
  let day = 1;

  // Clear the output file at the start
  await fs.writeFile("./schedule.txt", "", "utf-8");

  for (const video of videos) {
    const length = await getVideoLength(video);
    videoLength += length;

    // If the accumulated length exceeds 3600 seconds, increment the day
    if (videoLength > minutes) {
      videoLength = length; // Start new day with the current video's length
      day++;
      await fs.appendFile("./schedule.txt", `\nDay-${day}:\n`, "utf-8"); // Write the new day header
    } else if (videoLength === length) {
      await fs.appendFile("./schedule.txt", `Day-${day}:\n`, "utf-8"); // Write the first video of the day
    }

    const formattedLength = `${path.basename(video).padEnd(60)} ${String(
      Math.floor(length / 60)
    ).padStart(2, "0")}:${String(Math.floor(length % 60)).padStart(2, "0")}\n`;
    await fs.appendFile("./schedule.txt", formattedLength, "utf-8");
  }

  return videoLength;
}

// Call the main function to execute the script
main();
