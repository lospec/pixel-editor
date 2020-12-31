/* This scripts contains all the code used to handle the sprite scaling */
// Should I keep the sprite ratio?
let keepRatio = true;
// Used to store the current ratio
let currentRatio;
// The currenty selected resizing algorithm (nearest-neighbor or bilinear-interpolation)
let currentAlgo = 'nearest-neighbor';
// Current resize data
let data = {width: 0, height: 0, widthPercentage: 100, heightPercentage: 100};
// Start resize data
let startData = {width: 0, height:0, widthPercentage: 100, heightPercentage: 100};

/** Opens the sprite resizing window
 * 
 */
function openResizeSpriteWindow() {
    // Inits the sprie resize inputs
    initResizeSpriteInputs();

    // Computing the current ratio
    currentRatio = layers[0].canvasSize[0] / layers[0].canvasSize[1];

    // Initializing the input fields
    data.width = layers[0].canvasSize[0];
    data.height = layers[1].canvasSize[1];

    startData.width = parseInt(data.width);
    startData.height = parseInt(data.height);
    startData.heightPercentage = 100;
    startData.widthPercentage = 100;

    // Opening the pop up now that it's ready
    showDialogue('resize-sprite');
}

/** Initalizes the input values and binds the elements to their events
 * 
 */
function initResizeSpriteInputs() {
    document.getElementById("rs-width").value = layers[0].canvasSize[0];
    document.getElementById("rs-height").value = layers[0].canvasSize[1];

    document.getElementById("rs-width-percentage").value = 100;
    document.getElementById("rs-height-percentage").value = 100;

    document.getElementById("rs-keep-ratio").checked = true;

    document.getElementById("rs-width").addEventListener("change", changedWidth);
    document.getElementById("rs-height").addEventListener("change", changedHeight);
    document.getElementById("rs-width-percentage").addEventListener("change", changedWidthPercentage);
    document.getElementById("rs-height-percentage").addEventListener("change", changedHeightPercentage);

    document.getElementById("resize-sprite-confirm").addEventListener("click", resizeSprite);
    document.getElementById("rs-keep-ratio").addEventListener("click", toggleRatio);
    document.getElementById("resize-algorithm-combobox").addEventListener("change", changedAlgorithm);
}

/** Resizes (scales) the sprite
 * 
 * @param {*} event 
 * @param {*} ratio Keeps infos about the x ratio and y ratio
 */
function resizeSprite(event, ratio) {
    // Old data
    let oldWidth, oldHeight;
    // New data
    let newWidth, newHeight;
    // Current imageDatas
    let rsImageDatas = [];
    // Index that will be used a few lines below
    let layerIndex = 0;
    // Copy of the imageDatas that will be stored in the history
    let imageDatasCopy = [];

    oldWidth = layers[0].canvasSize[0];
    oldHeight = layers[1].canvasSize[1];
    rcPivot = "middle";

    // Updating values if the user didn't press enter
    switch (document.activeElement.id) {
        case "rs-width-percentage":
            changedWidthPercentage();
            break;
        case "rs-width":
            changedWidth();
            break;
        case "rs-height-percentage":
            changedHeightPercentage();
            break;
        case "rs-height":
            changedHeight();
            break;
        default:
            // In this case everything has been updated correctly
            break;
    }

    // Computing newWidth and newHeight
    if (ratio == null) {
        newWidth = data.width;
        newHeight = data.height;
    }
    else {
        newWidth = layers[0].canvasSize[0] * ratio[0];
        newHeight = layers[1].canvasSize[1] * ratio[1];
    }
    
    // Get all the image datas
    for (let i=0; i<layers.length; i++) {
        if (layers[i].menuEntry != null) {
            rsImageDatas.push(layers[i].context.getImageData(
                0, 0, layers[0].canvasSize[0], layers[0].canvasSize[1])
            );
        }
    }

    // ratio is null when the user is undoing
    if (ratio == null) {
        // Copying the image data
        imageDatasCopy = rsImageDatas.slice();
        // Saving the history
        new HistoryStateResizeSprite(newWidth / oldWidth, newHeight / oldHeight, currentAlgo, imageDatasCopy);
    }

    // Resizing the canvas
    resizeCanvas(null, {x: newWidth, y: newHeight});

    // Put the image datas on the new canvases
    for (let i=0; i<layers.length; i++) {
        if (layers[i].menuEntry != null) {
            layers[i].context.putImageData(
                resizeImageData(rsImageDatas[layerIndex], newWidth, newHeight, currentAlgo), 0, 0
            );
            layers[i].updateLayerPreview();
            layerIndex++;
        }
    }

    // Updating start values when I finish scaling the sprite
    // OPTIMIZABLE? Can't I just assign data to startData? Is js smart enough to understand?
    if (ratio == null) {
        startData.width = data.width;
        startData.height = data.height;
    }
    else {
        startData.width = layers[0].canvasSize[0];
        startData.height = layers[0].canvasSize[1];
    }

    startData.widthPercentage = 100;
    startData.heightPercentage = 100;

    closeDialogue();
}

/* Trust me, the math for the functions below works. If you want to optimize them feel free to have a look, though */

/** Fired when the input field for width is changed. Updates th othe input fields consequently
 * 
 * @param {*} event 
 */
function changedWidth(event) {
    let oldValue = data.width;
    let ratio;
    let percentageRatio;
    let newHeight, newHeightPerc, newWidthPerc;

    data.width = event.target.value;
    delta = data.width - oldValue;

    ratio = data.width / oldValue;

    newHeight = data.width / currentRatio;
    newHeightPerc = (newHeight * 100) / startData.height;
    newWidthPerc = (data.width * 100) / startData.width;

    if (keepRatio) {
        document.getElementById("rs-height").value = newHeight;
        data.height = newHeight;

        document.getElementById("rs-height-percentage").value = newHeightPerc;
        data.heightPercentage = newHeightPerc;
    }

    document.getElementById("rs-width-percentage").value = newWidthPerc;
}

/**Fired when the input field for width is changed. Updates the other input fields consequently
 * 
 * @param {*} event 
 */
function changedHeight(event) {
    let oldValue = 100;
    let ratio;
    let newWidth, newWidthPerc, newHeightPerc;

    data.height = event.target.value;
    delta = data.height - oldValue;

    ratio = data.height / oldValue;

    newWidth = data.height * currentRatio;
    newWidthPerc = (newWidth * 100) / startData.width;
    newHeightPerc = (data.height * 100) / startData.height;

    if (keepRatio) {
        document.getElementById("rs-width").value = newWidth;
        data.width = newWidth;

        document.getElementById("rs-width-percentage").value = newWidthPerc;
        data.widthPercentage = newWidthPerc;
    }

    document.getElementById("rs-height-percentage").value = newHeightPerc;
    data.heightPercentage = newHeightPerc;
}

/**Fired when the input field for width percentage is changed. Updates the other input fields consequently
 * 
 * @param {*} event 
 */
function changedWidthPercentage(event) {
    let oldValue = 100;
    let ratio;
    let newWidth, newHeight, newHeightPerc;

    data.widthPercentage = event.target.value;
    delta = data.widthPercentage - oldValue;

    ratio = data.widthPercentage / oldValue;

    console.log("old value: " + oldValue + ", ratio: " + ratio);

    newHeight = startData.height * ratio;
    newHeightPerc = data.widthPercentage / currentRatio;
    newWidth = startData.width * ratio;

    if (keepRatio) {
        document.getElementById("rs-height-percentage").value = newHeightPerc;
        data.heightPercentage = newHeightPerc;
        
        document.getElementById("rs-height").value = newHeight
        data.height = newHeight;
    }

    document.getElementById("rs-width").value = newWidth;
    data.width = newWidth;
}

/**Fired when the input field for height percentage is changed. Updates the other input fields consequently
 * 
 * @param {*} event 
 */
function changedHeightPercentage(event) {
    let oldValue = data.heightPercentage;
    let ratio;
    let newHeight, newWidth, newWidthPerc;

    data.heightPercentage = event.target.value;
    delta = data.heightPercentage - oldValue;

    ratio = data.heightPercentage / oldValue;

    newWidth = startData.width * ratio;
    newWidthPerc = data.heightPercentage * currentRatio;
    newHeight = startData.height * ratio;

    if (keepRatio) {
        document.getElementById("rs-width-percentage").value = data.heightPercentage * currentRatio;
        data.widthPercentage = newWidthPerc;

        document.getElementById("rs-width").value = newWidth;
        data.width = newWidth;
    }

    document.getElementById("rs-height").value = newHeight;
    data.height = newHeight;
}

/** Toggles the keepRatio value (fired by the checkbox in the pop up window)
 * 
 * @param {*} event 
 */
function toggleRatio(event) {
    keepRatio = !keepRatio;
}

/** Changes the scaling algorithm (fired by the combobox in the pop up window)
 * 
 * @param {*} event 
 */
function changedAlgorithm(event) {
    currentAlgo = event.target.value;
}