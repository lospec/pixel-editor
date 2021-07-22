// REFACTOR: let's keep this one for the end
var imageDataToMove;
var originalDataPosition;
var canMoveSelection = false;
var lastMovePos;
var selectionCanceled = true;
var firstTimeMove = true;

// TODO: move with arrows
/** Updates the move preview so that is placed in the right position
 * 
 * @param {*} mousePosition The position of the cursor
 */
function updateMovePreview(mousePosition) {
    // I haven't canceled the selection
    selectionCanceled = false;

    // If it's the first time that I move the selection, I cut it from its original position
    if (firstTimeMove) {
        cutSelection(mousePosition);
    }

    firstTimeMove = false;

    lastMousePos = mousePosition;
    // clear the entire tmp layer
    TMPLayer.context.clearRect(0, 0, TMPLayer.canvas.width, TMPLayer.canvas.height);
    // put the image data on the tmp layer with offset
    TMPLayer.context.putImageData(
        imageDataToMove, 
        Math.round(lastMousePos[0] / zoom) - imageDataToMove.width / 2, 
        Math.round(lastMousePos[1] / zoom) - imageDataToMove.height / 2);

    lastMovePos = lastMousePos;
    // Moving the the rectangular ants
    moveSelection(lastMousePos[0] / zoom, lastMousePos[1] / zoom, imageDataToMove.width, imageDataToMove.height); 
}

/** Ends a selection, meaning that it makes the changes definitive and creates the history states
 * 
 */
function endSelection() {
    // Clearing the tmp (move preview) and vfx (ants) layers
    TMPLayer.context.clearRect(0, 0, TMPLayer.canvas.width, TMPLayer.canvas.height);
    VFXLayer.context.clearRect(0, 0, VFXLayer.canvas.width, VFXLayer.canvas.height);
    // Preparing an empty imageData with the size of the canvas
    let cleanImageData = new ImageData(endX - startX, endY - startY);

    // If I was moving something
    if (imageDataToMove !== undefined) {
        // Saving the current clipboard before editing it in order to merge it with the current layer
        cleanImageData.data.set(imageDataToMove.data);

        // I have to save the underlying data, so that the transparent pixels in the clipboard 
        // don't override the coloured pixels in the canvas
        let underlyingImageData = currentLayer.context.getImageData(startX, startY, endX - startX, endY - startY);
		
        for (let i=0; i<underlyingImageData.data.length; i+=4) {
            let currentMovePixel = [
                imageDataToMove.data[i], imageDataToMove.data[i+1], 
                imageDataToMove.data[i+2], imageDataToMove.data[i+3]
            ];

            let currentUnderlyingPixel = [
                underlyingImageData.data[i], underlyingImageData.data[i+1], 
                underlyingImageData.data[i+2], underlyingImageData.data[i+3]
            ];

            // If the pixel of the clipboard is empty, but the one below it isn't, I use the pixel below
            if (isPixelEmpty(currentMovePixel)) {
                if (!isPixelEmpty(underlyingImageData)) {
                    imageDataToMove.data[i] = currentUnderlyingPixel[0];
                    imageDataToMove.data[i+1] = currentUnderlyingPixel[1];
                    imageDataToMove.data[i+2] = currentUnderlyingPixel[2];
                    imageDataToMove.data[i+3] = currentUnderlyingPixel[3];
                }
            }
        }

        // If I moved the selection before confirming it
        if (lastMovePos !== undefined) {
            // I put it in the new position
            currentLayer.context.putImageData(
                imageDataToMove, 
                Math.round(lastMovePos[0] / zoom) - imageDataToMove.width / 2, 
                Math.round(lastMovePos[1] / zoom) - imageDataToMove.height / 2);
        }
        else {
            // I put it in the same position
            currentLayer.context.putImageData(
                imageDataToMove, 
                copiedStartX, 
                copiedStartY);
        }

        imageDataToMove.data.set(cleanImageData.data);
    }

    // Resetting all the flags
    selectionCanceled = true;
    isRectSelecting = false;
    firstTimeMove = true;
    imageDataToMove = undefined;
    isPasting = false;
    isCutting = false;
    lastMovePos = undefined;
    currentLayer.updateLayerPreview();

    // Saving the history
    new HistoryState().EditCanvas();
}