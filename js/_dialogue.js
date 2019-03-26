function showDialogue (dialogueName, trackEvent) {
    if (typeof trackEvent === 'undefined') trackEvent = true; 
    
	dialogueOpen = true;
	popUpContainer.style.display = 'block';
	
	document.getElementById(dialogueName).style.display = 'block';
	
    //track google event
    if (trackEvent)
        ga('send', 'event', 'Palette Editor Dialogue', dialogueName); /*global ga*/
}

function closeDialogue () {
	popUpContainer.style.display = 'none';
	
	var popups = popUpContainer.children;
	for (var i = 0; i < popups.length; i++) {
		popups[i].style.display = 'none';
	}
	
	dialogueOpen = false;
}

popUpContainer.addEventListener("click", function (e) {
	if (e.target == popUpContainer)
	closeDialogue();
});

//add click handlers for all cancel buttons
var cancelButtons = popUpContainer.getElementsByClassName('close-button');
for (var i = 0; i < cancelButtons.length; i++) {
	cancelButtons[i].addEventListener('click', function () {
		closeDialogue();	
	});
}