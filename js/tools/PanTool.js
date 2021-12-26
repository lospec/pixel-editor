class PanTool extends Tool {

    constructor(name, options, switchFunction) {
        super(name, options);

        Events.on('click', this.mainButton, switchFunction, this);
    }

    onStart(mousePos, target) {
        super.onStart(mousePos);
        if (target.className != 'drawingCanvas')
            return;
        currFile.canvasView.style.cursor = "url(\'/pixel-editor/pan-held.png\'), auto";
	}

	onDrag(mousePos, target) {
        super.onDrag(mousePos);
        if (target.className != 'drawingCanvas')
            return;

        // Setting first layer position
        currFile.layers[0].setCanvasOffset(currFile.layers[0].canvas.offsetLeft + (mousePos[0] - this.startMousePos[0]), currFile.layers[0].canvas.offsetTop + (mousePos[1] - this.startMousePos[1]));
        // Copying that position to the other layers
        for (let i=1; i<currFile.layers.length; i++) {
            currFile.layers[i].copyData(currFile.layers[0]);
        }
	}

	onEnd(mousePos, target) {
        super.onEnd(mousePos);
        if (target.className != 'drawingCanvas')
            return;

        currFile.canvasView.style.cursor = "url(\'/pixel-editor/pan.png\'), auto";
	}

    onSelect() {
        super.onSelect();        
        currFile.canvasView.style.cursor = "url(\'/pixel-editor/pan.png\'), auto";
    }

    onDeselect() {
        super.onDeselect();
    }
}