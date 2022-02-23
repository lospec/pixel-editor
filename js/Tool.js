// REFACTOR: this is a nice base for the Tool class
//tools container / list, automatically managed when you create a new Tool();
var tool = {};

//class for tools
class Tool {
	name = "AbstractTool";
	isSelected = false;
	switchFunction = undefined;
	
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
	brushPreview = document.getElementById("brush-preview");

	// Tool tutorial
	toolTutorial = document.getElementById("tool-tutorial");
	tutorialTimer = undefined;
	tutorialString = "";

	constructor (name, options) {
		this.name = name;
		this.cursorType = options;
		
		this.mainButton = document.getElementById(name + "-button");

		if (this.mainButton != undefined) {
			// Timer to show the tutorial
			Events.on("mouseenter", this.mainButton, function(){
				this.setTutorial();
				this.tutorialTimer = setTimeout(this.showTutorial.bind(this), 750)
			}.bind(this));

			// Clear the callback if the user cancels the hovering
			Events.on("mouseleave", this.mainButton, function() {
				if (this.tutorialTimer != undefined)
					clearTimeout(this.tutorialTimer);
				this.tutorialTimer = undefined;
				this.hideTutorial();
			}.bind(this))

			this.hideTutorial();
		}
	}
	
	showTutorial() {
		let tutorialRect = this.toolTutorial.getBoundingClientRect();
		
		if ((this.mainButton.getBoundingClientRect().top - 48 + (tutorialRect.bottom - tutorialRect.top)) > window.innerHeight) {
			this.toolTutorial.style.top = window.innerHeight - 48 - (tutorialRect.bottom - tutorialRect.top) + "px";
		}
		else {
			this.toolTutorial.style.top = this.mainButton.getBoundingClientRect().top - 48 + "px";
		}
		this.toolTutorial.className = "fade-in";
	}
	hideTutorial() {
		this.toolTutorial.className = "fade-out";
	}

	resetTutorial() {
		this.tutorialString = "";
	}
	setTutorial() {
		this.toolTutorial.innerHTML = this.tutorialString;
	}
	addTutorialKey(key, text) {
		this.tutorialString += '<li><span class="keyboard-key">' + key + '</span> ' + text + '</li>';
	}
	addTutorialText(key, text) {
		this.tutorialString += '<li>' + key + ': ' + text + '</li>';
	}
	addTutorialImg(imgPath) {
		this.tutorialString += '</ul><img src="' + imgPath + '"/>';
	}
	addTutorialTitle(text) {
		this.tutorialString += "<h3>" + text + "</h3><ul>";
	}

	onSelect() {
		if (this.mainButton != undefined)
			this.mainButton.parentElement.classList.add("selected");
		this.isSelected = true;

		// Update the cursor
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

		// Reset the topbar
		TopMenuModule.resetInfos();
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

	onStart(mousePos, mouseTarget) {
		this.startMousePos = mousePos;
	}
    
	onDrag(mousePos, mouseTarget) {
    }
    
	onEnd(mousePos, mouseTarget) {
        this.endMousePos = mousePos;
        FileManager.localStorageSave();
	}
}