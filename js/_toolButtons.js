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

// ellipse bigger
Events.on('click',"ellipse-bigger-button", function(){
    tool.ellipse.brushSize++;
}, false);

// ellipse smaller
Events.on('click',"ellipse-smaller-button", function(e){
    if(tool.ellipse.brushSize > 1)
        tool.ellipse.brushSize--;
}, false);

//pan
Events.on('click',"pan-button", function(){
    tool.pan.switchTo();
}, false);

//rectangular selection button
Events.on('click', "rectselect-button", function(){
    tool.rectselect.switchTo();
}, false);