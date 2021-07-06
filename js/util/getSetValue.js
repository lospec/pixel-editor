

function getValue(elementId) {
	var element = (typeof elementId == 'string' ? document.getElementById(elementId) : elementId);
	console.log("setting: " + elementId + ": " + element.value);
	return element.value;
}

function setValue(elementId, value) {
	var element = (typeof elementId == 'string' ? document.getElementById(elementId) : elementId);
	element.value = value;
}