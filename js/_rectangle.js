
var emptySVG = document.getElementById("empty-button-svg");
var fullSVG = document.getElementById("full-button-svg");

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
    startRectX = Math.floor(cursorPos[0] / zoom) + 0.5;
    startRectY = Math.floor(cursorPos[1] / zoom) + 0.5;

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

	// Resetting this
	isDrawingRect = false;
	// Drawing the rect
	startRectY -= 0.5;
	endRectY -= 0.5;
	endRectX -= 0.5;
	startRectX -= 0.5;

	currentLayer.context.lineWidth = tool.rectangle.brushSize;
	currentLayer.context.fillStyle = currentGlobalColor;

	line(startRectX, startRectY, endRectX, startRectY, tool.rectangle.brushSize);
	line(endRectX, startRectY, endRectX, endRectY, tool.rectangle.brushSize);
	line(endRectX, endRectY, startRectX, endRectY, tool.rectangle.brushSize);
	line(startRectX, endRectY, startRectX, startRectY, tool.rectangle.brushSize);

	if (drawMode == 'fill') {
		currentLayer.context.fillRect(startRectX, startRectY, endRectX - startRectX, endRectY - startRectY);
	}

	// Clearing the vfx canvas
	vfxContext.clearRect(0, 0, VFXCanvas.width, VFXCanvas.height);
}

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

function setRectToolSvg() {
    if (drawMode == 'empty') {
        emptySVG.setAttribute('display', 'visible');
        fullSVG.setAttribute('display', 'none');
    }
    else {
        emptySVG.setAttribute('display', 'none');
        fullSVG.setAttribute('display', 'visible');
    }
}

function applyChanges() {
    VFXCanvas.style.zIndex = MIN_Z_INDEX;
}
