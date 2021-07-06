//add class .selected to specified element
function select(elementId) {
  //console.log(arguments.callee.caller.name, 'selected ', elementId);
	var element = (typeof elementId == 'string' ? document.getElementById(elementId) : elementId);
	element.classList.add('selected');
}

//remove .selected class from specified element
function deselect(elementId) {
  //console.log('deselected ', elementId);
	var element = (typeof elementId == 'string' ? document.getElementById(elementId) : elementId);
	element.classList.remove('selected');
}

//toggle the status of the .selected class on the specified element
function toggle(elementId) {
  //console.log('toggled ', elementId);
	var element = (typeof elementId == 'string' ? document.getElementById(elementId) : elementId);
	element.classList.toggle('selected');
}