class MoveSelectionTool extends Tool {
    currSelection = undefined;
    selectionTool = undefined;
    endTool = undefined;
    switchFunc = undefined;
    lastCopiedSelection = undefined;
    cutting = false;

    constructor (name, options, switchFunc, endTool) {
        super(name, options, switchFunc);

        this.switchFunc = switchFunc;
        this.endTool = endTool;

        Events.onCustom("esc-pressed", this.endSelection.bind(this));

        Events.onCustom("ctrl+c", this.copySelection.bind(this));
        Events.onCustom("ctrl+x", this.cutSelection.bind(this));
        Events.onCustom("ctrl+v", this.pasteSelection.bind(this));
    }

    copySelection() {
        this.lastCopiedSelection = this.currSelection;
        this.cutting = false;
    }

    cutSelection() {
        this.cutting = true;
        this.lastCopiedSelection = this.currSelection;
        this.endSelection();
        this.currSelection = this.lastCopiedSelection;
        // Cut the data
        currFile.currentLayer.context.clearRect(this.currSelection.left-0.5, this.currSelection.top-0.5,
            this.currSelection.width, this.currSelection.height);
    }

    pasteSelection() {
        if (this.lastCopiedSelection === undefined)
            return;
        // Finish the current selection and start a new one with the same data
        if (!this.cutting) {
            this.endSelection();
        }
        this.cutting = false;

        this.switchFunc(this);
        this.currSelection = this.lastCopiedSelection;

        // Putting the vfx layer on top of everything
        currFile.VFXLayer.canvas.style.zIndex = MAX_Z_INDEX;
        this.onDrag(this.currMousePos);

        new HistoryState().EditCanvas();
    }

    onStart(mousePos, mouseTarget) {
        super.onStart(mousePos, mouseTarget);

        if (!this.cursorInSelectedArea(mousePos) && 
            !Util.isChildOfByClass(mouseTarget, "editor-top-menu")) {
            this.endSelection();
        }
    }

    onDrag(mousePos) {
        super.onDrag(mousePos);

        this.currSelection = this.selectionTool.moveAnts(mousePos[0]/currFile.zoom, 
            mousePos[1]/currFile.zoom, this.currSelection.width, this.currSelection.height);

        // clear the entire tmp layer
        TMPLayer.context.clearRect(0, 0, currFile.TMPLayer.canvas.width, currFile.TMPLayer.canvas.height);
        // put the image data on the tmp layer with offset
        currFile.TMPLayer.context.putImageData(
            this.currSelection.data, 
            Math.round(mousePos[0] / currFile.zoom) - this.currSelection.width / 2, 
            Math.round(mousePos[1] / currFile.zoom) - this.currSelection.height / 2);
    }

    onEnd(mousePos) {
        super.onEnd(mousePos);
    }

    onSelect() {
        super.onSelect();
    }

    onDeselect() {
        super.onDeselect();
    }

    setSelectionData(data, tool) {
        this.currSelection = data;
        this.selectionTool = tool;
        this.firstTimeMove = true;
    }

    onHover(mousePos) {
        super.onHover(mousePos);

        if (this.cursorInSelectedArea(mousePos)) {
            currFile.canvasView.style.cursor = 'move';
        }
        else {
            currFile.canvasView.style.cursor = 'default';
        }
    }

    cursorInSelectedArea(cursorPos) {        
        // Getting the coordinates relatively to the canvas
        let x = cursorPos[0] / currFile.zoom;
        let y = cursorPos[1] / currFile.zoom;
    
        if (this.currSelection.left <= x && x <= this.currSelection.right) {
            if (y <= this.currSelection.bottom && y >= this.currSelection.top) {
                return true;
            }
            return false;
        }
        return false;
    }    

    endSelection() {
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
                    console.log("Original data: " + this.currSelection.data.data[i] + "," +
                    this.currSelection.data.data[i+1], this.currSelection.data.data[i+2]);

                    pasteData[i] = currentUnderlyingPixel[0];
                    pasteData[i+1] = currentUnderlyingPixel[1];
                    pasteData[i+2] = currentUnderlyingPixel[2];
                    pasteData[i+3] = currentUnderlyingPixel[3];

                    console.log("After data: " + this.currSelection.data.data[i] + "," +
                    this.currSelection.data.data[i+1], this.currSelection.data.data[i+2]);
                }
            }
        }

        currFile.currentLayer.context.putImageData(new ImageData(pasteData, this.currSelection.width+1),
            this.currSelection.left, this.currSelection.top
        );

        this.currSelection = undefined;
        currFile.currentLayer.updateLayerPreview();
        currFile.VFXLayer.canvas.style.zIndex = MIN_Z_INDEX;
        
        // Switch to brush
        this.switchFunc(this.endTool);
    }
}