const EditorState = (() => {
    let pixelEditorMode = "Basic";

    Events.on('click', 'switch-editor-mode-splash', function (e) {toggleMode();});
    Events.on('click', 'switch-mode-button', function (e) {toggleMode();});

    function getCurrentMode() {
        return pixelEditorMode;
    }

    function switchMode(newMode) {
        //switch to advanced mode
        if (newMode == 'Advanced' && pixelEditorMode == 'Basic') {
            // Switch to advanced ez pez lemon squez
            document.getElementById('switch-mode-button').innerHTML = 'Switch to basic mode';
            // Show the layer menus
            LayerList.getLayerListEntries().style.display = "inline-block";
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
                if (!confirm('Switching to basic mode will flatten all the visible layers. Are you sure you want to continue?')) {
                    return;
                }
    
                // Selecting the current layer
                currentLayer.selectLayer();
                // Flatten the layers
                LayerList.flatten(true);
            }
    
            //change menu text
            document.getElementById('switch-mode-button').innerHTML = 'Switch to advanced mode';
    
            // Hide the layer menus
            LayerList.getLayerListEntries().style.display = 'none';
            document.getElementById('layer-button').style.display = 'none';
            // Show the palette menu
            document.getElementById('colors-menu').style.display = 'flex';
            // Move the palette menu
            document.getElementById('colors-menu').style.right = '0px';
    
            //change splash text
            document.querySelector('#sp-quickstart-container .mode-switcher').classList.remove('advanced-mode');
    
            pixelEditorMode = 'Basic';
            togglePixelGrid('off');
        }
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