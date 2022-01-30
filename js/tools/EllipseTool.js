/** TODO
 *  - Increase the sensibility of the tool depending on the width / height ratio to avoid holes
 */
class EllipseTool extends ResizableTool {
    // Saving the empty rect svg
    emptyEllipseSVG = document.getElementById("ellipse-empty-button-svg");
    // and the full rect svg so that I can change them when the user changes rect modes
    fullEllipseSVG = document.getElementById("ellipse-full-button-svg");
    // Current fill mode
    currFillMode = 'empty';

    filledPixels = {};

    switchFunction = null;

    constructor(name, options, switchFunction) {
        super(name, options);

        this.switchFunction = switchFunction;
        Events.on('click', this.mainButton, this.changeFillType.bind(this));
        Events.on('click', this.biggerButton, this.increaseSize.bind(this));
        Events.on('click', this.smallerButton, this.decreaseSize.bind(this));

        this.resetTutorial();
        this.addTutorialTitle("Ellipse tool");
        this.addTutorialKey("S", " to select the ellipse");
        this.addTutorialKey("S while selected", " to change fill mode (empty or fill)");
        this.addTutorialKey("Left drag", " to draw an ellipse");
        this.addTutorialKey("Right drag", " to resize the brush");
        this.addTutorialKey("+ or -", " to resize the brush");
        this.addTutorialImg("ellipse-tutorial.gif");
    }

    changeFillType() {
        if (this.isSelected)
            if (this.currFillMode == 'empty') {
                this.currFillMode = 'fill';
                this.emptyEllipseSVG.setAttribute('display', 'none');
                this.fullEllipseSVG.setAttribute('display', 'visible');
            }
            else {
                this.currFillMode = 'empty'
                this.emptyEllipseSVG.setAttribute('display', 'visible');
                this.fullEllipseSVG.setAttribute('display', 'none');
            }
        else 
            this.switchFunction(this);
    }

    onStart(mousePos, mouseTarget) {
        super.onStart(mousePos);

        if (mouseTarget.className != "drawingCanvas")
            return;

        // Putting the tmp layer on top of everything
        currFile.TMPLayer.canvas.style.zIndex = parseInt(currFile.currentLayer.canvas.style.zIndex, 10) + 1;

        this.startMousePos[0] = Math.floor(mousePos[0] / currFile.zoom) + 0.5;
        this.startMousePos[1] = Math.floor(mousePos[1] / currFile.zoom) + 0.5;

        new HistoryState().EditCanvas();
	}

	onDrag(mousePos) {
        // Drawing the rect at the right position
	    this.drawEllipse(Math.floor(mousePos[0] / currFile.zoom) + 0.5, Math.floor(mousePos[1] / currFile.zoom) + 0.5, 
            currFile.TMPLayer.context);
	}

    /** Finishes drawing the rect, decides the end coordinates and moves the preview rectangle to the
     *  current layer
     * 
     * @param {*} mousePos The position of the mouse when the user stopped dragging
     */
	onEnd(mousePos) {
        super.onEnd(mousePos);
        
        if (this.startMousePos == undefined)
            return;

        let tmpContext = currFile.TMPLayer.context;

        this.endMousePos[0] = Math.floor(mousePos[0] / currFile.zoom) + 0.5;
        this.endMousePos[1] = Math.floor(mousePos[1] / currFile.zoom) + 0.5;

        // If I have to fill it, I do so
        if (this.currFillMode == 'fill') {
            // Use the fill tool on the tmp canvas
            FillTool.fill([this.startMousePos[0] * currFile.zoom, this.startMousePos[1] * currFile.zoom], 
                currFile.TMPLayer.context);
        }

        Util.pasteData(currFile.currentLayer.context.getImageData(0, 0, currFile.canvasSize[0], currFile.canvasSize[1]),
            currFile.TMPLayer.context.getImageData(0, 0, currFile.canvasSize[0], currFile.canvasSize[1]),
            currFile.currentLayer.context);
        
        // Update the layer preview
        currFile.currentLayer.updateLayerPreview();
        // Clearing the tmp canvas
        tmpContext.clearRect(0, 0, currFile.TMPLayer.canvas.width, currFile.TMPLayer.canvas.height);

        this.startMousePos = undefined;
	}

    onSelect() {
        super.onSelect();
    }

    onDeselect() {
        super.onDeselect();
    }

    /** Draws an ellipse with end coordinates given by x and y on the tmp layer (draws
     *  the preview for the ellipse tool)
     * 
     * @param {*} x The current end x of the ellipse
     * @param {*} y The current end y of the ellipse
     */
    drawEllipse(x, y, context) {
        // Width and height of the ellipse
        let width = undefined;
        let height = undefined;
        
        // Clearing the tmp canvas
        currFile.TMPLayer.context.clearRect(0, 0, currFile.TMPLayer.canvas.width, currFile.TMPLayer.canvas.height);

        // Compute width and height
        width = Math.abs(x - this.startMousePos[0]);
        height = Math.abs(y - this.startMousePos[1]);

        // Drawing the ellipse
        this.previewEllipse(context, this.startMousePos[0], this.startMousePos[1], width, height);
    }

    previewEllipse(context, xc, yc, a, b) {
        let x, y1, y2;
        let toFill = {};
        let removed = {};

        x = xc - a;

        while (x < (xc + a)) {
            
            let root = Math.sqrt((1 - (((x - xc)*(x - xc)) / (a*a))) * b*b);
            let flooredX = Math.floor(x);
            let flooredY1, flooredY2;

            y1 = root + yc;
            y2 = -root + yc;

            flooredY1 = Math.floor(y1);
            flooredY2 = Math.floor(y2);

            toFill[[flooredX, flooredY1]] = true;
            toFill[[flooredX, flooredY2]] = true;

            x += 0.005;
        }

        for (const coord in toFill) {
            let arrayCoord = JSON.parse("[" + coord + "]");

            if (arrayCoord[0]-xc < 0 || arrayCoord[1]-yc < 0) {
                continue;
            }

            if (!(
            // Top and left
            (toFill[[arrayCoord[0], arrayCoord[1] - 1]] && toFill[[arrayCoord[0] - 1, arrayCoord[1]]] &&
            !removed[[arrayCoord[0], arrayCoord[1] - 1]] && !removed[arrayCoord[0] - 1, arrayCoord[1]]) ||
            // Top and right
            (toFill[[arrayCoord[0], arrayCoord[1] - 1]] && toFill[[arrayCoord[0] + 1, arrayCoord[1]]] &&
            !removed[[arrayCoord[0], arrayCoord[1] - 1]] && !removed[arrayCoord[0] + 1, arrayCoord[1]]) ||
            // Bottom and left
            (toFill[[arrayCoord[0], arrayCoord[1] + 1]] && toFill[[arrayCoord[0] - 1, arrayCoord[1]]] &&
            !removed[[arrayCoord[0], arrayCoord[1] + 1]] && !removed[arrayCoord[0] - 1, arrayCoord[1]]) ||
            // Bottom and right
            (toFill[[arrayCoord[0], arrayCoord[1] + 1]] && toFill[[arrayCoord[0] + 1, arrayCoord[1]]] &&
                !removed[[arrayCoord[0], arrayCoord[1] + 1]] && !removed[arrayCoord[0] + 1, arrayCoord[1]])) ||
            removed[arrayCoord]) {
                context.fillRect(arrayCoord[0], arrayCoord[1], this.currSize, this.currSize);
                context.fillRect(xc - Math.abs(xc - arrayCoord[0]), arrayCoord[1], this.currSize, this.currSize);
                context.fillRect(arrayCoord[0], yc - Math.abs(yc - arrayCoord[1]), this.currSize, this.currSize);
                context.fillRect(xc - Math.abs(xc - arrayCoord[0]), yc - Math.abs(yc - arrayCoord[1]), this.currSize, this.currSize);
            }

            removed[arrayCoord] = true;
        }
    }
}