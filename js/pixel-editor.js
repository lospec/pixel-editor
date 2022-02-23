/** EXTERNALS AND LIBRARIES **/
//=include lib/cookies.js
//=include lib/jscolor.js
//=include lib/sortable.js

//=include data/consts.js
//=include data/palettes.js

/** UTILITY AND INPUT **/
//=include Util.js
//=include Events.js
//=include InputComponents.js
//=include Dialogue.js
//=include History.js
//=include Settings.js
//=include EditorState.js

/** MENUS **/
//=include FileManager.js
//=include TopMenuModule.js

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

/** TOOLS **/
//=include tools/DrawingTool.js
//=include tools/ResizableTool.js
//=include tools/SelectionTool.js

//=include tools/BrushTool.js
//=include tools/EraserTool.js
//=include tools/LineTool.js
//=include tools/RectangleTool.js
//=include tools/EllipseTool.js
//=include tools/FillTool.js
//=include tools/EyeDropperTool.js
//=include tools/PanTool.js
//=include tools/ZoomTool.js
//=include tools/MoveSelectionTool.js
//=include tools/RectangularSelectionTool.js
//=include tools/LassoSelectionTool.js
//=include tools/MagicWandTool.js

/** MODULES AND MENUS **/
//=include SplashPage.js
//=include PresetModule.js
//=include ColorModule.js
//=include ToolManager.js
//=include LayerList.js

/** STARTUP AND FILE MANAGEMENT **/
//=include Startup.js

/** HTML INPUT EVENTS **/
//=include Input.js

/** IHER **/
//=include FeatureToggles.js

// Controls execution of this preset module
PresetModule.instrumentPresetMenu();

//when the page is done loading, you can get ready to start
window.onload = function () {
	// First cursor update
    ToolManager.currentTool().updateCursor();
	// Apply checkboxes


    let args = window.location.pathname.split('/');
    let paletteSlug = args[2];
    let dimensions = args[3];
    // let prefillWidth = args[4] ?? 9; // TODO
    // let prefill = args[5] ?? "110101111110100110111100110110101111";
    // let customColors = args[6] ?? ""; // ex: "#ffffff,#000000"
    // console.log('prefill === ',prefill);
    if(paletteSlug && dimensions) {

            //fetch palette via lospec palette API
            fetch('https://lospec.com/palette-list/'+paletteSlug+'.json')
                .then(response => response.json())
                .then(data => {
                    //palette loaded successfully
                    palettes[paletteSlug] = data;
                    palettes[paletteSlug].specified = true;
                    //refresh list of palettes
                    document.getElementById('palette-menu-splash').refresh();
                    
                    //if the dimensions were specified
                    if (dimensions && dimensions.length >= 3 && dimensions.includes('x')) {
                        let width = dimensions.split('x')[0];
                        let height = dimensions.split('x')[1];
                        const layers = [];
                        let selectedLayer;
                        Startup.newPixel({
                            canvasWidth: width,
                            canvasHeight: height,
                            selectedLayer,
                            colors: data.colors.map(n=>"#"+n),
                            layers
                        });
                    }
                    //dimensions were not specified -- show splash screen with palette preselected
                    else {
                        //show splash
                        Dialogue.showDialogue('new-pixel', false);
                    }
                })
                //error fetching url (either palette doesn't exist, or lospec is down)
                .catch((error) => {
                    //console.warn('failed to load palette "'+paletteSlug+'"', error);
                    //proceed to splash screen
                    Dialogue.showDialogue('splash', false);
                });
    } else {
        if(FileManager.localStorageCheck()) {
            //load cached document
            const lpe = FileManager.localStorageLoad();
            
            Startup.newPixel(lpe);
        }
        //check if there are any url parameters
        else if (window.location.pathname.replace('/pixel-editor/','').length <= 1)  {
            //show splash screen
            Dialogue.showDialogue('splash', false);
        }
    }
}

//prevent user from leaving page with unsaved data
// window.onbeforeunload = function() {
//     if (EditorState.documentCreated)
//         return 'You will lose your pixel if it\'s not saved!';

//     else return;
// };

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
