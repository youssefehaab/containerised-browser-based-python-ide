var python = new Python()
let done = false
var isRequestingInput = false
let resetting = true
let initialize = true
var compileMode = false
var debugMode = false
let iteration = false
let readVariables = false
let nextButtonClicked = false
let stepButtonClicked = false
let stringNumber = ""
let variableName = ""
let variableValue = ""
let previousLineNumber = 0
let currentLineNumber = 0 
let variableIndex = 6640
let b5 = document.getElementById('b5')
let b4 = document.getElementById('b4')
let b6 = document.getElementById('b6')
let outputPre = document.getElementById('outputPre')
let variablesDiv = document.getElementById('variables')
let outputDiv = document.getElementById('output')

outputPre.scroll = function() {
	this.scrollTop = this.scrollHeight
}

python.stdin = callback => {
	let input = document.createElement('input')
	input.type = 'text'

	input.setAttribute("id", "input")

	input.size = 1
	input.oninput = () => {
		if (0 < input.value.length)
			input.size = input.value.length
	}

	input.addEventListener('keyup', (e) => {
		if (e.key == 'Enter') {
			let i = input.value
			input.remove()
			python.stdout(i + '\n')
			callback(i)
		}
	})

	if(debugMode) {
		let nextButton = document.getElementById("nextButton")
		nextButton.addEventListener('click', () => {
			let i = "n"
			if(!done) {
				python.stdout(i + '\n')
				done = true
				nextButtonClicked = true
			}
			callback(i)
		})
	}

	if(nextButtonClicked) {
		let i = "vars()"
		python.stdout(i + '\n')
		callback(i)
		nextButtonClicked = false
	}

	if(debugMode) {
		let stepButton = document.getElementById("stepButton")
		stepButton.addEventListener('click', () => {
			let i = "s"
			if(!done) {
				python.stdout(i + '\n')
				done = true
				stepButtonClicked = true
			}
			callback(i)
		})
	}

	if(stepButtonClicked) {
		let i = "vars()"
		python.stdout(i + '\n')
		callback(i)
		stepButtonClicked = false
	}
	
	done = false

	outputPre.appendChild(input)

	outputPre.onclick = () => {
		input.focus()
	}
	outputPre.click()
}

python.stdout = str => {
	str.length

	if(str[2] == '_' && str[3] == '_') {
		if(str[variableIndex] == "'") {
			variableIndex += 1
			if(str[variableIndex] != "_") {
				for(variableIndex; str[variableIndex] != "'"; variableIndex++) {
					variableName += str[variableIndex]
				}
				textArea.innerHTML += '\t\n\n' + variableName
				variableIndex += 3
				if(str[variableIndex] == "[") {
					variableIndex +=1
					for(variableIndex; str[variableIndex] != "]"; variableIndex++) {
						variableValue += str[variableIndex]
					}
					variableIndex += 1
				} else {
					for(variableIndex; str[variableIndex] != ","; variableIndex++) {
						if(str[variableIndex] != "}") {
							variableValue += str[variableIndex]
						} else {
							break
						}
					}
				}
				textArea.innerHTML += ' = ' + variableValue
				variableIndex += 2
				variablesPre.scroll()
			}
		}
		variableName = ""
		variableValue = ""
	} else {
		outputPre.innerText += str
	}

	previousLineNumber = currentLineNumber
	if(debugMode) {

		if(str[10] == "(") {
			
			for( i = 11; i < str.length; i++) {
				if(str[i] != ")") {
					stringNumber += str[i]
				}
				else {
					break
				}
			}
			
			currentLineNumber = parseInt(stringNumber) - 1
			if(!Number.isNaN(currentLineNumber)) {
				if(iteration) {
					editor.removeLineClass(previousLineNumber, "background", "CodeMirror-selected")
					editor.addLineClass(currentLineNumber, "background", "CodeMirror-selected")
				}
				else{
					editor.addLineClass(currentLineNumber, "background", "CodeMirror-selected")
					iteration = true
				}
			} else {
				currentLineNumber = previousLineNumber
			}
		}

		stringNumber = ""

	}

	outputPre.scroll()
}

python.stderr = str => {
	let span = document.createElement('span')
	span.style.color = 'red'
	span.innerText = str
	outputPre.appendChild(span)
	outputPre.scroll()
}

python.clear = () => {
	outputPre.innerHTML = ''
	if(typeof textArea !== 'undefined') {
		textArea.innerHTML = ''
	}
	variableIndex = 6640
}

python.onstatuschange = busy => {
	if (busy) {
		b5.disabled = true
		b4.disabled = true
		b6.disabled = false
		
	} else {
		if(!initialize) {
			b5.disabled = false
			b4.disabled = false
			b6.disabled = true
		}
		initialize = false
		if (resetting) {
			python.clear()
			resetting = false
		}
	}
}

b5.onclick = () => {
	debugMode = false
	readVariables = false
	python.clear()
	disableDebugMode()
	python.run(editor.getValue())
	const accordion = document.getElementsByClassName('contentBox');
	if(accordion[0].classList.toggle('active') != true) {
		accordion[0].classList.toggle('active')
	}
}

b4.onclick = () => {
	debugMode = true
	readVariables = true
	iteration = false
	python.clear()
	enableDebugMode()
	if(breakpointLines[0] != undefined) {
		for (i = 0; i < breakpointLines.length; i ++) {
			editor.replaceRange("\n    breakpoint()", {line: breakpointLines[i]})
		}
		breakpointLines = []
		python.run(editor.getValue())
	} else {
		python.debug(editor.getValue())
	}
	python.debug(editor.getValue())
	const accordion = document.getElementsByClassName('contentBox');
	if(accordion[0].classList.toggle('active') != true) {
		accordion[0].classList.toggle('active')
	}
}

b6.onclick = () => {
	editor.removeLineClass(currentLineNumber, "background", "CodeMirror-selected")
	python.reset()
	if(!debugMode) {
		resetting = true
	}
}

function enableDebugMode() {
	if(!document.getElementById("variablesPre")) {
		//creating pre
		var variablesPre = document.createElement("pre")
		variablesPre.setAttribute("id", "variablesPre")
		
		let nextButton = document.createElement("button")
		nextButton.innerHTML = "NEXT"
		nextButton.setAttribute("id", "nextButton")

		let stepButton = document.createElement("button")
		stepButton.innerHTML = "STEP"
		stepButton.setAttribute("id", "stepButton")

		let textArea = document.createElement("div")
		textArea.setAttribute("id", "textArea")

		variablesPre.appendChild(nextButton)
		variablesPre.appendChild(stepButton)
		variablesPre.appendChild(textArea)
	
	
		//creating label
		let variablesLabel = document.createElement("div")
		variablesLabel.setAttribute("id", "variablesLabel")
		variablesLabel.innerHTML = "VARIABLES"

		outputDiv.style.width = "50%"
		variablesDiv.style.width = "50%"
	
		variablesDiv.appendChild(variablesPre)
		variablesDiv.appendChild(variablesLabel)

		variablesLabel.addEventListener('click', function() {
			accordion[0].classList.toggle('active');
		})
	}
}

function disableDebugMode() {
	if(document.getElementById("variablesPre")) {
		let variablesPre = document.getElementById("variablesPre")
		let variablesLabel = document.getElementById("variablesLabel")

		variablesDiv.style.width = "0%"
		outputDiv.style.width = "100%"

		variablesDiv.removeChild(variablesPre)
		variablesDiv.removeChild(variablesLabel)
	}
}