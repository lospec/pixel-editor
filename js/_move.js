var imageDataToMove;
var originalDataPosition;
var canMoveSelection = false;
var lastMovePos;
var selectionCanceled = true;
var firstTimeMove = true;

// TODO: move with arrows
function updateMovePreview(mousePosition) {
    // ISSUE
    selectionCanceled = false;

    if (firstTimeMove) {
        cutSelection(mousePosition);
    }

    firstTimeMove = false;

    lastMousePos = mousePosition;
    // clear the entire tmp layer
    TMPLayer.context.clearRect(0, 0, TMPLayer.canvas.width, TMPLayer.canvas.height);
    // put the image data with offset
    TMPLayer.context.putImageData(
        imageDataToMove, 
        Math.round(lastMousePos[0] / zoom - imageDataToMove.width / 2), 
        Math.round(lastMousePos[1] / zoom - imageDataToMove.height / 2));

    lastMovePos = lastMousePos;
    moveSelection(lastMousePos[0] / zoom, lastMousePos[1] / zoom, imageDataToMove.width, imageDataToMove.height); 
}

function endSelection() {
    TMPLayer.context.clearRect(0, 0, TMPLayer.canvas.width, TMPLayer.canvas.height);
    VFXLayer.context.clearRect(0, 0, VFXLayer.canvas.width, VFXLayer.canvas.height);

    if (imageDataToMove !== undefined) {
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

            if (isPixelEmpty(currentMovePixel)) {
                if (!isPixelEmpty(underlyingImageData)) {
                    imageDataToMove.data[i] = currentUnderlyingPixel[0];
                    imageDataToMove.data[i+1] = currentUnderlyingPixel[1];
                    imageDataToMove.data[i+2] = currentUnderlyingPixel[2];
                    imageDataToMove.data[i+3] = currentUnderlyingPixel[3];
                }
            }
        }

        if (lastMovePos !== undefined) {
            currentLayer.context.putImageData(
                imageDataToMove, 
                Math.round(lastMovePos[0] / zoom - imageDataToMove.width / 2), 
                Math.round(lastMovePos[1] / zoom - imageDataToMove.height / 2));
        }
        else {
            undo();
        }
    }

    selectionCanceled = true;
    isRectSelecting = false;
    firstTimeMove = true;
    imageDataToMove = undefined;
    isPasting = false;
}