//DEPRECATED - USE on('click')


//add click event listener for any element which calls a function
//element can be provided as a direct reference or with just a string of the name
function onClick(elementId, functionCallback) {
	var element = (typeof elementId == 'string' ? document.getElementById(elementId) : elementId);
	element.addEventListener('click',functionCallback);
}