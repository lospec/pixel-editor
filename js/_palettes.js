const { on } = require("gulp");

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
        document.getElementById('no-palette-button-splash').style.display = 'block';
    }

    var buttonEvent = function() {

        //hide the dropdown menu
        deselect('palette-menu');
        deselect('palette-button');
        deselect('palette-menu-splash');
        deselect('palette-button-splash');

        //show empty palette option
        document.getElementById('no-palette-button').style.display = 'block';
        document.getElementById('no-palette-button-splash').style.display = 'block';

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

//select no palette
on('click', 'no-palette-button', function () {
    document.getElementById('no-palette-button').style.display = 'none';
    setText('palette-button', 'Choose a palette...');

    // Same for splash page
    document.getElementById('no-palette-button-splash').style.display = 'none';
    setText('palette-button-splash', 'Choose a palette...');
});

//select load palette
on('click', 'load-palette-button', function () {
    document.getElementById('load-palette-browse-holder').click();
});


on('click', 'palette-button', function (e){
    toggle('palette-button');
    toggle('palette-menu');

    deselect('preset-button');
    deselect('preset-menu');

    // Splash version
    toggle('palette-button-splash');
    toggle('palette-menu-splash');

    deselect('preset-button-splash');
    deselect('preset-menu-splash');

    e.stopPropagation();
});

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

// ISSUE: use the same functions for the splash menu