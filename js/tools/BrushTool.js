class BrushTool extends Tool {
    constructor(name, options) {
        super(name, options);

        // Selection button, brush size buttons
        Events.on('click',"pencil-button", this.onSelect);
        Events.on('click',"pencil-bigger-button", this.increaseSize.bind(this));
        Events.on('click',"pencil-smaller-button", this.decreaseSize.bind(this));
    }

    onStart(mousePos) {
        super.onStart(mousePos);
		this.startMousePos = mousePos;
	}

	onDrag(mousePos, cursorTarget) {
        super.onDrag(mousePos);

        if (cursorTarget === undefined)
            return;
        //draw line to current pixel
        if (cursorTarget.className == 'drawingCanvas' || cursorTarget.className == 'drawingCanvas') {
            line(Math.floor(this.prevMousePos[0]/zoom),
                Math.floor(this.prevMousePos[1]/zoom),
                Math.floor(this.currMousePos[0]/zoom),
                Math.floor(this.currMousePos[1]/zoom), 
                this.currSize
            );
        }

        currentLayer.updateLayerPreview();
	}

	onEnd(mousePos) {
        super.onEnd(mousePos);
		this.endMousePos = mousePos;
	}
}