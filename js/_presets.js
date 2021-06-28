const presetsModule = (() => {
    const presets = {
        'Gameboy Color': {width: 240, height: 203, palette: 'Gameboy Color'},
        'PICO-8': {width: 128, height: 128, palette: 'PICO-8'},
        'Commodore 64': {width: 40, height: 80, palette: 'Commodore 64'}
    };

    function instrumentPresetMenu() {
        console.info("Initializing presets..");
        // Add a button for all the presets available
        const presetsMenu = document.getElementById('preset-menu');
        Object.keys(presets).forEach((presetName,) => {

            const button = document.createElement('button');
            button.appendChild(document.createTextNode(presetName));

            presetsMenu.appendChild(button);

            button.addEventListener('click', () => {
                //change dimentions on new pixel form
                Util.setValue('size-width', presets[presetName].width);
                Util.setValue('size-height', presets[presetName].height);

                //set the text of the dropdown to the newly selected preset
                Util.setText('palette-button', presets[presetName].palette);

                //hide the dropdown menu
                Util.deselect('preset-menu');
                Util.deselect('preset-button');

                //set the text of the dropdown to the newly selected preset
                Util.setText('preset-button', presetName);

            });
        });

        const presetButton = document.getElementById('preset-button');
        presetButton.addEventListener('click', (e) => {
            //open or close the preset menu
            Util.toggle('preset-button');
            Util.toggle('preset-menu');

            //close the palette menu
            Util.deselect('palette-button');
            Util.deselect('palette-menu');

            e.stopPropagation();
        });
    }

    function propertiesOf(presetId) {
        return presets[presetId];
    }

    return {
        propertiesOf,
        instrumentPresetMenu
    };
    
})();