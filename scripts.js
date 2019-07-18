
function setTitle(text){
  const title = document.getElementById("currentDir");
  title.textContent = "";
  const newtitle = document.createElement("h1");
  newtitle.textContent = text;
  title.appendChild(newtitle);
}

function createFileButton(filename, fetchstring = filename) {
  const button = document.createElement("button");
  button.className = "file";
  button.textContent = filename;
  const cmd = `fetchFiles("${fetchstring}")`;
  button.setAttribute("onClick", cmd);
  return button;
}

function listdir(data){
  const div = document.getElementById("content");

  div.innerHTML = ""
  const back = createFileButton("..", "/..");
  div.appendChild(back);

  if (data.data != undefined){
    data.data.forEach(f => {
      const button = createFileButton(f);
      div.appendChild(button);
    });
  }
}

function openFile(data){
  const div = document.getElementById("content");
  div.innerHTML = ""
  // const lines = data.filecontent.split("\n").length;

  const textbox = document.createElement("textarea");
  textbox.setAttribute("rows", "40");
  textbox.setAttribute("readonly", "readonly");
  textbox.textContent = data.data;

  div.appendChild(textbox);
}

function openImage(data){
  const div = document.getElementById("content");
  div.innerHTML = ""

  const img = document.createElement("img");
  img.setAttribute("src", "/image/" + data.newdir);
  img.style.maxWidth = "100%";

  div.appendChild(img);
}

async function fetchFiles(foldername){
  const current = document.getElementById("currentDir").textContent;
  const data = {relativepath: current + "/" + foldername};

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  const response     = await fetch('/opendir', options);
  const responsedata = await response.json();
  setTitle(responsedata.newdir);
  switch (responsedata.type){
    case "directory":
      listdir(responsedata);
      break;
    case "textfile":
      openFile(responsedata);
      break;
    case "image":
      openImage(responsedata);
      break;
    default:
      break;
  }
}