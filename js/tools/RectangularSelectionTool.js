class RectangularSelectionTool extends SelectionTool {
    currSelection = {};

    constructor (name, options, switchFunc, moveTool) {
        super(name, options, switchFunc, moveTool);
        Events.on('click', this.mainButton, switchFunc, this);
    }

    onStart(mousePos) {
        super.onStart(mousePos);

        // Putting the vfx layer on top of everything
        currFile.VFXLayer.canvas.style.zIndex = MAX_Z_INDEX;

        // Saving the start coords of the rect
        this.startMousePos = [Math.floor(mousePos[0] / currFile.zoom),
                              Math.floor(mousePos[1] / currFile.zoom)];
        this.endMousePos = [this.startMousePos[0], this.startMousePos[1]];

        // Avoiding external selections
        if (this.startMousePos[0] < 0) {
            this.startMousePos[0] = 0;
        }
        else if (this.startMousePos[0] > currFile.currentLayer.canvas.width) {
            this.startMousePos[0] = currFile.currentLayer.canvas.width;
        }

        if (this.startMousePos[1] < 0) {
            this.startMousePos[1] = 0;
        }
        else if (this.startMousePos[1] > currFile.currentLayer.canvas.height) {
            this.startMousePos[1] = currFile.currentLayer.canvas.height;
        }

        // Drawing the rect
        this.drawSelection(this.startMousePos[0], this.startMousePos[1]);
    }

    onDrag(mousePos) {
        super.onDrag(mousePos);

        // Drawing the rect
        this.endMousePos = [Math.floor(mousePos[0] / currFile.zoom), Math.floor(mousePos[1] / currFile.zoom)];
        this.drawSelection(Math.floor(mousePos[0] / currFile.zoom), Math.floor(mousePos[1] / currFile.zoom));
    }

    onEnd(mousePos) {
        super.onEnd(mousePos);
        new HistoryState().EditCanvas();

        // Getting the end position
        this.endMousePos = [Math.floor(mousePos[0] / currFile.zoom), Math.floor(mousePos[1] / currFile.zoom)];

        // Inverting end and start (start must always be the top left corner)
        if (this.endMousePos[0] < this.startMousePos[0]) {
            let tmp = this.endMousePos[0];
            this.endMousePos[0] = this.startMousePos[0];
            this.startMousePos[0] = tmp;
        }
        // Same for the y
        if (this.endMousePos[1] < this.startMousePos[1]) {
            let tmp = this.endMousePos[1];
            this.endMousePos[1] = this.startMousePos[1];
            this.startMousePos[1] = tmp;
        }

        this.boundingBox.minX = this.startMousePos[0] - 1;
        this.boundingBox.maxX = this.endMousePos[0] + 1;
        this.boundingBox.minY = this.startMousePos[1] - 1;
        this.boundingBox.maxY = this.endMousePos[1] + 1;

        // Obtain the selected pixels
        this.getSelection();
        // Switch to the move tool so that the user can move the selection
        this.switchFunc(this.moveTool);
        this.moveTool.setSelectionData(null, this);
        
        /*
        // Switch to the move tool so that the user can move the selection
        this.switchFunc(this.moveTool);
        // Preparing data for the move tool
        let dataWidth = this.endMousePos[0] - this.startMousePos[0];
        let dataHeight = this.endMousePos[1] - this.startMousePos[1];

        this.currSelection = {
            left: this.startMousePos[0], right: this.endMousePos[0], 
            top: this.startMousePos[1], bottom: this.endMousePos[1], 

            width: dataWidth,
            height: dataHeight,
            
            data: currFile.currentLayer.context.getImageData(
                this.startMousePos[0], this.startMousePos[1], 
                dataWidth + 1, dataHeight + 1)
        };
        
        // Moving the selection to the TMP layer. It will be moved back to the original
        // layer if the user will cancel or end the selection
        currFile.currentLayer.context.clearRect(this.startMousePos[0], this.startMousePos[1], 
            dataWidth + 1, dataHeight + 1);
        // Moving those pixels from the current layer to the tmp layer
        currFile.TMPLayer.context.putImageData(this.currSelection.data, this.startMousePos[0], this.startMousePos[1]);

        this.moveTool.setSelectionData(this.currSelection, this);*/
        
    }

    copySelection() {
        super.copySelection();
    }

    cutSelection() {
        super.cutSelection();
        currFile.currentLayer.context.clearRect(this.currSelection.left-0.5, this.currSelection.top-0.5,
            this.currSelection.width, this.currSelection.height);
    }

    pasteSelection() {
        super.pasteSelection();
        if (this.currSelection == undefined)
            return;
        // Clearing the tmp (move preview) and vfx (ants) layers
        currFile.TMPLayer.context.clearRect(0, 0, currFile.TMPLayer.canvas.width, currFile.TMPLayer.canvas.height);
        currFile.VFXLayer.context.clearRect(0, 0, currFile.VFXLayer.canvas.width, currFile.VFXLayer.canvas.height);

        // I have to save the underlying data, so that the transparent pixels in the clipboard 
        // don't override the coloured pixels in the canvas
        let underlyingImageData = currFile.currentLayer.context.getImageData(
            this.currSelection.left, this.currSelection.top, 
            this.currSelection.width+1, this.currSelection.height+1
        );
        let pasteData = this.currSelection.data.data.slice();
        
        for (let i=0; i<underlyingImageData.data.length; i+=4) {
            let currentMovePixel = [
                pasteData[i], pasteData[i+1], pasteData[i+2], pasteData[i+3]
            ];

            let currentUnderlyingPixel = [
                underlyingImageData.data[i], underlyingImageData.data[i+1], 
                underlyingImageData.data[i+2], underlyingImageData.data[i+3]
            ];

            // If the pixel of the clipboard is empty, but the one below it isn't, I use the pixel below
            if (Util.isPixelEmpty(currentMovePixel)) {
                if (!Util.isPixelEmpty(currentUnderlyingPixel)) {
                    pasteData[i] = currentUnderlyingPixel[0];
                    pasteData[i+1] = currentUnderlyingPixel[1];
                    pasteData[i+2] = currentUnderlyingPixel[2];
                    pasteData[i+3] = currentUnderlyingPixel[3];
                }
            }
        }

        currFile.currentLayer.context.putImageData(new ImageData(pasteData, this.currSelection.width+1),
            this.currSelection.left, this.currSelection.top
        );

        currFile.currentLayer.updateLayerPreview();
        currFile.VFXLayer.canvas.style.zIndex = MIN_Z_INDEX;
    }

    onSelect() {
        super.onSelect();
    }

    onDeselect() {
        super.onDeselect();
    }

    drawSelection(x, y) {
        // Getting the vfx context
        let vfxContext = currFile.VFXLayer.context;
    
        // Clearing the vfx canvas
        vfxContext.clearRect(0, 0, currFile.VFXLayer.canvas.width, currFile.VFXLayer.canvas.height);

        currFile.VFXLayer.drawLine(this.startMousePos[0], this.startMousePos[1], this.endMousePos[0], this.startMousePos[1], 1);
        currFile.VFXLayer.drawLine(this.endMousePos[0], this.startMousePos[1], this.endMousePos[0], this.endMousePos[1], 1);
        currFile.VFXLayer.drawLine(this.endMousePos[0], this.endMousePos[1], this.startMousePos[0], this.endMousePos[1], 1);
        currFile.VFXLayer.drawLine(this.startMousePos[0], this.endMousePos[1], this.startMousePos[0], this.startMousePos[1], 1);
    }

    /** Moves the rect ants to the specified position 
     * 
     * @param {*} x X coordinate of the rect ants
     * @param {*} y Y coordinat of the rect ants
     * @param {*} width Width of the selection
     * @param {*} height Height of the selectione
     * 
     * @return The data regarding the current position and size of the selection
     */
    moveAnts(x, y, width, height) {
        // Getting the vfx context
        let vfxContext = currFile.VFXLayer.context;
        let ret = this.currSelection;

        // Clearing the vfx canvas
        vfxContext.clearRect(0, 0, currFile.VFXLayer.canvas.width, currFile.VFXLayer.canvas.height);

        // Fixing the coordinates
        this.currSelection.left = Math.floor(x - (width / 2));
        this.currSelection.top = Math.floor(y - (height / 2));
        this.currSelection.right = this.currSelection.left + Math.floor(width);
        this.currSelection.bottom = this.currSelection.top + Math.floor(height);

        // Drawing the rect
        currFile.VFXLayer.drawLine(this.currSelection.left, this.currSelection.top, this.currSelection.right, this.currSelection.top, 1);
        currFile.VFXLayer.drawLine(this.currSelection.right, this.currSelection.top, this.currSelection.right, this.currSelection.bottom, 1);
        currFile.VFXLayer.drawLine(this.currSelection.right, this.currSelection.bottom, this.currSelection.left, this.currSelection.bottom, 1);
        currFile.VFXLayer.drawLine(this.currSelection.left, this.currSelection.bottom, this.currSelection.left, this.currSelection.top, 1);

        return ret;
    }
}