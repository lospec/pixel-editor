class BrushTool extends ResizableTool {
    constructor(name, options, switchFunction) {
        super(name, options);

        Events.on('click', this.mainButton, switchFunction, this);
        Events.on('click', this.biggerButton, this.increaseSize.bind(this));
        Events.on('click', this.smallerButton, this.decreaseSize.bind(this));
    }

    onStart(mousePos, cursorTarget) {
        super.onStart(mousePos);
        if (cursorTarget === undefined)
            return;
        new HistoryState().EditCanvas();
        
        //draw line to current pixel
        if (cursorTarget.className == 'drawingCanvas' || cursorTarget.className == 'drawingCanvas') {
            currFile.currentLayer.drawLine(
                Math.floor(mousePos[0]/currFile.zoom),
                Math.floor(mousePos[1]/currFile.zoom),
                Math.floor(mousePos[0]/currFile.zoom),
                Math.floor(mousePos[1]/currFile.zoom), 
                this.currSize
            );
        }

        currFile.currentLayer.updateLayerPreview();
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
                this.currSize
            );
        }
        
        currFile.currentLayer.updateLayerPreview();
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
}