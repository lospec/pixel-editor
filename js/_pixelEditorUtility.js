function mergeLayers(belowLayer, topLayer) {
	// Copying the above content on the layerBelow
    let belowImageData = belowLayer.getImageData(0, 0, canvas.width, canvas.height);
    let toMergeImageData = topLayer.getImageData(0, 0, canvas.width, canvas.height);

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

    belowLayer.putImageData(toMergeImageData, 0, 0);
}

function simulateInput(keyCode, ctrl, alt, shift) {
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

function isPixelEmpty(pixel) {
	if (pixel == null || pixel === undefined) {
		return false;
	}
	
    if ((pixel[0] == 0 && pixel[1] == 0 && pixel[2] == 0) || pixel[3] == 0) {
        return true;
    }
	
    return false;
}

function isChildOfByClass(element, className) {
	while (element != null && element.classList != null && !element.classList.contains(className)) {
		element = element.parentElement;
	}

	if (element != null && element.classList != null && element.classList.contains(className)) {
		return true;
	}

	return false;
}

function getEyedropperColor(cursorLocation) {
	let max = -1;
	let tmpColour;
	let selectedColor;

	for (let i=1; i<layers.length; i++) {
		tmpColour = layers[i].context.getImageData(Math.floor(cursorLocation[0]/zoom),Math.floor(cursorLocation[1]/zoom),1,1).data;

		if (layers[i].canvas.style.zIndex > max || isPixelEmpty(selectedColor) || selectedColor === undefined) {
			max = layers[i].canvas.style.zIndex;

			if (!isPixelEmpty(tmpColour)) {
    			selectedColor = tmpColour;
    		}
		}
	}

	if (isPixelEmpty(tmpColour) && selectedColor === undefined) {
		selectedColor = [0, 0, 0];
	}

	return selectedColor;
}

function getElementAbsolutePosition(element) {
	let curleft = curtop = 0;

	if (element.offsetParent) {
		do {
			curleft += element.offsetLeft;
			curtop += element.offsetTop;
		} while (element = element.offsetParent);
	}

	return [curleft,curtop];
}

function nearestNeighbor (src, dst) {
	let pos = 0

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
  
function bilinearInterpolation (src, dst) {
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
  
function resizeImageData (image, width, height, algorithm) {
	algorithm = algorithm || 'bilinear-interpolation'
  
	let resize
	switch (algorithm) {
	  	case 'nearest-neighbor': resize = nearestNeighbor; break
	  	case 'bilinear-interpolation': resize = bilinearInterpolation; break
	  	default: throw new Error(`Unknown algorithm: ${algorithm}`)
	}
  
	const result = new ImageData(width, height)
  
	resize(image, result)
  
	return result
}

function getPixelPosition(index) {
	let linearIndex = index / 4;
	let x = linearIndex % layers[0].canvasSize[0];
	let y = Math.floor(linearIndex / layers[0].canvasSize[0]);

	return [Math.ceil(x), Math.ceil(y)];
}