//draw a line between two points on canvas
function line(x0,y0,x1,y1) {
	
	var dx = Math.abs(x1-x0);
	var dy = Math.abs(y1-y0);
	var sx = (x0 < x1 ? 1 : -1);
	var sy = (y0 < y1 ? 1 : -1);
	var err = dx-dy;

	while (true) {
		console.log("drawing line");
	    //set pixel
		if (currentTool == 'pencil') {
			context.fillRect(x0-Math.floor(brushSize/2), y0-Math.floor(brushSize/2), brushSize, brushSize);
		} else if (currentTool == 'eraser') {
            context.fillRect(x0-Math.floor(brushSize/2), y0-Math.floor(brushSize/2), brushSize, brushSize);
		}
		
		//if we've reached the end goal, exit the loop
		if ((x0==x1) && (y0==y1)) break;
		var e2 = 2*err;
		if (e2 >-dy) {err -=dy; x0+=sx;}
		if (e2 < dx) {err +=dx; y0+=sy;}
	}
}