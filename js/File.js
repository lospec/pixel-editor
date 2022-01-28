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
    hSymmetricLayer = undefined;
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
    // Should I keep the sprite ratio?
    keepRatio = true;
    // Used to store the current ratio
    currentRatio = undefined;
    // The currenty selected resizing algorithm (nearest-neighbor or bilinear-interpolation)
    currentAlgo = 'nearest-neighbor';
    // Current resize data
    data = {width: 0, height: 0, widthPercentage: 100, heightPercentage: 100};
    // Start resize data
    startData = {width: 0, height:0, widthPercentage: 100, heightPercentage: 100};

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
        currFile.hSymmetricLayer.fillAxis();
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

    /** Opens the sprite resizing window
     * 
     */
    openResizeSpriteWindow() {
        // Inits the sprie resize inputs
        this.initResizeSpriteInputs();

        // Computing the current ratio
        this.currentRatio = currFile.canvasSize[0] / currFile.canvasSize[1];

        // Initializing the input fields
        this.data.width = currFile.canvasSize[0];
        this.data.height = currFile.canvasSize[1];

        this.startData.width = parseInt(this.data.width);
        this.startData.height = parseInt(this.data.height);
        this.startData.heightPercentage = 100;
        this.startData.widthPercentage = 100;

        // Opening the pop up now that it's ready
        Dialogue.showDialogue('resize-sprite');
    }

    /** Initalizes the input values and binds the elements to their events
     * 
     */
    initResizeSpriteInputs() {
        document.getElementById("rs-width").value = currFile.canvasSize[0];
        document.getElementById("rs-height").value = currFile.canvasSize[1];

        document.getElementById("rs-width-percentage").value = 100;
        document.getElementById("rs-height-percentage").value = 100;

        document.getElementById("rs-keep-ratio").checked = true;

        Events.on("change", "rs-width", this.changedWidth.bind(this));
        Events.on("change", "rs-height", this.changedHeight.bind(this));
        
        Events.on("change", "rs-width-percentage", this.changedWidthPercentage.bind(this));
        Events.on("change", "rs-height-percentage", this.changedHeightPercentage.bind(this));

        Events.on("click", "resize-sprite-confirm", this.resizeSprite.bind(this));
        Events.on("click", "rs-keep-ratio", this.toggleRatio.bind(this));
        Events.on("change", "resize-algorithm-combobox", this.changedAlgorithm.bind(this));
    }

    /** Resizes (scales) the sprite
     * 
     * @param {*} event 
     * @param {*} ratio Keeps infos about the x ratio and y ratio
     */
    resizeSprite(event, ratio) {
        // Old data
        let oldWidth, oldHeight;
        // New data
        let newWidth, newHeight;
        // Current imageDatas
        let rsImageDatas = [];
        // Index that will be used a few lines below
        let layerIndex = 0;
        // Copy of the imageDatas that will be stored in the history
        let imageDatasCopy = [];

        oldWidth = currFile.canvasSize[0];
        oldHeight = currFile.canvasSize[1];
        this.rcPivot = "middle";

        // Updating values if the user didn't press enter
        switch (document.activeElement.id) {
            case "rs-width-percentage":
                this.changedWidthPercentage();
                break;
            case "rs-width":
                this.changedWidth();
                break;
            case "rs-height-percentage":
                this.changedHeightPercentage();
                break;
            case "rs-height":
                this.changedHeight();
                break;
            default:
                // In this case everything has been updated correctly
                break;
        }

        // Computing newWidth and newHeight
        if (ratio == null) {
            newWidth = this.data.width;
            newHeight = this.data.height;
        }
        else {
            newWidth = currFile.canvasSize[0] * ratio[0];
            newHeight = currFile.canvasSize[1] * ratio[1];
        }
        
        // Get all the image datas
        for (let i=0; i<currFile.layers.length; i++) {
            if (currFile.layers[i].hasCanvas()) {
                rsImageDatas.push(currFile.layers[i].context.getImageData(
                    0, 0, currFile.canvasSize[0], currFile.canvasSize[1])
                );
            }
        }

        // event is null when the user is undoing
        if (event != null) {
            // Copying the image data
            imageDatasCopy = rsImageDatas.slice();
            // Saving the history
            new HistoryState().ResizeSprite(newWidth / oldWidth, newHeight / oldHeight, this.currentAlgo, imageDatasCopy);
        }

        // Resizing the canvas
        currFile.resizeCanvas(null, {x: newWidth, y: newHeight});

        // Put the image datas on the new canvases
        for (let i=0; i<currFile.layers.length; i++) {
            if (currFile.layers[i].hasCanvas()) {
                currFile.layers[i].context.putImageData(
                    this.resizeImageData(rsImageDatas[layerIndex], newWidth, newHeight, this.currentAlgo), 0, 0
                );
                currFile.layers[i].updateLayerPreview();
                layerIndex++;
            }
        }

        // Updating start values when I finish scaling the sprite
        // OPTIMIZABLE? Can't I just assign data to startData? Is js smart enough to understand?
        if (ratio == null) {
            this.startData.width = this.data.width;
            this.startData.height = this.data.height;
        }
        else {
            this.startData.width = currFile.canvasSize[0];
            this.startData.height = currFile.canvasSize[1];
        }

        this.startData.widthPercentage = 100;
        this.startData.heightPercentage = 100;

        Dialogue.closeDialogue();
    }

    /* Trust me, the math for the functions below works. If you want to optimize them feel free to have a look, though */
    /** Fired when the input field for width is changed. Updates th othe input fields consequently
     * 
     * @param {*} event 
     */
    changedWidth(event) {
        let newHeight, newHeightPerc, newWidthPerc;
        this.data.width = event.target.value;

        newHeight = this.data.width / this.currentRatio;
        newHeightPerc = (newHeight * 100) / this.startData.height;
        newWidthPerc = (this.data.width * 100) / this.startData.width;

        if (this.keepRatio) {
            document.getElementById("rs-height").value = newHeight;
            this.data.height = newHeight;

            document.getElementById("rs-height-percentage").value = newHeightPerc;
            this.data.heightPercentage = newHeightPerc;
        }

        document.getElementById("rs-width-percentage").value = newWidthPerc;
    }

    /**Fired when the input field for width is changed. Updates the other input fields consequently
     * 
     * @param {*} event 
     */
    changedHeight(event) {
        let newWidth, newWidthPerc, newHeightPerc;
        this.data.height = event.target.value;

        newWidth = this.data.height * this.currentRatio;
        newWidthPerc = (newWidth * 100) / this.startData.width;
        newHeightPerc = (this.data.height * 100) / this.startData.height;

        if (this.keepRatio) {
            document.getElementById("rs-width").value = newWidth;
            this.data.width = newWidth;

            document.getElementById("rs-width-percentage").value = newWidthPerc;
            this.data.widthPercentage = newWidthPerc;
        }

        document.getElementById("rs-height-percentage").value = newHeightPerc;
        this.data.heightPercentage = newHeightPerc;
    }

    /**Fired when the input field for width percentage is changed. Updates the other input fields consequently
     * 
     * @param {*} event 
     */
    changedWidthPercentage(event) {
        let oldValue = 100;
        let ratio;
        let newWidth, newHeight, newHeightPerc;

        this.data.widthPercentage = event.target.value;
        ratio = this.data.widthPercentage / oldValue;

        newHeight = this.startData.height * ratio;
        newHeightPerc = this.data.widthPercentage;
        newWidth = this.startData.width * ratio;

        if (this.keepRatio) {
            document.getElementById("rs-height-percentage").value = newHeightPerc;
            this.data.heightPercentage = newHeightPerc;
            
            document.getElementById("rs-height").value = newHeight
            this.data.height = newHeight;
        }

        document.getElementById("rs-width").value = newWidth;
        this.data.width = newWidth;
    }

    /**Fired when the input field for height percentage is changed. Updates the other input fields consequently
     * 
     * @param {*} event 
     */
    changedHeightPercentage(event) {
        let oldValue = this.data.heightPercentage;
        let ratio;
        let newHeight, newWidth, newWidthPerc;

        this.data.heightPercentage = event.target.value;

        ratio = this.data.heightPercentage / oldValue;

        newWidth = this.startData.width * ratio;
        newWidthPerc = this.data.heightPercentage;
        newHeight = this.startData.height * ratio;

        if (this.keepRatio) {
            document.getElementById("rs-width-percentage").value = this.data.heightPercentage * currentRatio;
            this.data.widthPercentage = newWidthPerc;

            document.getElementById("rs-width").value = newWidth;
            this.data.width = newWidth;
        }

        document.getElementById("rs-height").value = newHeight;
        this.data.height = newHeight;
    }

    /** Toggles the keepRatio value (fired by the checkbox in the pop up window)
     */
    toggleRatio() {
        this.keepRatio = !this.keepRatio;
    }

    /** Changes the scaling algorithm (fired by the combobox in the pop up window)
     * 
     * @param {*} event 
     */
    changedAlgorithm(event) {
        this.currentAlgo = event.target.value;
    }

    /** Resizes an imageData depending on the algorithm and on the new width and height
     * 
     * @param {*} image The imageData to scale
     * @param {*} width The new width of the imageData
     * @param {*} height The new height of the imageData
     * @param {*} algorithm Scaling algorithm chosen by the user in the dialogue
     */
    resizeImageData (image, width, height, algorithm) {
        algorithm = algorithm || 'bilinear-interpolation'
    
        let resize;
        switch (algorithm) {
            case 'nearest-neighbor': resize = this.nearestNeighbor; break
            case 'bilinear-interpolation': resize = this.bilinearInterpolation; break
            default: return image;
        }
    
        const result = new ImageData(width, height)
    
        resize(image, result)
    
        return result
    }


    /** Nearest neighbor algorithm to scale a sprite
     * 
     * @param {*} src The source imageData
     * @param {*} dst The destination imageData
     */
    nearestNeighbor (src, dst) {
        let pos = 0

        // Just applying the nearest neighbor algorithm
        for (let y = 0; y < dst.height; y++) {
            for (let x = 0; x < dst.width; x++) {
            const srcX = Math.floor(x * src.width / dst.width)
            const srcY = Math.floor(y * src.height / dst.height)

            let srcPos = ((srcY * src.width) + srcX) * 4

            dst.data[pos++] = src.data[srcPos++] // R
            dst.data[pos++] = src.data[srcPos++] // G
            dst.data[pos++] = src.data[srcPos++] // B
            dst.data[pos++] = src.data[srcPos++] // A
            }
        }
    }
    
    /** Bilinear interpolation used to scale a sprite
     * 
     * @param {*} src The source imageData
     * @param {*} dst The destination imageData
     */
    bilinearInterpolation (src, dst) {
        // Applying the bilinear interpolation algorithm

        function interpolate (k, kMin, kMax, vMin, vMax) {
            return Math.round((k - kMin) * vMax + (kMax - k) * vMin)
        }
    
        function interpolateHorizontal (offset, x, y, xMin, xMax) {
            const vMin = src.data[((y * src.width + xMin) * 4) + offset]
            if (xMin === xMax) return vMin
    
            const vMax = src.data[((y * src.width + xMax) * 4) + offset]
            return interpolate(x, xMin, xMax, vMin, vMax)
        }
    
        function interpolateVertical (offset, x, xMin, xMax, y, yMin, yMax) {
            const vMin = interpolateHorizontal(offset, x, yMin, xMin, xMax)
            if (yMin === yMax) return vMin
    
            const vMax = interpolateHorizontal(offset, x, yMax, xMin, xMax)
            return interpolate(y, yMin, yMax, vMin, vMax)
        }
    
        let pos = 0
    
        for (let y = 0; y < dst.height; y++) {
            for (let x = 0; x < dst.width; x++) {
                const srcX = x * src.width / dst.width
                const srcY = y * src.height / dst.height
        
                const xMin = Math.floor(srcX)
                const yMin = Math.floor(srcY)
        
                const xMax = Math.min(Math.ceil(srcX), src.width - 1)
                const yMax = Math.min(Math.ceil(srcY), src.height - 1)
        
                dst.data[pos++] = interpolateVertical(0, srcX, xMin, xMax, srcY, yMin, yMax) // R
                dst.data[pos++] = interpolateVertical(1, srcX, xMin, xMax, srcY, yMin, yMax) // G
                dst.data[pos++] = interpolateVertical(2, srcX, xMin, xMax, srcY, yMin, yMax) // B
                dst.data[pos++] = interpolateVertical(3, srcX, xMin, xMax, srcY, yMin, yMax) // A
            }
        }
    }

}

let currFile = new File();