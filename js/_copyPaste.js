// Data saved when copying or cutting
let clipboardData;
// Tells if the user is pasting something or not
let isPasting = false;

// Coordinates of the copied (or cut) selection
let copiedStartX;
let copiedStartY;
let copiedEndX;
let copiedEndY;

/** Copies the current selection to the clipboard
 * 
 */
function copySelection() {
	copiedEndX = endX;
	copiedEndY = endY;

	copiedStartX = startX;
	copiedStartY = startY;
	// Getting the selected pixels
	clipboardData = currentLayer.context.getImageData(startX, startY, endX - startX + 1, endY - startY + 1);
}

/** Pastes the clipboard data onto the current layer
 * 
 */
function pasteSelection() {
	// Can't paste if the layer is locked
	if (currentLayer.isLocked) {
		return;
	}

	// Cancel the current selection
	endSelection();

	// I'm pasting
	isPasting = true;
	// Putting the image data on the tmp layer
	TMPLayer.context.putImageData(clipboardData, copiedStartX, copiedStartY);

	// Setting up the move tool to move the pasted value
	selectionCanceled = false;
	imageDataToMove = clipboardData;
	firstTimeMove = false;
	isRectSelecting = false;

	// Switching to the move tool
	tool.moveselection.switchTo();
	// Updating the rectangle preview
	moveSelection(
		copiedStartX + (copiedEndX - copiedStartX) / 2, 
		copiedStartY + (copiedEndY - copiedStartY) / 2, 
		clipboardData.width, clipboardData.height);	
	//drawRect(copiedStartX, copiedEndX, copiedStartY, copiedEndY);
}

/** Cuts the current selection and copies it to the clipboard
 * 
 */
function cutSelectionTool() {
	// Saving the coordinates
	copiedEndX = endX;
	copiedEndY = endY;

	copiedStartX = startX;
	copiedStartY = startY;

	// Getting the selected pixels
	// If I'm already moving a selection
	if (imageDataToMove !== undefined) {
		// I just save that selection in the clipboard
		clipboardData = imageDataToMove;
		// And clear the underlying space
		TMPLayer.context.clearRect(0, 0, TMPLayer.canvas.width, TMPLayer.canvas.height);
		// The image has been cleared, so I don't have anything to move anymore
		imageDataToMove = undefined;
	}
	else {
		// Otherwise, I copy the current selection into the clipboard
		copySelection();
		// And clear the selection
		currentLayer.context.clearRect(startX - 0.5, startY - 0.5, endX - startX + 1, endY - startY + 1);
	}
}