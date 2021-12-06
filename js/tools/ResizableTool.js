class ResizableTool extends Tool {
    startResizePos = undefined;
    currSize = 1;
	prevSize = 1;
    
    constructor(name, options, switchFunc) {
        super(name, options, switchFunc);
    }

    onRightStart(mousePos, mouseEvent) {
        this.startResizePos = mousePos;
    }

    onRightDrag(mousePos, mouseEvent) {
        //get new brush size based on x distance from original clicking location
        let distanceFromClick = mousePos[0]/currFile.zoom - this.startResizePos[0]/currFile.zoom;

        let brushSizeChange = Math.round(distanceFromClick/10);
        let newBrushSize = this.currSize + brushSizeChange;

        //set the brush to the new size as long as its bigger than 1 and less than 128
        this.currSize = Math.min(Math.max(1,newBrushSize), 128);

        //fix offset so the cursor stays centered
        this.updateCursor();
        this.onHover(this.startResizePos, mouseEvent);
    }

    onRightEnd(mousePos, mouseEvent) {
        
    }
}