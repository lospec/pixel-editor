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

    const brushSize = 1;

	
    if (currentTool.name !== 'line') return;

    currentLayer.context.fillRect(x0-Math.floor(brushSize/2), y0-Math.floor(brushSize/2), brushSize, brushSize);
	
}