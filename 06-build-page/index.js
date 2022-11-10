const fs = require("fs");
const path = require("path");

const copyPath = path.join(__dirname, "project-dist");
const initialStyles = path.join(__dirname, "styles");
const initialAssets = path.join(__dirname, "assets");

function openFiles(copyPath) {
  fs.mkdir(copyPath, { recursive: true }, (error) => {
    if (error) throw error;
  });

  fs.mkdir(path.join(copyPath, "assets"), { recursive: true }, (error) => {
    if (error) throw error;
  });

  fs.open(path.join(copyPath, "index.html"), "a+", (error) => {
    if (error) throw error;
  });

  fs.open(path.join(copyPath, "style.css"), "a+", (error) => {
    if (error) throw error;
  });
}

////// Assets //////

function deleteFilesAssets(copyPath) {
  fs.readdir(
    path.join(copyPath, "assets"),
    { withFileTypes: true },
    (error, files_1) => {
      files_1.forEach((file_1) => {
        fs.readdir(
          path.join(copyPath, "assets", file_1.name),
          { withFileTypes: true },
          (error, files_2) => {
            if (error) throw error;

            files_2.forEach((file_2) => {
              if (file_2.isFile()) {
                fs.unlink(
                  path.join(copyPath, "assets", file_1.name, file_2.name),
                  (error) => {
                    if (error) throw error;
                  }
                );
              }
            });
          }
        );
      });
    }
  );
}

function copyFilesAssets(initialAssets, copyPath) {
  fs.readdir(initialAssets, { withFileTypes: true }, (error, files) => {
    if (error) throw error;

    files.forEach((file_1) => {
      fs.mkdir(
        path.join(copyPath, "assets", file_1.name),
        { recursive: true },
        (error) => {
          if (error) throw error;
        }
      );

      if (file_1.isDirectory()) {
        fs.readdir(
          path.join(initialAssets, file_1.name),
          {
            withFileTypes: true,
          },
          (error, files_2) => {
            if (error) throw error;

            files_2.forEach((file) => {
              if (file.isFile()) {
                fs.copyFile(
                  path.join(initialAssets, file_1.name, file.name),
                  path.join(copyPath, "assets", file_1.name, file.name),
                  (error) => {
                    if (error) throw error;
                  }
                );
              }
            });
          }
        );
      }
    });
  });
}

function copyFolder(initialAssets, copyPath) {
  deleteFilesAssets(copyPath);
  copyFilesAssets(initialAssets, copyPath);
}

///////

////// Css //////

function deleteFilesCss(copyPath) {
  fs.stat(path.join(copyPath, "style.css"), function (err, stat) {
    if (err == null) {
      fs.writeFile(path.join(copyPath, "style.css"), "", (error) => {
        if (error) throw error;
      });
    }
  });
}

function copyFilesCss(initialStyles, copyPath) {
  fs.readdir(initialStyles, { withFileTypes: true }, (error, files) => {
    if (error) throw error;

    files.forEach((file) => {
      if (path.extname(path.join(initialStyles, file.name)) == ".css") {
        fs.readFile(path.join(initialStyles, file.name), (error, data) => {
          fs.appendFile(path.join(copyPath, "style.css"), data, (error) => {
            if (error) throw error;
          });
        });
      }
    });
  });
}

function copyCss(initialStyles, copyPath) {
  deleteFilesCss(copyPath);
  copyFilesCss(initialStyles, copyPath);
}

///////

////// Html //////

function copyHtml(copyPath) {
  fs.copyFile(
    path.join(__dirname, "template.html"),
    path.join(copyPath, "index.html"),
    (error) => {
      if (error) throw error;
    }
  );
}

function doHtml(copyPath) {
  fs.readFile(path.join(__dirname, "template.html"), "utf8", (err, chunk) => {
    let tagsInBrackets = chunk.match(/{{(.*)}}/gi);
    let filesByTags = [];

    for (item of tagsInBrackets) {
      item = item.replace("{{", "").replace("}}", "");
      filesByTags.push(item);
    }

    fs.readdir(
      path.join(__dirname, "components"),
      { withFileTypes: true },
      (err, files) => {
        files.forEach((file) => {
          for (let item of filesByTags) {
            if (file.name == item + ".html") {
              fs.readFile(
                path.join(path.join(__dirname, "components"), file.name),
                "utf8",
                (err, data) => {
                  if (err) throw err;
                  chunk = chunk.replace(`{{${item}}}`, data);

                  fs.writeFile(
                    path.join(
                      path.join(__dirname, "project-dist"),
                      "index.html"
                    ),
                    chunk,
                    () => {}
                  );
                }
              );
            }
          }
        });
      }
    );
  });
}

doHtml(copyPath);

///////

function doCopy(initialStyles, initialAssets, copyPath) {
  openFiles(copyPath);

  copyFolder(initialAssets, copyPath);
  copyCss(initialStyles, copyPath);
  copyHtml(copyPath);
  doHtml(copyPath);
}

doCopy(initialStyles, initialAssets, copyPath);
