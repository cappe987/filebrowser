

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

  if (data.files != undefined){
    data.files.forEach(f => {
      const button = createFileButton(f);
      div.appendChild(button);
    });
  }


}

function fetchFiles(foldername){
  const current = document.getElementById("currentDir").textContent;
  const data = {current: current, folder: foldername};

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