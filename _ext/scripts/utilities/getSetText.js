//get text of specified element
function getText(elementId) {
	var element = (typeof elementId == 'string' ? document.getElementById(elementId) : elementId);
	return element.textContent;
}

function setText(elementId, text) {
	var element = (typeof elementId == 'string' ? document.getElementById(elementId) : elementId);
	element.textContent = text;
}
// Leaving this here for now, not removing old functions to avoid breaks until full transition
const Utility = () => {
	return {
		getText: (elementId) => {
			const element = (typeof elementId == 'string' ? document.getElementById(elementId) : elementId);
			return element.textContent;
		},
		setText: (elementId, text) => {
			const element = (typeof elementId == 'string' ? document.getElementById(elementId) : elementId);
			element.textContent = text;
		},
		getValue: (elementId) => {
			const element = (typeof elementId == 'string' ? document.getElementById(elementId) : elementId);
			console.log("setting: " + elementId + ": " + element.value);
			return element.value;
		},
		setValue: (elementId, value) => {
			const element = (typeof elementId == 'string' ? document.getElementById(elementId) : elementId);
			element.value = value;
		},
		//add class .selected to specified element
		select: (elementId) => {
			const element = (typeof elementId == 'string' ? document.getElementById(elementId) : elementId);
			element.classList.add('selected');
		},
		//remove .selected class from specified element
		deselect: (elementId) => {
			const element = (typeof elementId == 'string' ? document.getElementById(elementId) : elementId);
			element.classList.remove('selected');
		},
		//toggle the status of the .selected class on the specified element
		toggle: (elementId) => {
			const element = (typeof elementId == 'string' ? document.getElementById(elementId) : elementId);
			element.classList.toggle('selected');
		}
	}	
}