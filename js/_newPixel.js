let firstPixel = true;

function newPixel (width, height, palette) {
	if (firstPixel) {
		layerList = document.getElementById("layers-menu");
		layerListEntry = layerList.firstElementChild;

		// Setting up the current layer
	    currentLayer = new Layer(width, height, canvas, layerListEntry);
	    canvas.style.zIndex = 2;
	}
	else {
		let nLayers = layers.length;
		for (let i=2; i < layers.length - 2; i++) {
			let currentEntry = layers[i].menuEntry;
			let associatedLayer;

			if (currentEntry != null) {
				// Getting the associated layer
				associatedLayer = getLayerByID(currentEntry.id);

				// Deleting its canvas
				associatedLayer.canvas.remove();

				// Adding the id to the unused ones
				unusedIDs.push(currentEntry.id);
				// Removing the entry from the menu
				currentEntry.remove();
			}
		}

		// Removing the old layers from the list
		for (let i=2; i<nLayers - 2; i++) {
			layers.splice(2, 1);
		}

		// Setting up the current layer
	    layers[1] = new Layer(width, height, layers[1].canvas, layers[1].menuEntry);
	    currentLayer = layers[1];

	    canvas = currentLayer.canvas;
	    context = currentLayer.context;
	    canvas.style.zIndex = 2;
	}

    // Adding the checkerboard behind it
    checkerBoard = new Layer(width, height, checkerBoardCanvas);

    // Creating the vfx layer on top of everything
    VFXLayer = new Layer(width, height, VFXCanvas);

    // Tmp layer to draw previews on
    TMPLayer = new Layer(width, height, TMPCanvas);

	canvasSize = currentLayer.canvasSize;

	if (firstPixel) {
		// Cloning the entry so that when I change something on the first layer, those changes aren't 
	    // propagated to the other ones
	    layerListEntry = layerListEntry.cloneNode(true);
		// Adding the first layer and the checkerboard to the list of layers
		layers.push(checkerBoard);
		layers.push(currentLayer);
		layers.push(VFXLayer);
		layers.push(TMPLayer);
	}

	//remove current palette
	colors = document.getElementsByClassName('color-button');
	while (colors.length > 0) {
		colors[0].parentElement.remove();
	}

	//add colors from selected palette
	var selectedPalette = getText('palette-button');
	if (selectedPalette != 'Choose a palette...') {

		//if this palette isnt the one specified in the url, then reset the url
		if (!palettes[selectedPalette].specified)
		  history.pushState(null, null, '/pixel-editor/app');

		//fill the palette with specified palette
		createColorPalette(palettes[selectedPalette].colors,true);
		fillCheckerboard();
	}
	else {
	  //this wasn't a specified palette, so reset the url
	  history.pushState(null, null, '/pixel-editor/app');

	  //generate default colors
	  var fg = hslToRgb(Math.floor(Math.random()*255), 230,70);
	  var bg = hslToRgb(Math.floor(Math.random()*255), 230,170);

	  //convert colors to hex
	  var defaultForegroundColor = rgbToHex(fg.r,fg.g,fg.b);
	  var defaultBackgroundColor = rgbToHex(bg.r,bg.g,bg.b);

	  //add colors to paletee
	  addColor(defaultForegroundColor).classList.add('selected');
	  addColor(defaultBackgroundColor);

    	//fill background of canvas with bg color
		fillCheckerboard();

		//set current drawing color as foreground color
		currentLayer.context.fillStyle = '#'+defaultForegroundColor;
		currentGlobalColor = '#' + defaultForegroundColor;
		selectedPalette = 'none';
	}

	//reset undo and redo states
	undoStates = [];
	redoStates = [];

	closeDialogue();
	currentTool.updateCursor();

	document.getElementById('save-as-button').classList.remove('disabled');
	documentCreated = true;

	firstPixel = false;
}