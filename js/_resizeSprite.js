let resizeSpriteInitialized = false;
let keepRatio = true;
let currentRatio;
let data = {width: 0, height: 0, widthPercentage: 100, heightPercentage: 100};
let startData = {width: 0, height:0, widthPercentage: 100, heightPercentage: 100};

function openResizeSpriteWindow() {
    if (!resizeSpriteInitialized) {
        resizeSpriteInitialized = true;
        initResizeSpriteInputs();
    }

    currentRatio = layers[0].canvasSize[0] / layers[0].canvasSize[1];

    data.width = layers[0].canvasSize[0];
    data.height = layers[1].canvasSize[1];

    startData.width = data.width;
    startData.height = data.height;

    showDialogue('resize-sprite');
}

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
}

function resizeSprite() {
    let newWidth, newHeight;
    let imageDatas = [];
    let layerIndex = 0;

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

    newWidth = data.width;
    newHeight = data.height;

    console.log(newWidth + ", " + newHeight);

    // Get all the image datas
    for (let i=0; i<layers.length; i++) {
        if (layers[i].menuEntry != null) {
            imageDatas.push(layers[i].context.getImageData(
                0, 0, layers[0].canvasSize[0], layers[0].canvasSize[1])
            );
        }
    }

    // Resizing the canvas
    resizeCanvas(null, {x: newWidth, y: newHeight});

    // Put the image datas on the new canvases
    for (let i=0; i<layers.length; i++) {
        if (layers[i].menuEntry != null) {
            layers[i].context.putImageData(
                resizeImageData(imageDatas[layerIndex], newWidth, newHeight, 'nearest-neighbor'), 0, 0
            );
            layerIndex++;
        }
    }
    closeDialogue();
}

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

function changedHeight(event) {
    let oldValue = data.height;
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

function changedWidthPercentage(event) {
    let oldValue = data.widthPercentage;
    let ratio;
    let newWidth, newHeight, newHeightPerc;

    data.widthPercentage = event.target.value;
    delta = data.widthPercentage - oldValue;

    ratio = data.widthPercentage / oldValue;

    newHeight = document.getElementById("rs-height").value * ratio;
    newHeightPerc = data.widthPercentage / currentRatio;
    newWidth = document.getElementById("rs-width").value * ratio;

    if (keepRatio) {
        document.getElementById("rs-height-percentage").value = newHeightPerc;
        data.heightPercentage = newHeightPerc;
        
        document.getElementById("rs-height").value = newHeight
        data.height = newHeight;
    }

    document.getElementById("rs-width").value = newWidth;
    data.width = newWidth;
}

function changedHeightPercentage(event) {
    let oldValue = data.heightPercentage;
    let ratio;
    let newHeight, newWidth, newWidthPerc;

    data.heightPercentage = event.target.value;
    delta = data.heightPercentage - oldValue;

    ratio = data.heightPercentage / oldValue;

    newWidth = document.getElementById("rs-width").value * ratio;
    newWidthPerc = data.heightPercentage * currentRatio;
    newHeight = document.getElementById("rs-height").value * ratio;

    if (keepRatio) {
        document.getElementById("rs-width-percentage").value = data.heightPercentage * currentRatio;
        data.widthPercentage = newWidthPerc;

        document.getElementById("rs-width").value = newWidth;
        data.width = newWidth;
    }

    document.getElementById("rs-height").value = newHeight;
    data.height = newHeight;
}

function toggleRatio(event) {
    keepRatio = !keepRatio;
    console.log(keepRatio);
}