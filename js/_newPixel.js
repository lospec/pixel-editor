
function newPixel (width, height, palette) {
  
	canvasSize = [width,height];

	var maxHorizontalZoom = Math.floor(window.innerWidth/canvasSize[0]*0.75);
	var maxVerticalZoom = Math.floor(window.innerHeight/canvasSize[1]*0.75);

	zoom = Math.min(maxHorizontalZoom,maxVerticalZoom);
	if (zoom < 1) zoom = 1;
	
	//resize canvas
	canvas.width = canvasSize[0];
	canvas.height = canvasSize[1];
	canvas.style.width = (canvas.width*zoom)+'px';
	canvas.style.height = (canvas.height*zoom)+'px';
	
	//unhide canvas
	canvas.style.display = 'block';
	
	//center canvas in window
	canvas.style.left = 64+canvasView.clientWidth/2-(canvasSize[0]*zoom/2)+'px';
	canvas.style.top = 48+canvasView.clientHeight/2-(canvasSize[1]*zoom/2)+'px';

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
		/*
		context.fillStyle = '#'+defaultBackgroundColor;
		context.fillRect(0, 0, canvasSize[0], canvasSize[1]);
		
		console.log('#'+defaultBackgroundColor)
		*/
		
		//set current drawing color as foreground color
		context.fillStyle = '#'+defaultForegroundColor;
		selectedPalette = 'none';
	}
		
	//reset undo and redo states
	undoStates = [];
	redoStates = [];
		
	closeDialogue();
	updateCursor();
	
	document.getElementById('save-as-button').classList.remove('disabled');
	documentCreated = true;
	
}