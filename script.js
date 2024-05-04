var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
	lineNumbers: true,
	mode: 'text/python',
	indentUnit: 4,
	theme: 'material-darker'
})
editor.setSize('100vw', 'calc(100vh - 10vmin)');


function newInput(newInputButton) {
	let name = window.prompt("Enter the name of the input");
	while (name != null && !isValidVarName(name)) {
		name = window.prompt("Invalid var name. Vars may A though Z lower case and uppercase underscorses and numbers after the first letter.");
	}
	if (name == null) {
		return
	}
	var newInput = document.createElement('div');
	newInput.className = 'input';
	newInput.innerText = name;
	newInput.ondblclick = function() {
		this.remove();
	}
	document.getElementsByClassName('inputs')[0].insertBefore(newInput, newInputButton);
}