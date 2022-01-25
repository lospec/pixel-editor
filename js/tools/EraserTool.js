class EraserTool extends ResizableTool {
    constructor(name, options, switchFunction) {
        super(name, options);

        Events.on('click', this.mainButton, switchFunction, this);
        Events.on('click', this.biggerButton, this.increaseSize.bind(this));
        Events.on('click', this.smallerButton, this.decreaseSize.bind(this));

        this.resetTutorial();
        this.addTutorialTitle("Eraser tool");
        this.addTutorialKey("E", " to select the eraser");
        this.addTutorialKey("Left drag", " to erase an area");
        this.addTutorialKey("Right drag", " to resize the eraser");
        this.addTutorialKey("+ or -", " to resize the eraser");
        this.addTutorialImg("eraser-tutorial.gif");
    }

    onStart(mousePos) {
        super.onStart(mousePos);
        new HistoryState().EditCanvas();
	}

	onDrag(mousePos, cursorTarget) {
        super.onDrag(mousePos);

        if (cursorTarget === undefined)
            return;
        //draw line to current pixel
        if (cursorTarget.className == 'drawingCanvas' || cursorTarget.className == 'drawingCanvas') {
            currFile.currentLayer.drawLine(Math.floor(this.prevMousePos[0]/currFile.zoom),
                Math.floor(this.prevMousePos[1]/currFile.zoom),
                Math.floor(this.currMousePos[0]/currFile.zoom),
                Math.floor(this.currMousePos[1]/currFile.zoom), 
                this.currSize, true
            );
        }

        currFile.currentLayer.updateLayerPreview();
	}

	onEnd(mousePos) {
        super.onEnd(mousePos);
		this.endMousePos = mousePos;
	}

    onSelect() {
        super.onSelect();
    }

    onDeselect() {
        super.onDeselect();
    }
}