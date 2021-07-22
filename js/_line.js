function diagLine(lastMouseClickPos, zoom, cursorLocation) {

    let x0 = Math.floor(lastMouseClickPos[0]/zoom);
    let y0 = Math.floor(lastMouseClickPos[1]/zoom);
    let x1 = Math.floor(cursorLocation[0]/zoom);
    let y1 = Math.floor(cursorLocation[1]/zoom);

	let dx = Math.abs(x1-x0);
	let dy = Math.abs(y1-y0);
	let sx = (x0 < x1 ? 1 : -1);
	let sy = (y0 < y1 ? 1 : -1);
    let err = dx-dy;

    const brushSize = tool.line.brushSize;
    
    const canvas = document.getElementById('tmp-canvas');
    const context = canvas.getContext('2d');

	context.clearRect(0, 0, canvas.width, canvas.height);
	canvas.style.zIndex = parseInt(currentLayer.canvas.style.zIndex, 10) + 1;

	//console.log(canvas.style.zIndex, currentLayer.canvas.style.zIndex);

	while (true) {
        if (currentTool.name !== 'line') return;

        context.fillRect(x0-Math.floor(brushSize/2), y0-Math.floor(brushSize/2), brushSize, brushSize);

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