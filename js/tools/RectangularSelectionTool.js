class RectangularSelectionTool extends SelectionTool {
    switchFunc = undefined;
    moveTool = undefined;
    currSelection = {};

    constructor (name, options, switchFunc, moveTool) {
        super(name, options, switchFunc);

        this.switchFunc = switchFunc;
        this.moveTool = moveTool;
        Events.on('click', this.mainButton, switchFunc, this);
    }

    onStart(mousePos) {
        super.onStart(mousePos);

        // Putting the vfx layer on top of everything
        VFXLayer.canvas.style.zIndex = MAX_Z_INDEX;

        // Saving the start coords of the rect
        this.startMousePos[0] = Math.round(this.startMousePos[0] / zoom) - 0.5;
        this.startMousePos[1] = Math.round(this.startMousePos[1] / zoom) - 0.5;

        // Avoiding external selections
        if (this.startMousePos[0] < 0) {
            this.startMousePos[0] = 0;
        }
        else if (this.startMousePos[0] > currentLayer.canvas.width) {
            this.startMousePos[0] = currentLayer.canvas.width;
        }

        if (this.startMousePos[1] < 0) {
            this.startMousePos[1] = 0;
        }
        else if (this.startMousePos[1] > currentLayer.canvas.height) {
            this.startMousePos[1] = currentLayer.canvas.height;
        }

        // Drawing the rect
        this.drawSelection(this.startMousePos[0], this.startMousePos[1]);
    }

    onDrag(mousePos) {
        super.onDrag(mousePos);

        // Drawing the rect
        this.drawSelection(Math.round(mousePos[0] / zoom) + 0.5, Math.round(mousePos[1] / zoom) + 0.5);
    }

    onEnd(mousePos) {
        super.onEnd(mousePos);
        new HistoryState().EditCanvas();

        // Getting the end position
        this.endMousePos[0] = Math.round(this.endMousePos[0] / zoom) + 0.5;
        this.endMousePos[1] = Math.round(this.endMousePos[1] / zoom) + 0.5;

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
            
            data: currentLayer.context.getImageData(
                this.startMousePos[0], this.startMousePos[1], 
                dataWidth + 1, dataHeight + 1)
        };
        
        // Moving the selection to the TMP layer. It will be moved back to the original
        // layer if the user will cancel or end the selection
        currentLayer.context.clearRect(this.startMousePos[0] - 0.5, this.startMousePos[1] - 0.5, 
            dataWidth + 1, dataHeight + 1);
        // Moving those pixels from the current layer to the tmp layer
        TMPLayer.context.putImageData(this.currSelection.data, this.startMousePos[0], this.startMousePos[1]);

        this.moveTool.setSelectionData(this.currSelection, this);
        console.log("data set");
    }

    onSelect() {
        super.onSelect();
    }

    onDeselect() {
        super.onDeselect();
    }

    drawSelection(x, y) {
        // Getting the vfx context
        let vfxContext = VFXLayer.context;
    
        // Clearing the vfx canvas
        vfxContext.clearRect(0, 0, VFXLayer.canvas.width, VFXLayer.canvas.height);
        vfxContext.lineWidth = 1;
        vfxContext.strokeStyle = 'black';
        vfxContext.setLineDash([4]);
    
        // Drawing the rect
        vfxContext.beginPath();
        vfxContext.rect(this.startMousePos[0], this.startMousePos[1], x - this.startMousePos[0], y - this.startMousePos[1]);
    
        vfxContext.stroke();
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
        let vfxContext = VFXLayer.context;
        let ret = this.currSelection;

        // Clearing the vfx canvas
        vfxContext.clearRect(0, 0, VFXLayer.canvas.width, VFXLayer.canvas.height);
        vfxContext.lineWidth = 1;
        vfxContext.setLineDash([4]);

        // Fixing the coordinates
        this.currSelection.left = Math.round(Math.round(x) - 0.5 - Math.round(width / 2)) + 0.5;
        this.currSelection.top = Math.round(Math.round(y) - 0.5 - Math.round(height / 2)) + 0.5;
        this.currSelection.right = this.currSelection.left + Math.round(width);
        this.currSelection.bottom = this.currSelection.top + Math.round(height);

        // Drawing the rect
        vfxContext.beginPath();
        vfxContext.rect(this.currSelection.left, this.currSelection.top, width, height);
        vfxContext.stroke();

        return ret;
    }
}