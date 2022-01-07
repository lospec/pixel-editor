class RectangularSelectionTool extends SelectionTool {

    constructor (name, options, switchFunc, moveTool) {
        super(name, options, switchFunc, moveTool);
        Events.on('click', this.mainButton, switchFunc, this);
    }

    onStart(mousePos) {
        super.onStart(mousePos);

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

        // Switch to the move tool so that the user can move the selection
        this.switchFunc(this.moveTool);
        // Obtain the selected pixels
        this.moveTool.setSelectionData(this.getSelection(), this);
    }

    copySelection() {
        super.copySelection();
    }

    cutSelection() {
        super.cutSelection();
        currFile.currentLayer.context.clearRect(this.currSelection.left-0.5, this.currSelection.top-0.5,
            this.currSelection.width, this.currSelection.height);
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