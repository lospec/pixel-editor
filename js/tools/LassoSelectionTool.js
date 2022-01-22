class LassoSelectionTool extends SelectionTool {
    currentPixels = [];

    constructor (name, options, switchFunc, moveTool) {
        super(name, options, switchFunc, moveTool);
        Events.on('click', this.mainButton, switchFunc, this);
    }

    onStart(mousePos, mouseTarget) {
        super.onStart(mousePos, mouseTarget);

        if (Util.isChildOfByClass(mouseTarget, "editor-top-menu") || 
            !Util.cursorInCanvas(currFile.canvasSize, [mousePos[0]/currFile.zoom, mousePos[1]/currFile.zoom]))
            return;
        
        this.currentPixels = [];
        this.drawSelection();
        this.currentPixels.push([mousePos[0] / currFile.zoom, mousePos[1] / currFile.zoom]);
    }

    onDrag(mousePos, mouseTarget) {
        super.onDrag(mousePos, mouseTarget);     
        
        if (Util.isChildOfByClass(mouseTarget, "editor-top-menu") || 
            !Util.cursorInCanvas(currFile.canvasSize, [mousePos[0]/currFile.zoom, mousePos[1]/currFile.zoom]))
            return;

        if (this.currentPixels[this.currentPixels.length - 1] != mousePos)
            this.currentPixels.push([mousePos[0] / currFile.zoom, mousePos[1] / currFile.zoom]);
        
        this.drawSelection();
    }

    onEnd(mousePos, mouseTarget) {
        super.onEnd(mousePos, mouseTarget);
        new HistoryState().EditCanvas();

        if (Util.isChildOfByClass(mouseTarget, "editor-top-menu") || 
            !Util.cursorInCanvas(currFile.canvasSize, [mousePos[0]/currFile.zoom, mousePos[1]/currFile.zoom]))
            return;

        this.currentPixels.push([this.startMousePos[0] / currFile.zoom, this.startMousePos[1] / currFile.zoom]);

        // Include extreme borders
        this.boundingBox.maxX++;
        this.boundingBox.maxY++;
        
        // Switch to the move tool so that the user can move the selection        
        this.switchFunc(this.moveTool);
        this.moveTool.setSelectionData(this.getSelection(), this);
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
        currFile.VFXLayer.context.fillStyle = 'rgba(0,0,0,1)';

        for (var index = 0; index < this.currentPixels.length; index ++) {
            point = this.currentPixels[index];
            
            if (index == 0)
                currFile.VFXLayer.context.moveTo(point[0], point[1]);
            else {
                prevPoint = this.currentPixels[index- 1];
                currFile.VFXLayer.drawLine(Math.floor(prevPoint[0]), Math.floor(prevPoint[1]), 
                    Math.floor(point[0]), Math.floor(point[1]), 1);
            }
        }
        
        currFile.VFXLayer.drawLine(Math.floor(point[0]), Math.floor(point[1]), 
                    Math.floor(this.currentPixels[0][0]), Math.floor(this.currentPixels[0][1]), 1);
    }
}