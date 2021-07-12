//pencil
Input.on('click',"pencil-button", function(){
    tool.pencil.switchTo();
}, false);

//pencil bigger
Input.on('click',"pencil-bigger-button", function(){
    tool.pencil.brushSize++;
}, false);

//pencil smaller
Input.on('click',"pencil-smaller-button", function(){
    if(tool.pencil.brushSize > 1)
    	tool.pencil.brushSize--;
}, false);

//eraser
Input.on('click',"eraser-button", function(){
    console.log("selecting eraser");
    tool.eraser.switchTo();
}, false);

//eraser bigger
Input.on('click',"eraser-bigger-button", function(){
    tool.eraser.brushSize++;
}, false);

//eraser smaller
Input.on('click',"eraser-smaller-button", function(e){
    if(tool.eraser.brushSize > 1)
    	tool.eraser.brushSize--;
}, false);

// rectangle
Input.on('click','rectangle-button', function(e){
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
Input.on('click','ellipse-button', function(e){
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
Input.on('click',"rectangle-bigger-button", function(){
    tool.rectangle.brushSize++;
}, false);

// rectangle smaller
Input.on('click',"rectangle-smaller-button", function(e){
    if(tool.rectangle.brushSize > 1)
    	tool.rectangle.brushSize--;
}, false);

// ellipse bigger
Input.on('click',"ellipse-bigger-button", function(){
    tool.ellipse.brushSize++;
}, false);

// ellipse smaller
Input.on('click',"ellipse-smaller-button", function(e){
    if(tool.ellipse.brushSize > 1)
        tool.ellipse.brushSize--;
}, false);

//fill
Input.on('click',"fill-button", function(){
    tool.fill.switchTo();
}, false);

//pan
Input.on('click',"pan-button", function(){
    tool.pan.switchTo();
}, false);

//eyedropper
Input.on('click',"eyedropper-button", function(){
	tool.eyedropper.switchTo();
}, false);

//rectangular selection button
Input.on('click', "rectselect-button", function(){
    tool.rectselect.switchTo();
}, false);

//line
Input.on('click',"line-button", function(){
    tool.line.switchTo();
}, false);

Input.on('click',"line-bigger-button", function(){
    tool.line.brushSize++;
}, false);

Input.on('click',"line-smaller-button", function(){
    if(tool.line.brushSize > 1)
    	tool.line.brushSize--;
}, false);