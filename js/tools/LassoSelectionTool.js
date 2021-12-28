class LassoSelectionTool extends SelectionTool {
    currentPixels = []
    currSelection = {}

    constructor (name, options, switchFunc, moveTool) {
        super(name, options, switchFunc, moveTool);
        Events.on('click', this.mainButton, switchFunc, this);
    }

    onStart(mousePos) {
        super.onStart(mousePos);

        // Putting the vfx layer on top of everything
        currFile.VFXLayer.canvas.style.zIndex = MAX_Z_INDEX;
        // clearSelection();
        this.currentPixels = [];
        this.drawSelection();
        this.currentPixels.push([mousePos[0] / currFile.zoom, mousePos[1] / currFile.zoom]);
    }

    onDrag(mousePos) {
        super.onDrag(mousePos);

        if (this.currentPixels[this.currentPixels.length - 1] != mousePos)
            this.currentPixels.push([mousePos[0] / currFile.zoom, mousePos[1] / currFile.zoom]);
        this.drawSelection();
        console.log("here selection");
    }

    onEnd(mousePos) {
        super.onEnd(mousePos);
        new HistoryState().EditCanvas();

        this.currentPixels.push[this.startMousePos[0] / currFile.zoom, this.startMousePos[1] / currFile.zoom];
        this.getSelection();

        // Switch to the move tool so that the user can move the selection
        this.switchFunc(this.moveTool);
    }

    onSelect() {
        super.onSelect();
    }

    onDeselect() {
        super.onDeselect();
    }

    drawSelection() {
        if (this.currentPixels.length <= 1)
            return;
        let point = [];
        let prevPoint = [];
        
        currFile.VFXLayer.context.clearRect(0, 0, currFile.canvasSize[0], currFile.canvasSize[1]);
        currFile.VFXLayer.context.strokeStyle = 'rgba(0,0,0,1)';
        currFile.VFXLayer.context.fillStyle = 'rgba(0,0,0,1)';
        currFile.VFXLayer.context.lineWidth = 1;
        currFile.VFXLayer.context.beginPath();

        for (var index = 0; index < this.currentPixels.length; index ++) {
            point = this.currentPixels[index];
            
            if (index == 0)
                currFile.VFXLayer.context.moveTo(point[0], point[1]);
            else {
                prevPoint = this.currentPixels[index- 1];
                currFile.VFXLayer.context.lineTo(point[0], point[1]);
                currFile.VFXLayer.drawLine(Math.floor(prevPoint[0]), Math.floor(prevPoint[1]), 
                    Math.floor(point[0]), Math.floor(point[1]), 1);
            }
        }
        
        currFile.VFXLayer.drawLine(Math.floor(prevPoint[0]), Math.floor(prevPoint[1]), 
                    Math.floor(this.startMousePos[0] / currFile.zoom), Math.floor(this.startMousePos[1] / currFile.zoom), 1);
        currFile.VFXLayer.context.lineTo(this.startMousePos[0] / currFile.zoom, this.startMousePos[1] / currFile.zoom);
        
        currFile.VFXLayer.context.fillStyle = 'rgba(0,0,0,0.3)';
        currFile.VFXLayer.context.fill();
        currFile.VFXLayer.context.closePath();
    }

    getSelection() {

    }
}