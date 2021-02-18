//populate palettes list in new pixel menu
Object.keys(palettes).forEach(function(paletteName,index) {

    var palettesMenu = document.getElementById('palette-menu');
    var splashPalettes = document.getElementById('palette-menu-splash');

    //create button
    var button = document.createElement('button');
    button.appendChild(document.createTextNode(paletteName));

    //if the palette was specified by the user, change the dropdown to it
    if (palettes[paletteName].specified == true) {
        setText('palette-button', paletteName);
        setText('palette-button-splash', paletteName)
        //Show empty palette option
        document.getElementById('no-palette-button').style.display = 'block';
    }

    var buttonEvent = function() {

        //hide the dropdown menu
        deselect('palette-menu');
        deselect('palette-button');
        deselect('palette-menu-splash');
        deselect('palette-button-splash');

        //show empty palette option
        document.getElementById('no-palette-button').style.display = 'block';

        //set the text of the dropdown to the newly selected preset
        setText('palette-button', paletteName);
        setText('palette-button-splash', paletteName);
    };

    on('click', button, buttonEvent);

    //insert new element
    palettesMenu.appendChild(button);

    // Making a copy for the splash page too
    var copyButton = button.cloneNode(true);
    // Attaching the same event
    on('click', copyButton, buttonEvent);
    // Appending it to the splash palette menu
    splashPalettes.appendChild(copyButton);
});

var noPaletteButtonClickEvent = function () {
    document.getElementById('no-palette-button').style.display = 'none';
    setText('palette-button', 'Choose a palette...');
}

var loadPaletteButtonEvent = function () {
    document.getElementById('load-palette-browse-holder').click();
}

var clickPaletteButtonEvent = function (e){
    toggle('palette-button');
    toggle('palette-menu');

    deselect('preset-button');
    deselect('preset-menu');

    // Splash version
    toggle('palette-button-splash');
    toggle('palette-menu-splash');

    e.stopPropagation();
}

//select no palette
on('click', 'no-palette-button', noPaletteButtonClickEvent);

//select load palette
on('click', 'load-palette-button', loadPaletteButtonEvent);
//select load palette
on('click', 'load-palette-button-splash', loadPaletteButtonEvent);

// Palette menu click
on('click', 'palette-button', clickPaletteButtonEvent);
on('click', 'palette-button-splash', clickPaletteButtonEvent);

on('click', 'new-pixel', function (){
    deselect('editor-mode-menu');
    deselect('preset-button');
    deselect('preset-menu');
    deselect('palette-button');
    deselect('palette-menu');

    // Splash version
    deselect('palette-button-splash');
    deselect('palette-menu-splash');
});