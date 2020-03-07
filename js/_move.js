var imageDataToMove;
var canMoveSelection = false;
var lastMovePos;
var selectionCanceled = false;

// TODO: move with arrows
function updateMovePreview(mouseEvent) {
	lastMousePos = getCursorPosition(mouseEvent);
	// clear the entire tmp layer
	TMPLayer.context.clearRect(0, 0, TMPLayer.canvas.width, TMPLayer.canvas.height);
	// put the image data with offset
	TMPLayer.context.putImageData(
		imageDataToMove, 
		Math.round(lastMousePos[0] / zoom - imageDataToMove.width / 2), 
		Math.round(lastMousePos[1] / zoom - imageDataToMove.height / 2));

	lastMovePos = lastMousePos;
	moveSelection(lastMousePos[0] / zoom, lastMousePos[1] / zoom, imageDataToMove.width, imageDataToMove.height) 
}

function endSelection() {
	// We have to make something smarter:
		// Take the selected data
		// Take the data underlying the selected data
		// for every element in the selected data
			// if the current pixel is empty
				// copy the pixel in the selected data

	TMPLayer.context.clearRect(0, 0, TMPLayer.canvas.width, TMPLayer.canvas.height);
	VFXLayer.context.clearRect(0, 0, VFXLayer.canvas.width, VFXLayer.canvas.height);

	let underlyingImageData = currentLayer.context.getImageData(startX, startY, endX - startX, endY - startY);

	for (let i=0; i<underlyingImageData.data.length; i+=4) {
		let currentMovePixel = [
			imageDataToMove.data[i], imageDataToMove.data[i+1], 
			imageDataToMove.data[i+2], imageDataToMove.data[i+3]
		];

		let currentUnderlyingPixel = [
			underlyingImageData.data[i], underlyingImageData.data[i+1], 
			underlyingImageData.data[i+2], underlyingImageData.data[i+3]
		];

		if (isPixelEmpty(currentMovePixel)) {
			if (!isPixelEmpty(underlyingImageData)) {
				imageDataToMove.data[i] = currentUnderlyingPixel[0];
				imageDataToMove.data[i+1] = currentUnderlyingPixel[1];
				imageDataToMove.data[i+2] = currentUnderlyingPixel[2];
				imageDataToMove.data[i+3] = currentUnderlyingPixel[3];
			}
		}
	}

	currentLayer.context.putImageData(
		imageDataToMove, 
		Math.round(lastMovePos[0] / zoom - imageDataToMove.width / 2), 
		Math.round(lastMovePos[1] / zoom - imageDataToMove.height / 2));

	selectionCanceled = true;
}