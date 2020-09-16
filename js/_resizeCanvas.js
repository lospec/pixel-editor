let resizeCanvasContainer = document.getElementById("resize-canvas");
let pivot = "middle";
let currentPivotObject;
let resizeCanvasInitialized = false;
let borders = {left: 0, right: 0, top: 0, bottom: 0};

function openResizeCanvasWindow() {
    if (!resizeCanvasInitialized) {
        resizeCanvasInitialized = true;
        initResizeCanvasInputs();
    }
    showDialogue('resize-canvas');
}

function initResizeCanvasInputs() {
    let buttons = document.getElementsByClassName("pivot-button");

    for (let i=0; i<buttons.length; i++) {
        buttons[i].addEventListener("click", changePivot);
        if (buttons[i].getAttribute("value").includes("middle")) {
            currentPivotObject = buttons[i];
        }
    }

    document.getElementById("rc-width").value = layers[0].canvasSize[0];
    document.getElementById("rc-height").value = layers[0].canvasSize[1];

    document.getElementById("rc-border-left").addEventListener("change", changedBorder);
    document.getElementById("rc-border-right").addEventListener("change", changedBorder);
    document.getElementById("rc-border-top").addEventListener("change", changedBorder);
    document.getElementById("rc-border-bottom").addEventListener("change", changedBorder);

    document.getElementById("rc-width").addEventListener("change", changedSize);
    document.getElementById("rc-height").addEventListener("change", changedSize);

    document.getElementById("resize-canvas-confirm").addEventListener("click", resizeCanvas);
    console.log("Pivot selezionato: " + currentPivotObject);
}

function changedBorder(event) {
    rcUpdateBorders();
    
    document.getElementById("rc-width").value = parseInt(layers[0].canvasSize[0]) + borders.left + borders.right;
    document.getElementById("rc-height").value = parseInt(layers[0].canvasSize[1]) + borders.top + borders.bottom;
}

function changedSize(event) {
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

    borders.left = left;
    borders.right = right;
    borders.top = top;
    borders.bottom = bottom;
}

function resizeCanvas(event, size) {
    let imageDatas = [];
    let leftOffset = 0;
    let topOffset = 0;
    let copiedDataIndex = 0;

    // If I'm undoing, I manually put the values in the window
    if (size !== undefined) {
        document.getElementById("rc-width").value = size.x;
        document.getElementById("rc-height").value = size.y;

        changedSize();
    }
    
    rcUpdateBorders();

    // Save all imageDatas
    for (let i=0; i<layers.length; i++) {
        if (layers[i].menuEntry != null) {
            imageDatas.push(layers[i].context.getImageData(0, 0, layers[i].canvasSize[0], layers[i].canvasSize[1]));
        }
    }

    // Saving the history only if I'm not already undoing or redoing
    if (size == undefined) {
        // Saving history
        new HistoryStateResizeCanvas(
            {x: parseInt(layers[0].canvasSize[0]) + borders.left + borders.right, 
            y: parseInt(layers[0].canvasSize[1]) + borders.top + borders.bottom},

            {x: layers[0].canvasSize[0],
            y: layers[0].canvasSize[1]},
            imageDatas
        );
    }

    // Resize the canvases
    for (let i=0; i<layers.length; i++) {
        layers[i].canvasSize[0] = parseInt(layers[i].canvasSize[0]) + borders.left + borders.right;
        layers[i].canvasSize[1] = parseInt(layers[i].canvasSize[1]) + borders.top + borders.bottom;

        layers[i].canvas.width = layers[i].canvasSize[0];
        layers[i].canvas.height = layers[i].canvasSize[1];

        layers[i].resize();
        layers[i].context.fillStyle = currentGlobalColor;
    }

    // Regenerate the checkerboard
    fillCheckerboard();

    // Put the imageDatas in the right position
    switch (pivot)
    {
        case 'topleft':
            leftOffset = 0;
            topOffset = 0;
            break;
        case 'top':
            leftOffset = (borders.left + borders.right) / 2;
            topOffset = 0;
            break;
        case 'topright':
            leftOffset = borders.left + borders.right;
            topOffset = 0;
            break;
        case 'left':
            leftOffset = 0;
            topOffset = (borders.top + borders.bottom) / 2;
            break;
        case 'middle':
            leftOffset = (borders.left + borders.right) / 2;
            topOffset = (borders.top + borders.bottom) / 2;
            break;
        case 'right':
            leftOffset = borders.left + borders.right;
            topOffset = (borders.top + borders.bottom) / 2;
            break;
        case 'bottomleft':
            leftOffset = 0;
            topOffset = borders.top + borders.bottom;
            break;
        case 'bottom':
            leftOffset = (borders.left + borders.right) / 2;
            topOffset = borders.top + borders.bottom;
            break;
        case 'bottomright':
            leftOffset = borders.left + borders.right;
            topOffset = borders.top + borders.bottom;
            break;
        default:
            console.log('Pivot does not exist, please report an issue at https://github.com/lospec/pixel-editor');
            break;
    }

    for (let i=0; i<layers.length; i++) {
        if (layers[i].menuEntry != null) {
            layers[i].context.putImageData(imageDatas[copiedDataIndex], leftOffset, topOffset);
            layers[i].updateLayerPreview();
            copiedDataIndex++;
        }
    }

    closeDialogue();
}

function rcUpdateBorders() {
    // Getting input
    borders.left = document.getElementById("rc-border-left").value;
    borders.right = document.getElementById("rc-border-right").value;
    borders.top = document.getElementById("rc-border-top").value;
    borders.bottom = document.getElementById("rc-border-bottom").value;

    // Validating input
    borders.left == "" ? borders.left = 0 : borders.left = Math.round(parseInt(borders.left));
    borders.right == "" ? borders.right = 0 : borders.right = Math.round(parseInt(borders.right));
    borders.top == "" ? borders.top = 0 : borders.top = Math.round(parseInt(borders.top));
    borders.bottom == "" ? borders.bottom = 0 : borders.bottom = Math.round(parseInt(borders.bottom));
}

function changePivot(event) {
    pivot = event.target.getAttribute("value");

    // Setting the selected class
    currentPivotObject.classList.remove("rc-selected-pivot");
    currentPivotObject = event.target;
    currentPivotObject.classList.add("rc-selected-pivot");
}
