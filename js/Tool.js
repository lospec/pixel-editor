// REFACTOR: this is a nice base for the Tool class
//tools container / list, automatically managed when you create a new Tool();
var tool = {};

//class for tools
class Tool {
	name = "AbstractTool";
	isSelected = false;
	
	// Cursor and brush size
	cursorType = {};
	cursor = undefined;
	cursorHTMLElement = undefined;

	// Useful coordinates
	startMousePos = {};
	currMousePos = {};
	prevMousePos = {};
	endMousePos = {};

	// HTML elements
	mainButton = undefined;
	biggerButton = undefined;
	smallerButton = undefined;
	brushPreview = document.getElementById("brush-preview");

	constructor (name, options) {
		this.name = name;
		this.cursorType = options;
		
		this.mainButton = document.getElementById(name + "-button");
		this.biggerButton = document.getElementById(name + "-bigger-button");
		this.smallerButton = document.getElementById(name + "-smaller-button");
	}

	onSelect() {
		if (this.mainButton != undefined)
			this.mainButton.parentElement.classList.add("selected");
		this.isSelected = true;

		switch (this.cursorType.type) {
			case 'html':
				currFile.canvasView.style.cursor = 'none';
				break;
			case 'cursor':
				this.cursor = this.cursorType.style;
				currFile.canvasView.style.cursor = this.cursor || 'default';
				break;
			default:
				break;
		}
	}

	updateCursor() {
		this.brushPreview.style.display = 'block';
		this.brushPreview.style.width = this.currSize * currFile.zoom + 'px';
		this.brushPreview.style.height = this.currSize * currFile.zoom + 'px';
	}

	onMouseWheel(mousePos, mode) {}

	onHover(cursorLocation, cursorTarget) {
		this.prevMousePos = this.currMousePos;
		this.currMousePos = cursorLocation;

		this.updateCursor();

		let toSub = 1;
        // Prevents the brush to be put in the middle of pixels
        if (this.currSize % 2 == 0) {
            toSub = 0.5;
        }        

        this.brushPreview.style.left = (Math.floor(cursorLocation[0] / currFile.zoom) * currFile.zoom + currFile.currentLayer.canvas.offsetLeft - this.currSize * currFile.zoom / 2 - currFile.zoom / 2 + toSub * currFile.zoom) + 'px';
        this.brushPreview.style.top = (Math.floor(cursorLocation[1] / currFile.zoom) * currFile.zoom + currFile.currentLayer.canvas.offsetTop - this.currSize * currFile.zoom / 2 - currFile.zoom / 2 + toSub * currFile.zoom) + 'px';

		if (this.cursorType.type == 'html') {
			if (cursorTarget.className == 'drawingCanvas'|| cursorTarget.className == 'drawingCanvas') {
				this.brushPreview.style.visibility = 'visible';
				currFile.canvasView.style.cursor = 'none';
			}
			else {
				this.brushPreview.style.visibility = 'hidden';
				currFile.canvasView.style.cursor = 'default';
			}
		}
	}

	onDeselect() {
		if (this.mainButton != undefined)
			this.mainButton.parentElement.classList.remove("selected");
		this.isSelected = false;

		this.brushPreview.style.visibility = 'hidden';
		currFile.canvasView.style.cursor = 'default';
	}

	onStart(mousePos) {
		this.startMousePos = mousePos;
	}

	onDrag(mousePos) {
	}

	onEnd(mousePos) {
		this.endMousePos = mousePos;
	}

	increaseSize() {
		if (this.currSize < 128) {
			this.currSize++;
			this.updateCursor();
		}
	}

	decreaseSize() {
		if (this.currSize > 1) {
			this.currSize--;
			this.updateCursor();
		}
	}

	get size() {
		return this.currSize;
	}
}