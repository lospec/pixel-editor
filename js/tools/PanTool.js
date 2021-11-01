class PanTool extends Tool {

    constructor(name, options, switchFunction) {
        super(name, options);

        Events.on('click', this.mainButton, switchFunction, this);
    }

    onStart(mousePos) {
        super.onStart(mousePos);
        canvasView.style.cursor = "url(\'/pixel-editor/pan-held.png\'), auto";
	}

	onDrag(mousePos) {
        super.onDrag(mousePos);

        // Setting first layer position
        layers[0].setCanvasOffset(layers[0].canvas.offsetLeft + (mousePos[0] - this.startMousePos[0]), layers[0].canvas.offsetTop + (mousePos[1] - this.startMousePos[1]));
        // Copying that position to the other layers
        for (let i=1; i<layers.length; i++) {
            layers[i].copyData(layers[0]);
        }
	}

	onEnd(mousePos) {
        super.onEnd(mousePos);

        canvasView.style.cursor = "url(\'/pixel-editor/pan.png\'), auto";
	}

    onSelect() {
        super.onSelect();        
        canvasView.style.cursor = "url(\'/pixel-editor/pan.png\'), auto";
    }

    onDeselect() {
        super.onDeselect();
    }
}