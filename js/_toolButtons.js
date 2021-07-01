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
    console.log("selecting eraser");
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
on('click','rectangle-button', function(e){
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
on('click','ellipse-button', function(e){
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
on('click',"rectangle-bigger-button", function(){
    tool.rectangle.brushSize++;
}, false);

// rectangle smaller
on('click',"rectangle-smaller-button", function(e){
    if(tool.rectangle.brushSize > 1)
    	tool.rectangle.brushSize--;
}, false);

// ellipse bigger
on('click',"ellipse-bigger-button", function(){
    tool.ellipse.brushSize++;
}, false);

// ellipse smaller
on('click',"ellipse-smaller-button", function(e){
    if(tool.ellipse.brushSize > 1)
        tool.ellipse.brushSize--;
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

//rectangular selection button
on('click', "rectselect-button", function(){
    tool.rectselect.switchTo();
}, false);

//line
on('click',"line-button", function(){
    tool.line.switchTo();
}, false);

on('click',"line-bigger-button", function(){
    tool.line.brushSize++;
}, false);

on('click',"line-smaller-button", function(){
    if(tool.line.brushSize > 1)
    	tool.line.brushSize--;
}, false);


/*global on */
