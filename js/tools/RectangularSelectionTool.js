class RectangularSelectionTool extends SelectionTool {

    constructor (name, options, switchFunc, moveTool) {
        super(name, options, switchFunc, moveTool);
        Events.on('click', this.mainButton, switchFunc, this);

        this.resetTutorial();
        this.addTutorialTitle("Rectangular selection tool");
        this.addTutorialKey("M", " to select the rectangular selection tool");
        this.addTutorialKey("Left drag", " to select a rectangular area");
        this.addTutorialKey("Left drag", " to move a selection");
        this.addTutorialKey("Esc", " to cancel a selection");
        this.addTutorialKey("Click", " outside the selection to cancel it");
        this.addTutorialKey("CTRL+C", " to copy a selection");
        this.addTutorialKey("CTRL+V", " to paste a selection");
        this.addTutorialKey("CTRL+X", " to cut a selection");
        this.addTutorialImg("rectselect-tutorial.gif");
    }

    onStart(mousePos, mouseTarget) {
        super.onStart(mousePos, mouseTarget);

        if (Util.isChildOfByClass(mouseTarget, "editor-top-menu") || 
            !Util.cursorInCanvas(currFile.canvasSize, [mousePos[0]/currFile.zoom, mousePos[1]/currFile.zoom]))
            return;

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

    onDrag(mousePos, mouseTarget) {
        super.onDrag(mousePos, mouseTarget);

        if (Util.isChildOfByClass(mouseTarget, "editor-top-menu") || 
            !Util.cursorInCanvas(currFile.canvasSize, [mousePos[0]/currFile.zoom, mousePos[1]/currFile.zoom]))
            return;

        // Drawing the rect
        this.endMousePos = [Math.floor(mousePos[0] / currFile.zoom), Math.floor(mousePos[1] / currFile.zoom)];
        this.drawSelection(Math.floor(mousePos[0] / currFile.zoom), Math.floor(mousePos[1] / currFile.zoom));
    }

    onEnd(mousePos, mouseTarget) {
        super.onEnd(mousePos, mouseTarget);
        
        if (Util.isChildOfByClass(mouseTarget, "editor-top-menu"))
            return;

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

        if (Util.cursorInCanvas(currFile.canvasSize, [mousePos[0]/currFile.zoom, mousePos[1]/currFile.zoom])) {
            this.boundingBox.minX = this.startMousePos[0] - 1;
            this.boundingBox.maxX = this.endMousePos[0] + 1;
            this.boundingBox.minY = this.startMousePos[1] - 1;
            this.boundingBox.maxY = this.endMousePos[1] + 1;
        }

        // Switch to the move tool so that the user can move the selection
        this.switchFunc(this.moveTool);
        // Obtain the selected pixels
        this.moveTool.setSelectionData(this.getSelection(), this);
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

    drawSelection() {
        // Getting the vfx context
        let vfxContext = currFile.VFXLayer.context;
    
        // Clearing the vfx canvas
        vfxContext.clearRect(0, 0, currFile.VFXLayer.canvas.width, currFile.VFXLayer.canvas.height);

        currFile.VFXLayer.drawLine(this.startMousePos[0], this.startMousePos[1], this.endMousePos[0], this.startMousePos[1], 1);
        currFile.VFXLayer.drawLine(this.endMousePos[0], this.startMousePos[1], this.endMousePos[0], this.endMousePos[1], 1);
        currFile.VFXLayer.drawLine(this.endMousePos[0], this.endMousePos[1], this.startMousePos[0], this.endMousePos[1], 1);
        currFile.VFXLayer.drawLine(this.startMousePos[0], this.endMousePos[1], this.startMousePos[0], this.startMousePos[1], 1);
    }
}