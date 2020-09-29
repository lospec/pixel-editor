let pixelGridColor = "#0000FF";
let lineDistance = 12;
let pixelGridVisible = false;
pixelGridCanvas = document.getElementById("pixel-grid");

function togglePixelGrid(event) {
    let button = document.getElementById("toggle-pixelgrid-button");

    pixelGridVisible = !pixelGridVisible;

    if (pixelGridVisible) {
        button.innerHTML = "Hide pixel grid";
        pixelGridCanvas.style.display = "inline-block";
    }
    else {
        button.innerHTML = "Show pixel grid";
        pixelGridCanvas.style.display = "none";
    }
}

function fillPixelGrid() {
    let context = pixelGridCanvas.getContext("2d");
    let originalSize = layers[0].canvasSize;

    pixelGridCanvas.width = originalSize[0] * lineDistance;
    pixelGridCanvas.height = originalSize[1] * lineDistance;

    // OPTIMIZABLE, could probably be a bit more elegant
    // Draw horizontal lines
    for (let i=0; i<pixelGridCanvas.width / lineDistance; i++) {
        context.strokeStyle = settings.pixelGridColour;

        context.beginPath();
        context.moveTo(i * lineDistance + 0.5, 0);
        context.lineTo(i * lineDistance + 0.5, originalSize[1] * lineDistance);
        context.stroke();
        context.closePath();
    }

    // Draw vertical lines
    for (let i=0; i<pixelGridCanvas.height / lineDistance; i++) {
        context.beginPath();
        context.moveTo(0, i * lineDistance + 0.5);
        context.lineTo(originalSize[0] * lineDistance, i * lineDistance + 0.5);
        context.stroke();
        context.closePath();    
    }

    if (!pixelGridVisible) {
        pixelGridCanvas.style.display = 'none';
    }
}