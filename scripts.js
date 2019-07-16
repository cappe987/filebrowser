
function setTitle(text){
  const title = document.getElementById("currentDir");
  title.textContent = "";
  const newtitle = document.createElement("h1");
  newtitle.textContent = text;
  title.appendChild(newtitle);
}

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
  // const title = document.getElementById("currentDir");
  // title.textContent = "";
  // const newtitle = document.createElement("h1");
  // newtitle.textContent = data.newdir;
  // title.appendChild(newtitle);
  setTitle(data.newdir);

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

function openFile(data){
  setTitle(data.newdir);

  const div = document.getElementById("content");
  div.innerHTML = ""
  // const lines = data.filecontent.split("\n").length;

  const textbox = document.createElement("textarea");
  textbox.setAttribute("cols", "89");
  textbox.setAttribute("rows", "40");
  textbox.setAttribute("readonly", "readonly");
  textbox.textContent = data.filecontent;

  div.appendChild(textbox);
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
    switch (resdata.status){
      case "directory":
        listdir(resdata);
        break;
      case "textfile":
        openFile(resdata);
        break;
      default:
        break;
    }
  });
}