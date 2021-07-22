// REFACTOR: add to single Tool implementations
//pencil
Events.on('click',"pencil-button", function(){
    tool.pencil.switchTo();
}, false);

//pencil bigger
Events.on('click',"pencil-bigger-button", function(){
    tool.pencil.brushSize++;
}, false);

//pencil smaller
Events.on('click',"pencil-smaller-button", function(){
    if(tool.pencil.brushSize > 1)
    	tool.pencil.brushSize--;
}, false);

//eraser
Events.on('click',"eraser-button", function(){
    console.log("selecting eraser");
    tool.eraser.switchTo();
}, false);

//eraser bigger
Events.on('click',"eraser-bigger-button", function(){
    tool.eraser.brushSize++;
}, false);

//eraser smaller
Events.on('click',"eraser-smaller-button", function(e){
    if(tool.eraser.brushSize > 1)
    	tool.eraser.brushSize--;
}, false);

// rectangle
Events.on('click','rectangle-button', function(e){
    // If the user clicks twice on the button, they change the draw mode
    if (currentTool.name == 'rectangle') {
        if (rectangleDrawMode == 'empty') {
            rectangleDrawMode = 'fill';
            setRectToolSvg();
        }
        else {
            rectangleDrawMode = 'empty';
            setRectToolSvg();
        }
    }
    else {
        tool.rectangle.switchTo();
    }
}, false);

// ellipse
Events.on('click','ellipse-button', function(e){
    // If the user clicks twice on the button, they change the draw mode
    if (currentTool.name == 'ellipse') {
        if (ellipseDrawMode == 'empty') {
            ellipseDrawMode = 'fill';
            setEllipseToolSvg();
        }
        else {
            ellipseDrawMode = 'empty';
            setEllipseToolSvg();
        }
    }
    else {
        tool.ellipse.switchTo();
    }
}, false);

// rectangle bigger
Events.on('click',"rectangle-bigger-button", function(){
    tool.rectangle.brushSize++;
}, false);

// rectangle smaller
Events.on('click',"rectangle-smaller-button", function(e){
    if(tool.rectangle.brushSize > 1)
    	tool.rectangle.brushSize--;
}, false);

// ellipse bigger
Events.on('click',"ellipse-bigger-button", function(){
    tool.ellipse.brushSize++;
}, false);

// ellipse smaller
Events.on('click',"ellipse-smaller-button", function(e){
    if(tool.ellipse.brushSize > 1)
        tool.ellipse.brushSize--;
}, false);

//fill
Events.on('click',"fill-button", function(){
    tool.fill.switchTo();
}, false);

//pan
Events.on('click',"pan-button", function(){
    tool.pan.switchTo();
}, false);

//eyedropper
Events.on('click',"eyedropper-button", function(){
	tool.eyedropper.switchTo();
}, false);

//rectangular selection button
Events.on('click', "rectselect-button", function(){
    tool.rectselect.switchTo();
}, false);

//line
Events.on('click',"line-button", function(){
    tool.line.switchTo();
}, false);

Events.on('click',"line-bigger-button", function(){
    tool.line.brushSize++;
}, false);

Events.on('click',"line-smaller-button", function(){
    if(tool.line.brushSize > 1)
    	tool.line.brushSize--;
}, false);