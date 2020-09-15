let firstPixel = true;

// Set the default palettes
palettes["Commodore 64"] = {"name":"Commodore 64","author":"","colors":["000000","626262","898989","adadad","ffffff","9f4e44","cb7e75","6d5412","a1683c","c9d487","9ae29b","5cab5e","6abfc6","887ecb","50459b","a057a3"]}
palettes["PICO-8"] = {"name":"PICO-8","author":"","colors":["000000","1D2B53","7E2553","008751","AB5236","5F574F","C2C3C7","FFF1E8","FF004D","FFA300","FFEC27","00E436","29ADFF","83769C","FF77A8","FFCCAA"]}
palettes["Gameboy Color"] = {"name":"Nintendo Gameboy (Black Zero)","author":"","colors":["2e463d","385d49","577b46","7e8416"]}

function newPixel (width, height, editorMode, fileContent = null) {
	pixelEditorMode = editorMode;

	currentPalette = [];
	if (firstPixel) {
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