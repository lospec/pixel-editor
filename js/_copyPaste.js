let clipboardData;

function copySelection() {
	
}

function pasteSelection() {
	imageDataToMove = clipboardData;
	updateMovePreview();
}

function cutSelectionTool() {
	// Getting the selected pixels
	clipBoardData = currentLayer.context.getImageData(startX, startY, endX - startX + 1, endY - startY + 1);

	currentLayer.context.clearRect(startX - 0.5, startY - 0.5, endX - startX + 1, endY - startY + 1);
	// Moving those pixels from the current layer to the tmp layer
	//TMPLayer.context.putImageData(imageDataToMove, startX + 1, startY);

    //originalDataPosition = [currentPos[0], currentPos[1]];
}