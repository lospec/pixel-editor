let firstPixel = true;

function newPixel (width, height, editorMode, fileContent = null) {
	pixelEditorMode = editorMode;

	currentPalette = [];
	if (firstPixel) {
		layerListEntry = layerList.firstElementChild;

	    currentLayer = new Layer(width, height, canvas, layerListEntry);
	    currentLayer.canvas.style.zIndex = 2;
	}
	else {
		let nLayers = layers.length;
		for (let i=2; i < layers.length - nAppLayers; i++) {
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
		for (let i=2; i<nLayers - nAppLayers; i++) {
			layers.splice(2, 1);
		}

		// Setting up the current layer
	    layers[1] = new Layer(width, height, layers[1].canvas, layers[1].menuEntry);
	    currentLayer = layers[1];

		currentLayer.canvas.style.zIndex = 2;
		
		// Updating canvas size
		for (let i=0; i<nLayers; i++) {
			layers[i].canvasSize = [width, height];
		}
	}

    // Adding the checkerboard behind it
    checkerBoard = new Layer(width, height, checkerBoardCanvas);

    // Creating the vfx layer on top of everything
    VFXLayer = new Layer(width, height, VFXCanvas);

    // Tmp layer to draw previews on
	TMPLayer = new Layer(width, height, TMPCanvas);
	
	// Pixel grid
	pixelGrid = new Layer(width, height, pixelGridCanvas);

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
		layers.push(pixelGrid);
	}

	//remove current palette
	colors = document.getElementsByClassName('color-button');
	while (colors.length > 0) {
		colors[0].parentElement.remove();
	}

	//add colors from selected palette
	var selectedPalette = getText('palette-button');
	if (selectedPalette != 'Choose a palette...' && fileContent == null) {

		//if this palette isnt the one specified in the url, then reset the url
		if (!palettes[selectedPalette].specified)
		  history.pushState(null, null, '/pixel-editor/app');

		//fill the palette with specified palette
		createColorPalette(palettes[selectedPalette].colors,true);
	}
	else if (fileContent == null) {
		//this wasn't a specified palette, so reset the url
		history.pushState(null, null, '/pixel-editor/app');

		//generate default colors
		var fg = hslToRgb(Math.floor(Math.random()*255), 230,70);
		var bg = hslToRgb(Math.floor(Math.random()*255), 230,170);

		//convert colors to hex
		var defaultForegroundColor = rgbToHex(fg.r,fg.g,fg.b);
		var defaultBackgroundColor = rgbToHex(bg.r,bg.g,bg.b);

		//add colors to palette
		addColor(defaultForegroundColor).classList.add('selected');
		addColor(defaultBackgroundColor);

		//set current drawing color as foreground color
		currentLayer.context.fillStyle = '#'+defaultForegroundColor;
		currentGlobalColor = '#' + defaultForegroundColor;
		selectedPalette = 'none';
	}

	//fill background of canvas with bg color
	fillCheckerboard();
	fillPixelGrid();

	//reset undo and redo states
	undoStates = [];
	redoStates = [];

	closeDialogue();
	currentTool.updateCursor();

	document.getElementById('export-button').classList.remove('disabled');
	documentCreated = true;

	firstPixel = false;

	if (fileContent != null) {
		for (let i=0; i<fileContent['nLayers']; i++) {
			let layerData = fileContent['layer' + i];
			let layerImage = fileContent['layer' + i + 'ImageData'];

			if (layerData != null) {
				// Setting id
				let createdLayer = addLayer(layerData.id, false);
				// Setting name
				createdLayer.menuEntry.getElementsByTagName("p")[0].innerHTML = layerData.name;

				// Adding the image (I can do that because they're sorted by increasing z-index)
				let img = new Image();
				img.onload = function() {
					createdLayer.context.drawImage(img, 0, 0);
					createdLayer.updateLayerPreview();

					if (i == (fileContent['nLayers'] - 1)) {
						createPaletteFromLayers();
					}
				};

				img.src = layerImage;

				// Setting visibility and lock options
				if (!layerData.isVisible) {
					createdLayer.hide();
				}
				if (layerData.isLocked) {
					createdLayer.lock();
				}
			}
		}

		// Deleting the default layer
		deleteLayer(false);
	}

	if (pixelEditorMode == 'Basic') {
		switchMode('Advanced', false);
	}
	else {
		switchMode('Basic', false);
	}
}