class EraserTool extends ResizableTool {
    constructor(name, options, switchFunction) {
        super(name, options);

        Events.on('click', this.mainButton, switchFunction, this);
        Events.on('click', this.biggerButton, this.increaseSize.bind(this));
        Events.on('click', this.smallerButton, this.decreaseSize.bind(this));
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
                this.currSize
            );
        }

        // If Horizontal Symmetry mode is activated
        // draw specular
        if (currFile.hSymmetricLayer.isEnabled) {
            // if the current mouse position is over the horizontal axis
            let originalSize = currFile.canvasSize;
            let midY = (originalSize[1] / 2);
            let prevMousePosY = Math.floor(this.prevMousePos[1] / currFile.zoom);
            let currMousePosY = Math.floor(this.currMousePos[1] / currFile.zoom);

            console.log("midY: " + midY);
            console.log("currMouseY: " + currMousePosY);

            if (currMousePosY <= midY) {
                console.log("Drawing over the horizontal axis");
                let mirrorPrevY = Math.floor(midY + Math.abs(midY - prevMousePosY));
                let mirrorCurrentY = Math.floor(midY + Math.abs(midY - currMousePosY));

                this.mirrorDraw(mirrorPrevY, mirrorCurrentY);
            } else {
                console.log("Drawing under the horizontal axis");
                let mirrorPrevY = Math.floor(midY - Math.abs(midY - prevMousePosY));
                let mirrorCurrentY = Math.floor(midY - Math.abs(midY - currMousePosY));

                this.mirrorDraw(mirrorPrevY, mirrorCurrentY);
            }
        }

        currFile.currentLayer.updateLayerPreview();
	}

    mirrorDraw(mirrorPrevY, mirrorCurrentY) {
        if (this.currSize % 2 === 0) {
            currFile.currentLayer.drawLine(
                Math.floor(this.prevMousePos[0] / currFile.zoom),
                Math.floor(mirrorPrevY),
                Math.floor(this.currMousePos[0] / currFile.zoom),
                Math.floor(mirrorCurrentY),
                this.currSize
            );
        } else {
            currFile.currentLayer.drawLine(
                Math.floor(this.prevMousePos[0] / currFile.zoom),
                Math.floor(mirrorPrevY - 1),
                Math.floor(this.currMousePos[0] / currFile.zoom),
                Math.floor(mirrorCurrentY - 1),
                this.currSize
            );
        }
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