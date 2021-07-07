// Start colour of the pixel grid (can be changed in the preferences)
let pixelGridColor = "#000000";
// Distance between one line and another in HTML pixels
let lineDistance = 12;
// The grid is visible by default
let pixelGridVisible = true;
// Saving the canvas containing the pixel grid
pixelGridCanvas = document.getElementById("pixel-grid");

/** Shows or hides the pixel grid depening on its current visibility
 *  (triggered by the show pixel grid button in the top menu)
 * 
 */
function togglePixelGrid(newState) {
	console.log('toggling pixel grid', newState)
    // Getting the button because I have to change its text
    let button = document.getElementById("toggle-pixelgrid-button");

    //Set the state based on the passed newState variable, otherwise just toggle it
	if (newState == 'on') pixelGridVisible = true;
	else if (newState == 'off') pixelGridVisible = false;
	else pixelGridVisible = !pixelGridVisible;

    // If it was visible, I hide it
    if (pixelGridVisible) {
        button.innerHTML = "Hide pixel grid";
        pixelGridCanvas.style.display = "inline-block";
    }
    // Otherwise, I show it
    else {
        button.innerHTML = "Show pixel grid";
        pixelGridCanvas.style.display = "none";
    }
}

/** Fills the pixelGridCanvas with the pixelgrid
 * 
 */
function fillPixelGrid() {
    let context = pixelGridCanvas.getContext("2d");
    let originalSize = layers[0].canvasSize;

    // The pixelGridCanvas is lineDistance times bigger so that the lines don't take 1 canvas pixel 
    // (which would cover the whole canvas with the pixelGridColour), but they take 1/lineDistance canvas pixels
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