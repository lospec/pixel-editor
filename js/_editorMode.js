let modes = {
    'Basic' : {
        description: 'Basic mode is perfect if you want to create simple sprites or try out palettes.'
    },
    'Advanced' : {
        description: 'Choose advanced mode to gain access to more advanced features such as layers.'
    }
}

on('click', 'switch-editor-mode-splash', function (e) {
	console.log('switching mode')
    switchMode();
});

function switchMode(mustConfirm = true) {
	console.log('switching mode', 'current:',pixelEditorMode)
	//switch to advanced mode
    if (pixelEditorMode == 'Basic') {
        // Switch to advanced ez pez lemon squez
        document.getElementById('switch-mode-button').innerHTML = 'Switch to basic mode';
		// Show the layer menus
		layerList.style.display = "inline-block";
		document.getElementById('layer-button').style.display = 'inline-block';
		// Hide the palette menu
        document.getElementById('colors-menu').style.right = '200px'

		//change splash text
		document.querySelector('#sp-quickstart-container .mode-switcher').classList.add('advanced-mode');

        pixelEditorMode = 'Advanced';

		//turn pixel grid off
		togglePixelGrid('off');
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
		// Show the palette menu
        document.getElementById('colors-menu').style.display = 'flex';
        // Move the palette menu
        document.getElementById('colors-menu').style.right = '0px';


		//change splash text
		document.querySelector('#sp-quickstart-container .mode-switcher').classList.remove('advanced-mode');

		pixelEditorMode = 'Basic';
		togglePixelGrid('on');
    }
}

on('click', 'switch-mode-button', function (e) {
    switchMode();
});
