//pencil
on('click',"pencil-button", function(){
    changeTool('pencil');
}, false);

//pencil bigger
on('click',"pencil-bigger-button", function(){
    brushSize++;
    updateCursor();
}, false);

//pencil smaller
on('click',"pencil-smaller-button", function(){
    if(brushSize > 1) brushSize--;
    updateCursor();
}, false);

//eraser
on('click',"eraser-button", function(){
    changeTool('eraser');
}, false);

//eraser bigger
on('click',"eraser-bigger-button", function(){
    eraserSize++;
    updateCursor();
}, false);

//eraser smaller
on('click',"eraser-smaller-button", function(e){
    if(eraserSize > 1) eraserSize--;
    updateCursor();
}, false);

// rectangle
on('click',"rectangle-button", function(){
    // If the user clicks twice on the button, they change the draw mode
    if (currentTool == 'rectangle') {
        if (drawMode == 'empty') {
            drawMode = 'full';
        }
        else {
            drawMode = 'empty';
        }
    }
    else {
        changeTool('rectangle');
    }
}, false);

// rectangle bigger
on('click',"rectangle-bigger-button", function(){
    rectangleSize++;
    updateCursor();
}, false);

// rectangle smaller
on('click',"rectangle-smaller-button", function(e){
    if(rectangleSize > 1) rectangleSize--;
    updateCursor();
}, false);

//fill
on('click',"fill-button", function(){
    changeTool('fill');
}, false);	

//pan
on('click',"pan-button", function(){
    changeTool('pan');
}, false);	

//eyedropper
on('click',"eyedropper-button", function(){
	changeTool('eyedropper');
}, false);		

//zoom tool button
on('click',"zoom-button", function(){
	changeTool('zoom');
}, false);

//zoom in button
on('click',"zoom-in-button", function(){
	//changeZoom('in',[window.innerWidth/2-canvas.offsetLeft,window.innerHeight/2-canvas.offsetTop]);
    changeZoom(layers[0],'in', [canvasSize[0] * zoom / 2, canvasSize[1] * zoom / 2]);

    for (let i=1; i<layers.length; i++) {
        layers[i].copyData(layers[0]);
    }
}, false);

//zoom out button
on('click',"zoom-out-button", function(){
    changeZoom(layers[0],'out',[canvasSize[0]*zoom/2,canvasSize[1]*zoom/2]);

    for (let i=1; i<layers.length; i++) {
        layers[i].copyData(layers[0]);
    }
}, false);

//rectangular selection button
on('click', "rectselect-button", function(){
    changeTool('rectselect');
}, false);