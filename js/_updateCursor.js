
//set the correct cursor for the current tool
function updateCursor () {
	if (currentTool == 'pencil' || currentTool == 'resize-brush') {
		canvasView.style.cursor = 'crosshair';
		brushPreview.style.display = 'block';
		brushPreview.style.width = brushSize * zoom + 'px';
		brushPreview.style.height = brushSize * zoom + 'px';
	} else if (currentTool == 'eraser') {
		console.log("Eraser size: " + eraserSize);
        canvasView.style.cursor = 'crosshair';
        brushPreview.style.display = 'block';
        brushPreview.style.width = eraserSize * zoom + 'px';
        brushPreview.style.height = eraserSize * zoom + 'px';
	} else
		brushPreview.style.display = 'none';
	
	if (currentTool == 'eyedropper') {
		canvasView.style.cursor = "url('/pixel-editor/eyedropper.png'), auto";
	} else 
		eyedropperPreview.style.display = 'none';
	
	if (currentTool == 'pan') 
		if (dragging)
			canvasView.style.cursor = "url('/pixel-editor/pan-held.png'), auto";
		else
			canvasView.style.cursor = "url('/pixel-editor/pan.png'), auto";
		
	if (currentTool == 'fill') 
		canvasView.style.cursor = "url('/pixel-editor/fill.png'), auto";
		
	if (currentTool == 'zoom') 
		canvasView.style.cursor = "url('/pixel-editor/zoom-in.png'), auto";
		
	if (currentTool == 'resize-brush') 
		canvasView.style.cursor = 'default';
}