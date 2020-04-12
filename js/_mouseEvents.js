var currentMouseEvent;
// TODO: replace every position calculation with lastMousePos
var lastMousePos;

//mousedown - start drawing
window.addEventListener('mousedown', function (mouseEvent) {
    // Saving the event in case something else needs it
    currentMouseEvent = mouseEvent;
    canDraw = true;

    //if no document has been created yet, or this is a dialog open
    if (!documentCreated || dialogueOpen) return;
    //prevent right mouse clicks and such, which will open unwanted menus
    //mouseEvent.preventDefault();

    lastPos = getCursorPosition(mouseEvent);

    dragging = true;
    // left or right click ?
    if (mouseEvent.which == 1) {
        if (spacePressed) 
            currentTool = 'pan';
        else if (mouseEvent.altKey) 
            currentTool = 'eyedropper';
        else if (mouseEvent.target.className == 'drawingCanvas' && 
            (currentTool == 'pencil' || currentTool == 'eraser' || currentTool == 'rectangle'))
            new HistoryStateEditCanvas();
        else if (currentTool == 'moveselection') {
            if (!cursorInSelectedArea()) {
                changeTool('pencil');
                canDraw = false;
            }
        }
        //saveHistoryState({type: 'canvas', canvas: context.getImageData(0, 0, canvasSize[0], canvasSize[1])});

        updateCursor();

        if (canDraw) {
            draw(mouseEvent);
        }
    }
    else if (currentTool == 'pencil' && mouseEvent.which == 3) {
        currentTool = 'resize-brush';
        prevBrushSize = pencilSize;
    }
    else if (currentTool == 'eraser' && mouseEvent.which == 3) {
        currentTool = 'resize-eraser';
        prevEraserSize = eraserSize;
    }
    else if (currentTool == 'rectangle' && mouseEvent.which == 3) {
        currentTool = 'resize-rectangle';
        prevRectangleSize = rectangleSize;
    }

    if (currentTool == 'eyedropper' && mouseEvent.target.className == 'drawingCanvas')
        eyedropperPreview.style.display = 'block';

    return false;
}, false);



//mouseup - end drawing
window.addEventListener('mouseup', function (mouseEvent) {
    // Saving the event in case something else needs it
    currentMouseEvent = mouseEvent;

    closeMenu();

    if (!documentCreated || dialogueOpen) return;

    if (currentTool == 'eyedropper' && mouseEvent.target.className == 'drawingCanvas') {
        var cursorLocation = getCursorPosition(mouseEvent);
        var selectedColor = context.getImageData(Math.floor(cursorLocation[0]/zoom),Math.floor(cursorLocation[1]/zoom),1,1);
        var newColor = rgbToHex(selectedColor.data[0],selectedColor.data[1],selectedColor.data[2]);

        currentGlobalColor = '#' + newColor;

        var colors = document.getElementsByClassName('color-button');
        for (var i = 0; i < colors.length; i++) {
            console.log(colors[i].jscolor.toString());

            //if picked color matches this color
            if (newColor == colors[i].jscolor.toString()) {
                console.log('color found');

                //remove current color selection
                var selectedColor = document.querySelector('#colors-menu li.selected');
                if (selectedColor) selectedColor.classList.remove('selected');

                //set current color
                context.fillStyle = '#'+newColor;

                //make color selected
                colors[i].parentElement.classList.add('selected');

                //hide eyedropper
                eyedropperPreview.style.display = 'none';
            }
        }
    }
    else if (currentTool == 'fill' && mouseEvent.target.className == 'drawingCanvas') {
        console.log('filling');
        //if you clicked on anything but the canvas, do nothing
        if (!mouseEvent.target == currentLayer.canvas) return;

        //get cursor postion
        var cursorLocation = getCursorPosition(mouseEvent);

        //offset to match cursor point
        cursorLocation[0] += 2;
        cursorLocation[1] += 12;

        //fill starting at the location
        fill(cursorLocation);
    }
    else if (currentTool == 'zoom' && mouseEvent.target.className == 'drawingCanvas') {
        let mode;
        if (mouseEvent.which == 1){
            mode = 'in';
        }
        else if (mouseEvent.which == 3){
            mode = 'out';
        }

        changeZoom(layers[0], mode, getCursorPosition(mouseEvent));

        for (let i=1; i<layers.length; i++) {
            layers[i].copyData(layers[0]);
        }
    }
    else if (currentTool == 'rectselect' && isRectSelecting) {
        endRectSelection(mouseEvent);
    }
    else if (currentTool == 'rectangle') {
        endRectDrawing(mouseEvent);
    }

    dragging = false;
    currentTool = currentToolTemp;

    updateCursor();


}, false);

function setPreviewPosition(preview, cursor, size){
    preview.style.left = (
        currentLayer.canvas.offsetLeft
        + Math.floor(cursor[0]/zoom) * zoom
        - Math.floor(size / 2) * zoom
    ) + 'px';
    preview.style.top = (
        currentLayer.canvas.offsetTop
        + Math.floor(cursor[1]/zoom) * zoom
        - Math.floor(size / 2) * zoom
    ) + 'px';
}


// OPTIMIZABLE: redundant || mouseEvent.target.className in currentTool ifs

//mouse is moving on canvas		
window.addEventListener('mousemove', draw, false);
function draw (mouseEvent) {
    lastMousePos = getCursorPosition(mouseEvent);
    // Saving the event in case something else needs it
    currentMouseEvent = mouseEvent;

    var cursorLocation = lastMousePos;

    //if a document hasnt yet been created, exit this function
    if (!documentCreated || dialogueOpen) return;


    eyedropperPreview.style.display = 'none';

    if (currentTool == 'pencil') {
        //move the brush preview
        setPreviewPosition(brushPreview, cursorLocation, pencilSize);

        //hide brush preview outside of canvas / canvas view
        if (mouseEvent.target.className == 'drawingCanvas'|| mouseEvent.target.className == 'drawingCanvas')
            brushPreview.style.visibility = 'visible';
        else
            brushPreview.style.visibility = 'hidden';

        //draw line to current pixel
        if (dragging) {
            if (mouseEvent.target.className == 'drawingCanvas' || mouseEvent.target.className == 'drawingCanvas') {
                line(
                    Math.floor(lastPos[0]/zoom), Math.floor(lastPos[1]/zoom),
                    Math.floor(cursorLocation[0]/zoom), Math.floor(cursorLocation[1]/zoom),
                    pencilSize
                );
                lastPos = cursorLocation;
            }
        }

        //get lightness value of color
        var selectedColor = context.getImageData(Math.floor(cursorLocation[0]/zoom),Math.floor(cursorLocation[1]/zoom),1,1).data;
        var colorLightness = Math.max(selectedColor[0],selectedColor[1],selectedColor[2]);

        //for the darkest 50% of colors, change the brush preview to dark mode
        if (colorLightness>127) brushPreview.classList.remove('dark');
        else brushPreview.classList.add('dark');
    }
    // Decided to write a different implementation in case of differences between the brush and the eraser tool
    else if (currentTool == 'eraser') {
        // Uses the same preview as the brush
        //move the brush preview
        setPreviewPosition(brushPreview, cursorLocation, eraserSize);

        //hide brush preview outside of canvas / canvas view
        if (mouseEvent.target.className == 'drawingCanvas' || mouseEvent.target.className == 'drawingCanvas')
            brushPreview.style.visibility = 'visible';
        else
            brushPreview.style.visibility = 'hidden';

        //draw line to current pixel
        if (dragging) {
            if (mouseEvent.target.className == 'drawingCanvas' || mouseEvent.target.className == 'drawingCanvas') {
                line(
                    Math.floor(lastPos[0]/zoom), Math.floor(lastPos[1]/zoom),
                    Math.floor(cursorLocation[0]/zoom), Math.floor(cursorLocation[1]/zoom),
                    eraserSize
                );
                lastPos = cursorLocation;
            }
        }
    }
    else if (currentTool == 'rectangle')
    {
        //move the brush preview
        setPreviewPosition(brushPreview, cursorLocation, rectangleSize)

        //hide brush preview outside of canvas / canvas view
        if (mouseEvent.target.className == 'drawingCanvas'|| mouseEvent.target.className == 'drawingCanvas')
            brushPreview.style.visibility = 'visible';
        else
            brushPreview.style.visibility = 'hidden';

        if (!isDrawingRect && dragging) {
            startRectDrawing(mouseEvent);
        }
        else if (dragging){
            updateRectDrawing(mouseEvent);
        }
    }
    else if (currentTool == 'pan' && dragging) {
        // Setting first layer position
        setCanvasOffset(layers[0].canvas, layers[0].canvas.offsetLeft + (cursorLocation[0] - lastPos[0]), layers[0].canvas.offsetTop + (cursorLocation[1] - lastPos[1]));
        // Copying that position to the other layers
        for (let i=1; i<layers.length; i++) {
            layers[i].copyData(layers[0]);
        }
    }
    else if (currentTool == 'eyedropper' && dragging && mouseEvent.target.className == 'drawingCanvas') {
        var selectedColor = context.getImageData(Math.floor(cursorLocation[0]/zoom),Math.floor(cursorLocation[1]/zoom),1,1).data;

        eyedropperPreview.style.borderColor = '#'+rgbToHex(selectedColor[0],selectedColor[1],selectedColor[2]);
        eyedropperPreview.style.display = 'block';

        eyedropperPreview.style.left = cursorLocation[0] + currentLayer.canvas.offsetLeft - 30 + 'px';
        eyedropperPreview.style.top = cursorLocation[1] + currentLayer.canvas.offsetTop - 30 + 'px';

        var colorLightness = Math.max(selectedColor[0],selectedColor[1],selectedColor[2]);

        //for the darkest 50% of colors, change the eyedropper preview to dark mode
        if (colorLightness>127) eyedropperPreview.classList.remove('dark');
        else eyedropperPreview.classList.add('dark');
    }
    else if (currentTool == 'resize-brush' && dragging) {
        //get new brush size based on x distance from original clicking location
        var distanceFromClick = cursorLocation[0] - lastPos[0];
        //var roundingAmount = 20 - Math.round(distanceFromClick/10);
        //this doesnt work in reverse...  because... it's not basing it off of the brush size which it should be
        var brushSizeChange = Math.round(distanceFromClick/10);
        var newBrushSize = prevBrushSize + brushSizeChange;

        //set the brush to the new size as long as its bigger than 1
        pencilSize = Math.max(1, newBrushSize);

        //fix offset so the cursor stays centered
        setPreviewPosition(brushPreview, cursorLocation, pencilSize);

        updateCursor();
    }
    else if (currentTool == 'resize-eraser' && dragging) {
        //get new brush size based on x distance from original clicking location
        var distanceFromClick = cursorLocation[0] - lastPos[0];
        //var roundingAmount = 20 - Math.round(distanceFromClick/10);
        //this doesnt work in reverse...  because... it's not basing it off of the brush size which it should be
        var eraserSizeChange = Math.round(distanceFromClick/10);
        var newEraserSizeChange = prevEraserSize + eraserSizeChange;

        //set the brush to the new size as long as its bigger than 1
        eraserSize = Math.max(1,newEraserSizeChange);

        //fix offset so the cursor stays centered
        setPreviewPosition(brushPreview, cursorLocation, eraserSize);

        updateCursor();
    }
    else if (currentTool == 'resize-rectangle' && dragging) {
        //get new brush size based on x distance from original clicking location
        var distanceFromClick = cursorLocation[0] - lastPos[0];
        //var roundingAmount = 20 - Math.round(distanceFromClick/10);
        //this doesnt work in reverse...  because... it's not basing it off of the brush size which it should be
        var rectangleSizeChange = Math.round(distanceFromClick/10);
        var newRectangleSize = prevRectangleSize + rectangleSizeChange;

        //set the brush to the new size as long as its bigger than 1
        rectangleSize = Math.max(1,newRectangleSize);

        //fix offset so the cursor stays centered
        setPreviewPosition(brushPreview, cursorLocation, rectangleSize);

        updateCursor();
    }
    else if (currentTool == 'rectselect') {
        if (dragging && !isRectSelecting && mouseEvent.target.className == 'drawingCanvas') {
            isRectSelecting = true;
            console.log('cominciata selezione su ' + mouseEvent.target.className);
            startRectSelection(mouseEvent);
        }
        else if (dragging && isRectSelecting) {
            updateRectSelection(mouseEvent);
        }
        else if (isRectSelecting) {
            endRectSelection();
        }
    }
    else if (currentTool == 'moveselection') {
        // Updating the cursor (move if inside rect, cross if not)
        updateCursor();

        // If I'm dragging, I move the preview
        if (dragging && cursorInSelectedArea()) {
            updateMovePreview(mouseEvent);
        }
    }
}

//mousewheel scrroll
canvasView.addEventListener('wheel', function(mouseEvent){

    if (currentTool == 'zoom' || mouseEvent.altKey) {
        let mode;
        if (mouseEvent.deltaY < 0){
            mode = 'in';
        }
        else if (mouseEvent.deltaY > 0) {
            mode = 'out';
        }

        // Changing zoom and position of the first layer
        changeZoom(layers[0], mode, getCursorPosition(mouseEvent));

        for (let i=1; i<layers.length; i++) {
            // Copying first layer's data into the other layers
            layers[i].copyData(layers[0]);
        }
    }

});
