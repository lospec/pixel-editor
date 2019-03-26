//add click listener to each of specified element's children

function onClickChildren(parentElement, functionCallback) {
	
	var parentElement = (typeof parentElement == 'string' ? document.getElementById(parentElement) : parentElement);
	
	var children = parentElement.children;
	
	//loop through children and add onClick listener
	for (var i = 0; i < children.length; i++) {
		onClick(children[i],functionCallback);
	}
}