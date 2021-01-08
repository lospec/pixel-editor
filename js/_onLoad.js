//when the page is donw loading, you can get ready to start
window.onload = function(){
  currentTool.updateCursor();

  //if the user specified dimentions
  if (specifiedDimentions)
    //create a new pixel
    newPixel(getValue('size-width'),getValue('size-height'), getValue('editor-mode'));
  else
    //otherwise show the new pixel dialog
    if (settings.showLog != undefined && !settings.showLog)
      showDialogue('new-pixel', false);
};