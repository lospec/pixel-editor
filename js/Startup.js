const Startup = (() => {
    let splashPostfix = '';

    let cacheIntervalIdx;

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
    
        newPixel(FileManager.defaultLPE(width,height));
        resetInput();
    
        //track google event
        if (typeof ga !== 'undefined')
            ga('send', 'event', 'Pixel Editor New', selectedPalette, width+'/'+height); /*global ga*/
    }

    /** Creates a new, empty file
     * 
     * @param {*} lpe If lpe != null, then the newPixel is being called from the open menu
     * @param {*} skipModeConfirm If skipModeConfirm == true, then the mode switching confirmation will be skipped
     */
    function newPixel (lpe = null, skipModeConfirm = false) {    
        console.log('called newPixel');   
        console.trace();
        // The palette is empty, at the beginning
        ColorModule.resetPalette();

        initLayers(lpe);
        initPalette();

        // Closing the "New Pixel dialogue"
        Dialogue.closeDialogue();
        // Updating the cursor of the current tool
        ToolManager.currentTool().updateCursor();

        // The user is now able to export the Pixel
        document.getElementById('export-button').classList.remove('disabled');

        if (lpe != null) {
            FileManager.loadFromLPE(lpe);
        }
        ////console.log('ColorModule.getCurrentPalette() === ',ColorModule.getCurrentPalette());
        
        EditorState.switchMode(EditorState.getCurrentMode(), skipModeConfirm);
        // This is not the first Pixel anymore
        EditorState.created();

        ////console.log('ColorModule.getCurrentPalette() === ',ColorModule.getCurrentPalette());
        ////console.trace();
    }
    function clearLayers() {
        console.dir(currFile.layers);
        for(let i = currFile.layers.length-1; i >= 0;i--) {
            currFile.layers[i].delete(i);
        }
        console.dir(currFile.layers);
        for(let i = currFile.sublayers.length-1; i >= 0;i--) {
            currFile.sublayers[i].delete(i);
        }
    }
    function initLayers(lpe) {
        //console.group('called initLayers');
        //console.log('currFile.layers === ',currFile.layers);

        const width = lpe.canvasWidth = Number(lpe.canvasWidth);
        const height = lpe.canvasHeight = Number(lpe.canvasHeight);
        clearLayers();

        // debugger;
        //
        currFile.canvasSize = [width, height];
        console.log('lpe === ',lpe);
        if( lpe.layers && lpe.layers.length ) {
            currFile.currentLayer = new Layer(width, height, `pixel-canvas`,"","layer-li-template");
            currFile.currentLayer.canvas.style.zIndex = 2;
            currFile.sublayers.push(currFile.currentLayer);

            let selectedIdx = lpe.selectedLayer ?? 0;

            lpe.layers.forEach((layerData, i) => {
                //console.log('lpe.layers[i] === ', i);
                const _i = lpe.layers.length - i;
                let layerImage = layerData.src;
                if (layerData != null) {
                    // Setting id
                    let createdLayer = LayerList.addLayer(layerData.id, false, layerData.name);
                    createdLayer.canvas.style.zIndex = (_i+1) * 10;
                    if(i===selectedIdx)createdLayer.selectLayer();
                    // Setting name
                    createdLayer.menuEntry.getElementsByTagName("p")[0].innerHTML = layerData.name;
    
                    // Adding the image (I can do that because they're sorted by increasing z-index)
                    let img = new Image();
                    img.onload = function() {
                        createdLayer.context.drawImage(img, 0, 0);
                        createdLayer.updateLayerPreview();
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
            });

        } else {
            currFile.currentLayer = new Layer(width, height, `pixel-canvas`,"");
            currFile.currentLayer.canvas.style.zIndex = 2;
            currFile.sublayers.push(currFile.currentLayer);
            
            const defaultLayerId = "layer0";
            const defaultLayerName = "Layer 0";
            
            let createdLayer = LayerList.addLayer(defaultLayerId, false, defaultLayerName);
            createdLayer.selectLayer();
            // Setting name
            createdLayer.menuEntry.getElementsByTagName("p")[0].innerHTML = defaultLayerName;
        }

        // Adding the checkerboard behind it
        currFile.checkerBoard = new Checkerboard(width, height, null);
        // Pixel grid
        ////console.log("CREATED GRID");
        currFile.pixelGrid = new PixelGrid(width, height, "pixel-grid");

        // Creating the vfx layer on top of everything
        currFile.VFXLayer = new Layer(width, height, 'vfx-canvas');
        // Tmp layer to draw previews on
        currFile.TMPLayer = new Layer(width, height, 'tmp-canvas');

        currFile.sublayers.push(currFile.checkerBoard);
        currFile.sublayers.push(currFile.TMPLayer);
        currFile.sublayers.push(currFile.pixelGrid);
        currFile.sublayers.push(currFile.VFXLayer);
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
        
        newPixel(FileManager.defaultLPE(x,y));
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