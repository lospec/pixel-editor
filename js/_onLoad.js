//when the page is done loading, you can get ready to start
window.onload = function () {

    featureToggles.onLoad();

    currentTool.updateCursor();

    //if the user specified dimensions
    if (specifiedDimentions) {
        //create a new pixel
        newPixel(getValue('size-width'), getValue('size-height'), getValue('editor-mode'));
    } else {
        //otherwise show the new pixel dialog
        showDialogue('splash', false);
    }

};