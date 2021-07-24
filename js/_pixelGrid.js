// REFACTOR: inherit from Layer, override init method (call super as well)

// Start colour of the pixel grid (can be changed in the preferences)
let pixelGridColor = "#000000";
// Distance between one line and another in HTML pixels
let lineDistance = 12;
// The grid is not visible by default
let pixelGridVisible = false;
// The grid is enabled, but is disabled in order to save performance with big sprites
let pixelGridEnabled = true;
// Used to edit lineDistance depending on the zoom level
let zoomFactor = 1;

function disablePixelGrid() {
    pixelGridEnabled = false;
    pixelGrid.canvas.style.display = "none";
}

function enablePixelGrid() {
    pixelGridEnabled = true;
    pixelGrid.canvas.style.display = "inline-block";
}

function repaintPixelGrid(factor) {
    lineDistance += factor;
    console.log("Line distance: " + lineDistance + " zoom: " + zoom);
    fillPixelGrid();
}

/** Shows or hides the pixel grid depening on its current visibility
 *  (triggered by the show pixel grid button in the top menu)
 * 
 */
function togglePixelGrid(newState) {
    // Ignore the event if the grid is disabled
    if (!pixelGridEnabled) return;

    // Getting the button because I have to change its text
    let button = document.getElementById("toggle-pixelgrid-button");

    //Set the state based on the passed newState variable, otherwise just toggle it
	if (newState == 'on') pixelGridVisible = true;
	else if (newState == 'off') pixelGridVisible = false;
	else pixelGridVisible = !pixelGridVisible;

    // If it was visible, I hide it
    if (pixelGridVisible) {
        button.innerHTML = "Hide pixel grid";
        pixelGrid.canvas.style.display = "inline-block";
    }
    // Otherwise, I show it
    else {
        button.innerHTML = "Show pixel grid";
        pixelGrid.canvas.style.display = "none";
    }
}

/** Fills the pixelGridCanvas with the pixelgrid
 * 
 */
function fillPixelGrid() {
    let context = pixelGrid.context;
    let originalSize = layers[0].canvasSize;

    // The pixelGridCanvas is lineDistance times bigger so that the lines don't take 1 canvas pixel 
    // (which would cover the whole canvas with the pixelGridColour), but they take 1/lineDistance canvas pixels
    pixelGrid.canvas.width = originalSize[0] * Math.round(lineDistance);
    pixelGrid.canvas.height = originalSize[1] * Math.round(lineDistance);

    // OPTIMIZABLE, could probably be a bit more elegant
    // Draw horizontal lines
    for (let i=0; i<pixelGrid.canvas.width / Math.round(lineDistance); i++) {
        context.strokeStyle = settings.pixelGridColour;

        context.beginPath();
        context.moveTo(i * Math.round(lineDistance) + 0.5, 0);
        context.lineTo(i * Math.round(lineDistance) + 0.5, originalSize[1] * Math.round(lineDistance));
        context.stroke();
        context.closePath();
    }

    // Draw vertical lines
    for (let i=0; i<pixelGrid.canvas.height / Math.round(lineDistance); i++) {
        context.beginPath();
        context.moveTo(0, i * Math.round(lineDistance) + 0.5);
        context.lineTo(originalSize[0] * Math.round(lineDistance), i * Math.round(lineDistance) + 0.5);
        context.stroke();
        context.closePath();    
    }

    if (!pixelGridVisible) {
        pixelGrid.canvas.style.display = 'none';
    }
}