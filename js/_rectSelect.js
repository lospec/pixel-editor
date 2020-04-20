var isRectSelecting = false;
let startX;
let startY;
let endX;
let endY;

function startRectSelection(mouseEvent) {
    // Saving the canvas
    new HistoryStateEditCanvas();
    // Putting the vfx layer on top of everything
    VFXCanvas.style.zIndex = MAX_Z_INDEX;

    // Saving the start coords of the rect
    let cursorPos = getCursorPosition(mouseEvent);
    startX = Math.round(cursorPos[0] / zoom) - 0.5;
    startY = Math.round(cursorPos[1] / zoom) - 0.5;

    // Avoiding external selections
    if (startX < 0) {
        startX = 0;
    }
    else if (startX > currentLayer.canvas.width) {
        startX = currentLayer.canvas.width;
    }

    if (startY < 0) {
        startY = 0;
    }
    else if (startY > currentLayer.canvas.height) {
        startY = currentLayer.canvas.height;
    }

    // Drawing the rect
    drawRect(startX, startY);
    selectionCanceled = false;
}

function updateRectSelection(mouseEvent) {
	let pos = getCursorPosition(mouseEvent);

	// Drawing the rect
	drawRect(Math.round(pos[0] / zoom) + 0.5, Math.round(pos[1] / zoom) + 0.5);
}

function endRectSelection(mouseEvent) {
	// Getting the end position
	let currentPos = getCursorPosition(mouseEvent);
	endX = Math.round(currentPos[0] / zoom) + 0.5;
	endY = Math.round(currentPos[1] / zoom) + 0.5;

	// Inverting end and start (start must always be the top left corner)
	if (endX < startX) {
		let tmp = endX;
		endX = startX;
		startX = tmp;
	}
	// Same for the y
	if (endY < startY) {
		let tmp = endY;
		endY = startY;
		startY = tmp;
	}

	// Selecting the move tool
	currentTool = tool.moveselection;
	currentToolTemp = currentTool;

	// Resetting this
	isRectSelecting = false;

	// Updating the cursor
	currentTool.updateCursor();
}

function cutSelection(mousePosition) {
	console.log("Coordinate: start x, y: " + startX + ", " + startY + " end x, y: " + endX + ", " + endY);
	// Getting the selected pixels
	imageDataToMove = currentLayer.context.getImageData(startX, startY, endX - startX + 1, endY - startY + 1);
    clipBoardData = imageDataToMove;

	currentLayer.context.clearRect(startX - 0.5, startY - 0.5, endX - startX + 1, endY - startY + 1);
	// Moving those pixels from the current layer to the tmp layer
	TMPLayer.context.putImageData(imageDataToMove, startX + 1, startY);

    //originalDataPosition = [currentPos[0], currentPos[1]];
}

function drawRect(x, y) {
    // Getting the vfx context
    let vfxContext = VFXCanvas.getContext('2d');

    // Clearing the vfx canvas
    vfxContext.clearRect(0, 0, VFXCanvas.width, VFXCanvas.height);
    vfxContext.lineWidth = 1;
    vfxContext.strokeStyle = 'black';
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

    if (leftX <= x && x <= rightX) {
        if (bottomY <= y && y <= topY) {
            return true;
        }

        return false;
    }

    return false;
}

function moveSelection(x, y, width, height) {
    // Getting the vfx context
    let vfxContext = VFXCanvas.getContext('2d');

    // Clearing the vfx canvas
    vfxContext.clearRect(0, 0, VFXCanvas.width, VFXCanvas.height);
    vfxContext.lineWidth = 1;
    vfxContext.setLineDash([4]);

    startX = Math.round(Math.round(x) - Math.round(width / 2)) + 0.5;
    startY = Math.round(Math.round(y) - Math.round(height / 2)) + 0.5;
    endX = startX + Math.round(width);
    endY = startY + Math.round(height);

    // Drawing the rect
    vfxContext.beginPath();
    vfxContext.rect(startX, startY, width, height);

    vfxContext.stroke();
}