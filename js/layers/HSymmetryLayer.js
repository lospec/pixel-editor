class HSymmetryLayer extends Layer {
    // is hidden && enabled
    isEnabled = false;
    // Distance between one line and another in HTML pixels
    lineDistance = 10;

    constructor(width, height, canvas, menuEntry) {
        super(width, height, canvas, menuEntry);
        this.initialize();
        Events.onCustom("refreshHorizontalAxis", this.fillAxis.bind(this));
    }

    initialize() {
        super.initialize();
        this.fillAxis();
    }

    // Enable or not
    disableAxis() {
        // get toggle h axis button
        let toggleButton = document.getElementById("toggle-h-symmetry-button");
        toggleButton.innerHTML = "Show Horizontal Symmetry";
        this.isEnabled = false;
        this.canvas.style.display = "none";
    }

    enableAxis() {
        // get toggle h axis button
        let toggleButton = document.getElementById("toggle-h-symmetry-button");
        toggleButton.innerHTML = "Hide Horizontal Symmetry";

        this.isEnabled = true;
        this.canvas.style.display = "inline-block";
    }

    initPaint() {
        this.lineDistance = 5;
        this.fillAxis();
    }

    repaint(factor) {
        this.lineDistance += factor;
        this.fillAxis();
    }

    normalPaint() {
        this.lineDistance = 10;
        this.fillAxis();
    }

    /**
     * Shows or hides axis depending on its current visibility
     * (triggered by the show h symmetry button in the top menu)
     */
    toggleHAxis() {
        console.log("toggleHAxis");
        if (this.isEnabled) {
            this.disableAxis();
        } else {
            this.enableAxis();
        }
    }

    /**
     * It fills the canvas
     */
    fillAxis() {
        let originalSize = currFile.canvasSize;
        this.canvas.width = originalSize[0] * Math.round(this.lineDistance);
        this.canvas.height = originalSize[1] * Math.round(this.lineDistance);

        this.context.strokeStyle = Settings.getCurrSettings().hAxisGridColour;

        // Draw horizontal axis
        this.drawHAxis();

        if (!this.isEnabled) {
            this.canvas.style.display = 'none';
        }
    }

    drawHAxis() {
        // Get middle y
        let midY = Math.round(this.canvas.height / 2);
        this.context.beginPath();
        this.context.moveTo(0, midY);
        this.context.lineTo(this.canvas.width, midY);
        this.context.stroke();
        this.context.closePath();
    }
}