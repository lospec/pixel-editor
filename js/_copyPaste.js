let clipboardData;
let isPasting = false;

let copiedStartX;
let copiedStartY;
let copiedEndX;
let copiedEndY;

function copySelection() {
	copiedEndX = endX;
	copiedEndY = endY;

	copiedStartX = startX;
	copiedStartY = startY;
	// Getting the selected pixels
	clipboardData = currentLayer.context.getImageData(startX, startY, endX - startX + 1, endY - startY + 1);
}

function pasteSelection() {
	// Can't paste if the layer is locked
	if (currentLayer.isLocked) {
		return;
	}
	endSelection();

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

function cutSelectionTool() {
	console.log("Taglio");

	copiedEndX = endX;
	copiedEndY = endY;

	copiedStartX = startX;
	copiedStartY = startY;

	// Getting the selected pixels
	if (imageDataToMove !== undefined) {
		clipboardData = imageDataToMove;
		TMPLayer.context.clearRect(0, 0, TMPLayer.canvas.width, TMPLayer.canvas.height);
		imageDataToMove = undefined;
	}
	else {
		clipboardData = currentLayer.context.getImageData(startX, startY, endX - startX + 1, endY - startY + 1);
		currentLayer.context.clearRect(startX - 0.5, startY - 0.5, endX - startX + 1, endY - startY + 1);
	}
}