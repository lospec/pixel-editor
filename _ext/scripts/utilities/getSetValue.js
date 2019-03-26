

function getValue(elementId) {
	var element = (typeof elementId == 'string' ? document.getElementById(elementId) : elementId);
	return element.value;
}

function setValue(elementId, value) {
	var element = (typeof elementId == 'string' ? document.getElementById(elementId) : elementId);
	element.value = value;
}