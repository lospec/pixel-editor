let resizeCanvasContainer = document.getElementById("resize-canvas");
let pivot = "middle";
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
    }

    document.getElementById("resize-canvas-confirm").addEventListener("click", resizeCanvas);
}

function resizeCanvas(event) {
    resizeCanvasUpdateBorders();
}

function resizeCanvasUpdateBorders() {
    console.log(document.getElementById("rc-border-left").value);

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

    console.log(borders);
}

function changePivot(event) {
    pivot = event.target.getAttribute("value");
}

// Use a dialogue
    // Apply the new sizing
    // Move the images on the layers to fit what the user actually decided

// Function to actually resize the canvases
    // Save all imageDatas
    // Resize the canvases
    // Clear the canvases

// Function to place the imageDatas as specified in the pivot section
    // Put the imageDatas in the right position
    // Must crop the imageDatas if the canvas has being reduced