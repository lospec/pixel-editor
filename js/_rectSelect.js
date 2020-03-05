var isRectSelecting = false;
let startX;
let startY;
let endX;
let endY;
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
	endX = currentPos[0] / zoom;
	endY = currentPos[1] / zoom;

	// Putting the vfx layer behind everything
	isRectSelecting = false;
	// Getting the selected pixels
	imageData = currentLayer.context.createImageData(endX - startX, endY - startY);

	// Selecting the move tool
	currentTool = 'moveselection';
	currentToolTemp = currentTool;
	// Updating the cursor 
	updateCursor();

	// TODO: find out why the imagedata is blank
	for (i=0; i<imageData.data.length; i++) {
		console.log("rgba(" + imageData.data[i] + ',' + imageData.data[i + 1] + ',' + imageData.data[i + 2] + ','  + imageData.data[i + 3] + ')');
	}

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

	currentLayer.context.putImageData(imageData, startX, startY);
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

// Checks whether the pointer is inside the selected area or not
function cursorInSelectedArea() {
	let cursorPos = getCursorPosition(currentMouseEvent);
	let x = cursorPos[0] / zoom;
	let y = cursorPos[1] / zoom;

	let leftX = Math.min(startX, endX);
	let rightX = Math.max(startX, endX);
	let topY = Math.max(startY, endY);
	let bottomY = Math.min(startY, endY);

	// ISSUE: is it <= or <? test it
	if (leftX <= x && x <= rightX) {
		if (bottomY <= y && y <= topY) {
			return true;
		}

		return false;
	}

	return false;
}