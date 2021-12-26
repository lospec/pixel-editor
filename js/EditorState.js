const EditorState = (() => {
    let pixelEditorMode = "Basic";
    let firstFile = true;
    
    Events.on('click', 'switch-editor-mode-splash', chooseMode);
    Events.on('click', 'switch-mode-button', toggleMode);

    function getCurrentMode() {
        return pixelEditorMode;
    }

    function switchMode(newMode) {
        if (!firstFile && newMode == "Basic" && !confirm('Switching to basic mode will flatten all the visible layers. Are you sure you want to continue?')) {
            return;
        }
        //switch to advanced mode
        if (newMode == 'Advanced') {
            Events.emit("switchedToAdvanced");
            // Hide the palette menu
            document.getElementById('colors-menu').style.right = '200px'
    
            pixelEditorMode = 'Advanced';
            document.getElementById("switch-mode-button").innerHTML = 'Switch to basic mode';
        }
        //switch to basic mode
        else { 
            Events.emit("switchedToBasic");
            // Show the palette menu
            document.getElementById('colors-menu').style.display = 'flex';
            // Move the palette menu
            document.getElementById('colors-menu').style.right = '0px';

            pixelEditorMode = 'Basic';
            document.getElementById("switch-mode-button").innerHTML = 'Switch to advanced mode';
        }
    }

    function chooseMode() {
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

    function documentCreated() {
        return !firstFile;
    }

    function firstPixel() {
        return firstFile;
    }

    function created() {
        firstFile = false;
    }

    return {
        getCurrentMode,
        switchMode,
        documentCreated,
        created,
        firstPixel
    }
})();