/** EXTERNALS AND LIBRARIES **/
//=include lib/cookies.js
//=include lib/jscolor.js
//=include lib/sortable.js

//=include data/consts.js
//=include data/palettes.js

/** UTILITY AND INPUT **/
//=include Util.js
//=include Events.js
//=include Dialogue.js
//=include History.js
//=include Settings.js
//=include EditorState.js

/** COLOR-RELATED **/
//=include Color.js
//=include ColorPicker.js
//=include PaletteBlock.js

/** BASE CLASSES **/
//=include File.js
//=include Tool.js
//=include layers/Layer.js

/** SPECIAL LAYERS **/
//=include layers/Checkerboard.js
//=include layers/PixelGrid.js
//=include layers/SymmetryModule.js

/** TOOLS **/
//=include tools/DrawingTool.js
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

/** MODULES AND MENUS **/
//=include SplashPage.js
//=include PresetModule.js
//=include ColorModule.js
//=include ToolManager.js
//=include LayerList.js

/** STARTUP AND FILE MANAGEMENT **/
//=include Startup.js
//=include FileManager.js
//=include TopMenuModule.js

/** HTML INPUT EVENTS **/
//=include Input.js

/** IHER **/
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
    if (EditorState.documentCreated)
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
