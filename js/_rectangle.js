// Saving the empty rect svg
var emptyRectangleSVG = document.getElementById("rectangle-empty-button-svg");
// and the full rect svg so that I can change them when the user changes rect modes
var fullRectangleSVG = document.getElementById("rectangle-full-button-svg");

// The start mode is empty rectangle
var rectangleDrawMode = 'empty';
// I'm not drawing a rectangle at the beginning
var isDrawingRect = false;

// Rect coordinates
let startRectX;
let startRectY;
let endRectX;
let endRectY;

/** Starts drawing the rect, saves the start coordinates
 * 
 * @param {*} mouseEvent 
 */
function startRectDrawing(mouseEvent) {
	// Putting the vfx layer on top of everything
    VFXCanvas.style.zIndex = parseInt(currentLayer.canvas.style.zIndex, 10) + 1;;
    // Updating flag
    isDrawingRect = true;

    // Saving the start coords of the rect
    let cursorPos = getCursorPosition(mouseEvent);
    startRectX = Math.floor(cursorPos[0] / zoom) + 0.5;
    startRectY = Math.floor(cursorPos[1] / zoom) + 0.5;

    drawRectangle(startRectX, startRectY);
}

/** Updates the rectangle preview depending on the position of the mouse
 * 
 * @param {*} mouseEvent The mouseEvent from which we'll get the mouse position
 */
function updateRectDrawing(mouseEvent) {
	let pos = getCursorPosition(mouseEvent);

	// Drawing the rect at the right position
	drawRectangle(Math.floor(pos[0] / zoom) + 0.5, Math.floor(pos[1] / zoom) + 0.5);
}

/** Finishes drawing the rect, decides the end coordinates and moves the preview rectangle to the
 *  current layer
 * 
 * @param {*} mouseEvent event from which we'll get the mouse position
 */
function endRectDrawing(mouseEvent) {
	// Getting the end position
	let currentPos = getCursorPosition(mouseEvent);
	let vfxContext = VFXCanvas.getContext("2d");

	endRectX = Math.floor(currentPos[0] / zoom) + 0.5;
	endRectY = Math.floor(currentPos[1] / zoom) + 0.5;

	// Inverting end and start (start must always be the top left corner)
	if (endRectX < startRectX) {
		let tmp = endRectX;
		endRectX = startRectX;
		startRectX = tmp;
	}
	// Same for the y
	if (endRectY < startRectY) {
		let tmp = endRectY;
		endRectY = startRectY;
		startRectY = tmp;
	}

	// Resetting this
	isDrawingRect = false;
	// Drawing the rect
	startRectY -= 0.5;
	endRectY -= 0.5;
	endRectX -= 0.5;
	startRectX -= 0.5;

	// Setting the correct linewidth and colour
	currentLayer.context.lineWidth = tool.rectangle.brushSize;
	currentLayer.context.fillStyle = currentGlobalColor;

	// Drawing the rect using 4 lines
	line(startRectX, startRectY, endRectX, startRectY, tool.rectangle.brushSize);
	line(endRectX, startRectY, endRectX, endRectY, tool.rectangle.brushSize);
	line(endRectX, endRectY, startRectX, endRectY, tool.rectangle.brushSize);
	line(startRectX, endRectY, startRectX, startRectY, tool.rectangle.brushSize);

	// If I have to fill it, I do so
	if (rectangleDrawMode == 'fill') {
		currentLayer.context.fillRect(startRectX, startRectY, endRectX - startRectX, endRectY - startRectY);
	}

	// Clearing the vfx canvas
	vfxContext.clearRect(0, 0, VFXCanvas.width, VFXCanvas.height);
}

/** Draws a rectangle with end coordinates given by x and y on the VFX layer (draws
 *  the preview for the rectangle tool)
 * 
 * @param {*} x The current end x of the rectangle
 * @param {*} y The current end y of the rectangle
 */
function drawRectangle(x, y) {
	// Getting the vfx context
	let vfxContext = VFXCanvas.getContext("2d");

	// Clearing the vfx canvas
	vfxContext.clearRect(0, 0, VFXCanvas.width, VFXCanvas.height);

	// Drawing the rect
	vfxContext.lineWidth = tool.rectangle.brushSize;
	vfxContext.strokeStyle = currentGlobalColor;

	// Drawing the rect
	vfxContext.beginPath();
	if ((tool.rectangle.brushSize % 2 ) == 0) {
		vfxContext.rect(startRectX - 0.5, startRectY - 0.5, x - startRectX, y - startRectY);
	}
	else {
		vfxContext.rect(startRectX, startRectY, x - startRectX, y - startRectY);
	}

	vfxContext.setLineDash([]);
    vfxContext.stroke();
}

/** Sets the correct tool icon depending on its mode
 * 
 */
function setRectToolSvg() {
    if (rectangleDrawMode == 'empty') {
        emptyRectangleSVG.setAttribute('display', 'visible');
        fullRectangleSVG.setAttribute('display', 'none');
    }
    else {
        emptyRectangleSVG.setAttribute('display', 'none');
        fullRectangleSVG.setAttribute('display', 'visible');
    }
}

function applyChanges() {
    //VFXCanvas.style.zIndex = MIN_Z_INDEX;
}
