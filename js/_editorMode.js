let modes = {
    'Basic' : {
        description: 'Basic mode is perfect if you want to create simple sprites or try out palettes.'
    },
    'Advanced' : {
        description: 'Choose advanced mode to gain access to features such as layers.'
    }
}

let infoBox = document.getElementById('editor-mode-info');

function switchMode(currentMode, mustConfirm = true) {

	//switch to advanced mode
    if (currentMode == 'Basic') {
        // Switch to advanced ez pez lemon squez
        document.getElementById('switch-mode-button').innerHTML = 'Switch to basic mode';
		// Show the layer menus
		layerList.style.display = "inline-block";
		document.getElementById('layer-button').style.display = 'inline-block';
		// Move the palette menu
        document.getElementById('colors-menu').style.right = '200px';

        pixelEditorMode = 'Advanced';
    }

    //switch to basic mode
    else {
		//if there is a current layer (a document is active)
        if (currentLayer) {
        	//confirm with user before flattening image
        	if (mustConfirm ) {
	            if (!confirm('Switching to basic mode will flatten all the visible layers. Are you sure you want to continue?')) {
	                return;
	            }
	        }

			// Selecting the current layer
			currentLayer.selectLayer();
			// Flatten the layers
			flatten(true);
        }

        //change menu text
        document.getElementById('switch-mode-button').innerHTML = 'Switch to advanced mode';

		// Hide the layer menus
		layerList.style.display = 'none';
		document.getElementById('layer-button').style.display = 'none';
		// Move the palette menu
		document.getElementById('colors-menu').style.right = '0px';

		pixelEditorMode = 'Basic';
    }
}

on('click', 'switch-mode-button', function (e) {
    switchMode(pixelEditorMode);
});

// Makes the menu open
on('click', 'editor-mode-button', function (e){
    //open or close the preset menu
    toggle('editor-mode-button');
    toggle('editor-mode-menu');

    //close the palette menu
    deselect('palette-button');
    deselect('palette-menu');

    //close the preset menu
    deselect('preset-button');
    deselect('preset-menu');

    //stop the click from propogating to the parent element
    e.stopPropagation();
});

//populate preset list in new pixel menu
Object.keys(modes).forEach(function(modeName,index) {
    var editorModeMenu = document.getElementById('editor-mode-menu');

    //create button
    var button = document.createElement('button');
    button.appendChild(document.createTextNode(modeName));

    //insert new element
    editorModeMenu.appendChild(button);

    //add click event listener
    on('click', button, function() {

        //change mode on new pixel
        setValue('editor-mode', modeName);
        // Change description
        infoBox.innerHTML = modes[modeName].description;

        //hide the dropdown menu
        deselect('editor-mode-menu');
        deselect('editor-mode-button');

        //set the text of the dropdown to the newly selected mode
        setText('editor-mode-button', modeName);
    });

});