var editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
                mode: "python",
                theme: "dracula",
                lineNumbers: true,
                lineWrapping: true,
                autoCloseBrackets: true,
                readOnly: true,
                gutters: ["CodeMirror-linenumbers", "breakpoints", "CodeMirror-foldgutter"],
                styleActiveLine: false,
                extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }},
                foldGutter: true,
                highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true}
});

var breakpointLines = [];

editor.on("gutterClick", function(cm, n) {
    var info = cm.lineInfo(n);
    cm.setGutterMarker(n, "breakpoints", info.gutterMarkers ? null : makeMarker());
    breakpointLines.push(n - 1);
});

function makeMarker() {
    var marker = document.createElement("div");
    marker.style.color = "#822";
    marker.innerHTML = "●";
    return marker;
}