//populate palettes list in new pixel menu
(() => {
    const palettesMenu = document.getElementById('palette-menu');
    const splashPalettes = document.getElementById('palette-menu-splash');
    const noPaletteButton = document.getElementById('no-palette-button');
    const newPixelElement = document.getElementById('new-pixel');
    const paletteButton = document.getElementById('palette-button');
    const paletteButtonSplash = document.getElementById('palette-button-splash');
    const loadPaletteButton = document.getElementById('load-palette-button');
    const loadPaletteButtonSplash = document.getElementById('load-palette-button-splash');

    Object.keys(palettes).forEach((paletteName,) => {

        const button = document.createElement('button');
        button.appendChild(document.createTextNode(paletteName));

        //if the palette was specified by the user, change the dropdown to it
        if (palettes[paletteName].specified) {
            Utility().setText('palette-button', paletteName);
            Utility().setText('palette-button-splash', paletteName)
            //Show empty palette option
            noPaletteButton.style.display = 'block';
        }

        const buttonEvent = () => {
            //hide the dropdown menu
            Utility().deselect('palette-menu');
            Utility().deselect('palette-button');
            Utility().deselect('palette-menu-splash');
            Utility().deselect('palette-button-splash');

            //show empty palette option
            noPaletteButton.style.display = 'block';

            //set the text of the dropdown to the newly selected preset
            Utility().setText('palette-button', paletteName);
            Utility().setText('palette-button-splash', paletteName);
        }

        // Making a copy for the splash page too
        const copyButton = button.cloneNode(true);
        copyButton.addEventListener('click', buttonEvent);
        button.addEventListener('click', buttonEvent);

        // Appending it to the splash palette menu
        splashPalettes.appendChild(copyButton);
        palettesMenu.appendChild(button);
    });


    const loadPaletteButtonEvent = () => {
        document.getElementById('load-palette-browse-holder').click();
    }
    const clickPaletteButtonEvent = (e) => {
        Utility().toggle('palette-button');
        Utility().toggle('palette-menu');

        Utility().deselect('preset-button');
        Utility().deselect('preset-menu');

        // Splash version
        Utility().toggle('palette-button-splash');
        Utility().toggle('palette-menu-splash');

        e.stopPropagation();
    }
    // Load Palettes
    loadPaletteButton.addEventListener('click', loadPaletteButtonEvent);
    loadPaletteButtonSplash.addEventListener('click', loadPaletteButtonEvent);

    // Palette menu click
    paletteButtonSplash.addEventListener('click', clickPaletteButtonEvent);
    paletteButton.addEventListener('click', clickPaletteButtonEvent);

    noPaletteButton.addEventListener('click', () => {
        noPaletteButton.style.display = 'none';
        Utility().setText('palette-button', 'Choose a palette...');
    })

    newPixelElement.addEventListener('click', () => {
        Utility().deselect('editor-mode-menu');
        Utility().deselect('preset-button');
        Utility().deselect('preset-menu');
        Utility().deselect('palette-button');
        Utility().deselect('palette-menu');

        // Splash version
        Utility().deselect('palette-button-splash');
        Utility().deselect('palette-menu-splash');
    })
})(); 