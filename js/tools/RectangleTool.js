class RectangleTool extends ResizableTool {
    // Saving the empty rect svg
    emptyRectangleSVG = document.getElementById("rectangle-empty-button-svg");
    // and the full rect svg so that I can change them when the user changes rect modes
    fullRectangleSVG = document.getElementById("rectangle-full-button-svg");
    // Current fill mode
    currFillMode = 'empty';

    switchFunction = null;

    // startX, startY, endX, endY of mirrored rectangles
    horizontalMirrorCoordinates = [];
    verticalMirrorCoordinates = [];
    fourthQuadrantCoordinates = [];

    constructor(name, options, switchFunction) {
        super(name, options);

        this.switchFunction = switchFunction;
        Events.on('click', this.mainButton, this.changeFillType.bind(this));
        Events.on('click', this.biggerButton, this.increaseSize.bind(this));
        Events.on('click', this.smallerButton, this.decreaseSize.bind(this));

        this.resetTutorial();
        this.addTutorialTitle("Rectangle tool");
        this.addTutorialKey("U", " to select the rectangle");
        this.addTutorialKey("U while selected", " to change fill mode (empty or fill)");
        this.addTutorialKey("Left drag", " to draw a rectangle");
        this.addTutorialKey("Right drag", " to resize the brush");
        this.addTutorialKey("+ or -", " to resize the brush");
        this.addTutorialImg("rectangle-tutorial.gif");
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
        currFile.TMPLayer.canvas.style.zIndex = parseInt(currFile.currentLayer.canvas.style.zIndex, 10) + 1;

        this.startMousePos[0] = Math.floor(mousePos[0] / currFile.zoom) + 0.5;
        this.startMousePos[1] = Math.floor(mousePos[1] / currFile.zoom) + 0.5;

        this.drawRect(this.startMousePos[0], this.startMousePos[1],
            this.startMousePos[0], this.startMousePos[1]
        );

        new HistoryState().EditCanvas();
	}

	onDrag(mousePos, cursorTarget) {

        // Drawing the rect at the right position
	    this.drawRect(Math.floor(mousePos[0] / currFile.zoom) + 0.5, Math.floor(mousePos[1] / currFile.zoom) + 0.5);
	}

    /** Finishes drawing the rect, decides the end coordinates and moves the preview rectangle to the
     *  current layer
     * 
     * @param {*} mousePos The position of the mouse when the user stopped dragging
     */
	onEnd(mousePos) {
        super.onEnd(mousePos);
        let tmpContext = currFile.TMPLayer.context;

        let endRectX = Math.floor(mousePos[0] / currFile.zoom) + 0.5;
        let endRectY = Math.floor(mousePos[1] / currFile.zoom) + 0.5;
        let startRectX = this.startMousePos[0];
        let startRectY = this.startMousePos[1];

        const coordinates = this.adjustCoordinates(
            endRectX,
            startRectX,
            endRectY,
            startRectY
        );

        endRectX = coordinates.endRectX;
        startRectX = coordinates.startRectX;
        endRectY = coordinates.endRectY;
        startRectY = coordinates.startRectY;

        // Setting the correct linewidth and colour
        currFile.currentLayer.context.lineWidth = this.currSize;

        // Drawing the rect using 4 lines
        this.drawFinalRect(startRectX, startRectY, endRectX, endRectY);

        // If I have to fill it, I do so
        if (this.currFillMode == 'fill') {
            currFile.currentLayer.context.fillRect(startRectX, startRectY, endRectX - startRectX, endRectY - startRectY);
        }

        if (currFile.hSymmetricLayer.isEnabled) {
            if (typeof this.horizontalMirrorCoordinates != 'undefined') {

                let startMirrorRectX = this.horizontalMirrorCoordinates[0];
                let startMirrorRectY = this.horizontalMirrorCoordinates[1];
                let endMirrorRectX = this.horizontalMirrorCoordinates[2];
                let endMirrorRectY = this.horizontalMirrorCoordinates[3];

                this.handleMirrorRectDrawing(
                    endMirrorRectX,
                    startMirrorRectX,
                    endMirrorRectY,
                    startMirrorRectY
                );
            }
        }

        if (currFile.vSymmetricLayer.isEnabled) {
            if (typeof this.verticalMirrorCoordinates != 'undefined') {

                let startMirrorRectX = this.verticalMirrorCoordinates[0];
                let startMirrorRectY = this.verticalMirrorCoordinates[1];
                let endMirrorRectX = this.verticalMirrorCoordinates[2];
                let endMirrorRectY = this.verticalMirrorCoordinates[3];

                this.handleMirrorRectDrawing(
                    endMirrorRectX,
                    startMirrorRectX,
                    endMirrorRectY,
                    startMirrorRectY
                );
            }
        }

        if (currFile.hSymmetricLayer.isEnabled && currFile.vSymmetricLayer.isEnabled) {
            if (typeof this.fourthQuadrantCoordinates != 'undefined') {
                let startMirrorRectX = this.fourthQuadrantCoordinates[0];
                let startMirrorRectY = this.fourthQuadrantCoordinates[1];
                let endMirrorRectX = this.fourthQuadrantCoordinates[2];
                let endMirrorRectY = this.fourthQuadrantCoordinates[3];

                this.handleMirrorRectDrawing(
                    endMirrorRectX,
                    startMirrorRectX,
                    endMirrorRectY,
                    startMirrorRectY
                );
            }
        }

        this.clearCanvas(tmpContext);

	}

    /**
     * It draws the mirror rectangle with adjustments. It also fills rectangle if needed
     * @param endMirrorRectX
     * @param startMirrorRectX
     * @param endMirrorRectY
     * @param startMirrorRectY
     */
    handleMirrorRectDrawing(endMirrorRectX, startMirrorRectX, endMirrorRectY, startMirrorRectY) {
        const mirrorCoordinates = this.adjustCoordinates(
            endMirrorRectX,
            startMirrorRectX,
            endMirrorRectY,
            startMirrorRectY
        );

        endMirrorRectX = mirrorCoordinates.endRectX
        startMirrorRectX = mirrorCoordinates.startRectX;
        endMirrorRectY = mirrorCoordinates.endRectY
        startMirrorRectY = mirrorCoordinates.startRectY;

        // Setting the correct linewidth and colour
        currFile.currentLayer.context.lineWidth = this.currSize;

        this.drawFinalRect(startMirrorRectX, startMirrorRectY, endMirrorRectX, endMirrorRectY);

        // If I have to fill it, I do so
        if (this.currFillMode == 'fill') {
            currFile.currentLayer.context.fillRect(
                startMirrorRectX,
                startMirrorRectY,
                endMirrorRectX - startMirrorRectX,
                endMirrorRectY - startMirrorRectY
            );
        }
    }

    /** Updates the layer preview and clears the tmp canvas
     * @param {*} tmpContext tmp canvas context
     */
    clearCanvas(tmpContext) {
        // Clearing the tmp canvas
        tmpContext.clearRect(0, 0, currFile.TMPLayer.canvas.width, currFile.TMPLayer.canvas.height);
    }

    /**
     * Draws the final rectangle after preview (used in handleMirrorRectDrawing)
     * @param startRectX
     * @param startRectY
     * @param endRectX
     * @param endRectY
     */
    drawFinalRect(startRectX, startRectY, endRectX, endRectY) {
        currFile.currentLayer.drawLine(startRectX, startRectY, endRectX, startRectY, this.currSize);
        currFile.currentLayer.drawLine(endRectX, startRectY, endRectX, endRectY, this.currSize);
        currFile.currentLayer.drawLine(endRectX, endRectY, startRectX, endRectY, this.currSize);
        currFile.currentLayer.drawLine(startRectX, endRectY, startRectX, startRectY, this.currSize);
    }

    /**
     * Rect coordinates adjustments before draw final rectangle (used in handleMirrorRectDrawing)
     * @param endRectX
     * @param startRectX
     * @param endRectY
     * @param startRectY
     * @returns {{endRectY, endRectX, startRectY, startRectX}}
     */
    adjustCoordinates(endRectX, startRectX, endRectY, startRectY) {
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

        startRectX -= 0.5;
        startRectY -= 0.5;
        endRectX -= 0.5;
        endRectY -= 0.5;
        return {endRectX, startRectX, endRectY, startRectY};
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
        let tmpContext = currFile.TMPLayer.context;

        // Clearing the tmp canvas
        tmpContext.clearRect(0, 0, currFile.TMPLayer.canvas.width, currFile.TMPLayer.canvas.height);

        // Drawing the rect
        tmpContext.lineWidth = this.currSize;

        // Drawing the rect
        tmpContext.beginPath();
        if ((this.currSize % 2 ) == 0) {
            tmpContext.rect(this.startMousePos[0] - 0.5, this.startMousePos[1] - 0.5, x - this.startMousePos[0], y - this.startMousePos[1]);
        }
        else {
            tmpContext.rect(
                this.startMousePos[0],
                this.startMousePos[1],
                x - this.startMousePos[0],
                y - this.startMousePos[1]
            );
        }

        tmpContext.setLineDash([]);
        tmpContext.stroke();

        let midX = currFile.canvasSize[0] / 2;
        let midY = currFile.canvasSize[1] / 2;
        let startYMirror, endYMirror;
        let startXMirror, endXMirror;

        // Handling horizontal symmetry
        if (currFile.hSymmetricLayer.isEnabled) {
            // check if start mouse position y is under the y axis
            if (this.startMousePos[1] <= midY) {
                // console.log("[RECT] => Drawing over the y axis");
                startYMirror = midY + Math.abs(midY - this.startMousePos[1]);
                endYMirror =  midY + Math.abs(midY - y);
            } else {
                // console.log("[RECT] => Drawing under the y axis");
                startYMirror = midY - Math.abs(midY - this.startMousePos[1]);
                endYMirror =  midY - Math.abs(midY - y);
            }

            // Every time that a mirror is changed we must update mirrors array
            tmpContext.beginPath();
            if ((this.currSize % 2 ) == 0) {
                tmpContext.rect(this.startMousePos[0] - 0.5, startYMirror - 0.5, x - this.startMousePos[0], endYMirror - startYMirror);
            }
            else {
                tmpContext.rect(
                    this.startMousePos[0],
                    startYMirror,
                    x - this.startMousePos[0],
                    endYMirror - startYMirror
                );
            }
            tmpContext.setLineDash([]);
            tmpContext.stroke();

            this.horizontalMirrorCoordinates = [
                this.startMousePos[0], // start mirror rect x
                startYMirror, // start mirror rect y
                x, // end mirror rect x
                endYMirror// end mirror rect y
            ];
        }

        // Handling vertical symmetry
        if (currFile.vSymmetricLayer.isEnabled) {
            if (this.startMousePos[0] <= midX) {
                startXMirror = midX + Math.abs(midX - this.startMousePos[0]);
                endXMirror =  midX + Math.abs(midX - x);
            } else {
                startXMirror = midX - Math.abs(midX - this.startMousePos[0]);
                endXMirror =  midX - Math.abs(midX - x);
            }

            tmpContext.beginPath();
            if ((this.currSize % 2 ) == 0) {
                tmpContext.rect(startXMirror - 0.5,
                    this.startMousePos[1] - 0.5,
                    endXMirror - startXMirror,
                    y - this.startMousePos[1]
                );
            }
            else {
                tmpContext.rect(
                    startXMirror,
                    this.startMousePos[1],
                    endXMirror - startXMirror,
                    y - this.startMousePos[1]
                );
            }
            tmpContext.setLineDash([]);
            tmpContext.stroke();

            this.verticalMirrorCoordinates = [
                startXMirror, // start mirror rect x
                this.startMousePos[1], // start mirror rect y
                endXMirror, // end mirror rect x
                y// end mirror rect y
            ];
        }

        if (currFile.hSymmetricLayer.isEnabled && currFile.vSymmetricLayer.isEnabled) {
            tmpContext.beginPath();
            if ((this.currSize % 2 ) == 0) {
                tmpContext.rect(startXMirror - 0.5,
                    startYMirror - 0.5,
                    endXMirror - startXMirror,
                    endYMirror - startYMirror
                );
            } else {
                tmpContext.rect(
                    startXMirror,
                    startYMirror,
                    endXMirror - startXMirror,
                    endYMirror - startYMirror
                );
            }
            tmpContext.setLineDash([]);
            tmpContext.stroke();

            this.fourthQuadrantCoordinates = [
                startXMirror,
                startYMirror,
                endXMirror,
                endYMirror
            ];
        }

    }
}