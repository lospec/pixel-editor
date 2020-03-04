var isRectSelecting = false;
let startX;
let startY;

function startRectSelection(mouseEvent) {
	// Putting the vfx layer on top of everything
	VFXCanvas.style.zIndex = MAX_Z_INDEX;
	console.log("Started selecting");
	// Saving the start coords of the rect
	cursorPos = getCursorPositionRelative(mouseEvent, VFXCanvas)
	startX = cursorPos[0];
	startY = cursorPos[1];

	// Drawing the rect
	drawRect(startX, startY);
}

function updateRectSelection(mouseEvent) {
	pos = getCursorPositionRelative(mouseEvent, VFXCanvas);
	
	// Drawing the rect
	drawRect(pos[0], pos[1]);
}

function endRectSelection(mouseEvent) {
	console.log("Finished selecting");
	// Putting the vfx layer behind everything
	//VFXCanvas.style.zIndex = MIN_Z_INDEX;
	isRectSelecting = false;
}

function drawRect(x, y) {
	console.log("Currently selecting");
	// Getting the vfx context
	let vfxContext = VFXCanvas.getContext("2d");

	// Clearing the vfx canvas
	vfxContext.clearRect(0, 0, VFXCanvas.width, VFXCanvas.height);
	// Drawing the rect
	vfxContext.beginPath();
	vfxContext.rect(startX, startY, x - startX, y - startY);
	vfxContext.stroke();
}

// TODO: esc to exit selection mode