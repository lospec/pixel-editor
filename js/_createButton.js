function create(isSplash) {
    var splashPostfix = '';
    // If I'm creating from the splash menu, I append '-splash' so I get the corresponding values
    if (isSplash) {
        splashPostfix = '-splash';
    }

    var width = Util.getValue('size-width' + splashPostfix);
    var height = Util.getValue('size-height' + splashPostfix);

    newPixel(width, height);
    
    // If I'm not creating from the splash page, then this is not the first project I've created
    if (!isSplash)
        document.getElementById('new-pixel-warning').style.display = 'block';

    //get selected palette name
    var selectedPalette = Util.getText('palette-button' + splashPostfix);
    if (selectedPalette == 'Choose a palette...') 
        selectedPalette = 'none';

    //track google event
    if (typeof ga !== 'undefined')
        ga('send', 'event', 'Pixel Editor New', selectedPalette, width+'/'+height); /*global ga*/

    //reset new form
    Util.setValue('size-width', 64);
    Util.setValue('size-height', 64);

    Util.setText('palette-button', 'Choose a palette...');
    Util.setText('preset-button', 'Choose a preset...');
}

/** Triggered when the "Create" button in the new pixel dialogue is pressed
 * 
 */
Input.on('click', 'create-button', create, false);

/** Triggered when the "Create" button in the splash page is pressed
 * 
 */
 Input.on('click', 'create-button-splash', create, true);
