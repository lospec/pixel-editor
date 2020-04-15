function changeTool (newToolName) {

	console.log('changing tool to',newToolName)

	var selectedTool = tool[newToolName];

	// Ending any selection in progress
    if (currentTool.name.includes("select") && !selectedTool.name.includes("select") && !selectionCanceled) {
    	endSelection();
    }
    //set tool and temp tje tje tpp;
    currentTool = selectedTool;
	currentToolTemp = selectedTool;

    var tools = document.getElementById("tools-menu").children;

	for (var i = 0; i < tools.length; i++) {
	    tools[i].classList.remove("selected");
	}

    //give the button of the selected tool the .selected class
	document.getElementById(selectedTool.name+"-button").parentNode.classList.add("selected");

	//change cursor
	currentTool.updateCursor();
}