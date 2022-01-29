const Startup = (() => {
    let splashPostfix = '';

    Events.on('click', 'create-button', create, false);
    Events.on('click', 'create-button-splash', create, true);

    function create(isSplash) {
        // If I'm creating from the splash menu, I append '-splash' so I get the corresponding values
        if (isSplash)
            splashPostfix = '-splash';
        else
            splashPostfix = '';
    
        var width = Util.getValue('size-width' + splashPostfix);
        var height = Util.getValue('size-height' + splashPostfix);
        var selectedPalette = Util.getText('palette-button' + splashPostfix);
    
        newPixel(width, height);
        resetInput();
    
        //track google event
        if (typeof ga !== 'undefined')
            ga('send', 'event', 'Pixel Editor New', selectedPalette, width+'/'+height); /*global ga*/
    }

    /** Creates a new, empty file
     * 
     * @param {*} width Start width of the canvas
     * @param {*} height Start height of the canvas
     * @param {*} fileContent If fileContent != null, then the newPixel is being called from the open menu
     */
    function newPixel (width, height, fileContent = null) {       
        // The palette is empty, at the beginning
        ColorModule.resetPalette();

        initLayers(width, height);
        initPalette();

        // Closing the "New Pixel dialogue"
        Dialogue.closeDialogue();
        // Updating the cursor of the current tool
        ToolManager.currentTool().updateCursor();

        // The user is now able to export the Pixel
        document.getElementById('export-button').classList.remove('disabled');

        // Now, if I opened an LPE file
        if (fileContent != null) {
            loadFromLPE(fileContent);
            // Deleting the default layer
            LayerList.deleteLayer(false);
            // Selecting the new one
            currFile.layers[1].selectLayer();
        }

        EditorState.switchMode(EditorState.getCurrentMode());
        // This is not the first Pixel anymore
        EditorState.created();
    }

    function initLayers(width, height) {
        // Setting the general canvasSize
        currFile.canvasSize = [width, height];

        // If this is the first pixel I'm creating since the app has started
        if (EditorState.firstPixel()) {
            // Creating the first layer
            currFile.currentLayer = new Layer(width, height, 'pixel-canvas', "");
            currFile.currentLayer.canvas.style.zIndex = 2;
        }
        else {
            // Deleting all the extra layers and canvases, leaving only one
            let nLayers = currFile.layers.length;
            for (let i=2; i < currFile.layers.length - nAppLayers; i++) {
                let currentEntry = currFile.layers[i].menuEntry;
                let associatedLayer;

                if (currentEntry != null) {
                    // Getting the associated layer
                    associatedLayer = LayerList.getLayerByID(currentEntry.id);

                    // Deleting its canvas
                    associatedLayer.canvas.remove();

                    // Adding the id to the unused ones
                    Layer.unusedIDs.push(currentEntry.id);
                    // Removing the entry from the menu
                    currentEntry.remove();

                }
            }

            // Removing the old layers from the list
            for (let i=2; i<nLayers - nAppLayers; i++) {
                currFile.layers.splice(2, 1);
            }

            // Setting up the current layer
            currFile.layers[1] = new Layer(width, height, currFile.layers[1].canvas, currFile.layers[1].menuEntry);
            currFile.currentLayer = currFile.layers[1];
            currFile.currentLayer.canvas.style.zIndex = 2;
        }

        // Adding the checkerboard behind it
        currFile.checkerBoard = new Checkerboard(width, height, null);
        // Pixel grid
        console.log("CREATED GRID");
        currFile.pixelGrid = new PixelGrid(width, height, "pixel-grid");

        // Horizontal symmetric layer
        currFile.hSymmetricLayer = new HSymmetryLayer(width, height, "horizontal-symmetric");

        // Vertical symmetric layer
        currFile.vSymmetricLayer = new VSymmetryLayer(width, height, "vertical-symmetric");

        // Creating the vfx layer on top of everything
        currFile.VFXLayer = new Layer(width, height, 'vfx-canvas');
        // Tmp layer to draw previews on
        currFile.TMPLayer = new Layer(width, height, 'tmp-canvas');

        if (EditorState.firstPixel()) {            
            // Adding the first layer and the checkerboard to the list of layers
            currFile.layers.push(currFile.checkerBoard);
            currFile.layers.push(currFile.currentLayer);
            currFile.layers.push(currFile.TMPLayer);
            currFile.layers.push(currFile.pixelGrid);
            currFile.layers.push(currFile.hSymmetricLayer);
            currFile.layers.push(currFile.vSymmetricLayer);
            currFile.layers.push(currFile.VFXLayer);
        }
    }

    function initPalette() {
        // Get selected palette
        let selectedPalette = Util.getText('palette-button' + splashPostfix);

        //remove current palette
        let colors = document.getElementsByClassName('color-button');
        while (colors.length > 0) {
            colors[0].parentElement.remove();
        }

        // If the user selected a palette and isn't opening a file, I load the selected palette
        if (selectedPalette != 'Choose a palette...') {
            if (selectedPalette === 'Loaded palette') {
                ColorModule.createColorPalette(palettes['Loaded palette'].colors);
            }
            else {
                //if this palette isnt the one specified in the url, then reset the url
                if (!palettes[selectedPalette].specified)
                    history.pushState(null, null, '/pixel-editor');
                
                //fill the palette with specified colours
                ColorModule.createColorPalette(palettes[selectedPalette].colors);
            }
        }
        // Otherwise, I just generate 2 semirandom colours
        else {
            //this wasn't a specified palette, so reset the url
            history.pushState(null, null, '/pixel-editor');

            //generate default colors
            var fg = new Color("hsv", Math.floor(Math.random()*360), 50, 50).rgb;
            var bg = new Color("hsv", Math.floor(Math.random()*360), 80, 100).rgb;

            //convert colors to hex
            var defaultForegroundColor = Color.rgbToHex(fg);
            var defaultBackgroundColor = Color.rgbToHex(bg);

            //add colors to palette
            ColorModule.addColor(defaultForegroundColor).classList.add('selected');
            ColorModule.addColor(defaultBackgroundColor);

            //set current drawing color as foreground color
            ColorModule.updateCurrentColor('#'+defaultForegroundColor);
            selectedPalette = 'none';
        }
    }

    function loadFromLPE(fileContent) {
        // I add every layer the file had in it
        for (let i=0; i<fileContent['nLayers']; i++) {
            let layerData = fileContent['layer' + i];
            let layerImage = fileContent['layer' + i + 'ImageData'];

            if (layerData != null) {
                // Setting id
                let createdLayer = LayerList.addLayer(layerData.id, false);
                // Setting name
                createdLayer.menuEntry.getElementsByTagName("p")[0].innerHTML = layerData.name;

                // Adding the image (I can do that because they're sorted by increasing z-index)
                let img = new Image();
                img.onload = function() {
                    createdLayer.context.drawImage(img, 0, 0);
                    createdLayer.updateLayerPreview();

                    if (i == (fileContent['nLayers'] - 1)) {
                        ColorModule.createPaletteFromLayers();
                    }
                };

                img.src = layerImage;

                // Setting visibility and lock options
                if (!layerData.isVisible) {
                    createdLayer.hide();
                }
                if (layerData.isLocked) {
                    createdLayer.lock();
                }
            }
        }
    }
    
    function resetInput() {
        //reset new form
        Util.setValue('size-width', 64);
        Util.setValue('size-height', 64);
    
        Util.setText('palette-button', 'Choose a palette...');
        Util.setText('preset-button', 'Choose a preset...');
    }

    function newFromTemplate(preset, x, y) {
        if (preset != '') {
            const presetProperties = PresetModule.propertiesOf(preset);
            Util.setText('palette-button-splash', presetProperties.palette);
            Util.setText('palette-button', presetProperties.palette);
            
            x = presetProperties.width;
            y = presetProperties.height;
        }
        newPixel(x, y);
    }

    function splashEditorMode(mode) {
        editorMode = mode;
    }

    return {
        create,
        newPixel,
        newFromTemplate,
        splashEditorMode
    }
})();