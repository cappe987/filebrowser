const express = require("express");
const fs = require("fs");
const path = require("path");
const util = require("util");

const statAsync = util.promisify(fs.stat);
const readFileAsync = util.promisify(fs.readFile);
const readDirAsync = util.promisify(fs.readdir);

const app = express();
const port = 3000;
const rootdir = __dirname;

app.use(express.static("./client/"));
app.use(express.json({ limit: '1mb' }));

app.listen(port, () => console.log(`Listening to port ${port}`));

function getExtension(absolutepath) {
  return path.extname(absolutepath).substring(1);
}

function getFiletype(stat, relativepath) {
  if (stat.isFile()) {
    const img = ["png", "jpg", "jpeg", "bmp", "gif", "apng", "svg", "ico"];
    const ext = getExtension(relativepath);
    return img.includes(ext) ? "image" : "textfile";
  }
  else if (stat.isDirectory()) {
    return "directory";
  }
  return "invalid";
}

function getAbsolutepath(relativepath) {
  const absolutepath = path.join(rootdir, relativepath);
  return decodeURI(absolutepath); //To handle spaces in path
}

app.post('/open', async (req, res) => {

  const relativepath = path.normalize(req.body.relativepath);
  const absolutepath = getAbsolutepath(relativepath);

  try {
    const stat = await statAsync(absolutepath);
    switch (getFiletype(stat, relativepath)) {
      case "textfile":
        const contents = await readFileAsync(absolutepath, "utf8");
        res.json({ type: "textfile", newdir: relativepath, data: contents });
        break;

      case "directory":
        const files = await readDirAsync(absolutepath);
        res.json({ type: "directory", newdir: relativepath, data: files });
        break;

      case "image":
        res.json({ type: "image", newdir: relativepath });
        break;

      default:
        console.log("Non-supported filetype");
        return;
    }
  }
  catch (e) {
    console.log("Caught Error: " + e);
    return;
  }
});


app.get('/image/*', (req, res) => {
  const url = (req.originalUrl).split("/image/")[1];
  const relativepath = path.normalize(url);
  const absolutepath = getAbsolutepath(relativepath);
  res.sendFile(absolutepath);
});

// Move client-code to a lower folder.