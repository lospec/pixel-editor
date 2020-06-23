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