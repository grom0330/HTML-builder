const fs = require("fs");
const path = require("path");

const initialPath = path.join(__dirname, "styles");
const copyPath = path.join(__dirname, "project-dist/bundle");
const copyPathCss = path.join(__dirname, "project-dist/bundle.css");

function deleteFiles(copyPathCss) {
  fs.stat(copyPathCss, function (err, stat) {
    if (err == null) {
      fs.writeFile(copyPathCss, "", (error) => {
        if (error) throw error;
      });
    }
  });
}

function copyFiles(initialPath, copyPath) {
  fs.readdir(initialPath, { withFileTypes: true }, (error, files) => {
    if (error) throw error;

    files.forEach((file) => {
      if (path.extname(path.join(initialPath, file.name)) == ".css") {
        fs.readFile(path.join(initialPath, file.name), (error, data) => {
          fs.appendFile(copyPath, data, (error) => {
            if (error) throw error;
          });
        });
      }
    });
  });
}

function doCopy(initialPath, copyPath) {
  fs.open(copyPathCss, "a+", (error) => {
    if (error) throw error;
  });

  deleteFiles(copyPathCss);
  copyFiles(initialPath, copyPath);
}

doCopy(initialPath, copyPathCss);
