/* This scripts contains all the code used to handle the canvas resizing */

// Resize canvas pop up window
let resizeCanvasContainer = document.getElementById("resize-canvas");
// Start pivot
let rcPivot = "middle";
// Selected pivot button
let currentPivotObject;
// Border offsets
let rcBorders = {left: 0, right: 0, top: 0, bottom: 0};

/** Opens the canvas resize window
 * 
 */
function openResizeCanvasWindow() {
    // Initializes the inputs
    initResizeCanvasInputs();
    Dialogue.showDialogue('resize-canvas');
}

/** Initializes the canvas resizing input
 * 
 */
function initResizeCanvasInputs() {
    // Getting the pivot buttons
    let buttons = document.getElementsByClassName("pivot-button");

    // Adding the event handlers for them
    for (let i=0; i<buttons.length; i++) {
        buttons[i].addEventListener("click", changePivot);
        if (buttons[i].getAttribute("value").includes("middle")) {
            currentPivotObject = buttons[i];
        }
    }

    document.getElementById("rc-width").value = layers[0].canvasSize[0];
    document.getElementById("rc-height").value = layers[0].canvasSize[1];

    document.getElementById("rc-border-left").addEventListener("change", rcChangedBorder);
    document.getElementById("rc-border-right").addEventListener("change", rcChangedBorder);
    document.getElementById("rc-border-top").addEventListener("change", rcChangedBorder);
    document.getElementById("rc-border-bottom").addEventListener("change", rcChangedBorder);

    document.getElementById("rc-width").addEventListener("change", rcChangedSize);
    document.getElementById("rc-height").addEventListener("change", rcChangedSize);

    document.getElementById("resize-canvas-confirm").addEventListener("click", resizeCanvas);
    console.log("Pivot selezionato: " + currentPivotObject);
}

/** Fired when a border offset is changed: it updates the width and height
 * 
 * @param {*} event 
 */
function rcChangedBorder(event) {
    rcUpdateBorders();
    
    document.getElementById("rc-width").value = parseInt(layers[0].canvasSize[0]) + rcBorders.left + rcBorders.right;
    document.getElementById("rc-height").value = parseInt(layers[0].canvasSize[1]) + rcBorders.top + rcBorders.bottom;
}

/** Fired when width or height are changed: updates the border offsets
 * 
 * @param {*} event 
 */
function rcChangedSize(event) {
    let widthOffset = Math.abs(document.getElementById("rc-width").value) - layers[0].canvasSize[0];
    let heightOffset = Math.abs(document.getElementById("rc-height").value) - layers[0].canvasSize[1];

    let left = Math.round(widthOffset / 2);
    let right = widthOffset - left;
    let top = Math.round(heightOffset / 2);
    let bottom = heightOffset - top;

    document.getElementById("rc-border-left").value = left;
    document.getElementById("rc-border-right").value = right;
    document.getElementById("rc-border-top").value = top;
    document.getElementById("rc-border-bottom").value = bottom;

    rcBorders.left = left;
    rcBorders.right = right;
    rcBorders.top = top;
    rcBorders.bottom = bottom;
}

/** Resizes the canvas
 * 
 * @param {*} event The event that triggered the canvas resizing
 * @param {*} size The new size of the picture
 * @param {*} customData Used when ctrl+z ing
 * @param {*} saveHistory Should I save the history? You shouldn't if you're undoing
 */
function resizeCanvas(event, size, customData, saveHistory = true) {
    let imageDatas = [];
    let leftOffset = 0;
    let topOffset = 0;
    let copiedDataIndex = 0;

    // If I'm undoing and I'm not trimming, I manually put the values in the window
    if (size != null && customData == null) {
        document.getElementById("rc-width").value = size.x;
        document.getElementById("rc-height").value = size.y;

        rcChangedSize();
    }
    
    rcUpdateBorders();

    // Save all imageDatas
    for (let i=0; i<layers.length; i++) {
        if (layers[i].menuEntry != null) {
            imageDatas.push(layers[i].context.getImageData(0, 0, layers[0].canvasSize[0], layers[0].canvasSize[1]));
        }
    }

    // Saving the history only if I'm not already undoing or redoing
    if (saveHistory && event != null) {
        // Saving history
        new HistoryState().ResizeCanvas(
            {x: parseInt(layers[0].canvasSize[0]) + rcBorders.left + rcBorders.right, 
            y: parseInt(layers[0].canvasSize[1]) + rcBorders.top + rcBorders.bottom},

            {x: layers[0].canvasSize[0],
            y: layers[0].canvasSize[1]},
            imageDatas.slice(), customData != null && saveHistory
        );

        console.log("salvata");
    }

    // Resize the canvases
    for (let i=0; i<layers.length; i++) {
        layers[i].canvasSize[0] = parseInt(layers[i].canvasSize[0]) + rcBorders.left + rcBorders.right;
        layers[i].canvasSize[1] = parseInt(layers[i].canvasSize[1]) + rcBorders.top + rcBorders.bottom;

        layers[i].canvas.width = layers[i].canvasSize[0];
        layers[i].canvas.height = layers[i].canvasSize[1];

        layers[i].resize();
        layers[i].context.fillStyle = currentGlobalColor;
    }

    // Regenerate the checkerboard
    fillCheckerboard();
    fillPixelGrid();
    // Put the imageDatas in the right position
    switch (rcPivot)
    {
        case 'topleft':
            leftOffset = 0;
            topOffset = 0;
            break;
        case 'top':
            leftOffset = (rcBorders.left + rcBorders.right) / 2;
            topOffset = 0;
            break;
        case 'topright':
            leftOffset = rcBorders.left + rcBorders.right;
            topOffset = 0;
            break;
        case 'left':
            leftOffset = 0;
            topOffset = (rcBorders.top + rcBorders.bottom) / 2;
            break;
        case 'middle':
            leftOffset = (rcBorders.left + rcBorders.right) / 2;
            topOffset = (rcBorders.top + rcBorders.bottom) / 2;
            break;
        case 'right':
            leftOffset = rcBorders.left + rcBorders.right;
            topOffset = (rcBorders.top + rcBorders.bottom) / 2;
            break;
        case 'bottomleft':
            leftOffset = 0;
            topOffset = rcBorders.top + rcBorders.bottom;
            break;
        case 'bottom':
            leftOffset = (rcBorders.left + rcBorders.right) / 2;
            topOffset = rcBorders.top + rcBorders.bottom;
            break;
        case 'bottomright':
            leftOffset = rcBorders.left + rcBorders.right;
            topOffset = rcBorders.top + rcBorders.bottom;
            break;
        default:
            console.log('Pivot does not exist, please report an issue at https://github.com/lospec/pixel-editor');
            break;
    }
    
    // Putting all the data for each layer with the right offsets (decided by the pivot)
    for (let i=0; i<layers.length; i++) {
        if (layers[i].menuEntry != null) {
            if (customData == undefined) {
                layers[i].context.putImageData(imageDatas[copiedDataIndex], leftOffset, topOffset);
            }
            else {
                layers[i].context.putImageData(customData[copiedDataIndex], 0, 0);
            }
            layers[i].updateLayerPreview();
            copiedDataIndex++;
        }
    }

    Dialogue.closeDialogue();
}

/** Trims the canvas so tat the sprite is perfectly contained in it
 * 
 * @param {*} event 
 * @param {*} saveHistory Should I save the history? You shouldn't if you're undoing
 */
function trimCanvas(event, saveHistory) {
    let minY = Infinity;
    let minX = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let tmp;
    let imageDatas = [];
    let historySave = saveHistory == null;
    let prevPivot = rcPivot;

    rcPivot = "topleft";
    console.log("debug");

    // Computing the min and max coordinates in which there's a non empty pixel
    for (let i=1; i<layers.length - nAppLayers; i++) {
        let imageData = layers[i].context.getImageData(0, 0, layers[0].canvasSize[0], layers[0].canvasSize[1]);
        let pixelPosition;

        for (let i=imageData.data.length - 1; i>= 0; i-=4) {
            if (!isPixelEmpty(
                [imageData.data[i - 3], imageData.data[i - 2], 
                -imageData.data[i - 1], imageData.data[i]])) {
                pixelPosition = getPixelPosition(i);        

                // max x
                if (pixelPosition[0] > maxX) {
                    maxX = pixelPosition[0];
                }
                // min x
                if (pixelPosition[0] < minX) {
                    minX = pixelPosition[0];
                }
                // max y
                if (pixelPosition[1] > maxY) {
                    maxY = pixelPosition[1];
                }
                // min y
                if (pixelPosition[1] < minY) {
                    minY = pixelPosition[1];
                }
            }
        }
    }

    tmp = minY;
    minY = maxY;
    maxY = tmp;

    minY = layers[0].canvasSize[1] - minY;
    maxY = layers[0].canvasSize[1] - maxY;

    // Setting the borders coherently with the values I've just computed
    rcBorders.right = (maxX - layers[0].canvasSize[0]) + 1;
    rcBorders.left = -minX;
    rcBorders.top = maxY - layers[0].canvasSize[1] + 1;
    rcBorders.bottom = -minY;

    // Saving the data
    for (let i=0; i<layers.length; i++) {
        if (layers[i].menuEntry != null) {
            imageDatas.push(layers[i].context.getImageData(minX - 1, layers[i].canvasSize[1] - maxY, maxX-minX + 1, maxY-minY + 1));
        }
    }

    console.log(imageDatas);
    //console.log("sx: " + borders.left + "dx: " + borders.right + "top: " + borders.top + "btm: " + borders.bottom);

    document.getElementById("rc-border-left").value = rcBorders.left;
    document.getElementById("rc-border-right").value = rcBorders.right;
    document.getElementById("rc-border-top").value = rcBorders.top;
    document.getElementById("rc-border-bottom").value = rcBorders.bottom;

    // Resizing the canvas with the decided border offsets
    resizeCanvas(null, null, imageDatas.slice(), historySave);
    // Resetting the previous pivot
    rcPivot = prevPivot;
}

function rcUpdateBorders() {
    // Getting input
    rcBorders.left = document.getElementById("rc-border-left").value;
    rcBorders.right = document.getElementById("rc-border-right").value;
    rcBorders.top = document.getElementById("rc-border-top").value;
    rcBorders.bottom = document.getElementById("rc-border-bottom").value;

    // Validating input
    rcBorders.left == "" ? rcBorders.left = 0 : rcBorders.left = Math.round(parseInt(rcBorders.left));
    rcBorders.right == "" ? rcBorders.right = 0 : rcBorders.right = Math.round(parseInt(rcBorders.right));
    rcBorders.top == "" ? rcBorders.top = 0 : rcBorders.top = Math.round(parseInt(rcBorders.top));
    rcBorders.bottom == "" ? rcBorders.bottom = 0 : rcBorders.bottom = Math.round(parseInt(rcBorders.bottom));
}

function changePivot(event) {
    rcPivot = event.target.getAttribute("value");

    // Setting the selected class
    currentPivotObject.classList.remove("rc-selected-pivot");
    currentPivotObject = event.target;
    currentPivotObject.classList.add("rc-selected-pivot");
}

