var imageDataToMove;
var canMoveSelection = false;
var lastMovePos;

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

	currentLayer.context.putImageData(
		imageDataToMove, 
		Math.round(lastMovePos[0] / zoom - imageDataToMove.width / 2), 
		Math.round(lastMovePos[1] / zoom - imageDataToMove.height / 2));
}