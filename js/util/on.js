//add event listener for any element which calls a function
//element can be provided as a direct reference or with just a string of the name

function on(event, elementId, functionCallback) {
	
	
	
	//if element provided is string, get the actual element
	var element = (typeof elementId == 'string' ? document.getElementById(elementId) : elementId);
	
	//console.log('added '+event+' event listener on '+element) 
	
	element.addEventListener(event,
	  function (e) {
	     // e = event
	     //this = element clicked
	     functionCallback(e, this);
	     //if you need to access the event or this variable, you need to add them
	     //when you define the callback, but you cant use the word this, eg:
	     //on('click', menuButton, function (e, button) {});
	  });
}