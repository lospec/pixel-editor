const EditorState = (() => {
    let pixelEditorMode = "Basic";
    
    Events.on('click', 'switch-editor-mode-splash', chooseMode);
    Events.on('click', 'switch-mode-button', toggleMode);

    function getCurrentMode() {
        return pixelEditorMode;
    }

    function switchMode(newMode) {
        //switch to advanced mode
        if (newMode == 'Advanced') {
            // Show the layer menus
            LayerList.getLayerListEntries().style.display = "inline-block";
            document.getElementById('layer-button').style.display = 'inline-block';
            // Hide the palette menu
            document.getElementById('colors-menu').style.right = '200px'
    
            pixelEditorMode = 'Advanced';
    
            //turn pixel grid off
            togglePixelGrid('off');
        }
        //switch to basic mode
        else {
            //if there is a current layer (a document is active)
            if (Startup.documentCreated()) {
                if (!confirm('Switching to basic mode will flatten all the visible layers. Are you sure you want to continue?')) {
                    return;
                }
    
                // Selecting the current layer
                currentLayer.selectLayer();
                // Flatten the layers
                LayerList.flatten(true);
            }
    
            // Hide the layer menus
            LayerList.getLayerListEntries().style.display = 'none';
            document.getElementById('layer-button').style.display = 'none';
            // Show the palette menu
            document.getElementById('colors-menu').style.display = 'flex';
            // Move the palette menu
            document.getElementById('colors-menu').style.right = '0px';

            pixelEditorMode = 'Basic';
            togglePixelGrid('on');
        }
    }

    function chooseMode() {
        console.log("Here");
        let prevMode = pixelEditorMode.toLowerCase();

        if (pixelEditorMode === "Basic") {
            pixelEditorMode = "Advanced";
        }
        else {
            pixelEditorMode = "Basic";
        }

        //change splash text
        document.querySelector('#sp-quickstart-container .mode-switcher').classList.remove(prevMode + '-mode');
        document.querySelector('#sp-quickstart-container .mode-switcher').classList.add(pixelEditorMode.toLowerCase() + '-mode');
    }
    
    function toggleMode() {
        if (pixelEditorMode == 'Advanced')
            switchMode('Basic');
        else
            switchMode('Advanced');
    }

    return {
        getCurrentMode,
        switchMode
    }
})();