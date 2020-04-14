//when the page is donw loading, you can get ready to start
window.onload = function(){
    updateCursor();

    //if the user specified dimentions
    if (specifiedDimentions)
        //create a new pixel
        newPixel(getValue('size-width'),getValue('size-height'),'');
    else
        //otherwise show the new pixel dialog
        showDialogue('new-pixel', false);
};
