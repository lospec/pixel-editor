/** Cuts the selection from its canvas and puts it in the tmp layer so it can be moved
 * 
 * @param {*} mousePosition 
 */
function cutSelection(mousePosition) {
	// Getting the selected pixels
	imageDataToMove = currentLayer.context.getImageData(startX, startY, endX - startX + 1, endY - startY + 1);
    
	currentLayer.context.clearRect(startX - 0.5, startY - 0.5, endX - startX + 1, endY - startY + 1);
	// Moving those pixels from the current layer to the tmp layer
	TMPLayer.context.putImageData(imageDataToMove, startX + 1, startY);
}

function applyChanges() {
    VFXLayer.canvas.style.zIndex = MIN_Z_INDEX;
}

// Checks whether the pointer is inside the selected area or not
function cursorInSelectedArea() {
    // Getting the cursor position
    let cursorPos = Input.getCursorPosition(Input.getCurrMouseEvent());
    // Getting the coordinates relatively to the canvas
    let x = cursorPos[0] / zoom;
    let y = cursorPos[1] / zoom;

    // This is to avoid rightX or topY being less than leftX or bottomY
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

/** Moves the rect ants to the specified position 
 * 
 * @param {*} x X coordinate of the rect ants
 * @param {*} y Y coordinat of the rect ants
 * @param {*} width Width of the selection
 * @param {*} height Height of the selectin
 */
function moveSelection(x, y, width, height) {
    // Getting the vfx context
    let vfxContext = VFXLayer.context;

    // Clearing the vfx canvas
    vfxContext.clearRect(0, 0, VFXLayer.canvas.width, VFXLayer.canvas.height);
    vfxContext.lineWidth = 1;
    vfxContext.setLineDash([4]);

    // Fixing the coordinates
    startX = Math.round(Math.round(x) - 0.5 - Math.round(width / 2)) + 0.5;
    startY = Math.round(Math.round(y) - 0.5 - Math.round(height / 2)) + 0.5;
    endX = startX + Math.round(width);
    endY = startY + Math.round(height);

    // Drawing the rect
    vfxContext.beginPath();
    vfxContext.rect(startX, startY, width, height);

    vfxContext.stroke();
}