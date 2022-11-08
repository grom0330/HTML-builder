const fs = require("fs");
const path = require("path");
const readline = require("node:readline");
const process = require("process");

const path_join = path.join(__dirname, "text.txt");

const close = () => {
  console.log("Buy)");
  rl.close();
};

fs.open(path_join, "a+", (error) => {
  if (error) throw error;

  console.log("What do you want to note ?:");
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", (info) => {
  info.trim().toLowerCase() === "exit"
    ? close()
    : fs.appendFile(path_join, `${info}\n`, (error) => {
        if (error) throw error;
      });
});

process.on("SIGINT", () => {
  close();
});
