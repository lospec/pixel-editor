(() => {
    const presets = {
        'Gameboy Color': {
            width: 240,
            height: 203,
            palette: 'Gameboy Color'
        },
        'PICO-8': {
            width: 128,
            height: 128,
            palette: 'PICO-8'
        },
        'Commodore 64': {
            width: 40,
            height: 80,
            palette: 'Commodore 64'
        }
    };
    const presetsMenu = document.getElementById('preset-menu');
    Object.keys(presets).forEach((presetName,) => {

        const button = document.createElement('button');
        button.appendChild(document.createTextNode(presetName));

        presetsMenu.appendChild(button);

        button.addEventListener('click', () => {
            //change dimentions on new pixel form
            Utility().setValue('size-width', presets[presetName].width);
            Utility().setValue('size-height', presets[presetName].height);

            //set the text of the dropdown to the newly selected preset
            Utility().setText('palette-button', presets[presetName].palette);

            //hide the dropdown menu
            Utility().deselect('preset-menu');
            Utility().deselect('preset-button');

            //set the text of the dropdown to the newly selected preset
            Utility().setText('preset-button', presetName);

        });
    });
    const presetButton = document.getElementById('preset-button');
    presetButton.addEventListener('click', (e) => {
        //open or close the preset menu
        Utility().toggle('preset-button');
        Utility().toggle('preset-menu');

        //close the palette menu
        Utility().deselect('palette-button');
        Utility().deselect('palette-menu');

        e.stopPropagation();
    });
})();