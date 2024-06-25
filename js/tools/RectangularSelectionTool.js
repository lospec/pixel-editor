class RectangularSelectionTool extends SelectionTool {
    constructor(name, options, switchFunc, moveTool) {
        super(name, options, switchFunc, moveTool);
        Events.on('click', this.mainButton, switchFunc, this);

        // Tutorial setup
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

        // Validate initial position within the canvas
        if (Util.isChildOfByClass(mouseTarget, "editor-top-menu") || 
            !Util.cursorInCanvas(currFile.canvasSize, [mousePos[0] / currFile.zoom, mousePos[1] / currFile.zoom]))
            return;

        // Constrain start position to canvas boundaries
        this.startMousePos[0] = Math.max(0, Math.min(this.startMousePos[0], currFile.currentLayer.canvas.width));
        this.startMousePos[1] = Math.max(0, Math.min(this.startMousePos[1], currFile.currentLayer.canvas.height));

        // Initialize the endMousePos to startMousePos to draw an initial dot
        this.endMousePos = [...this.startMousePos];

        // Draw the initial selection rectangle
        this.drawSelection();
    }

    onDrag(mousePos, mouseTarget) {
        super.onDrag(mousePos, mouseTarget);

        // Validate drag position within the canvas
        if (Util.isChildOfByClass(mouseTarget, "editor-top-menu") || 
            !Util.cursorInCanvas(currFile.canvasSize, [mousePos[0] / currFile.zoom, mousePos[1] / currFile.zoom]))
            return;

        // Update the end position with precise rounding
        this.endMousePos = [Math.round(mousePos[0] / currFile.zoom), Math.round(mousePos[1] / currFile.zoom)];

        // Draw the updated selection rectangle
        this.drawSelection();
    }

    onEnd(mousePos, mouseTarget) {
        super.onEnd(mousePos, mouseTarget);

        if (Util.isChildOfByClass(mouseTarget, "editor-top-menu"))
            return;

        new HistoryState().EditCanvas();

        // Finalize the end position with precise rounding
        this.endMousePos = [Math.round(mousePos[0] / currFile.zoom), Math.round(mousePos[1] / currFile.zoom)];

        // Ensure startMousePos is top-left and endMousePos is bottom-right
        if (this.endMousePos[0] < this.startMousePos[0]) {
            [this.startMousePos[0], this.endMousePos[0]] = [this.endMousePos[0], this.startMousePos[0]];
        }
        if (this.endMousePos[1] < this.startMousePos[1]) {
            [this.startMousePos[1], this.endMousePos[1]] = [this.endMousePos[1], this.startMousePos[1]];
        }

        // Set the bounding box exactly within the selection without expanding
        if (Util.cursorInCanvas(currFile.canvasSize, [mousePos[0] / currFile.zoom, mousePos[1] / currFile.zoom])) {
            this.boundingBox.minX = this.startMousePos[0];
            this.boundingBox.maxX = this.endMousePos[0];
            this.boundingBox.minY = this.startMousePos[1];
            this.boundingBox.maxY = this.endMousePos[1];
        }

        // Switch to the move tool to move the selection
        this.switchFunc(this.moveTool);
        this.moveTool.setSelectionData(this.getSelection(), this);
    }

    cutSelection() {
        super.cutSelection();

        // Clear the selected area without fractional offsets
        currFile.currentLayer.context.clearRect(
            this.currSelection.left,
            this.currSelection.top,
            this.currSelection.width,
            this.currSelection.height
        );
    }

    onSelect() {
        super.onSelect();
    }

    onDeselect() {
        super.onDeselect();
    }

    drawSelection() {
        // Access the VFX context for visualizing the selection rectangle
        let vfxContext = currFile.VFXLayer.context;

        // Clear the VFX canvas to ensure no previous selection visuals are visible
        vfxContext.clearRect(0, 0, currFile.VFXLayer.canvas.width, currFile.VFXLayer.canvas.height);

        // Draw the selection rectangle with precise lines
        if (this.startMousePos && this.endMousePos) {
            vfxContext.strokeStyle = 'rgba(0, 0, 255, 1)'; // Example color for the rectangle
            vfxContext.lineWidth = 1;
            vfxContext.strokeRect(
                Math.min(this.startMousePos[0], this.endMousePos[0]),
                Math.min(this.startMousePos[1], this.endMousePos[1]),
                Math.abs(this.endMousePos[0] - this.startMousePos[0]),
                Math.abs(this.endMousePos[1] - this.startMousePos[1])
            );
        }
    }
}
