const express = require("express");
const fs      = require("fs"     );

const app = express();
const port = 3000;

app.use(express.static("."));
app.use(express.json({limit: '1mb'}));

// app.get('/files', (req, res) => res.send("Hello World"));

app.listen(port, () => console.log(`Listening to port ${port}`));

// app.get('/title', (req, res) => {
//   res.json({title: "Story of a programmer"});
// });





app.post('/opendir', (req, res) => {
  let relativepath = req.body.dir;
  const dir = __dirname + relativepath;
  // const dir = "/" + relativepath;
  console.log(dir);
  
  fs.readdir(dir, (err, files) => {
    res.json({status: "success", newdir: relativepath, files: files});
  });
});