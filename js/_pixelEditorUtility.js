/***********MISCELLANEOUS UTILITY FUNCTIONS**************/

/** Merges topLayer onto belowLayer
 * 
 * @param {*} belowLayer The layer on the bottom of the layer stack
 * @param {*} topLayer The layer on the top of the layer stack
 */
function mergeLayers(belowLayer, topLayer) {
	// Copying the above content on the layerBelow
    let belowImageData = belowLayer.getImageData(0, 0, belowLayer.canvas.width, belowLayer.canvas.height);
    let toMergeImageData = topLayer.getImageData(0, 0, topLayer.canvas.width, topLayer.canvas.height);

    for (let i=0; i<belowImageData.data.length; i+=4) {
        let currentMovePixel = [
            toMergeImageData.data[i], toMergeImageData.data[i+1], 
            toMergeImageData.data[i+2], toMergeImageData.data[i+3]
        ];

        let currentUnderlyingPixel = [
            belowImageData.data[i], belowImageData.data[i+1], 
            belowImageData.data[i+2], belowImageData.data[i+3]
        ];

        if (isPixelEmpty(currentMovePixel)) {
            if (!isPixelEmpty(belowImageData)) {
                toMergeImageData.data[i] = currentUnderlyingPixel[0];
                toMergeImageData.data[i+1] = currentUnderlyingPixel[1];
                toMergeImageData.data[i+2] = currentUnderlyingPixel[2];
                toMergeImageData.data[i+3] = currentUnderlyingPixel[3];
            }
        }
    }

	// Putting the top data into the belowdata
    belowLayer.putImageData(toMergeImageData, 0, 0);
}

/** Used to programmatically create an input event
 * 
 * @param {*} keyCode KeyCode of the key to press
 * @param {*} ctrl Is ctrl pressed?
 * @param {*} alt Is alt pressed?
 * @param {*} shift Is shift pressed?
 */
function simulateInput(keyCode, ctrl, alt, shift) {
	// I just copy pasted this from stack overflow lol please have mercy
	let keyboardEvent = document.createEvent("KeyboardEvent");
	let initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";

	keyboardEvent[initMethod](
	  "keydown", // event type: keydown, keyup, keypress
	  true,      // bubbles
	  true,      // cancelable
	  window,    // view: should be window
	  ctrl,     // ctrlKey
	  alt,     // altKey
	  shift,     // shiftKey
	  false,     // metaKey
	  keyCode,        // keyCode: unsigned long - the virtual key code, else 0
	  keyCode       // charCode: unsigned long - the Unicode character associated with the depressed key, else 0
	);
	document.dispatchEvent(keyboardEvent);
}

/** Tells if a pixel is empty (has alpha = 0)
 * 
 * @param {*} pixel 
 */
function isPixelEmpty(pixel) {
	if (pixel == null || pixel === undefined) {
		return false;
	}
	
	// If the alpha channel is 0, the current pixel is empty
    if (pixel[3] == 0) {
        return true;
    }
	
    return false;
}

/** Tells if element is a child of an element with class className
 * 
 * @param {*} element 
 * @param {*} className 
 */
function isChildOfByClass(element, className) {
	// Getting the element with class className
	while (element != null && element.classList != null && !element.classList.contains(className)) {
		element = element.parentElement;
	}

	// If that element exists and its class is the correct one
	if (element != null && element.classList != null && element.classList.contains(className)) {
		// Then element is a chld of an element with class className
		return true;
	}

	return false;
}

/** Gets the eyedropped colour (the colour of the pixel pointed by the cursor when the user is using the eyedropper).
 *  It takes the colour of the canvas with the biggest z-index, basically the one the user can see, since it doesn't
 *  make much sense to sample a colour which is hidden behind a different layer
 * 
 * @param {*} cursorLocation The position of the cursor
 */
function getEyedropperColor(cursorLocation) {
	// Making sure max will take some kind of value
	let max = -1;
	// Using tmpColour to sample the sprite
	let tmpColour;
	// Returned colour
	let selectedColor;

	for (let i=1; i<layers.length; i++) {
		// Getting the colour of the pixel in the cursorLocation
		tmpColour = layers[i].context.getImageData(Math.floor(cursorLocation[0]/zoom),Math.floor(cursorLocation[1]/zoom),1,1).data;

		// If it's not empty, I check if it's on the top of the previous colour
		if (layers[i].canvas.style.zIndex > max || isPixelEmpty(selectedColor) || selectedColor === undefined) {
			max = layers[i].canvas.style.zIndex;

			if (!isPixelEmpty(tmpColour)) {
    			selectedColor = tmpColour;
    		}
		}
	}

	// If the final colour was empty, I return black
	if (isPixelEmpty(tmpColour) && selectedColor === undefined) {
		selectedColor = [0, 0, 0];
	}

	return selectedColor;
}

/** Gets the absolute position of the element (position on the screen)
 * 
 * @param {*} element The element of which we have to get the position
 */
function getElementAbsolutePosition(element) {
	// Probably copy pasted this from stack overflow too, if not I don't recall how it works
	let curleft = curtop = 0;

	if (element.offsetParent) {
		do {
			curleft += element.offsetLeft;
			curtop += element.offsetTop;
		} while (element = element.offsetParent);
	}

	return [curleft,curtop];
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

/** Gets the position in (x, y) format of the pixel with index "index" 
 * 
 * @param {*} index The index of the pixel of which we need the (x, y) position
 */
function getPixelPosition(index) {
	let linearIndex = index / 4;
	let x = linearIndex % layers[0].canvasSize[0];
	let y = Math.floor(linearIndex / layers[0].canvasSize[0]);

	return [Math.ceil(x), Math.ceil(y)];
}

/** Sets isDragging to false, used when the user interacts with sortable lists
 * 
 */
function makeIsDraggingFalse(event) {
	dragging = false;
}