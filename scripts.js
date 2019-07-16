

function createFileButton(filename) {
  const button = document.createElement("button");
  button.className = "file";
  button.textContent = filename;
  // const cmd = //`console.log("${filename}"); fetchFiles("${filename}")`;
  const cmd = `fetchFiles("${filename}")`;
  button.setAttribute("onClick", cmd);
  return button;
}

function listdir(data){
  if (data.status != "success"){
    return;
  }

  const title = document.getElementById("currentDir");
  title.textContent = "";
  const newtitle = document.createElement("h1");
  newtitle.textContent = data.newdir;
  title.appendChild(newtitle);

  const div = document.getElementById("content");

  div.innerHTML = ""
  const back = createFileButton("..");
  div.appendChild(back);

  data.files.forEach(f => {
    const button = createFileButton(f);
    div.appendChild(button);
  });


}

function fetchFiles(foldername){
  const current = document.getElementById("currentDir").textContent;
  let data = {dir: current + "/" + foldername}
  // console.log("Foldername: " + foldername);
  
  if (current == "/") { //Already at root
    data = {dir: current + foldername}
  }

  if (foldername.includes("..")){
    // console.log(foldername);
    if (current == "/"){
      // console.log("Curr: " + current);
      data = {dir: current}
    }
    else if (foldername === ".."){
      let i = current.length - 1;
      for (; i > 0 && current[i] != '/'; i--) {}
      data = {dir: current.substring(0, i)}
      if (data.dir == ""){data.dir = "/"}
    }
    else {
      data = {dir: current}
    }
  }

  // if (current == "/") { //Already at root
  //   data = {dir: current + foldername}
  //   if (foldername.includes("../")){ //Tries to go over root.
  //     data = {dir: current}
  //   }
  // }
  // else if (foldername === ".."){ //Going one directory up, remove previous directory
  //   let i = current.length - 1;
  //   for (; i > 0 && current[i] != '/'; i--) {}
  //   data = {dir: current.substring(0, i)}
  //   if (data.dir == ""){data.dir = "/"}
  // }
  // else if (foldername.includes("..")){ //Security. Tries to go up more than one directory.
  //   data = {dir: current}
  // }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  fetch('/opendir', options)
  .then(res => res.json())
  .then(resdata => {
    // console.log(resdata);
    listdir(resdata);
  });
}