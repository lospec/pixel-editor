/**
 * Opens the export window and initializes events for export customization.
 */
function openPixelExportWindow() {
    var selectedPalette = getText('palette-button');

    if (selectedPalette != 'Choose a palette...'){
        var paletteAbbreviation = palettes[selectedPalette].name;
        var fileName = 'pixel-'+paletteAbbreviation+'-'+layers[0].canvasSize[0]+'x'+layers[0].canvasSize[1]+'.png';
    } else {
        var fileName = 'pixel-'+layers[0].canvasSize[0]+'x'+layers[0].canvasSize[1]+'.png';
        selectedPalette = 'none';
    }

    setValue('file-name', fileName);

    document.getElementById("export-confirm").addEventListener("click", exportPixel);

    showDialogue('export', false);
}

/**
 * Exports the pixel based on the export dialogue.
 */
function exportPixel() {
    if (documentCreated) {
        var fileName = getValue('file-name');

        //set download link
        var linkHolder = document.getElementById('save-image-link-holder');
        // Creating a tmp canvas to flatten everything
        var exportCanvas = document.createElement("canvas");
        var emptyCanvas = document.createElement("canvas");
        var layersCopy = layers.slice();

        exportCanvas.width = layers[0].canvasSize[0];
        exportCanvas.height = layers[0].canvasSize[1];

        emptyCanvas.width = layers[0].canvasSize[0];
        emptyCanvas.height = layers[0].canvasSize[1];

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
}