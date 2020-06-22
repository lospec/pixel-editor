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