class ZoomTool extends ResizableTool {
    constructor (name, options, switchFunc) {
        super(name, options, switchFunc);

        Events.on('click', this.mainButton, switchFunc, this);
        Events.on('click', this.biggerButton, this.setZoomIn.bind(this));
        Events.on('click', this.smallerButton, this.setZoomOut.bind(this));

        this.mode = 'in';
    }

    onStart(mousePos, target) {
        if (target.className != 'drawingCanvas')
            return;
        
        // Computing current width and height
        let oldWidth = currFile.canvasSize[0] * currFile.zoom;
        let oldHeight = currFile.canvasSize[1] * currFile.zoom;
        let prevZoom = currFile.zoom;
        let zoomed = false;

        //change zoom level
        //if you want to zoom out, and the zoom isnt already at the smallest level
        if (this.mode == 'out' && currFile.zoom > MIN_ZOOM_LEVEL) {
            zoomed = true;
            this.zoomOut(oldWidth, oldHeight, mousePos);
        }
        //if you want to zoom in
        else if (this.mode == 'in' && currFile.zoom + Math.ceil(currFile.zoom/10) < window.innerHeight/4) {
            zoomed = true;
            this.zoomIn(oldWidth, oldHeight, mousePos);
        }

        //resize canvas
        currFile.layers[0].resize();
        // adjust brush size
        ToolManager.currentTool().updateCursor();

        // Adjust pixel grid thickness
        if (zoomed) {
            if (currFile.zoom <= 7)
                currFile.pixelGrid.disablePixelGrid();
            else if (currFile.zoom >= 20 && this.mode == 'in') {
                currFile.pixelGrid.enablePixelGrid();
                currFile.pixelGrid.repaintPixelGrid((currFile.zoom - prevZoom) * 0.6);
            }
            else if (prevZoom >= 20 && this.mode == 'out') {
                currFile.pixelGrid.enablePixelGrid();
                currFile.pixelGrid.repaintPixelGrid((currFile.zoom - prevZoom) * 0.6);
            }
            else {
                currFile.pixelGrid.enablePixelGrid();
            }
        }

        for (let i=0; i<currFile.layers.length; i++) {
            currFile.layers[i].copyData(currFile.layers[0]);
        }
        for (let i=0; i<currFile.sublayers.length; i++) {
            currFile.sublayers[i].copyData(currFile.layers[0]);
        }
    }

    zoomIn(oldWidth, oldHeight, mousePos) {
        let newWidth, newHeight;

        if (currFile.zoom > 2)
            currFile.zoom += Math.ceil(currFile.zoom/10);
        else {
            if (currFile.zoom + currFile.zoom/10 > 2) {
                currFile.zoom += Math.ceil(currFile.zoom/10);
                currFile.zoom = Math.ceil(currFile.zoom);
            }
            else {
                currFile.zoom += Math.ceil(currFile.zoom * 2 / 10) / 2;
            }
        }
            
        newWidth = currFile.canvasSize[0] * currFile.zoom;
        newHeight = currFile.canvasSize[1] * currFile.zoom;

        //adjust canvas position
        currFile.layers[0].setCanvasOffset(
            currFile.layers[0].canvas.offsetLeft - Math.round((newWidth - oldWidth)*mousePos[0]/oldWidth), 
            currFile.layers[0].canvas.offsetTop - Math.round((newHeight - oldHeight)*mousePos[1]/oldHeight));
    }

    zoomOut(oldWidth, oldHeight, mousePos) {
        let newWidth, newHeight;

        if (currFile.zoom > 2)
            currFile.zoom -= Math.ceil(currFile.zoom / 10);
        else
            currFile.zoom -= Math.ceil(currFile.zoom * 2 / 10) / 2;

        newWidth = currFile.canvasSize[0] * currFile.zoom;
        newHeight = currFile.canvasSize[1] * currFile.zoom;

        //adjust canvas position
        currFile.layers[0].setCanvasOffset(
            currFile.layers[0].canvas.offsetLeft + (oldWidth - newWidth) * mousePos[0]/oldWidth, 
            currFile.layers[0].canvas.offsetTop + (oldHeight - newHeight) * mousePos[1]/oldHeight);
    }

    setZoomIn() {
        this.mode = 'in';
    }

    setZoomOut() {
        this.mode = 'out';
    }
}