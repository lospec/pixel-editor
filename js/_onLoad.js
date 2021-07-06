



//when the page is done loading, you can get ready to start
window.onload = function () {

    featureToggles.onLoad();

    currentTool.updateCursor();
	
	//check if there are any url parameters
	if (window.location.pathname.replace('/pixel-editor/','').length <= 1)  {
		console.log('no url parameters were found');

		//show splash screen
		showDialogue('splash', false);
	}

	//url parameters were specified
	else {
		console.log('loading preset from url parameters', window.location.pathname);

		let args = window.location.pathname.split('/');
		let paletteSlug = args[2];
		let dimentions = args[3];

		//fetch palette via lospec palette API
		fetch('https://lospec.com/palette-list/'+paletteSlug+'.json')
			.then(response => response.json())
			.then(data => {
				//palette loaded successfully
				console.log('loaded palette', data);
				palettes[paletteSlug] = data;
				palettes[paletteSlug].specified = true;

				//refresh list of palettes
				document.getElementById('palette-menu-splash').refresh();

				//if the dimentions were specified
				if (dimentions && dimentions.length >= 3 && dimentions.includes('x')) {
					let width = dimentions.split('x')[0];
					let height = dimentions.split('x')[1];
					
					console.log('dimentions were specified',width,'x',height)
					
					//firstPixel = false;

					//create new document
					newPixel(width, height, getValue('editor-mode'));
				}
				
				//dimentions were not specified -- show splash screen with palette preselected
				else {
					//show splash
					showDialogue('new-pixel', false);
				}
				
			})
			//error fetching url (either palette doesn't exist, or lospec is down)
			.catch((error) => {
				console.warn('failed to load palette "'+paletteSlug+'"', error);
				
				//proceed to splash screen
				showDialogue('splash', false);
			});
	} 
};