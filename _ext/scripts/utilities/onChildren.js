//add event listener to each of specified element's children

function onChildren(event, parentElement, functionCallback) {
	console.log('onChildren()');
	
	var parentElement = (typeof parentElement == 'string' ? document.getElementById(parentElement) : parentElement);
	
	var children = parentElement.children;
	
	//loop through children and add onClick listener
	for (var i = 0; i < children.length; i++) {
		on(event, children[i],functionCallback);
	}
}