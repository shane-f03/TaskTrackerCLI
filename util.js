const fs = require("fs");
const FILE_NAME = "tasks.json";

function getDate() {
  const d = new Date();
  let currentDate =
    d.toISOString().substring(0, 10) +
    " " +
    d.getHours() +
    ":" +
    d.getMinutes();

  return currentDate;
}

function writeTaskJSON(tasksList) {
  const data = JSON.stringify(tasksList);
  fs.writeFile("tasks.json", data, (error) => {
    if (error) {
      console.error(error);
    }
  });
}

function initJSONFile() {
  const path = `../${FILE_NAME}`;
  if (!fs.existsSync(FILE_NAME)) {
    console.log("File does not exist.");
    fs.writeFileSync(FILE_NAME, JSON.stringify([]));
  }
  return path;
}

module.exports = { getDate, writeTaskJSON, initJSONFile };
