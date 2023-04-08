window.allFilesList = [];
window.selectedFileName = "Untitled.py";

function liClicks() {
    $('li').mousedown(function(event){

        //filereader
        var fileReader = new FileReader();
        fileReader.addEventListener("loadend", function(event) { //loadend is used to wait until the file is completely loaded
            editor.setValue(event.target.result)
        })
    
        switch(event.which) {
    
            case 1: //left-click to view file

                if(debugMode) {
                    alert("Please stop the debugging process first");
                    break;
                }

                if(compileMode) {
                    alert("Please stop the compiling process first");
                    break;
                }

                document.getElementById("b5").disabled = false;   
                document.getElementById("b4").disabled = false;  

                document.getElementById("editor").placeholder = "Code here..."
    
                var nameOfFile = $(this).text();
    
                for (var i = 0; i <= allFilesList.length - 1; i++) {
    
                    if (nameOfFile != allFilesList[i].name) 
                        continue;
                    else 
                        var fileSelected = allFilesList[i];
                        var fileIndex = i;
                        break;
                }

                selectedFileName = fileSelected;
    
                fileReader.readAsText(fileSelected);

                editor.setOption("readOnly", false);

                $(document).keyup(function() {
                    if (editor.doc.getValue() != fileSelected) {
                        document.getElementById("b2").disabled = false;
                        if(allFilesList[fileIndex].name == selectedFileName.name){
                            allFilesList[fileIndex] = new File([editor.doc.getValue()], selectedFileName.name);
                        }
                    }
                })
    
                break;
    
            case 3: //right-click to remove file

                if(debugMode) {
                    break;
                }

                if(compileMode) {
                    break;
                }
    
                if (confirm("Are you sure you want to remove file?")) {

                    document.getElementById('outputPre').innerHTML = '';
    
                    var deletedFile = $(this).text();
    
                    let ul = document.getElementById("ul");

                    for (var i = 0; i <= allFilesList.length - 1; i++) {
    
                        if (deletedFile != allFilesList[i].name) 
                            continue;
                        else {

                            ul.removeChild(ul.childNodes[i]);
    
                            window.allFilesList.splice(i, 1);
                        }
                            
                    }
    
                    editor.setValue("");

                    editor.setOption("readOnly", true);

                    document.getElementById("b2").disabled = true;
                    document.getElementById("b5").disabled = true;   
                    document.getElementById("b4").disabled = true;            
    
                    break;

                } else
                    break;  
        }
    })
}

function saveFile() {
    var text = editor.doc.getValue();
    var text = text.replace(/\n/g, "\r\n");
    var blob = new Blob([text], {type: "text/x-python;charset=utf-8"});
    saveAs(blob, selectedFileName.name);
}

$(document).ready(function() {
    $('#fileInputControl').on("change", fileInputControlChangeEventHandler) 
});

function fileInputControlChangeEventHandler(event) {

    editor.setValue("");                                //to clear editor

    var fileInputControl = event.target;                //setting variable to target value
    var files = fileInputControl.files;                 //creating files list

    if(files.length > 0) {
        for(var i = 0; i <= files.length - 1; i++) {
            allFilesList.push(files[i]);
            var li = document.createElement("li");
            li.setAttribute("id", allFilesList.length - 1);
            li.append(files.item(i).name);
            let ul = document.getElementById("ul");
            ul.appendChild(li);
        }

    } else {
        alert("No files have been selected");
    }

    liClicks();
}

$(document).ready(function(){
    $('#b3').on("click", createFile)
})

function createFile() {

    var fileName = prompt("Please enter file name:", "Untitled");

    if (fileName != null) {

        fileName += ".py";

        var newfile = new File( [""],fileName,{
            type: "text/x-python"
        });

        allFilesList.push(newfile);

        var li = document.createElement("li");

        li.setAttribute("id", allFilesList.length - 1);

        li.append(fileName);

        let ul = document.getElementById("ul");

        ul.appendChild(li);

        liClicks();
    }
}

$(document).ready(function() {
    $('#b2').on("click", saveFile) 
});