var mainMenuItems = document.getElementById('main-menu').children;

//for each button in main menu (starting at 1 to avoid logo)
for (var i = 1; i < mainMenuItems.length; i++) {

    //get the button that's in the list item
    var menuItem = mainMenuItems[i];
    var menuButton = menuItem.children[0];

    //when you click a main menu items button
    on('click', menuButton, function (e, button) {
        select(button.parentElement);
    });

    var subMenu = menuItem.children[1];
    var subMenuItems = subMenu.children;

    //when you click an item within a menu button
    for (var j = 0; j < subMenuItems.length; j++) {

        var subMenuItem = subMenuItems[j];
        var subMenuButton = subMenuItem.children[0];

        subMenuButton.addEventListener('click', function (e) {

            switch(this.textContent) {

                //File Menu
                case 'New':
                    showDialogue('new-pixel');
                    break;
                case 'Save project':
                    //create name
                    var selectedPalette = getText('palette-button');
                    if (selectedPalette != 'Choose a palette...'){
                        var paletteAbbreviation = palettes[selectedPalette].abbreviation;
                        var fileName = 'pixel-'+paletteAbbreviation+'-'+canvasSize[0]+'x'+canvasSize[1]+'.lpe';
                    } else {
                        var fileName = 'pixel-'+canvasSize[0]+'x'+canvasSize[1]+'.lpe';
                        selectedPalette = 'none';
                    }

                    //set download link
                    var linkHolder = document.getElementById('save-project-link-holder');
                    // create file content
                    var content = getProjectData();

                    linkHolder.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
                    linkHolder.download = fileName;
                    linkHolder.click();

                    ga('send', 'event', 'Pixel Editor Save', selectedPalette, canvasSize[0]+'/'+canvasSize[1]); /*global ga*/

                    break;
                case 'Open':
                    //if a document exists
                    if (documentCreated) {
                        //check if the user wants to overwrite
                        if (confirm('Opening a pixel will discard your current one. Are you sure you want to do that?'))
                            //open file selection dialog
                            document.getElementById('open-image-browse-holder').click();
                    }
                    else
                        //open file selection dialog
                        document.getElementById('open-image-browse-holder').click();

                    break;

                case 'Export':
                    if (documentCreated) {
                        //create name
                        var selectedPalette = getText('palette-button');
                        if (selectedPalette != 'Choose a palette...'){
                            var paletteAbbreviation = palettes[selectedPalette].abbreviation;
                            var fileName = 'pixel-'+paletteAbbreviation+'-'+canvasSize[0]+'x'+canvasSize[1]+'.png';
                        } else {
                            var fileName = 'pixel-'+canvasSize[0]+'x'+canvasSize[1]+'.png';
                            selectedPalette = 'none';
                        }

                        //set download link
                        var linkHolder = document.getElementById('save-image-link-holder');
                        // Creating a tmp canvas to flatten everything
                        var exportCanvas = document.createElement("canvas");
                        var emptyCanvas = document.createElement("canvas");
                        var layersCopy = layers.slice();

                        exportCanvas.width = canvasSize[0];
                        exportCanvas.height = canvasSize[1];

                        emptyCanvas.width = canvasSize[0];
                        emptyCanvas.height = canvasSize[1];

                        // Sorting the layers by z index
                        layersCopy.sort((a, b) => (a.canvas.style.zIndex > b.canvas.style.zIndex) ? 1 : -1);

                        // Merging every layer on the export canvas
                        for (let i=0; i<layersCopy.length; i++) {
                            if (layersCopy[i].menuEntry != null && layersCopy[i].isVisible) {
                                mergeLayers(exportCanvas.getContext('2d'), layersCopy[i].context);
                            }
                            // I'm not going to find out why the layer ordering screws up if you don't copy
                            // a blank canvas when layers[i] is not set as visible, but if you have time to
                            // spend, feel free to investigate (comment the else, create 3 layers: hide the 
                            // middle one and export, the other 2 will be swapped in their order)
                            else {
                                mergeLayers(exportCanvas.getContext('2d'), emptyCanvas.getContext('2d'));
                            }
                        }

                        linkHolder.href = exportCanvas.toDataURL();
                        linkHolder.download = fileName;

                        linkHolder.click();

                        emptyCanvas.remove();
                        exportCanvas.remove();

                        //track google event
                        ga('send', 'event', 'Pixel Editor Export', selectedPalette, canvasSize[0]+'/'+canvasSize[1]); /*global ga*/
                    }

                    break;

                case 'Exit':

                    console.log('exit');
                    //if a document exists, make sure they want to delete it
                    if (documentCreated) {

                        //ask user if they want to leave
                        if (confirm('Exiting will discard your current pixel. Are you sure you want to do that?'))
                            //skip onbeforeunload prompt
                            window.onbeforeunload = null;
                        else
                            e.preventDefault();
                    }

                    break;
                    //Edit Menu
                case 'Undo':
                    undo();
                    break;
                case 'Redo':
                    redo();
                    break;

                    //Palette Menu
                case 'Add color':
                    addColor('#eeeeee');
                    break;
                    // SELECTION MENU
                case 'Paste':
                    pasteSelection();
                    break;
                case 'Copy':
                    copySelection();
                    tool.pencil.switchTo();
                    break;
                case 'Cut':
                    cutSelectionTool();
                    tool.pencil.switchTo();
                    break;
                case 'Cancel':
                    tool.pencil.switchTo();
                    break;
                    //Help Menu
                case 'Settings':
                    //fill form with current settings values
                    setValue('setting-numberOfHistoryStates', settings.numberOfHistoryStates);

                    showDialogue('settings');
                    break;
                    //Help Menu
                case 'Help':
                    showDialogue('help');
                    break;
                case 'About':
                    showDialogue('about');
                    break;
                case 'Changelog':
                    showDialogue('changelog');
                    break;
            }

            closeMenu();
        });
    }
}

function closeMenu () {
    //remove .selected class from all menu buttons
    for (var i = 0; i < mainMenuItems.length; i++) {
        deselect(mainMenuItems[i]);
    }
}

function getProjectData() {
    // use a dictionary
    let dictionary = {};
    // sorting layers by increasing z-index
    let layersCopy = layers.slice();
    layersCopy.sort((a, b) => (a.canvas.style.zIndex > b.canvas.style.zIndex) ? 1 : -1);
    // save canvas size
    dictionary['canvasWidth'] = currentLayer.canvasSize[0];
    dictionary['canvasHeight'] = currentLayer.canvasSize[1];
    // save editor mode
    dictionary['editorMode'] = pixelEditorMode;
    // save palette
    for (let i=0; i<currentPalette.length; i++) {
        dictionary["color" + i] = currentPalette[i];
    }

    // save number of layers
    dictionary["nLayers"] = layersCopy.length;

    // save layers 
    for (let i=0; i<layersCopy.length; i++) {
        // Only saving the layers the user has access to (no vfx, tmp or checkerboard layers)
        if (layersCopy[i].menuEntry != null) {
            dictionary["layer" + i] = layersCopy[i];
            dictionary["layer" + i + "ImageData"] = layersCopy[i].canvas.toDataURL();
        }
    }
    
    return JSON.stringify(dictionary);
}