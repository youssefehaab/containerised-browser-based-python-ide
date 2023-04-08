# containerised-browser-based-python-ide

This is a containerised browser based Python IDE

## Components:
- codemirror for code editor: https://codemirror.net
- pyodide for compiler and debugger: https://pyodide.org/en/stable/

Rest of components like file upload and download are implemented by Javascript in ```html/FileSaver.js``` and ```html/folderArea.js```

## How to run

> You will need to install docker.

open terminal and run this command in the ```Dockerfile``` directory to create a docker image
```
docker build -t pythonide
```
Run this command to create a container using the docker image
```
docker run -d -p 80:80 pythonide
```
Then open your browser and go to ```localhost```