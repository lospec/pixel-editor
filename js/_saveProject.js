/**
 * Opens the save project window and initializes events for save project customization.
 */
function openSaveProjectWindow() {
    //create name
    var selectedPalette = getText('palette-button');
    if (selectedPalette != 'Choose a palette...'){
        var paletteAbbreviation = palettes[selectedPalette].abbreviation;
        var fileName = 'pixel-'+paletteAbbreviation+'-'+canvasSize[0]+'x'+canvasSize[1];
    } else {
        var fileName = 'pixel-'+canvasSize[0]+'x'+canvasSize[1];
        selectedPalette = 'none';
    }

    setValue('lpe-file-name', fileName);

    document.getElementById("save-project-confirm").addEventListener("click", saveProject);

    showDialogue('save-project', false);
}

/**
 * Downloads the .lpe file for the current project.
 */
function saveProject() {
    var fileName = `${getValue('lpe-file-name')}.lpe`;

    // create file content
    var content = getProjectData();

    //set download link
    var linkHolder = document.getElementById('save-project-link-holder');

    linkHolder.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
    linkHolder.download = fileName;
    linkHolder.click();

    ga('send', 'event', 'Pixel Editor Save', selectedPalette, canvasSize[0]+'/'+canvasSize[1]); /*global ga*/ 
}