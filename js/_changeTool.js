function changeTool (selectedTool) {
    
    //set tool and temp tje tje tpp;
    currentTool = selectedTool;
	currentToolTemp = selectedTool;
	
    var tools = document.getElementById("tools-menu").children;
	
	for (var i = 0; i < tools.length; i++) {
	    tools[i].classList.remove("selected");
	}
	
    //give the button of the selected tool the .selected class
	document.getElementById(selectedTool+"-button").parentNode.classList.add("selected");
	
	//change cursor
	updateCursor();
}