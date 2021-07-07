let firstPixel = true;

/** Creates a new, empty file
 * 
 * @param {*} width Start width of the canvas
 * @param {*} height Start height of the canvas
 * @param {*} editorMode The editor mode chosen by the user (advanced or basic)
 * @param {*} fileContent If fileContent != null, then the newPixel is being called from the open menu
 */
function newPixel (width, height, editorMode, fileContent = null) {
	// Saving the editor mode
	pixelEditorMode = editorMode;

	// The palette is empty, at the beginning
	ColorModule.currentPalette.length = 0;

	// If this is the first pixel I'm creating since the app has started
	if (firstPixel) {
		// I configure the layers elements
		layerListEntry = layerList.firstElementChild;

		// Creating the first layer
	    currentLayer = new Layer(width, height, canvas, layerListEntry);
	    currentLayer.canvas.style.zIndex = 2;
	}
	else {
		// If it's not the first Pixel, I have to reset the app

		// Deleting all the extra layers and canvases, leaving only one
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
		
		// Updating canvas size to the new size
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
	// Setting the general canvasSize
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
	var selectedPalette;
	if (!firstPixel)
		var selectedPalette = getText('palette-button');
	else
		var selectedPalette = getText('palette-button-splash');

	// If the user selected a palette and isn't opening a file, I load the selected palette
	if (selectedPalette != 'Choose a palette...' && fileContent == null) {
		console.log('HELO', selectedPalette, palettes[selectedPalette])
		//if this palette isnt the one specified in the url, then reset the url
		if (!palettes[selectedPalette].specified)
		  history.pushState(null, null, '/pixel-editor');
		
		//fill the palette with specified colours
		createColorPalette(palettes[selectedPalette].colors,true);
	}
	// Otherwise, I just generate 2 semirandom colours
	else if (fileContent == null) {
		//this wasn't a specified palette, so reset the url
		history.pushState(null, null, '/pixel-editor');

		//generate default colors
		var fg = hslToRgb(Math.floor(Math.random()*255), 230,70);
		var bg = hslToRgb(Math.floor(Math.random()*255), 230,170);

		//convert colors to hex
		var defaultForegroundColor = rgbToHex(fg.r,fg.g,fg.b);
		var defaultBackgroundColor = rgbToHex(bg.r,bg.g,bg.b);

		//add colors to palette
		ColorModule.addColor(defaultForegroundColor).classList.add('selected');
		ColorModule.addColor(defaultBackgroundColor);

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

	// Closing the "New Pixel dialogue"
	closeDialogue();
	// Updating the cursor of the current tool
	currentTool.updateCursor();

	// The user is now able to export the Pixel
	document.getElementById('export-button').classList.remove('disabled');
	documentCreated = true;

	// This is not the first Pixel anymore
	firstPixel = false;

	// Now, if I opened an LPE file
	if (fileContent != null) {
		// I add every layer the file had in it
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

	// Applying the correct editor mode
	if (pixelEditorMode == 'Basic') {
		switchMode(false);
	}
	else {
		switchMode(false);
	}

	// Resetting history
	undoStates = [];
	redoStates = [];
}

function newFromTemplate(preset, x, y) {
	if (preset != '') {
		const presetProperties = PresetModule.propertiesOf(preset);
		Util.setText('palette-button-splash', presetProperties.palette);
		Util.setText('palette-button', presetProperties.palette);

		x = presetProperties.width;
		y = presetProperties.height;
	}
	newPixel(x, y, pixelEditorMode == 'Advanced' ? 'Basic' : 'Advanced');
}