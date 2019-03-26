
function changeZoom (direction, cursorLocation) {

	var oldWidth = canvasSize[0] * zoom;
	var oldHeight = canvasSize[1] * zoom;
	var newWidth, newHeight;
	
	//change zoom level
	//if you want to zoom out, and the zoom isnt already at the smallest level
	if (direction == 'out' && zoom > 1) {
		zoom -= Math.ceil(zoom / 10);
		newWidth = canvasSize[0] * zoom;
		newHeight = canvasSize[1] * zoom;
		
		//adjust canvas position
		setCanvasOffset(canvas.offsetLeft + (oldWidth - newWidth) *cursorLocation[0]/oldWidth, canvas.offsetTop + (oldHeight - newHeight) *cursorLocation[1]/oldWidth)
	}
	//if you want to zoom in
	else if (direction == 'in' && zoom + Math.ceil(zoom/10) < window.innerHeight/4){
		zoom += Math.ceil(zoom/10);
		newWidth = canvasSize[0] * zoom;
		newHeight = canvasSize[1] * zoom;
		
		//adjust canvas position
		setCanvasOffset(canvas.offsetLeft - Math.round((newWidth - oldWidth)*cursorLocation[0]/oldWidth), canvas.offsetTop - Math.round((newHeight - oldHeight)*cursorLocation[1]/oldHeight))
	}
	
	//resize canvas
	canvas.style.width = (canvas.width*zoom)+'px';
	canvas.style.height = (canvas.height*zoom)+'px';

	// adjust brush size
	updateCursor();
}