var isRectSelecting = false;
let startX;
let startY;
let workingLayer;
let imageData;

function startRectSelection(mouseEvent) {
	// Putting the vfx layer on top of everything
	VFXCanvas.style.zIndex = MAX_Z_INDEX;
	// Saving the layer the user is working on
	workingLayer = currentLayer;

	// Saving the start coords of the rect
	let cursorPos = getCursorPosition(mouseEvent);
	startX = Math.floor(cursorPos[0] / zoom) + 0.5;
	startY = Math.floor(cursorPos[1] / zoom) + 0.5;

	// Drawing the rect
	drawRect(startX, startY);
}

function updateRectSelection(mouseEvent) {
	let pos = getCursorPosition(mouseEvent);
	
	// Drawing the rect
	drawRect(Math.floor(pos[0] / zoom) + 0.5, Math.floor(pos[1] / zoom) + 0.5);
}

function endRectSelection(mouseEvent) {
	// Getting the end position
	let currentPos = getCursorPosition(mouseEvent);
	let x = currentPos[0] / zoom;
	let y = currentPos[1] / zoom;

	// Putting the vfx layer behind everything
	isRectSelecting = false;
	// Getting the selected pixels
	imageData = currentLayer.context.createImageData(x - startX, y - startY);

	// NOW
	// Select the move tool
		// the move tool moves stuff only if the cursor is on the selected area
		// the move tool stops working when esc is pressed
		// when the move tool is disabled, the control is given to the brush tool
		// on click: start dragging
		// on drag: render preview by changing the position of the image data and change the position of the selection rect
			// IMPORTANT: the image data must be deleted from the original layer
			// the image data must be copied to a temporary layer
			// the image data is added to the original layer when the move tool is disabled

	workingLayer.context.putImageData(imageData, startX, startY);
}

function drawRect(x, y) {
	console.log("Currently selecting");
	// Getting the vfx context
	let vfxContext = VFXCanvas.getContext("2d");

	// Clearing the vfx canvas
	vfxContext.clearRect(0, 0, VFXCanvas.width, VFXCanvas.height);
	vfxContext.lineWidth = 1;
	vfxContext.setLineDash([4]);

	// Drawing the rect
	vfxContext.beginPath();
	vfxContext.rect(startX, startY, x - startX, y - startY);

	vfxContext.stroke();

	// TODO: make the rect blink from black to white in case of dark backgrounds
}

function applyChanges() {
	VFXCanvas.style.zIndex = MIN_Z_INDEX;
}