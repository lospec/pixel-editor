class VSymmetryLayer extends Layer {
    // is hidden && enabled
    isEnabled = false;
    // Distance between one line and another in HTML pixels
    lineDistance = 10;

    constructor(width, height, canvas, menuEntry) {
        super(width, height, canvas, menuEntry);
        this.initialize();
        Events.onCustom("refreshVerticalAxis", this.fillAxis.bind(this));
    }

    initialize() {
        super.initialize();
        this.fillAxis();
    }

    // Enable or not
    disableAxis() {
        // get toggle h axis button
        let toggleButton = document.getElementById("toggle-v-symmetry-button");
        toggleButton.innerHTML = "Show Vertical Axis";
        this.isEnabled = false;
        this.canvas.style.display = "none";
    }

    enableAxis() {
        // get toggle h axis button
        let toggleButton = document.getElementById("toggle-v-symmetry-button");
        toggleButton.innerHTML = "Hide Vertical Axis";
        this.isEnabled = true;
        this.canvas.style.display = "inline-block";
        this.initPaint();
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
    toggleVAxis() {
        console.log("toggleVAxis");
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

        this.context.strokeStyle = Settings.getCurrSettings().vAxisGridColour;

        // Draw horizontal axis
        this.drawVAxis();

        if (!this.isEnabled) {
            this.canvas.style.display = 'none';
        }
    }

    drawVAxis() {
        // Get middle y
        let midX = Math.round(this.canvas.width / 2);
        this.context.beginPath();
        this.context.moveTo(midX, 0);
        this.context.lineTo(midX, this.canvas.height);
        this.context.stroke();
        this.context.closePath();
    }
}