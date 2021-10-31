class EraserTool extends Tool {
    constructor(name, options, switchFunction) {
        super(name, options);

        Events.on('click', this.mainButton, switchFunction, this);
        Events.on('click', this.biggerButton, this.increaseSize.bind(this));
        Events.on('click', this.smallerButton, this.decreaseSize.bind(this));
    }

    onStart(mousePos) {
        super.onStart(mousePos);
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

    onSelect() {
        super.onSelect();
    }

    onDeselect() {
        super.onDeselect();
    }
}