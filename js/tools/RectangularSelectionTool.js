class RectangularSelectionTool extends SelectionTool {
    constructor (name, options, switchFunc) {
        super(name, options, switchFunc);

        Events.on('click', this.mainButton, switchFunc, this);
    }

    onStart(mousePos) {
        super.onStart(mousePos);

        // Saving the canvas
        new HistoryState().EditCanvas();
        // Putting the vfx layer on top of everything
        VFXLayer.canvas.style.zIndex = MAX_Z_INDEX;

        // Saving the start coords of the rect
        this.startMousePos[0] = Math.round(this.startMousePos[0] / zoom) - 0.5;
        this.startMousePos[1] = Math.round(this.startMousePos[1] / zoom) - 0.5;

        // Avoiding external selections
        if (this.startMousePos[0] < 0) {
            this.startMousePos[0] = 0;
        }
        else if (this.startMousePos[0] > currentLayer.canvas.width) {
            this.startMousePos[0] = currentLayer.canvas.width;
        }

        if (this.startMousePos[1] < 0) {
            this.startMousePos[1] = 0;
        }
        else if (this.startMousePos[1] > currentLayer.canvas.height) {
            this.startMousePos[1] = currentLayer.canvas.height;
        }

        // Drawing the rect
        this.drawRect(this.startMousePos[0], this.startMousePos[1]);
    }

    onDrag(mousePos) {
        super.onDrag(mousePos);

        // Drawing the rect
        this.drawRect(Math.round(mousePos[0] / zoom) + 0.5, Math.round(mousePos[1] / zoom) + 0.5);
    }

    onEnd(mousePos) {
        super.onEnd(mousePos);

        // Getting the end position
        this.endMousePos[0] = Math.round(this.endMousePos[0] / zoom) + 0.5;
        this.endMousePos[1] = Math.round(this.endMousePos[1] / zoom) + 0.5;

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
    }

    onSelect() {
        super.onSelect();
    }

    onDeselect() {
        super.onDeselect();
    }

    drawRect(x, y) {
        // Getting the vfx context
        let vfxContext = VFXLayer.context;
    
        // Clearing the vfx canvas
        vfxContext.clearRect(0, 0, VFXLayer.canvas.width, VFXLayer.canvas.height);
        vfxContext.lineWidth = 1;
        vfxContext.strokeStyle = 'black';
        vfxContext.setLineDash([4]);
    
        // Drawing the rect
        vfxContext.beginPath();
        vfxContext.rect(this.startMousePos[0], this.startMousePos[1], x - this.startMousePos[0], y - this.startMousePos[1]);
    
        vfxContext.stroke();
    }
}