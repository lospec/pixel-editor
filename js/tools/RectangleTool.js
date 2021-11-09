// TODO: FIX SELECTION

class RectangleTool extends ResizableTool {
    // Saving the empty rect svg
    emptyRectangleSVG = document.getElementById("rectangle-empty-button-svg");
    // and the full rect svg so that I can change them when the user changes rect modes
    fullRectangleSVG = document.getElementById("rectangle-full-button-svg");
    // Current fill mode
    currFillMode = 'empty';

    switchFunction = null;

    constructor(name, options, switchFunction) {
        super(name, options);

        this.switchFunction = switchFunction;
        Events.on('click', this.mainButton, this.changeFillType.bind(this));
        Events.on('click', this.biggerButton, this.increaseSize.bind(this));
        Events.on('click', this.smallerButton, this.decreaseSize.bind(this));
    }

    changeFillType() {
        if (this.isSelected)
            if (this.currFillMode == 'empty') {
                this.currFillMode = 'fill';
                this.emptyRectangleSVG.setAttribute('display', 'none');
                this.fullRectangleSVG.setAttribute('display', 'visible');
            }
            else {
                this.currFillMode = 'empty'
                this.emptyRectangleSVG.setAttribute('display', 'visible');
                this.fullRectangleSVG.setAttribute('display', 'none');
            }
        else 
            this.switchFunction(this);
    }

    onStart(mousePos) {
        super.onStart(mousePos);

        // Putting the tmp layer on top of everything
        TMPLayer.canvas.style.zIndex = parseInt(currentLayer.canvas.style.zIndex, 10) + 1;

        this.startMousePos[0] = Math.floor(mousePos[0] / zoom) + 0.5;
        this.startMousePos[1] = Math.floor(mousePos[1] / zoom) + 0.5;

        new HistoryState().EditCanvas();
	}

	onDrag(mousePos, cursorTarget) {

        // Drawing the rect at the right position
	    this.drawRect(Math.floor(mousePos[0] / zoom) + 0.5, Math.floor(mousePos[1] / zoom) + 0.5);
	}

    /** Finishes drawing the rect, decides the end coordinates and moves the preview rectangle to the
     *  current layer
     * 
     * @param {*} mousePos The position of the mouse when the user stopped dragging
     */
	onEnd(mousePos) {
        super.onEnd(mousePos);
        console.log("Rect end");

        let tmpContext = TMPLayer.context;

        let endRectX = Math.floor(mousePos[0] / zoom) + 0.5;
        let endRectY = Math.floor(mousePos[1] / zoom) + 0.5;
        let startRectX = this.startMousePos[0];
        let startRectY = this.startMousePos[1];

        // Inverting end and start (start must always be the top left corner)
        if (endRectX < startRectX) {
            let tmp = endRectX;
            endRectX = startRectX;
            startRectX = tmp;
        }
        // Same for the y
        if (endRectY < startRectY) {
            let tmp = endRectY;
            endRectY = startRectY;
            startRectY = tmp;
        }

        // Drawing the rect
        startRectY -= 0.5;
        endRectY -= 0.5;
        endRectX -= 0.5;
        startRectX -= 0.5;

        // Setting the correct linewidth and colour
        currentLayer.context.lineWidth = this.currSize;

        // Drawing the rect using 4 lines
        line(startRectX, startRectY, endRectX, startRectY, this.currSize);
        line(endRectX, startRectY, endRectX, endRectY, this.currSize);
        line(endRectX, endRectY, startRectX, endRectY, this.currSize);
        line(startRectX, endRectY, startRectX, startRectY, this.currSize);

        // If I have to fill it, I do so
        if (this.currFillMode == 'fill') {
            currentLayer.context.fillRect(startRectX, startRectY, endRectX - startRectX, endRectY - startRectY);
        }

        // Update the layer preview
        currentLayer.updateLayerPreview();
        // Clearing the tmp canvas
        tmpContext.clearRect(0, 0, TMPLayer.canvas.width, TMPLayer.canvas.height);
	}

    onSelect() {
        super.onSelect();
    }

    onDeselect() {
        super.onDeselect();
    }

    /** Draws a rectangle with end coordinates given by x and y on the tmp layer (draws
     *  the preview for the rectangle tool)
     * 
     * @param {*} x The current end x of the rectangle
     * @param {*} y The current end y of the rectangle
     */
    drawRect(x, y) {
        // Getting the tmp context
        let tmpContext = TMPLayer.context;

        // Clearing the tmp canvas
        tmpContext.clearRect(0, 0, TMPLayer.canvas.width, TMPLayer.canvas.height);

        // Drawing the rect
        tmpContext.lineWidth = this.currSize;

        // Drawing the rect
        tmpContext.beginPath();
        if ((this.currSize % 2 ) == 0) {
            tmpContext.rect(this.startMousePos[0] - 0.5, this.startMousePos[1] - 0.5, x - this.startMousePos[0], y - this.startMousePos[1]);
        }
        else {
            tmpContext.rect(this.startMousePos[0], this.startMousePos[1], x - this.startMousePos[0], y - this.startMousePos[1]);
        }

        tmpContext.setLineDash([]);
        tmpContext.stroke();
    }
}