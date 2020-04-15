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
	if (e.key === "Escape") {
		if (!selectionCanceled) {
			endSelection();
			tool.pencil.switchTo();
		}
	}
	else {
	  	switch (keyboardEvent.keyCode) {
			//pencil tool - 1, b
			case 49: case 66:
				tool.pencil.switchTo();
				break;
			//fill tool - 2, f
			case 50: case 70:
				tool.fill.switchTo();
				break;
			//eyedropper - 3, e
			case 51: case 69:
				tool.eyedropper.switchTo();
				break;
			//pan - 4, p,
			case 52: case 80:
				tool.pan.switchTo();
				break;
			//zoom - 5
			case 53:
			  tool.zoom.switchTo();
			  break;
			 // eraser -6, r
		    case 54: case 82:
		         console.log("Pressed r");
	            tool.eraser.switchTo()
		     	break;
		    // Rectangular selection
		    case 77: case 109:
				tool.rectselect.switchTo()
				break;
			//Z
			case 90:
			  console.log('PRESSED Z ', keyboardEvent.ctrlKey)
			  //CTRL+ALT+Z redo
			  if (keyboardEvent.altKey && keyboardEvent.ctrlKey)
			    redo();
				if (!selectionCanceled) {
			    		endSelection();
			    		tool.pencil.switchTo()
			    	}
			  //CTRL+Z undo
			  else if (keyboardEvent.ctrlKey) {
			    	undo();
			    	if (!selectionCanceled) {
			    		endSelection();
			    		tool.pencil.switchTo()
			    	}
			    }
				//Z switch to zoom tool
				else
					tool.zoom.switchTo()
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
}

document.onkeydown = KeyPress;

window.addEventListener("keyup", function (e) {

	if (e.keyCode == 32) spacePressed = false;

});
