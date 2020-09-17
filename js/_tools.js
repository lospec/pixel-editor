//tools container / list, automatically managed when you create a new Tool();
var tool = {};

//class for tools
class Tool {
	constructor (name, options) {

		//stores the name in object, only needed for legacy functions from when currentTool was just a string
		this.name = name;

		//copy options to this object
		if (options.cursor) {
			//passed statically as a string
			if (typeof options.cursor == 'string') this.cursor = options.cursor;
			//passed a function which should be used as a getter function
			if (typeof options.cursor == 'function') Object.defineProperty(this, 'cursor', { get: options.cursor});
		}

		if (options.imageCursor) this.cursor = "url(\'/pixel-editor/"+options.imageCursor+".png\'), auto";

		if (options.brushPreview) {
			this.brushPreview = true;
			this.currentBrushSize = 1;
			this.previousBrushSize = 1;
		}

		//add to tool object so it can be referenced
		tool[name] = this;
	}

	get brushSize () {
		return this.currentBrushSize;
	}

	set brushSize (value) {
		this.currentBrushSize = value;
		this.updateCursor();
	}


	//switch to this tool (replaced global changeTool())
	switchTo () {
		// Ending any selection in progress
	    if (currentTool.name.includes("select") && !this.name.includes("select") && !selectionCanceled) {
	    	endSelection();
	    }

	    //set tool and temp tje tje tpp <--- he's speaking the language of the gods, don't delete
	    currentTool = this;
		currentToolTemp = this;

	    var tools = document.getElementById("tools-menu").children;

		for (var i = 0; i < tools.length; i++) {
		    tools[i].classList.remove("selected");
		}

		let buttonNode = document.getElementById(this.name + "-button");
	    //give the button of the selected tool the .selected class if the tool has a button
	    if(buttonNode != null && buttonNode.parentNode != null) {
			document.getElementById(this.name+"-button").parentNode.classList.add("selected");
		}

		//change cursor
		this.updateCursor();
	}

	updateCursor () {
		//switch to that tools cursor
		canvasView.style.cursor = this.cursor || 'default';
	
		//if the tool uses a brush preview, make it visible and update the size
		if (this.brushPreview) {
			//console.log('brush size',this.currentBrushSize)
			brushPreview.style.display = 'block';
			brushPreview.style.width = this.currentBrushSize * zoom + 'px';
			brushPreview.style.height = this.currentBrushSize * zoom + 'px';
		}
	
		//show / hide eyedropper color preview
		if (this.eyedropperPreview) eyedropperPreview.style.display = 'block';
		else eyedropperPreview.style.display = 'none';
	
		//moveSelection
		if (currentTool.name == 'moveselection') {
			if (cursorInSelectedArea()) {
				canMoveSelection = true;
				canvasView.style.cursor = 'move';
				brushPreview.style.display = 'none';
			}
			else {
				canvasView.style.cursor = 'crosshair';
			}
		}
	}

	moveBrushPreview(cursorLocation) {
		let toSub = 0;
		// Prevents the brush to be put in the middle of pixels
		if (this.currentBrushSize % 2 == 0) {
			toSub = 0.5;
		}		

		brushPreview.style.left = (Math.ceil(cursorLocation[0] / zoom) * zoom + currentLayer.canvas.offsetLeft - this.currentBrushSize * zoom / 2 - zoom / 2 - toSub * zoom) + 'px';
		brushPreview.style.top = (Math.ceil(cursorLocation[1] / zoom) * zoom + currentLayer.canvas.offsetTop - this.currentBrushSize * zoom / 2 - zoom / 2 - toSub * zoom) + 'px';
	}
}


/*global dragging currentTool, currentToolTemp, selectionCanceled, endSelection*/