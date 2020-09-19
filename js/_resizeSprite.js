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

}

function changedWidth(event) {
    let oldValue = data.width;
    let ratio;
    let percentageRatio;
    data.width = event.target.value;
    delta = data.width - oldValue;

    ratio = data.width / oldValue;

    if (keepRatio) {
        document.getElementById("rs-height").value = data.width / currentRatio;
        document.getElementById("rs-height-percentage").value = (data.width * 100) / startData.width;
    }

    document.getElementById("rs-width-percentage").value = (data.width * 100) / startData.width;
}

function changedHeight(event) {
    let oldValue = data.height;
    let ratio;

    data.height = event.target.value;
    delta = data.height - oldValue;

    ratio = data.height / oldValue;

    if (keepRatio) {
        document.getElementById("rs-width").value = data.height * currentRatio;
        document.getElementById("rs-width-percentage").value = (data.height * 100) / startData.height;
    }

    document.getElementById("rs-height-percentage").value = (data.height * 100) / startData.height;
}

function changedWidthPercentage(event) {
    let oldValue = data.widthPercentage;
    let ratio;

    data.widthPercentage = event.target.value;
    delta = data.widthPercentage - oldValue;

    ratio = data.widthPercentage / oldValue;

    if (keepRatio) {
        document.getElementById("rs-height-percentage").value = data.widthPercentage / currentRatio;
        document.getElementById("rs-height").value *= ratio;
    }

    document.getElementById("rs-width").value *= ratio;
}

function changedHeightPercentage(event) {
    let oldValue = data.heightPercentage;
    let ratio;

    data.heightPercentage = event.target.value;
    delta = data.heightPercentage - oldValue;

    ratio = data.heightPercentage / oldValue;

    if (keepRatio) {
        document.getElementById("rs-width-percentage").value = data.heightPercentage * currentRatio;
        document.getElementById("rs-width").value *= ratio;
    }

    document.getElementById("rs-height").value *= ratio;
}

function toggleRatio(event) {
    keepRatio = !keepRatio;
    console.log(keepRatio);
}