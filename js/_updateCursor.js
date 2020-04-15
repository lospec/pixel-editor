

//set the correct cursor for the current tool
Tool.prototype.updateCursor = function () {

	console.log('updateCursor()', currentTool)

	//switch to that tools cursor
	canvasView.style.cursor = this.cursor || 'default';

	//if the tool uses a brush preview, make it visible and update the size
	if (this.brushPreview) {
		console.log('brush size',this.currentBrushSize)
		brushPreview.style.display = 'block';
        brushPreview.style.width = this.currentBrushSize * zoom + 'px';
        brushPreview.style.height = this.currentBrushSize * zoom + 'px';
	}

	//show / hide eyedropper color preview
	if (this.eyedropperPreview) eyedropperPreview.style.display = 'block';
	else eyedropperPreview.style.display = 'none';

	//moveSelection
	if (currentTool.name == 'moveselection') {
		if (cursorInSelectedArea()) {
			canMoveSelection = true;
			canvasView.style.cursor = 'move';
			brushPreview.style.display = 'none';
		}
		else {
			canvasView.style.cursor = 'crosshair';
		}
	}
}

/*global Tool, dragging, canvasView, brushPreview, canMoveSelection, cursorInSelectedArea, eyedropperPreview, zoom, currentTool */