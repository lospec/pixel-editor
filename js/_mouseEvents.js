
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
		else if (mouseEvent.target == canvas && currentTool == 'pencil')
		    new HistoryStateEditCanvas();
		    //saveHistoryState({type: 'canvas', canvas: context.getImageData(0, 0, canvasSize[0], canvasSize[1])});
		
		updateCursor();
		
		draw(mouseEvent);
	}
	else if (currentTool == 'pencil' && mouseEvent.which == 3) {
		currentTool = 'resize-brush';
		prevBrushSize=brushSize;
	}
	
	if (currentTool == 'eyedropper' && mouseEvent.target == canvas)
	    eyedropperPreview.style.display = 'block';
	
	return false;
}, false);



//mouseup - end drawing
window.addEventListener("mouseup", function (mouseEvent) {
	
	closeMenu();
	
	if (!documentCreated || dialogueOpen) return;
	
	if (currentTool == 'eyedropper' && mouseEvent.target == canvas) {
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
	else if (currentTool == 'fill' && mouseEvent.target == canvas) {
	  console.log('filling')
	  //if you clicked on anything but the canvas, do nothing
		if (!mouseEvent.target == canvas) return;
		
		//get cursor postion
		var cursorLocation = getCursorPosition(mouseEvent);
		
		//offset to match cursor point
		cursorLocation[0] += 2;
		cursorLocation[1] += 12;
		
    //fill starting at the location
		fill(cursorLocation);
	}
	else if (currentTool == 'zoom' && mouseEvent.target == canvas) {
		if (mouseEvent.which == 1) changeZoom('in', getCursorPosition(mouseEvent));
		else if (mouseEvent.which == 3) changeZoom('out', getCursorPosition(mouseEvent))
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
		brushPreview.style.left = cursorLocation[0] + canvas.offsetLeft - brushSize * zoom / 2 + 'px';
		brushPreview.style.top = cursorLocation[1] + canvas.offsetTop - brushSize * zoom / 2 + 'px';
		
		//hide brush preview outside of canvas / canvas view
		if (mouseEvent.target == canvas || mouseEvent.target == canvasView)
		  brushPreview.style.visibility = 'visible';
		else
		  brushPreview.style.visibility = 'hidden';

		//draw line to current pixel
		if (dragging) {
			if (mouseEvent.target == canvas || mouseEvent.target == canvasView) {
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
	else if (currentTool == 'pan' && dragging) {

		
		setCanvasOffset(canvas.offsetLeft + (cursorLocation[0] - lastPos[0]), canvas.offsetTop + (cursorLocation[1] - lastPos[1]))
		/*
		if 	(
			//right
			canvas.offsetLeft + (cursorLocation[0] - lastPos[0]) < window.innerWidth - canvasSize[0]*zoom*0.25 - 48 &&
			//left
			canvas.offsetLeft + (cursorLocation[0] - lastPos[0]) > -canvasSize[0]*zoom*0.75 + 64) 
				canvas.style.left = canvas.offsetLeft + (cursorLocation[0] - lastPos[0]) +'px';
			
		if (
			//bottom
			canvas.offsetTop + (cursorLocation[1] - lastPos[1]) < window.innerHeight-canvasSize[1]*zoom*0.25 &&
			//top
			canvas.offsetTop + (cursorLocation[1] - lastPos[1]) > -canvasSize[0]*zoom*0.75 + 48) 
				canvas.style.top = canvas.offsetTop + (cursorLocation[1] - lastPos[1]) +'px';
    	*/
    }
    else if (currentTool == 'eyedropper' && dragging && mouseEvent.target == canvas) {
        var selectedColor = context.getImageData(Math.floor(cursorLocation[0]/zoom),Math.floor(cursorLocation[1]/zoom),1,1).data;
        eyedropperPreview.style.borderColor = '#'+rgbToHex(selectedColor[0],selectedColor[1],selectedColor[2]);
        eyedropperPreview.style.display = 'block';
       
        eyedropperPreview.style.left = cursorLocation[0] + canvas.offsetLeft - 30 + 'px';
        eyedropperPreview.style.top = cursorLocation[1] + canvas.offsetTop - 30 + 'px';
        
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
		brushPreview.style.left = lastPos[0] + canvas.offsetLeft - brushSize * zoom / 2 + 'px';
		brushPreview.style.top = lastPos[1] + canvas.offsetTop - brushSize * zoom / 2 + 'px';

		updateCursor();
	}
}

//mousewheel scrroll
canvasView.addEventListener("wheel", function(mouseEvent){
	
	if (currentTool == 'zoom' || mouseEvent.altKey) {
		if (mouseEvent.deltaY < 0) changeZoom('in', getCursorPosition(mouseEvent));
		else if (mouseEvent.deltaY > 0) changeZoom('out', getCursorPosition(mouseEvent))
	}
		
});