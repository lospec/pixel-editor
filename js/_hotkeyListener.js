var spacePressed = false;

/**
	Copy / paste / cut logic:
		- The user selects an area
		- Pressing ctrl+c copies the selection
		- Pressing ctrl+v ends the current selection and copies the clipboard in the tmp layer:
			the editor enters move mode and lets the user move the copied selection around.
			Pressing ctrl+v while moving a copy has the same effect of pressing ctrl+v after a ctrl+c
		- Pressing ctrl+x cuts the selection and stores it in the clipboard
		- The behaviour of ctrl+v is the same and doesn't depend on how the selected area was obtained
			(with ctrl+c or with ctrl+v)
		- Selecting a different tool while moving the copied or cut selection has the same effect of selecting 
			a different tool while moving a standard selection
		- You can't paste while dragging
		- You can paste at any other time
*/ 

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
			// copy tool c
			case 67: case 99:
				console.log("Copying");
				if (keyboardEvent.ctrlKey && !dragging && currentTool.name == 'moveselection') {
			    	copySelection();
			    }
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
			// Paste tool
			case 86: case 118:
				console.log("Pasting");
				if (keyboardEvent.ctrlKey && !dragging) {
					pasteSelection();
				}
				break;
			case 88: case 120:
				console.log("Cutting");
				if (keyboardEvent.ctrlKey && !dragging && currentTool.name == 'moveselection') {
					cutSelectionTool();
					endSelection();
					tool.pencil.switchTo();
				}
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
