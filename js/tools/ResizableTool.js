class ResizableTool extends DrawingTool {
    startResizePos = undefined;
    currSize = 1;
	prevSize = 1;
    toolSizeInput = undefined;

    biggerButton = undefined;
	smallerButton = undefined;
    
    constructor(name, options, switchFunc) {
        super(name, options, switchFunc);

        this.biggerButton = document.getElementById(name + "-bigger-button");
		this.smallerButton = document.getElementById(name + "-smaller-button");
    }

    onSelect(mousePos) {
        super.onSelect(mousePos);

        if (this.toolSizeInput == undefined) {
            this.toolSizeInput = InputComponents.createNumber(this.name + "-input", "Tool size");
            Events.on("change", this.toolSizeInput.getElementsByTagName("input")[0], this.updateSize.bind(this));
        }
        TopMenuModule.addInfoElement(this.name + "-input", this.toolSizeInput);
        TopMenuModule.updateField(this.name + "-input", this.currSize);
    }

    updateSize(event) {
        let value = event.target.value;
        this.currSize = value;
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

    increaseSize() {
		if (this.currSize < 128) {
			this.currSize++;
			this.updateCursor();
            TopMenuModule.updateField(this.name + "-input", this.currSize);
		}
	}

	decreaseSize() {
		if (this.currSize > 1) {
			this.currSize--;
			this.updateCursor();
            TopMenuModule.updateField(this.name + "-input", this.currSize);
		}
	}

	get size() {
		return this.currSize;
	}
}