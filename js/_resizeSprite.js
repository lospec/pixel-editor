// REFACTOR: method of File class probably

/* This scripts contains all the code used to handle the sprite scaling */
// Should I keep the sprite ratio?
let keepRatio = true;
// Used to store the current ratio
let currentRatio;
// The currenty selected resizing algorithm (nearest-neighbor or bilinear-interpolation)
let currentAlgo = 'nearest-neighbor';
// Current resize data
let data = {width: 0, height: 0, widthPercentage: 100, heightPercentage: 100};
// Start resize data
let startData = {width: 0, height:0, widthPercentage: 100, heightPercentage: 100};

/** Opens the sprite resizing window
 * 
 */
function openResizeSpriteWindow() {
    // Inits the sprie resize inputs
    initResizeSpriteInputs();

    // Computing the current ratio
    currentRatio = currFile.canvasSize[0] / currFile.canvasSize[1];

    console.log("Current ratio: " + currentRatio);

    // Initializing the input fields
    data.width = currFile.canvasSize[0];
    data.height = currFile.canvasSize[1];

    startData.width = parseInt(data.width);
    startData.height = parseInt(data.height);
    startData.heightPercentage = 100;
    startData.widthPercentage = 100;

    // Opening the pop up now that it's ready
    Dialogue.showDialogue('resize-sprite');
}

/** Initalizes the input values and binds the elements to their events
 * 
 */
function initResizeSpriteInputs() {
    document.getElementById("rs-width").value = currFile.canvasSize[0];
    document.getElementById("rs-height").value = currFile.canvasSize[1];

    document.getElementById("rs-width-percentage").value = 100;
    document.getElementById("rs-height-percentage").value = 100;

    document.getElementById("rs-keep-ratio").checked = true;

    document.getElementById("rs-width").addEventListener("change", changedWidth);
    document.getElementById("rs-height").addEventListener("change", changedHeight);
    document.getElementById("rs-width-percentage").addEventListener("change", changedWidthPercentage);
    document.getElementById("rs-height-percentage").addEventListener("change", changedHeightPercentage);

    document.getElementById("resize-sprite-confirm").addEventListener("click", resizeSprite);
    document.getElementById("rs-keep-ratio").addEventListener("click", toggleRatio);
    document.getElementById("resize-algorithm-combobox").addEventListener("change", changedAlgorithm);
}

/** Resizes (scales) the sprite
 * 
 * @param {*} event 
 * @param {*} ratio Keeps infos about the x ratio and y ratio
 */
function resizeSprite(event, ratio) {
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
    rcPivot = "middle";

    // Updating values if the user didn't press enter
    switch (document.activeElement.id) {
        case "rs-width-percentage":
            changedWidthPercentage();
            break;
        case "rs-width":
            changedWidth();
            break;
        case "rs-height-percentage":
            changedHeightPercentage();
            break;
        case "rs-height":
            changedHeight();
            break;
        default:
            // In this case everything has been updated correctly
            break;
    }

    // Computing newWidth and newHeight
    if (ratio == null) {
        newWidth = data.width;
        newHeight = data.height;
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
        new HistoryState().ResizeSprite(newWidth / oldWidth, newHeight / oldHeight, currentAlgo, imageDatasCopy);
    }

    // Resizing the canvas
    currFile.resizeCanvas(null, {x: newWidth, y: newHeight});

    // Put the image datas on the new canvases
    for (let i=0; i<currFile.layers.length; i++) {
        if (currFile.layers[i].hasCanvas()) {
            currFile.layers[i].context.putImageData(
                resizeImageData(rsImageDatas[layerIndex], newWidth, newHeight, currentAlgo), 0, 0
            );
            currFile.layers[i].updateLayerPreview();
            layerIndex++;
        }
    }

    // Updating start values when I finish scaling the sprite
    // OPTIMIZABLE? Can't I just assign data to startData? Is js smart enough to understand?
    if (ratio == null) {
        startData.width = data.width;
        startData.height = data.height;
    }
    else {
        startData.width = currFile.canvasSize[0];
        startData.height = currFile.canvasSize[1];
    }

    startData.widthPercentage = 100;
    startData.heightPercentage = 100;

    Dialogue.closeDialogue();
}

/* Trust me, the math for the functions below works. If you want to optimize them feel free to have a look, though */

/** Fired when the input field for width is changed. Updates th othe input fields consequently
 * 
 * @param {*} event 
 */
function changedWidth(event) {
    let oldValue = data.width;
    let ratio;
    let percentageRatio;
    let newHeight, newHeightPerc, newWidthPerc;

    data.width = event.target.value;
    delta = data.width - oldValue;

    ratio = data.width / oldValue;

    newHeight = data.width / currentRatio;
    newHeightPerc = (newHeight * 100) / startData.height;
    newWidthPerc = (data.width * 100) / startData.width;

    if (keepRatio) {
        document.getElementById("rs-height").value = newHeight;
        data.height = newHeight;

        document.getElementById("rs-height-percentage").value = newHeightPerc;
        data.heightPercentage = newHeightPerc;
    }

    document.getElementById("rs-width-percentage").value = newWidthPerc;
}

/**Fired when the input field for width is changed. Updates the other input fields consequently
 * 
 * @param {*} event 
 */
function changedHeight(event) {
    let oldValue = 100;
    let ratio;
    let newWidth, newWidthPerc, newHeightPerc;

    data.height = event.target.value;
    delta = data.height - oldValue;

    ratio = data.height / oldValue;

    newWidth = data.height * currentRatio;
    newWidthPerc = (newWidth * 100) / startData.width;
    newHeightPerc = (data.height * 100) / startData.height;

    if (keepRatio) {
        document.getElementById("rs-width").value = newWidth;
        data.width = newWidth;

        document.getElementById("rs-width-percentage").value = newWidthPerc;
        data.widthPercentage = newWidthPerc;
    }

    document.getElementById("rs-height-percentage").value = newHeightPerc;
    data.heightPercentage = newHeightPerc;
}

/**Fired when the input field for width percentage is changed. Updates the other input fields consequently
 * 
 * @param {*} event 
 */
function changedWidthPercentage(event) {
    let oldValue = 100;
    let ratio;
    let newWidth, newHeight, newHeightPerc;

    data.widthPercentage = event.target.value;
    delta = data.widthPercentage - oldValue;

    ratio = data.widthPercentage / oldValue;

    console.log("old value: " + oldValue + ", ratio: " + ratio);

    newHeight = startData.height * ratio;
    newHeightPerc = data.widthPercentage;
    newWidth = startData.width * ratio;

    if (keepRatio) {
        document.getElementById("rs-height-percentage").value = newHeightPerc;
        data.heightPercentage = newHeightPerc;
        
        document.getElementById("rs-height").value = newHeight
        data.height = newHeight;
    }

    document.getElementById("rs-width").value = newWidth;
    data.width = newWidth;
}

/**Fired when the input field for height percentage is changed. Updates the other input fields consequently
 * 
 * @param {*} event 
 */
function changedHeightPercentage(event) {
    let oldValue = data.heightPercentage;
    let ratio;
    let newHeight, newWidth, newWidthPerc;

    data.heightPercentage = event.target.value;
    delta = data.heightPercentage - oldValue;

    ratio = data.heightPercentage / oldValue;

    newWidth = startData.width * ratio;
    newWidthPerc = data.heightPercentage;
    newHeight = startData.height * ratio;

    if (keepRatio) {
        document.getElementById("rs-width-percentage").value = data.heightPercentage * currentRatio;
        data.widthPercentage = newWidthPerc;

        document.getElementById("rs-width").value = newWidth;
        data.width = newWidth;
    }

    document.getElementById("rs-height").value = newHeight;
    data.height = newHeight;
}

/** Toggles the keepRatio value (fired by the checkbox in the pop up window)
 * 
 * @param {*} event 
 */
function toggleRatio(event) {
    keepRatio = !keepRatio;
}

/** Changes the scaling algorithm (fired by the combobox in the pop up window)
 * 
 * @param {*} event 
 */
function changedAlgorithm(event) {
    currentAlgo = event.target.value;
}

/** Resizes an imageData depending on the algorithm and on the new width and height
 * 
 * @param {*} image The imageData to scale
 * @param {*} width The new width of the imageData
 * @param {*} height The new height of the imageData
 * @param {*} algorithm Scaling algorithm chosen by the user in the dialogue
 */
 function resizeImageData (image, width, height, algorithm) {
	algorithm = algorithm || 'bilinear-interpolation'
  
	let resize;
	switch (algorithm) {
	  	case 'nearest-neighbor': resize = nearestNeighbor; break
	  	case 'bilinear-interpolation': resize = bilinearInterpolation; break
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
 function nearestNeighbor (src, dst) {
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
function bilinearInterpolation (src, dst) {
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
