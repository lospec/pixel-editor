//pencil
on('click',"pencil-button", function(){
    tool.pencil.switchTo();
}, false);

//pencil bigger
on('click',"pencil-bigger-button", function(){
    tool.pencil.brushSize++;
}, false);

//pencil smaller
on('click',"pencil-smaller-button", function(){
    if(tool.pencil.brushSize > 1)
    	tool.pencil.brushSize--;
}, false);

//eraser
on('click',"eraser-button", function(){
    tool.eraser.switchTo();
}, false);

//eraser bigger
on('click',"eraser-bigger-button", function(){
    tool.eraser.brushSize++;
}, false);

//eraser smaller
on('click',"eraser-smaller-button", function(e){
    if(tool.eraser.brushSize > 1)
    	tool.eraser.brushSize--;
}, false);

// rectangle
on('click',"rectangle-button", function(){
    // If the user clicks twice on the button, they change the draw mode
    if (currentTool.name == 'rectangle') {
        if (drawMode == 'empty') {
            drawMode = 'fill';
            setRectToolSvg();
        }
        else {
            drawMode = 'empty';
            setRectToolSvg();
        }
    }
    else {
        tool.rectangle.switchTo();
    }
}, false);

// rectangle bigger
on('click',"rectangle-bigger-button", function(){
    tool.rectangle.brushSize++;
}, false);

// rectangle smaller
on('click',"rectangle-smaller-button", function(e){
    if(tool.rectangle.brushSize > 1)
    	tool.rectangle.brushSize--;
}, false);

//fill
on('click',"fill-button", function(){
    tool.fill.switchTo();
}, false);

//pan
on('click',"pan-button", function(){
    tool.pan.switchTo();
}, false);

//eyedropper
on('click',"eyedropper-button", function(){
	tool.eyedropper.switchTo();
}, false);

//zoom tool button
on('click',"zoom-button", function(){
	tool.zoom.switchTo();
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
    tool.rectselect.switchTo();
}, false);

/*global on */