// OPTIMIZABLE: palette is known here, so why not pass it to _newPixel.js?

function create(isSplash) {
    var splashPostfix = '';
    // If I'm creating from the splash menu, I append '-splash' so I get the corresponding values
    if (isSplash) {
        splashPostfix = '-splash';
    }

    var width = getValue('size-width' + splashPostfix);
    var height = getValue('size-height' + splashPostfix);

    // If I'm creating from the splash screen, I use the splashMode variable
    var mode = isSplash ? splashMode : getValue('editor-mode');

    newPixel(width, height, mode);
    
    // If I'm not creating from the splash page, then this is not the first project I've created
    if (!isSplash)
        document.getElementById('new-pixel-warning').style.display = 'block';

    //get selected palette name
    var selectedPalette = getText('palette-button' + splashPostfix);
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
}

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

/** Triggered when the "Create" button in the new pixel dialogue is pressed
 * 
 */
on('click', 'create-button-splash', function (){
    // Getting the values of the form
    var width = getValue('size-width-splash');
    var height = getValue('size-height-splash');
    var mode = 'basic';

    // Creating a new pixel with those properties
    newPixel(width, height, mode);
    document.getElementById('new-pixel-warning').style.display = 'block';

    //get selected palette name
    /*var selectedPalette = getText('palette-button');
    if (selectedPalette == 'Choose a palette...') */
        selectedPalette = 'none';

    //track google event
    ga('send', 'event', 'Pixel Editor New', selectedPalette, width+'/'+height); /*global ga*/


    //reset new form
    setValue('size-width-splash', 64);
    setValue('size-height-splash', 64);
    /*setValue("editor-mode", 'Advanced')

    setText('editor-mode-button', 'Choose a mode...');
    setText('palette-button', 'Choose a palette...');
    setText('preset-button', 'Choose a preset...');*/   
});
