var spacePressed = false;

function KeyPress(e) {
  var keyboardEvent = window.event? event : e;
  
  //if the user is typing in an input field, ignore these hotkeys
  if (document.activeElement.tagName == 'INPUT') return;
  
  //if no document has been created yet,
  //orthere is a dialog box open
  //ignore hotkeys
  if (!documentCreated || dialogueOpen) return;
  
  //
  switch (keyboardEvent.keyCode) {
		//pencil tool - 1, b
		case 49: case 66: 
			changeTool('pencil');
			break;
		//fill tool - 2, f
		case 50: case 70:
			changeTool('fill');
			break;
		//eyedropper - 3, e
		case 51: case 69:
			changeTool('eyedropper');
			break;
		//pan - 4, p, m
		case 52: case 80: case 77:
			changeTool('pan');
			break;
		//zoom - 5
		case 53:
		  changeTool('zoom');
		  break;
		 // eraser -6, r
	     case 54: case 82:
	         console.log("Pressed r");
            changeTool('eraser');
	     	break;
		//Z
		case 90:
		  console.log('PRESSED Z ', keyboardEvent.ctrlKey)
		  //CTRL+ALT+Z redo
		  if (keyboardEvent.altKey && keyboardEvent.ctrlKey) 
		    redo();
		  //CTRL+Z undo
		  else if (keyboardEvent.ctrlKey) 
		    undo();
			//Z switch to zoom tool
			else 
			  changeTool('zoom');
			break;
		//redo - ctrl y
		case 89:
		  if (keyboardEvent.ctrlKey) 
		    redo();
		  break;
		case 32:
		  spacePressed=true;
		  break;
  }
}

document.onkeydown = KeyPress;

window.addEventListener("keyup", function (e) {
	
	if (e.keyCode == 32) spacePressed = false;

});
