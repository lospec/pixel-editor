/** Triggered when the "Create" button in the new pixel dialogue is pressed
 * 
 */
on('click', 'create-button', function (){
    // Getting the values of the form
    var width = getValue('size-width');
    var height = getValue('size-height');
    var mode = getValue("editor-mode");

    // Creating a new pixel with those properties
    newPixel(width, height, mode);
    document.getElementById('new-pixel-warning').style.display = 'block';

    //get selected palette name
    var selectedPalette = getText('palette-button');
    if (selectedPalette == 'Choose a palette...') 
        selectedPalette = 'none';

    //track google event
    ga('send', 'event', 'Pixel Editor New', selectedPalette, width+'/'+height); /*global ga*/


    //reset new form
    setValue('size-width', 64);
    setValue('size-height', 64);
    setValue("editor-mode", 'Advanced')

    setText('editor-mode-button', 'Choose a mode...');
    setText('palette-button', 'Choose a palette...');
    setText('preset-button', 'Choose a preset...');
});
