const fs = require("fs");
const path = require("path");

const initialPath = path.join(__dirname, "files");
const copyPath = path.join(__dirname, "files-copy");

function deleteFiles(copyPath) {
  fs.readdir(copyPath, { withFileTypes: true }, (error, files) => {
    if (error) throw error;

    files.forEach((file) => {
      if (file.isFile()) {
        fs.unlink(path.join(copyPath, file.name), (error) => {
          if (error) throw error;
        });
      }
    });
  });
}

function copyFiles(initialPath, copyPath) {
  fs.readdir(initialPath, { withFileTypes: true }, (error, files) => {
    if (error) throw error;

    files.forEach((file) => {
      if (file.isFile()) {
        fs.copyFile(
          path.join(initialPath, file.name),
          path.join(copyPath, file.name),
          (error) => {
            if (error) throw error;
          }
        );
      }
    });
  });
}

function copyFolder(initialPath, copyPath) {
  fs.mkdir(copyPath, { recursive: true }, (error) => {
    if (error) throw error;
  });

  deleteFiles(copyPath);
  copyFiles(initialPath, copyPath);
}

copyFolder(initialPath, copyPath);
