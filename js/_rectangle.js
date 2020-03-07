var rectangleSize = 1;
var drawMode = 'empty';
var isDrawingRect = false;

let startRectX;
let startRectY;
let endRectX;
let endRectY;


function startRectDrawing(mouseEvent) {
	// Putting the vfx layer on top of everything
	VFXCanvas.style.zIndex = MAX_Z_INDEX;
	// Updating flag
	isDrawingRect = true;

	// Saving the start coords of the rect
	let cursorPos = getCursorPosition(mouseEvent);
	startRectX = Math.round(cursorPos[0] / zoom) - 0.5;
	startRectY = Math.round(cursorPos[1] / zoom) - 0.5;

	drawRectangle(startRectX, startRectY);
}

function updateRectDrawing(mouseEvent) {
	let pos = getCursorPosition(mouseEvent);
	
	// Drawing the rect
	drawRectangle(Math.round(pos[0] / zoom) + 0.5, Math.round(pos[1] / zoom) + 0.5);
}

function endRectDrawing(mouseEvent) {
	// Getting the end position
	let currentPos = getCursorPosition(mouseEvent);
	let vfxContext = VFXCanvas.getContext("2d");

	endRectX = Math.round(currentPos[0] / zoom) + 0.5;
	endRectY = Math.round(currentPos[1] / zoom) + 0.5;

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

	let hexColor = hexToRgb(currentLayer.context.fillStyle);

	// Resetting this
	isDrawingRect = false;
	// Drawing the final rectangle
	currentLayer.context.lineWidth = rectangleSize;
	currentLayer.context.strokeStyle = currentGlobalColor;

	// Drawing the rect
	currentLayer.context.beginPath();
	currentLayer.context.rect(startRectX, startRectY, endRectX - startRectX, endRectY - startRectY);
	currentLayer.context.setLineDash([]);
	currentLayer.context.stroke();

	// Drawing on the corners
	var id = currentLayer.context.createImageData(1,1);
	var d  = id.data;
	d[0]   = hexColor.r;
	d[1]   = hexColor.g;
	d[2]   = hexColor.b;
	d[3]   = 255;

	currentLayer.context.putImageData(id, startRectX, startRectY); 
	currentLayer.context.putImageData(id, startRectX, endRectY); 
	currentLayer.context.putImageData(id, endRectX, startRectY); 
	currentLayer.context.putImageData(id, endRectX, endRectY);

	// Clearing the vfx canvas
	vfxContext.clearRect(0, 0, VFXCanvas.width, VFXCanvas.height);
}
	
function drawRectangle(x, y) {
	// Getting the vfx context
	let vfxContext = VFXCanvas.getContext("2d");

	// Clearing the vfx canvas
	vfxContext.clearRect(0, 0, VFXCanvas.width, VFXCanvas.height);

	// Drawing the rect
	vfxContext.lineWidth = rectangleSize;
	vfxContext.strokeStyle = currentGlobalColor;

	// Drawing the rect
	vfxContext.beginPath();
	vfxContext.rect(startRectX, startRectY, x - startRectX, y - startRectY);
	vfxContext.setLineDash([]);

	vfxContext.stroke();
}

function applyChanges() {
	VFXCanvas.style.zIndex = MIN_Z_INDEX;
}