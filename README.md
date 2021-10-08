# File Browser
## About

**File Browser** is a file browser made using Node.JS.

## Installation and Setup 

1. Install Node.JS (Linux)
```
sudo apt update
sudo apt install nodejs
```

2. Clone and start the program
```
git clone https://github.com/cappe987/filebrowser
cd filebrowser
node server.js
```

3. The server is now accessible through the URL `localhost:3000`. The browser will now let you freely browse through your files, starting from the directory specified in the `rootdir` constant in server.js.

# To-do list
- [ ] File editing
- [X] Image support
- [ ] File download
- [ ] File upload
- [ ] Tree view
- [ ] Favorites folder
- [ ] Fuzzy searcher - Levenshtein distance?
- [ ] Colors and themes for frontend - color depending on filetype
- [ ] Docker?
- [ ] Electron?
