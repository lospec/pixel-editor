const Settings = (() => {
    let settings;
    let settingsFromCookie;

    //on clicking the save button in the settings dialog
    Events.on('click', 'save-settings', saveSettings);

    init();

    function init() {
        if (!Cookies.enabled) {
            document.getElementById('cookies-disabled-warning').style.display = 'block';
        }
        settingsFromCookie = Cookies.get('pixelEditorSettings');

        if(!settingsFromCookie) {
            console.log('settings cookie not found');

            settings = {
                switchToChangedColor: true,
                enableDynamicCursorOutline: true, //unused - performance
                enableBrushPreview: true, //unused - performance
                enableEyedropperPreview: true, //unused - performance
                numberOfHistoryStates: 20,
                maxColorsOnImportedImage: 128,
                pixelGridColour: '#000000'
            };
        }
        else{
            console.log('settings cookie found');
            console.log(settingsFromCookie);

            settings = JSON.parse(settingsFromCookie);
        }
    }

    function saveSettings() {
        //check if values are valid
        if (isNaN(Util.getValue('setting-numberOfHistoryStates'))) {
            alert('Invalid value for numberOfHistoryStates');
            return;
        }
    
        //save new settings to settings object
        settings.numberOfHistoryStates = Util.getValue('setting-numberOfHistoryStates');
        settings.pixelGridColour = Util.getValue('setting-pixelGridColour');
        // Filling pixel grid again if colour changed
        fillPixelGrid();
    
        //save settings object to cookie
        var cookieValue = JSON.stringify(settings);
        Cookies.set('pixelEditorSettings', cookieValue, { expires: Infinity });
    
        //close window
        Dialogue.closeDialogue();
    }

    function getCurrSettings() {
        return settings;
    }

    return {
        getCurrSettings
    }

})();