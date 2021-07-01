/** Changes the zoom level of the canvas
 * @param {*} direction 'in' or 'out'
 * @param {*} cursorLocation The position of the cursor when the user zoomed
 */
function changeZoom (direction, cursorLocation) {
	// Computing current width and height
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
		layers[0].setCanvasOffset(
			layers[0].canvas.offsetLeft + (oldWidth - newWidth) * cursorLocation[0]/oldWidth, 
			layers[0].canvas.offsetTop + (oldHeight - newHeight) * cursorLocation[1]/oldWidth);
	}
	//if you want to zoom in
	else if (direction == 'in' && zoom + Math.ceil(zoom/10) < window.innerHeight/4){
		zoom += Math.ceil(zoom/10);
		newWidth = canvasSize[0] * zoom;
		newHeight = canvasSize[1] * zoom;

		//adjust canvas position
		layers[0].setCanvasOffset(
			layers[0].canvas.offsetLeft - Math.round((newWidth - oldWidth)*cursorLocation[0]/oldWidth), 
			layers[0].canvas.offsetTop - Math.round((newHeight - oldHeight)*cursorLocation[1]/oldHeight));
	}

	//resize canvas
	layers[0].resize();

	// adjust brush size
	currentTool.updateCursor();
}
