/**utilities**/
//=include lib/cookies.js
//=include _jscolor.js
//=include _pixelEditorUtility.js
//=include _variables.js
//=include lib/sortable.js
//=include Util.js
//=include Events.js
//=include Color.js
//=include Dialogue.js
//=include History.js

//=include _tools.js
//=include tools/*.js
//=include ToolManager.js

/**init**/
//=include _consts.js
//=include Settings.js
//=include LayerList.js
//=include Layer.js
//=include Startup.js
//=include _pixelGrid.js
//=include EditorState.js

/**dropdown formatting**/
//=include PresetModule.js
//=include _palettes.js

/**functions**/
//=include _changeZoom.js
//=include ColorModule.js
//=include _drawLine.js
//=include _fill.js
//=include _line.js
//=include _checkerboard.js
//=include _copyPaste.js
//=include _resizeCanvas.js
//=include _resizeSprite.js
//=include _colorPicker.js
//=include _paletteBlock.js
//=include SplashPage.js

/**buttons**/
//=include _toolButtons.js
//=include FileManager.js
//=include TopMenuModule.js
//=include _rectSelect.js
//=include _move.js
//=include _rectangle.js
//=include _ellipse.js

/**event listeners**/
//=include Input.js
//=include _mouseEvents.js

/**feature toggles**/
//=include _featureToggles.js

// Controls execution of this preset module
PresetModule.instrumentPresetMenu();

//when the page is done loading, you can get ready to start
window.onload = function () {
    featureToggles.onLoad();

    ToolManager.currentTool().updateCursor();
	
	//check if there are any url parameters
	if (window.location.pathname.replace('/pixel-editor/','').length <= 1)  {
		//show splash screen
		Dialogue.showDialogue('splash', false);
	}
	//url parameters were specified
	else {
		let args = window.location.pathname.split('/');
		let paletteSlug = args[2];
		let dimentions = args[3];

		//fetch palette via lospec palette API
		fetch('https://lospec.com/palette-list/'+paletteSlug+'.json')
			.then(response => response.json())
			.then(data => {
				//palette loaded successfully
				palettes[paletteSlug] = data;
				palettes[paletteSlug].specified = true;

				//refresh list of palettes
				document.getElementById('palette-menu-splash').refresh();

				//if the dimentions were specified
				if (dimentions && dimentions.length >= 3 && dimentions.includes('x')) {
					let width = dimentions.split('x')[0];
					let height = dimentions.split('x')[1];
					
					//create new document
					Startup.newPixel(width, height);
				}
				//dimentions were not specified -- show splash screen with palette preselected
				else {
					//show splash
					Dialogue.showDialogue('new-pixel', false);
				}
			})
			//error fetching url (either palette doesn't exist, or lospec is down)
			.catch((error) => {
				console.warn('failed to load palette "'+paletteSlug+'"', error);
				//proceed to splash screen
				Dialogue.showDialogue('splash', false);
			});
	} 
};

//prevent user from leaving page with unsaved data
window.onbeforeunload = function() {
    if (documentCreated)
        return 'You will lose your pixel if it\'s not saved!';

    else return;
};