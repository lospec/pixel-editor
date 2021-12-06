class File {
    // Canvas, canvas state
    canvasSize = [];
    zoom = 7;
    canvasView = document.getElementById("canvas-view");

    // Layers
    layers = [];
    currentLayer = undefined;
    VFXLayer = undefined;
    TMPLayer = undefined;
    pixelGrid = undefined;
    checkerBoard = undefined

    // Canvas resize attributes
    // Resize canvas pop up window
    resizeCanvasContainer = document.getElementById("resize-canvas");
    // Start pivot
    rcPivot = "middle";
    // Selected pivot button
    currentPivotObject = undefined;
    // Border offsets
    rcBorders = {left: 0, right: 0, top: 0, bottom: 0};

    // Sprite scaling attributes

    openResizeCanvasWindow() {
        // Initializes the inputs
        this.initResizeCanvasInputs();
        Dialogue.showDialogue('resize-canvas');
    }

    initResizeCanvasInputs() {
        // Getting the pivot buttons
        let buttons = document.getElementsByClassName("pivot-button");
    
        // Adding the event handlers for them
        for (let i=0; i<buttons.length; i++) {
            Events.on("click", buttons[i], this.changePivot.bind(this));
            if (buttons[i].getAttribute("value").includes("middle")) {
                this.currentPivotObject = buttons[i];
            }
        }
    
        document.getElementById("rc-width").value = currFile.canvasSize[0];
        document.getElementById("rc-height").value = currFile.canvasSize[1];
    
        Events.on("change", "rc-border-left", this.rcChangedBorder.bind(this));
        Events.on("change", "rc-border-right", this.rcChangedBorder.bind(this));
        Events.on("change", "rc-border-top", this.rcChangedBorder.bind(this));
        Events.on("change", "rc-border-bottom", this.rcChangedBorder.bind(this));
    
        Events.on("change", "rc-width", this.rcChangedSize.bind(this));
        Events.on("change", "rc-height", this.rcChangedSize.bind(this));

        Events.on("click", "resize-canvas-confirm", this.resizeCanvas.bind(this));
    }

    /** Fired when a border offset is changed: it updates the width and height
     */
    rcChangedBorder() {
        this.rcUpdateBorders();
        
        document.getElementById("rc-width").value = parseInt(currFile.canvasSize[0]) + 
            this.rcBorders.left + this.rcBorders.right;
        document.getElementById("rc-height").value = parseInt(currFile.canvasSize[1]) + 
            this.rcBorders.top + this.rcBorders.bottom;
    }
    
    /** Fired when width or height are changed: updates the border offsets
     */
    rcChangedSize() {
        let widthOffset = Math.abs(document.getElementById("rc-width").value) - currFile.canvasSize[0];
        let heightOffset = Math.abs(document.getElementById("rc-height").value) - currFile.canvasSize[1];

        let left = Math.round(widthOffset / 2);
        let right = widthOffset - left;
        let top = Math.round(heightOffset / 2);
        let bottom = heightOffset - top;

        document.getElementById("rc-border-left").value = left;
        document.getElementById("rc-border-right").value = right;
        document.getElementById("rc-border-top").value = top;
        document.getElementById("rc-border-bottom").value = bottom;

        this.rcBorders.left = left;
        this.rcBorders.right = right;
        this.rcBorders.top = top;
        this.rcBorders.bottom = bottom;
    }

    /** Resizes the canvas
     * 
     * @param {*} event The event that triggered the canvas resizing
     * @param {*} size The new size of the picture
     * @param {*} customData Used when ctrl+z ing
     * @param {*} saveHistory Should I save the history? You shouldn't if you're undoing
     */
    resizeCanvas(event, size, customData, saveHistory = true) {
        console.log("resizing");
        let imageDatas = [];
        let leftOffset = 0;
        let topOffset = 0;
        let copiedDataIndex = 0;

        // If I'm undoing and I'm not trimming, I manually put the values in the window
        if (size != null && customData == null) {
            document.getElementById("rc-width").value = size.x;
            document.getElementById("rc-height").value = size.y;

            this.rcChangedSize();
        }
        
        this.rcUpdateBorders();

        // Save all imageDatas
        for (let i=0; i<currFile.layers.length; i++) {
            if (currFile.layers[i].hasCanvas()) {
                imageDatas.push(currFile.layers[i].context.getImageData(
                    0, 0, currFile.canvasSize[0], currFile.canvasSize[1])
                );
            }
        }

        // Saving the history only if I'm not already undoing or redoing
        if (saveHistory && event != null) {
            // Saving history
            new HistoryState().ResizeCanvas(
                {x: parseInt(currFile.canvasSize[0]) + this.rcBorders.left + this.rcBorders.right, 
                y: parseInt(currFile.canvasSize[1]) + this.rcBorders.top + this.rcBorders.bottom},

                {x: currFile.canvasSize[0],
                y: currFile.canvasSize[1]},
                imageDatas.slice(), customData != null && saveHistory
            );
        }

        currFile.canvasSize[0] = parseInt(currFile.canvasSize[0]) + 
                this.rcBorders.left + this.rcBorders.right;
        currFile.canvasSize[1] = parseInt(currFile.canvasSize[1]) + 
            this.rcBorders.top + this.rcBorders.bottom;

        // Resize the canvases
        for (let i=0; i<currFile.layers.length; i++) {
            currFile.layers[i].canvas.width = currFile.canvasSize[0];
            currFile.layers[i].canvas.height = currFile.canvasSize[1];

            currFile.layers[i].resize();
        }

        // Regenerate the checkerboard
        currFile.checkerBoard.fillCheckerboard();
        currFile.pixelGrid.fillPixelGrid();
        // Put the imageDatas in the right position
        switch (this.rcPivot)
        {
            case 'topleft':
                leftOffset = 0;
                topOffset = 0;
                break;
            case 'top':
                leftOffset = (this.rcBorders.left + this.rcBorders.right) / 2;
                topOffset = 0;
                break;
            case 'topright':
                leftOffset = this.rcBorders.left + this.rcBorders.right;
                topOffset = 0;
                break;
            case 'left':
                leftOffset = 0;
                topOffset = (this.rcBorders.top + this.rcBorders.bottom) / 2;
                break;
            case 'middle':
                leftOffset = (this.rcBorders.left + this.rcBorders.right) / 2;
                topOffset = (this.rcBorders.top + this.rcBorders.bottom) / 2;
                break;
            case 'right':
                leftOffset = this.rcBorders.left + this.rcBorders.right;
                topOffset = (this.rcBorders.top + this.rcBorders.bottom) / 2;
                break;
            case 'bottomleft':
                leftOffset = 0;
                topOffset = this.rcBorders.top + this.rcBorders.bottom;
                break;
            case 'bottom':
                leftOffset = (this.rcBorders.left + this.rcBorders.right) / 2;
                topOffset = this.rcBorders.top + this.rcBorders.bottom;
                break;
            case 'bottomright':
                leftOffset = this.rcBorders.left + this.rcBorders.right;
                topOffset = this.rcBorders.top + this.rcBorders.bottom;
                break;
            default:
                break;
        }
        
        // Putting all the data for each layer with the right offsets (decided by the pivot)
        for (let i=0; i<currFile.layers.length; i++) {
            if (currFile.layers[i].hasCanvas()) {
                if (customData == undefined) {
                    currFile.layers[i].context.putImageData(imageDatas[copiedDataIndex], leftOffset, topOffset);
                }
                else {
                    currFile.layers[i].context.putImageData(customData[copiedDataIndex], 0, 0);
                }
                currFile.layers[i].updateLayerPreview();
                copiedDataIndex++;
            }
        }

        Dialogue.closeDialogue();
    }

    /** Trims the canvas so tat the sprite is perfectly contained in it
     * 
     * @param {*} event 
     * @param {*} saveHistory Should I save the history? You shouldn't if you're undoing
     */
    trimCanvas(event, saveHistory) {
        let minY = Infinity;
        let minX = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        let tmp;
        let imageDatas = [];
        let historySave = saveHistory == null;
        let prevPivot = rcPivot;

        this.rcPivot = "topleft";

        // Computing the min and max coordinates in which there's a non empty pixel
        for (let i=1; i<currFile.layers.length - nAppLayers; i++) {
            let imageData = currFile.layers[i].context.getImageData(0, 0, currFile.canvasSize[0], currFile.canvasSize[1]);
            let pixelPosition;

            for (let i=imageData.data.length - 1; i>= 0; i-=4) {
                if (!Util.isPixelEmpty(
                    [imageData.data[i - 3], imageData.data[i - 2], 
                    -imageData.data[i - 1], imageData.data[i]])) {
                    pixelPosition = getPixelPosition(i);        

                    // max x
                    if (pixelPosition[0] > maxX) {
                        maxX = pixelPosition[0];
                    }
                    // min x
                    if (pixelPosition[0] < minX) {
                        minX = pixelPosition[0];
                    }
                    // max y
                    if (pixelPosition[1] > maxY) {
                        maxY = pixelPosition[1];
                    }
                    // min y
                    if (pixelPosition[1] < minY) {
                        minY = pixelPosition[1];
                    }
                }
            }
        }

        tmp = minY;
        minY = maxY;
        maxY = tmp;

        minY = currFile.canvasSize[1] - minY;
        maxY = currFile.canvasSize[1] - maxY;

        // Setting the borders coherently with the values I've just computed
        this.rcBorders.right = (maxX - currFile.canvasSize[0]) + 1;
        this.rcBorders.left = -minX;
        this.rcBorders.top = maxY - currFile.canvasSize[1] + 1;
        this.rcBorders.bottom = -minY;

        // Saving the data
        for (let i=0; i<currFile.layers.length; i++) {
            if (currFile.layers[i].hasCanvas()) {
                imageDatas.push(currFile.layers[i].context.getImageData(minX - 1, currFile.layers[i].canvasSize[1] - maxY, maxX-minX + 1, maxY-minY + 1));
            }
        }

        //console.log("sx: " + borders.left + "dx: " + borders.right + "top: " + borders.top + "btm: " + borders.bottom);

        document.getElementById("rc-border-left").value = this.rcBorders.left;
        document.getElementById("rc-border-right").value = this.rcBorders.right;
        document.getElementById("rc-border-top").value = this.rcBorders.top;
        document.getElementById("rc-border-bottom").value = this.rcBorders.bottom;

        // Resizing the canvas with the decided border offsets
        this.resizeCanvas(null, null, imageDatas.slice(), historySave);
        // Resetting the previous pivot
        this.rcPivot = prevPivot;
    }

    rcUpdateBorders() {
        // Getting input
        this.rcBorders.left = document.getElementById("rc-border-left").value;
        this.rcBorders.right = document.getElementById("rc-border-right").value;
        this.rcBorders.top = document.getElementById("rc-border-top").value;
        this.rcBorders.bottom = document.getElementById("rc-border-bottom").value;

        // Validating input
        this.rcBorders.left == "" ? this.rcBorders.left = 0 : this.rcBorders.left = Math.round(parseInt(this.rcBorders.left));
        this.rcBorders.right == "" ? this.rcBorders.right = 0 : this.rcBorders.right = Math.round(parseInt(this.rcBorders.right));
        this.rcBorders.top == "" ? this.rcBorders.top = 0 : this.rcBorders.top = Math.round(parseInt(this.rcBorders.top));
        this.rcBorders.bottom == "" ? this.rcBorders.bottom = 0 : this.rcBorders.bottom = Math.round(parseInt(this.rcBorders.bottom));
    }

    changePivot(event) {
        this.rcPivot = event.target.getAttribute("value");

        // Setting the selected class
        this.currentPivotObject.classList.remove("rc-selected-pivot");
        this.currentPivotObject = event.target;
        this.currentPivotObject.classList.add("rc-selected-pivot");
    }
}

let currFile = new File();