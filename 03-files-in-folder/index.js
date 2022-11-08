const fs = require("fs");
const path = require("path");

const path_join = path.join(__dirname, "secret-folder");

fs.readdir(path_join, { withFileTypes: true }, (error, files) => {
  if (error) throw error;

  files.forEach((file) => {
    if (file.isFile()) {
      fs.stat(path.join(path_join, file.name), (error, stats) => {
        if (error) throw error;

        console.log(
          path.basename(file.name, path.extname(file.name)),
          "-",
          path.extname(file.name).slice(1),
          "-",
          stats["size"],
          "bytes"
        );
      });
    }
  });
});
