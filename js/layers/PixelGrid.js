// OPTIMIZABLE: render the grid only for the current viewport
class PixelGrid extends Layer {
    // Start colour of the pixel grid (can be changed in the preferences)
    pixelGridColor = "#000000";
    // Distance between one line and another in HTML pixels
    lineDistance = 10;
    // The grid is not visible by default
    pixelGridVisible = false;
    // The grid is enabled, but is disabled in order to save performance with big sprites
    pixelGridEnabled = true;

    constructor(width, height, canvas, menuEntry) {
        super(width, height, canvas, menuEntry);
        this.initialize();
        Events.onCustom("refreshPixelGrid", this.fillPixelGrid.bind(this));
        Events.onCustom("switchedToAdvanced", this.togglePixelGrid.bind(this));
        Events.onCustom("switchedToBasic", this.togglePixelGrid.bind(this));
    }

    initialize() {
        super.initialize();
        this.fillPixelGrid();
    }

    disablePixelGrid() {
        this.pixelGridEnabled = false;
        this.canvas.style.display = "none";
    }

    enablePixelGrid() {
        if (!this.pixelGridVisible) 
            return;
        this.pixelGridEnabled = true;
        this.canvas.style.display = "inline-block";
    }

    hidePixelGrid() {
        let button = document.getElementById("toggle-pixelgrid-button");
        this.pixelGridVisible = false;
        button.innerHTML = "Show pixel grid";
        this.canvas.style.display = "none";
    }
    showPixelGrid() {
        let button = document.getElementById("toggle-pixelgrid-button");
        this.pixelGridVisible = true;
        button.innerHTML = "Hide pixel grid";
        this.canvas.style.display = "inline-block";
    }

    repaintPixelGrid(factor) {
        this.lineDistance += factor;
        this.fillPixelGrid();
    }

    /** Shows or hides the pixel grid depening on its current visibility
     *  (triggered by the show pixel grid button in the top menu)
     * 
     */
    togglePixelGrid(newState) {
        //Set the state based on the passed newState variable, otherwise just toggle it
        if (newState == 'on') 
            this.showPixelGrid();
        else if (newState == 'off') 
            this.hidePixelGrid();
        else 
            if (this.pixelGridVisible)
                this.hidePixelGrid();
            else
                this.showPixelGrid();
    }

    /** Fills the pixelGridCanvas with the pixelgrid
     * 
     */
    fillPixelGrid() {
        let originalSize = currFile.canvasSize;

        // The pixelGridCanvas is lineDistance times bigger so that the lines don't take 1 canvas pixel 
        // (which would cover the whole canvas with the pixelGridColour), but they take 1/lineDistance canvas pixels
        this.canvas.width = originalSize[0] * Math.round(this.lineDistance);
        this.canvas.height = originalSize[1] * Math.round(this.lineDistance);

        this.context.strokeStyle = Settings.getCurrSettings().pixelGridColour;

        console.log("Line ditance: " + this.lineDistance)

        // OPTIMIZABLE, could probably be a bit more elegant
        // Draw horizontal lines
        for (let i=0; i<this.canvas.width / Math.round(this.lineDistance); i++) {
            this.context.beginPath();
            this.context.moveTo(i * Math.round(this.lineDistance) + 0.5, 0);
            this.context.lineTo(i * Math.round(this.lineDistance) + 0.5, 
                originalSize[1] * Math.round(this.lineDistance));
            this.context.stroke();
            this.context.closePath();
        }

        // Draw vertical lines
        for (let i=0; i<this.canvas.height / Math.round(this.lineDistance); i++) {
            this.context.beginPath();
            this.context.moveTo(0, i * Math.round(this.lineDistance) + 0.5);
            this.context.lineTo(originalSize[0] * Math.round(this.lineDistance), 
                i * Math.round(this.lineDistance) + 0.5);
            this.context.stroke();
            this.context.closePath();    
        }

        if (!this.pixelGridVisible) {
            this.canvas.style.display = 'none';
        }
    }
}