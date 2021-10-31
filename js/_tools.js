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
	currSize = 1;
	prevSize = 1;

	// Useful coordinates
	startMousePos = {};
	currMousePos = {};
	prevMousePos = {};
	endMousePos = {};

	// HTML elements
	mainButton = undefined;
	biggerButton = undefined;
	smallerButton = undefined;

	constructor (name, options) {
		this.name = name;
		this.cursorType = options;
		
		this.mainButton = document.getElementById(name + "-button");
		this.biggerButton = document.getElementById(name + "-bigger-button");
		this.smallerButton = document.getElementById(name + "-smaller-button");
	}

	onSelect() {
		this.mainButton.parentElement.classList.add("selected");
		this.isSelected = true;
	/*
		//copy options to this object
		if (options.cursor) {
			//passed statically as a string
			if (typeof options.cursor == 'string') this.cursor = options.cursor;
			//passed a function which should be used as a getter function
			if (typeof options.cursor == 'function') Object.defineProperty(this, 'cursor', { get: options.cursor});

			if (options.imageCursor) this.cursor = "url(\'/pixel-editor/"+options.imageCursor+".png\'), auto";

			if (options.brushPreview) {
				this.brushPreview = true;
			}
		}*/
	}

	updateCursor() {}

	onHover(cursorLocation, cursorTarget) {
		this.prevMousePos = this.currMousePos;
		this.currMousePos = cursorLocation;

		let toSub = 1;
        // Prevents the brush to be put in the middle of pixels
        if (this.currSize % 2 == 0) {
            toSub = 0.5;
        }        

        brushPreview.style.left = (Math.floor(cursorLocation[0] / zoom) * zoom + currentLayer.canvas.offsetLeft - this.currSize * zoom / 2 - zoom / 2 + toSub * zoom) + 'px';
        brushPreview.style.top = (Math.floor(cursorLocation[1] / zoom) * zoom + currentLayer.canvas.offsetTop - this.currSize * zoom / 2 - zoom / 2 + toSub * zoom) + 'px';

		switch (this.cursorType.type) {
			case 'html':
				if (cursorTarget == 'drawingCanvas'|| cursorTarget.className == 'drawingCanvas')
					brushPreview.style.visibility = 'visible';
				else
					brushPreview.style.visibility = 'hidden';

				brushPreview.style.display = 'block';
				brushPreview.style.width = this.currSize * zoom + 'px';
				brushPreview.style.height = this.currSize * zoom + 'px';
				break;
			case 'cursor':
				canvasView.style.cursor = this.cursor || 'default';
				break;
			default:
				break;
		}
	}

	onDeselect() {
		this.mainButton.parentElement.classList.remove("selected");
		this.isSelected = false;
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
		if (this.currSize > 0) {
			this.currSize--;
			this.updateCursor();
		}
	}

	get size() {
		return this.currSize;
	}
}


/*global dragging currentTool, currentToolTemp, selectionCanceled, endSelection*/

/**
 * Class selectionTool extends Tool {
 * 		imageDataToMove
 * 		startDataPos
 * 		currDataPos
 * 		finalDataPos
 * 		canMove
 * 		
 * 		movePreview()
 * 		
 * 		// start and end selection just overwrite the onStart and onEnd methods
 * 
 * }
 * 
 */