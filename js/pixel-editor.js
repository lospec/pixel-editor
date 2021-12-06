/**utilities**/
//=include lib/cookies.js
//=include lib/jscolor.js
//=include data/variables.js
//=include lib/sortable.js
//=include Util.js
//=include Events.js
//=include Color.js
//=include Dialogue.js
//=include History.js

//=include ColorModule.js

//=include Tool.js

//=include tools/ResizableTool.js
//=include tools/SelectionTool.js

//=include tools/BrushTool.js
//=include tools/EraserTool.js
//=include tools/LineTool.js
//=include tools/RectangleTool.js
//=include tools/FillTool.js
//=include tools/EyedropperTool.js
//=include tools/PanTool.js
//=include tools/ZoomTool.js
//=include tools/RectangularSelectionTool.js
//=include tools/MoveSelectionTool.js

/**init**/
//=include data/consts.js
//=include Settings.js
//=include LayerList.js
//=include layers/Layer.js
//=include layers/Checkerboard.js
//=include layers/PixelGrid.js

//=include Startup.js
//=include EditorState.js
//=include ToolManager.js

/**dropdown formatting**/
//=include PresetModule.js
//=include data/palettes.js

/**functions**/
//=include _resizeCanvas.js
//=include _resizeSprite.js
//=include ColorPicker.js
//=include PaletteBlock.js
//=include SplashPage.js

/**buttons**/
//=include FileManager.js
//=include TopMenuModule.js
//=include _ellipse.js

/**event listeners**/
//=include Input.js

/**feature toggles**/
//=include FeatureToggles.js

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

// Compatibility functions
function closeCompatibilityWarning() {
	document.getElementById("compatibility-warning").style.visibility =	"hidden";
}

//check browser/version
if (
	(bowser.firefox && bowser.version >= 28) ||
	(bowser.chrome && bowser.version >= 29) ||
	(!bowser.mobile && !bowser.tablet)
)
	console.log("compatibility check passed");
//show warning
else document.getElementById("compatibility-warning").style.visibility = "visible";
