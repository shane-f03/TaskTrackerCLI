#!/usr/bin/env node

const { getDate, writeTaskJSON, initJSONFile } = require("../util.js");

const path = initJSONFile();
const tasks = require(path);

// The command is always in 2nd index
const command = process.argv[2];

handleCommand(command);

/**
 * Commands:
 * add [title]
 * delete [id]
 * update [id] [title]
 * mark-todo [id]
 * mark-in-progress [id]
 * mark-done [id]
 * list [optional: status]
 *
 */

function handleCommand(command) {
  const commandMap = {
    add: addCommand,
    delete: deleteCommand,
    update: updateCommand,
    list: listCommand,
    "mark-todo": () => markCommand("todo"),
    "mark-in-progress": () => markCommand("in-progress"),
    "mark-done": () => markCommand("done"),
    help: helpCommand,
  };

  const functionToCall = commandMap[command];
  if (!functionToCall) {
    console.log("Invalid command");
    return;
  }
  functionToCall();
}

function addTask(title, id) {
  const defaultStatus = "todo";
  const task = {
    id,
    title, // title: title
    status: defaultStatus,
    createdAt: getDate(),
    updatedAt: getDate(),
  };

  tasks.push(task);

  writeTaskJSON(tasks);

  console.log("Added task");
}

function updateTask(idToUpdate, property, newValue) {
  tasks.forEach((task) => {
    if (task.id == idToUpdate) {
      task[property] = newValue;
      task.updatedAt = getDate();
    }
  });
}

function validateID(id) {
  if (!id) {
    console.log("You must provide an ID");
    return false;
  }

  if (tasks.filter((task) => task.id == id).length == 0) {
    console.log("Invalid ID");
    return false;
  }

  return true;
}

function validateTitle(title) {
  if (!title) {
    console.log("You must provide a title");
    return false;
  }

  return true;
}

function validateStatus(status) {
  const validStatus = ["todo", "in-progress", "done"];
  return status === undefined || validStatus.includes(status);
}

function increID() {
  let id = 0;
  if (tasks.length != 0) {
    id = tasks.at(-1).id;
  }
  id++;
  return id;
}

function addCommand() {
  const title = process.argv[3];
  if (!validateTitle(title)) return;
  addTask(title, increID());
}

function deleteCommand() {
  const idToDelete = process.argv[3];

  if (!validateID(idToDelete)) return;

  const newTasks = tasks.filter((task) => task.id != idToDelete);
  writeTaskJSON(newTasks);

  console.log("Deleted task");
}

function updateCommand() {
  const idToUpdate = process.argv[3];
  const updatedTitle = process.argv[4];

  if (!validateID(idToUpdate)) return;
  if (!validateTitle(updatedTitle)) return;

  updateTask(idToUpdate, "title", updatedTitle);
  writeTaskJSON(tasks);

  console.log("Updated task");
}

function listCommand() {
  const status = process.argv[3];

  if (!validateStatus(status)) return;
  if (!status) console.log(tasks);

  console.log(tasks.filter((task) => status == task.status));
}

function markCommand(status) {
  const idToUpdate = process.argv[3];

  if (!validateID(idToUpdate)) return;

  updateTask(idToUpdate, "status", status);
  writeTaskJSON(tasks);

  console.log(`Marked task #${idToUpdate} as ${status}`);
}

function helpCommand() {
  console.log(
    "Commands: \nadd [title]\ndelete [id]\nupdate [id] [title]\nmark-todo [id]\nmark-in-progress [id]\nmark-done [id]\nlist [optional: status]"
  );
}
