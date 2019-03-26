//get text of specified element
function getText(elementId) {
	var element = (typeof elementId == 'string' ? document.getElementById(elementId) : elementId);
	return element.textContent;
}

function setText(elementId, text) {
	var element = (typeof elementId == 'string' ? document.getElementById(elementId) : elementId);
	element.textContent = text;
}
