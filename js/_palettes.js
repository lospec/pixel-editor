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
            Util.setText('palette-button', paletteName);
            Util.setText('palette-button-splash', paletteName)
            //Show empty palette option
            noPaletteButton.style.display = 'block';
        }

        const buttonEvent = () => {
            //hide the dropdown menu
            Util.deselect('palette-menu');
            Util.deselect('palette-button');
            Util.deselect('palette-menu-splash');
            Util.deselect('palette-button-splash');

            //show empty palette option
            noPaletteButton.style.display = 'block';

            //set the text of the dropdown to the newly selected preset
            Util.setText('palette-button', paletteName);
            Util.setText('palette-button-splash', paletteName);
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
        Util.toggle('palette-button');
        Util.toggle('palette-menu');

        Util.deselect('preset-button');
        Util.deselect('preset-menu');

        // Splash version
        Util.toggle('palette-button-splash');
        Util.toggle('palette-menu-splash');

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
        Util.setText('palette-button', 'Choose a palette...');
    })

    newPixelElement.addEventListener('click', () => {
        Util.deselect('editor-mode-menu');
        Util.deselect('preset-button');
        Util.deselect('preset-menu');
        Util.deselect('palette-button');
        Util.deselect('palette-menu');

        // Splash version
        Util.deselect('palette-button-splash');
        Util.deselect('palette-menu-splash');
    })
})(); 