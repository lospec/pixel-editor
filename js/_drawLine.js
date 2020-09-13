//draw a line between two points on canvas
function line(x0,y0,x1,y1, brushSize) {
	var dx = Math.abs(x1-x0);
	var dy = Math.abs(y1-y0);
	var sx = (x0 < x1 ? 1 : -1);
	var sy = (y0 < y1 ? 1 : -1);
	var err = dx-dy;

	while (true) {
	    //set pixel
		// If the current tool is the brush
		if (currentTool.name == 'pencil' || currentTool.name == 'rectangle') {
			// I fill the rect
			currentLayer.context.fillRect(x0-Math.floor(brushSize/2), y0-Math.floor(brushSize/2), brushSize, brushSize);
		} else if (currentTool.name == 'eraser') {
			// In case I'm using the eraser I must clear the rect
            currentLayer.context.clearRect(x0-Math.floor(tool.eraser.brushSize/2), y0-Math.floor(tool.eraser.brushSize/2), tool.eraser.brushSize, tool.eraser.brushSize);
		}

		//if we've reached the end goal, exit the loop
		if ((x0==x1) && (y0==y1)) break;
		var e2 = 2*err;

		if (e2 >-dy) {
			err -=dy; 
			x0+=sx;
		}

		if (e2 < dx) {
			err +=dx; 
			y0+=sy;
		}
	}
}