const express = require("express");
const fs      = require("fs"     );
const path    = require("path"   );
const util    = require("util"   );

const statAsync =     util.promisify(fs.stat    );
const readFileAsync = util.promisify(fs.readFile);
const readDirAsync  = util.promisify(fs.readdir );

const app = express();
const port = 3000;
// const rootdir = "/";
const rootdir = __dirname;

app.use(express.static("."));
app.use(express.json({limit: '1mb'}));

app.listen(port, () => console.log(`Listening to port ${port}`));

function getExtension(absolutepath){
  return path.extname(absolutepath).substring(1);
}

function getFiletype(stat){
  if (stat.isFile()){
    return "textfile";
  }
  else if (stat.isDirectory()){
    return "directory";
  }
  return "invalid";
}

app.post('/opendir', async (req, res) => {

  const relativepath = path.normalize(req.body.relativepath);
  console.log("Relative: " + relativepath);
  const absolutepath = path.join(rootdir, relativepath);
  console.log("Absolute: " + absolutepath);

  try{
    const stat = await statAsync(absolutepath);
    switch (getFiletype(stat)){
      case "textfile" :
        const contents = await readFileAsync(absolutepath, "utf8");
        res.json({type: "textfile", newdir: relativepath, data: contents});
        break;

      case "directory": 
        const files = await readDirAsync(absolutepath);
        res.json({type: "directory", newdir: relativepath, data: files});
        break;

      default:
        console.log("Non-supported filetype");
        return;
    }
  }
  catch(e){ 
    console.log("Caught Error: " + e); 
    return;
  }
});

