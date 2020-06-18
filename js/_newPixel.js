function newPixel (width, height, palette) {
	layerList = document.getElementById("layers-menu");
	layerListEntry = layerList.firstElementChild;

	console.log("Layer entry: " + layerListEntry);
    // Setting up the current layer
    currentLayer = new Layer(width, height, canvas, layerListEntry);

    // Adding the checkerboard behind it
    checkerBoard = new Layer(width, height, checkerBoardCanvas);

    // Creating the vfx layer on top of everything
    VFXLayer = new Layer(width, height, VFXCanvas);

    // Tmp layer to draw previews on
    TMPLayer = new Layer(width, height, TMPCanvas);

	canvasSize = currentLayer.canvasSize;

	// Adding the first layer and the checkerboard to the list of layers
	layers.push(checkerBoard);
	layers.push(currentLayer);
	layers.push(VFXLayer);
	layers.push(TMPLayer);

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

}
