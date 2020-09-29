var settings;

if (!Cookies.enabled) {
    document.getElementById('cookies-disabled-warning').style.display = 'block';
}

//try to load settings from cookie
var settingsFromCookie = Cookies.get('pixelEditorSettings');
if(!settingsFromCookie) {
    console.log('settings cookie not found');
    settings = {
        switchToChangedColor: true,
        enableDynamicCursorOutline: true, //unused - performance
        enableBrushPreview: true, //unused - performance
        enableEyedropperPreview: true, //unused - performance
        numberOfHistoryStates: 20,
        maxColorsOnImportedImage: 128,
        pixelGridColour: '#0000FF'
    };
}
else{
    console.log('settings cookie found');
    console.log(settingsFromCookie);
    var settings = JSON.parse(settingsFromCookie);
}
console.log(settings);

//on clicking the save button in the settings dialog
on('click', 'save-settings', function (){

    //check if values are valid
    if (isNaN(getValue('setting-numberOfHistoryStates'))) {
        alert('Invalid value for numberOfHistoryStates');
        return;
    }

    //save new settings to settings object
    settings.numberOfHistoryStates = getValue('setting-numberOfHistoryStates');
    settings.pixelGridColour = getValue('setting-pixelGridColour');
    // Filling pixel grid again if colour changed
    fillPixelGrid();

    //save settings object to cookie
    var cookieValue = JSON.stringify(settings);
    Cookies.set('pixelEditorSettings', cookieValue, { expires: Infinity });

    //close window
    closeDialogue();
});
