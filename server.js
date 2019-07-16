const express = require("express");
const fs      = require("fs"     );

const app = express();
const port = 3000;

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

  const dir = __dirname + relativepath;
  // const dir = "/" + relativepath;
  console.log(dir);

  // fs.stat(__dirname + "/index.html", (err, stat) => {
  //   console.log(stat.isFile());
  // });
  
  fs.readdir(dir, (err, files) => {
    res.json({status: "success", newdir: relativepath, files: files});
  });
});