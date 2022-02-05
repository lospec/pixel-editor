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

        let midX = (currFile.canvasSize[0] / 2);
        let midY = (currFile.canvasSize[1] / 2);
        let prevMousePosX = Math.floor(this.prevMousePos[0] / currFile.zoom);
        let prevMousePosY = Math.floor(this.prevMousePos[1] / currFile.zoom);
        let currMousePosX = Math.floor(this.currMousePos[0] / currFile.zoom);
        let currMousePosY = Math.floor(this.currMousePos[1] / currFile.zoom);
        let mirrorPrevX, mirrorPrevY, mirrorCurrentX, mirrorCurrentY;

        // If Horizontal Symmetry mode is activated
        // draw specular
        if (currFile.hSymmetricLayer.isEnabled) {
            // if the current mouse position is over the horizontal axis
            if (currMousePosY <= midY) {
                mirrorPrevY = Math.floor(midY + Math.abs(midY - prevMousePosY));
                mirrorCurrentY = Math.floor(midY + Math.abs(midY - currMousePosY));
            } else {
                mirrorPrevY = Math.floor(midY - Math.abs(midY - prevMousePosY));
                mirrorCurrentY = Math.floor(midY - Math.abs(midY - currMousePosY));
            }
            this.mirrorErase(
                Math.floor(this.prevMousePos[0] / currFile.zoom),
                mirrorPrevY,
                Math.floor(this.currMousePos[0] / currFile.zoom),
                mirrorCurrentY,
                true, false
            );

        }

        if (currFile.vSymmetricLayer.isEnabled) {
            // console.log("midX => " + midX);
            // console.log("currMouseX => " + currMousePosX);

            // if the current mouse position is over the horizontal axis
            if (currMousePosX <= midX) {
                mirrorPrevX = Math.floor(midX + Math.abs(midX - prevMousePosX));
                mirrorCurrentX = Math.floor(midX + Math.abs(midX - currMousePosX));
            } else {
                mirrorPrevX = Math.floor(midX - Math.abs(midX - prevMousePosX));
                mirrorCurrentX = Math.floor(midX - Math.abs(midX - currMousePosX));
            }

            this.mirrorErase(
                mirrorPrevX,
                Math.floor(this.prevMousePos[1] / currFile.zoom),
                mirrorCurrentX,
                Math.floor(this.currMousePos[1] / currFile.zoom),
                false, true
            );
        }

        if (currFile.hSymmetricLayer.isEnabled && currFile.vSymmetricLayer.isEnabled) {
            // Based on current mouse position we can infer which quadrant is the remaining one
            this.mirrorErase(mirrorPrevX, mirrorPrevY, mirrorCurrentX, mirrorCurrentY, true, true);
        }

        currFile.currentLayer.updateLayerPreview();
	}

    mirrorErase(prevX, prevY, currX, currY, isHorizontal, isVertical) {
        let horizontalFactor = (isHorizontal) ? 1 : 0;
        let verticalFactor = (isVertical) ? 1 : 0;
        if (this.currSize % 2 === 0) {
            currFile.currentLayer.drawLine(
                prevX,
                prevY,
                currX,
                currY,
                this.currSize, true
            );
        } else {
            currFile.currentLayer.drawLine(
                prevX - verticalFactor,
                prevY - horizontalFactor,
                currX - verticalFactor,
                currY - horizontalFactor,
                this.currSize, true
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