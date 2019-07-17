const express = require("express");
const fs      = require("fs"     );

const app = express();
const port = 3000;
const rootdir = "/";
// const rootdir = __dirname;

app.use(express.static("."));
app.use(express.json({limit: '1mb'}));

app.listen(port, () => console.log(`Listening to port ${port}`));


function ascendDir(path){
  let i = path.length - 1;
  for (; i > 0 && path[i] != '/'; i--) {}
  const newpath = path.substring(0, i);
  if (newpath == ""){
    return "/";
  }
  return newpath;
}


function sendDirectory(res, absolutepath, relativepath) {
  fs.readdir(absolutepath, (err, files) => {
    res.json({status: "directory", newdir: relativepath, files: files});
  });

}

function openFile(res, absolutepath, relativepath) {
  const promise = fs.readFile(absolutepath, "utf8", (err, contents) => {
    res.json({status: "textfile", newdir: relativepath, filecontent: contents});
  });
}

app.post('/opendir', (req, res) => {
  let current = req.body.current;
  let foldername = req.body.folder;
  let relativepath = current + "/" + foldername 
  
  if (current == "/") { //Already at root
    relativepath = current + foldername;
  }

  if (foldername.includes("..")){ //Ascending
    if (foldername === ".."){ //Proper ascension
      relativepath = ascendDir(current); }
    else { //Invalid action
      return; }
  }

  const dir = rootdir + relativepath;
  // const dir = "/" + relativepath;
  console.log(dir);
  
  fs.stat(dir, (err, stat) => {
    if (stat.isFile()){
      openFile(res, dir, relativepath);
    }
    else if (stat.isDirectory()){
      sendDirectory(res, dir, relativepath);
    }
  });


  
});