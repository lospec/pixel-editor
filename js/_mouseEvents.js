
//mousedown - start drawing
window.addEventListener("mousedown", function (mouseEvent) {
	
	//if no document has been created yet, or this is a dialog open
	if (!documentCreated || dialogueOpen) return;
	//prevent right mouse clicks and such, which will open unwanted menus
	//mouseEvent.preventDefault();
	
	lastPos = getCursorPosition(mouseEvent);
	
	dragging = true;
	//left or right click
	if (mouseEvent.which == 1) {
						
		if (spacePressed) 
			currentTool = 'pan';
		else if (mouseEvent.altKey) 
			currentTool = 'eyedropper';
		else if (mouseEvent.target == currentLayer.canvas && (currentTool == 'pencil' || currentTool == 'eraser'))
		    new HistoryStateEditCanvas();
		    //saveHistoryState({type: 'canvas', canvas: context.getImageData(0, 0, canvasSize[0], canvasSize[1])});
		
		updateCursor();
		
		draw(mouseEvent);
	}
	else if (currentTool == 'pencil' && mouseEvent.which == 3) {
		currentTool = 'resize-brush';
		prevBrushSize=brushSize;
	}
	// TODO add eraser resize for scroll wheel
	
	if (currentTool == 'eyedropper' && mouseEvent.target == currentLayer.canvas)
	    eyedropperPreview.style.display = 'block';
	
	return false;
}, false);



//mouseup - end drawing
window.addEventListener("mouseup", function (mouseEvent) {
	
	closeMenu();
	
	if (!documentCreated || dialogueOpen) return;
	
	if (currentTool == 'eyedropper' && mouseEvent.target == currentLayer.canvas) {
		var cursorLocation = getCursorPosition(mouseEvent);
		var selectedColor = context.getImageData(Math.floor(cursorLocation[0]/zoom),Math.floor(cursorLocation[1]/zoom),1,1);
		var newColor = rgbToHex(selectedColor.data[0],selectedColor.data[1],selectedColor.data[2]);
		
		console.log(newColor);
		
		var colors = document.getElementsByClassName('color-button');
    for (var i = 0; i < colors.length; i++) {
      console.log(colors[i].jscolor.toString());
      
      //if picked color matches this color
      if (newColor == colors[i].jscolor.toString()) {
        console.log('color found');
        
        //remove current color selection
        var selectedColor = document.querySelector("#colors-menu li.selected")
        if (selectedColor) selectedColor.classList.remove("selected");
        
      	//set current color
      	context.fillStyle = '#'+newColor;
      	
      	//make color selected
      	colors[i].parentElement.classList.add('selected');
        
        //hide eyedropper
        eyedropperPreview.style.display = 'none';
      }
    }
		
		
	}
	else if (currentTool == 'fill' && mouseEvent.target == currentLayer.canvas) {
	  console.log('filling')
	  //if you clicked on anything but the canvas, do nothing
		if (!mouseEvent.target == currentLayer.canvas) return;
		
		//get cursor postion
		var cursorLocation = getCursorPosition(mouseEvent);
		
		//offset to match cursor point
		cursorLocation[0] += 2;
		cursorLocation[1] += 12;
		
    //fill starting at the location
		fill(cursorLocation);
	}
	else if (currentTool == 'zoom') {
		let mode;
		if (mouseEvent.which == 1){
			mode = "in";
        }
		else if (mouseEvent.which == 3){
			mode = "out";
        }

        changeZoom(layers[0], mode, getCursorPosition(mouseEvent));

        for (let i=1; i<layers.length; i++) {
			layers[i].copyData(layers[0]);
        }
	}

	dragging = false;
	currentTool = currentToolTemp;
	
	updateCursor();

	
}, false);


//mouse is moving on canvas		
window.addEventListener("mousemove", draw, false);
function draw (mouseEvent) {
	var cursorLocation = getCursorPosition(mouseEvent);
	
	//if a document hasnt yet been created, exit this function
	if (!documentCreated || dialogueOpen) return;
	
	
	eyedropperPreview.style.display = 'none';
	
	if (currentTool == 'pencil') {
	
		//move the brush preview
		brushPreview.style.left = cursorLocation[0] + currentLayer.canvas.offsetLeft - brushSize * zoom / 2 + 'px';
		brushPreview.style.top = cursorLocation[1] + currentLayer.canvas.offsetTop - brushSize * zoom / 2 + 'px';
		
		//hide brush preview outside of canvas / canvas view
		if (mouseEvent.target == currentLayer.canvas || mouseEvent.target == canvasView)
		  brushPreview.style.visibility = 'visible';
		else
		  brushPreview.style.visibility = 'hidden';

		//draw line to current pixel
		if (dragging) {
			if (mouseEvent.target == currentLayer.canvas || mouseEvent.target == canvasView) {
				line(Math.floor(lastPos[0]/zoom),Math.floor(lastPos[1]/zoom),Math.floor(cursorLocation[0]/zoom),Math.floor(cursorLocation[1]/zoom));
				lastPos = cursorLocation;
			}
		}
		
		//get lightness value of color
		var selectedColor = context.getImageData(Math.floor(cursorLocation[0]/zoom),Math.floor(cursorLocation[1]/zoom),1,1).data;
		var colorLightness = Math.max(selectedColor[0],selectedColor[1],selectedColor[2])
		
		//for the darkest 50% of colors, change the brush preview to dark mode
		if (colorLightness>127) brushPreview.classList.remove('dark');
		else brushPreview.classList.add('dark');
	}
	// Decided to write a different implementation in case of differences between the brush and the eraser tool
	else if (currentTool == 'eraser') {
        //move the brush preview
        brushPreview.style.left = cursorLocation[0] + canvas.offsetLeft - brushSize * zoom / 2 + 'px';
        brushPreview.style.top = cursorLocation[1] + canvas.offsetTop - brushSize * zoom / 2 + 'px';

        //hide brush preview outside of canvas / canvas view
        if (mouseEvent.target == currentLayer.canvas || mouseEvent.target == canvasView)
            brushPreview.style.visibility = 'visible';
        else
            brushPreview.style.visibility = 'hidden';

        //draw line to current pixel
        if (dragging) {
            if (mouseEvent.target == currentLayer.canvas || mouseEvent.target == canvasView) {
                line(Math.floor(lastPos[0]/zoom),Math.floor(lastPos[1]/zoom),Math.floor(cursorLocation[0]/zoom),Math.floor(cursorLocation[1]/zoom));
                lastPos = cursorLocation;
            }
        }
	}
	else if (currentTool == 'pan' && dragging) {

		for (let i=0; i<layers.length; i++) {
            setCanvasOffset(layers[i].canvas, layers[i].canvas.offsetLeft + (cursorLocation[0] - lastPos[0]), layers[i].canvas.offsetTop + (cursorLocation[1] - lastPos[1]))
        }
    }
    else if (currentTool == 'eyedropper' && dragging && mouseEvent.target == currentLayer.canvas) {
        var selectedColor = context.getImageData(Math.floor(cursorLocation[0]/zoom),Math.floor(cursorLocation[1]/zoom),1,1).data;
        eyedropperPreview.style.borderColor = '#'+rgbToHex(selectedColor[0],selectedColor[1],selectedColor[2]);
        eyedropperPreview.style.display = 'block';
       
        eyedropperPreview.style.left = cursorLocation[0] + currentLayer.canvas.offsetLeft - 30 + 'px';
        eyedropperPreview.style.top = cursorLocation[1] + currentLayer.canvas.offsetTop - 30 + 'px';
        
        var colorLightness = Math.max(selectedColor[0],selectedColor[1],selectedColor[2]);
        
        //for the darkest 50% of colors, change the eyedropper preview to dark mode
		if (colorLightness>127) eyedropperPreview.classList.remove('dark');
		else eyedropperPreview.classList.add('dark');
    }
    else if (currentTool == 'resize-brush' && dragging) {
       
        //get new brush size based on x distance from original clicking location
        var distanceFromClick = cursorLocation[0] - lastPos[0];
        //var roundingAmount = 20 - Math.round(distanceFromClick/10);
        //this doesnt work in reverse...  because... it's not basing it off of the brush size which it should be
        var brushSizeChange = Math.round(distanceFromClick/10);
		var newBrushSize = prevBrushSize + brushSizeChange;
		
		//set the brush to the new size as long as its bigger than 1
		brushSize = Math.max(1,newBrushSize);
		
		//fix offset so the cursor stays centered
		brushPreview.style.left = lastPos[0] + currentLayer.canvas.offsetLeft - brushSize * zoom / 2 + 'px';
		brushPreview.style.top = lastPos[1] + currentLayer.canvas.offsetTop - brushSize * zoom / 2 + 'px';

		updateCursor();
	}
}

//mousewheel scrroll
canvasView.addEventListener("wheel", function(mouseEvent){
	
	if (currentTool == 'zoom' || mouseEvent.altKey) {
		let mode;
		if (mouseEvent.deltaY < 0){
			mode = 'in';
        }
		else if (mouseEvent.deltaY > 0) {
			mode = 'out';
        }

        // Changing zoom and position of the first layer
        changeZoom(layers[0], mode, getCursorPosition(mouseEvent))

        for (let i=1; i<layers.length; i++) {
			// Copying first layer's data into the other layers
            layers[i].copyData(layers[0]);
		}
	}
		
});