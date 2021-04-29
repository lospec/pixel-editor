// Saving the empty rect svg
var emptyEllipseSVG = document.getElementById("ellipse-empty-button-svg");
// and the full rect svg so that I can change them when the user changes rect modes
var fullEllipseSVG = document.getElementById("ellipse-full-button-svg");

// The start mode is empty ellipse
var ellipseDrawMode = 'empty';
// I'm not drawing a ellipse at the beginning
var isDrawingEllipse = false;

// Ellipse coordinates
let startEllipseX;
let startEllipseY;
let endEllipseX;
let endEllipseY;

// TODO: [ELLIPSE] Make it draw ellipse instead of copy-pasted rectangle
/** Starts drawing the ellipse, saves the start coordinates
 * 
 * @param {*} mouseEvent 
 */
function startEllipseDrawing(mouseEvent) {
	// Putting the vfx layer on top of everything
    VFXCanvas.style.zIndex = parseInt(currentLayer.canvas.style.zIndex, 10) + 1;;
    // Updating flag
    isDrawingEllipse = true;

    // Saving the start coords of the ellipse
    let cursorPos = getCursorPosition(mouseEvent);
    startEllipseX = Math.floor(cursorPos[0] / zoom) + 0.5;
    startEllipseY = Math.floor(cursorPos[1] / zoom) + 0.5;

    drawEllipse(startEllipseX, startEllipseY);
}

// TODO: [ELLIPSE] Make it draw ellipse instead of copy-pasted rectangle
/** Updates the ellipse preview depending on the position of the mouse
 * 
 * @param {*} mouseEvent The mouseEvent from which we'll get the mouse position
 */
function updateEllipseDrawing(mouseEvent) {
	let pos = getCursorPosition(mouseEvent);

	// Drawing the ellipse at the right position
	drawEllipse(Math.round(pos[0] / zoom) + 0.5, Math.round(pos[1] / zoom) + 0.5);
}

// TODO: [ELLIPSE] Make it draw ellipse instead of copy-pasted rectangle
/** Finishes drawing the ellipse, decides the end coordinates and moves the preview ellipse to the
 *  current layer
 * 
 * @param {*} mouseEvent event from which we'll get the mouse position
 */
function endEllipseDrawing(mouseEvent) {
	// Getting the end position
	let currentPos = getCursorPosition(mouseEvent);
	let vfxContext = VFXCanvas.getContext("2d");

	endEllipseX = Math.round(currentPos[0] / zoom) + 0.5;
	endEllipseY = Math.round(currentPos[1] / zoom) + 0.5;

	// Inverting end and start (start must always be the top left corner)
	if (endEllipseX < startEllipseX) {
		let tmp = endEllipseX;
		endEllipseX = startEllipseX;
		startEllipseX = tmp;
	}
	// Same for the y
	if (endEllipseY < startEllipseY) {
		let tmp = endEllipseY;
		endEllipseY = startEllipseY;
		startEllipseY = tmp;
	}

	// Resetting this
	isDrawingEllipse = false;
	// Drawing the ellipse
	startEllipseY -= 0.5;
	endEllipseY -= 0.5;
	endEllipseX -= 0.5;
	startEllipseX -= 0.5;

	// Setting the correct linewidth and colour
	currentLayer.context.lineWidth = tool.ellipse.brushSize;
	currentLayer.context.fillStyle = currentGlobalColor;

	// Drawing the ellipse using 4 lines
	line(startEllipseX, startEllipseY, endEllipseX, startEllipseY, tool.ellipse.brushSize);
	line(endEllipseX, startEllipseY, endEllipseX, endEllipseY, tool.ellipse.brushSize);
	line(endEllipseX, endEllipseY, startEllipseX, endEllipseY, tool.ellipse.brushSize);
	line(startEllipseX, endEllipseY, startEllipseX, startEllipseY, tool.ellipse.brushSize);

	// If I have to fill it, I do so
	if (ellipseDrawMode == 'fill') {
		currentLayer.context.fillRect(startEllipseX, startEllipseY, endEllipseX - startEllipseX, endEllipseY - startEllipseY);
	}

	// Clearing the vfx canvas
	vfxContext.clearRect(0, 0, VFXCanvas.width, VFXCanvas.height);
}

// TODO: [ELLIPSE] Make it draw ellipse instead of copy-pasted rectangle
/** Draws a ellipse with end coordinates given by x and y on the VFX layer (draws
 *  the preview for the ellipse tool)
 * 
 * @param {*} x The current end x of the ellipse
 * @param {*} y The current end y of the ellipse
 */
function drawEllipse(x, y) {
	// Getting the vfx context
	let vfxContext = VFXCanvas.getContext("2d");

	// Clearing the vfx canvas
	vfxContext.clearRect(0, 0, VFXCanvas.width, VFXCanvas.height);

	// Drawing the ellipse
	vfxContext.lineWidth = tool.ellipse.brushSize;
	vfxContext.strokeStyle = currentGlobalColor;

	// Drawing the ellipse
	vfxContext.beginPath();
	if ((tool.ellipse.brushSize % 2 ) == 0) {
		vfxContext.rect(startEllipseX - 0.5, startEllipseY - 0.5, x - startEllipseX, y - startEllipseY);
	}
	else {
		vfxContext.rect(startEllipseX, startEllipseY, x - startEllipseX, y - startEllipseY);
	}

	vfxContext.setLineDash([]);
    vfxContext.stroke();
}

/** Sets the correct tool icon depending on its mode
 * 
 */
function setEllipseToolSvg() {
	console.log("set eilipse svg");
	if (ellipseDrawMode == 'empty') {
        emptyEllipseSVG.setAttribute('display', 'visible');
        fullEllipseSVG.setAttribute('display', 'none');
    }
    else {
        emptyEllipseSVG.setAttribute('display', 'none');
        fullEllipseSVG.setAttribute('display', 'visible');
    }
}
