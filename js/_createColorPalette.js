
/** Creates the colour palette
 * 
 * @param {*} paletteColors The colours of the palette
 * @param {*} deletePreviousPalette Tells if the app should delete the previous palette or not 
 *                                  (used when opening a file, for example)
 */
function createColorPalette(paletteColors, deletePreviousPalette = true) {
    //remove current palette
    if (deletePreviousPalette) {
        colors = document.getElementsByClassName('color-button');
        while (colors.length > 0) {
            colors[0].parentElement.remove();
        }
    }

    var lightestColor = new Color("hex", '#000000');
    var darkestColor = new Color("hex", '#ffffff');

    // Adding all the colours in the array
    for (var i = 0; i < paletteColors.length; i++) {
        var newColor = new Color("hex", paletteColors[i]);
        var newColorElement = ColorModule.addColor(newColor.hex);

        var newColRgb = newColor.rgb;

        var lightestColorRgb = lightestColor.rgb;
        if (newColRgb.r + newColRgb.g + newColRgb.b > lightestColorRgb.r + lightestColorRgb.g + lightestColorRgb.b)
            lightestColor = newColor;

        var darkestColorRgb = darkestColor.rgb;
        if (newColRgb.r + newColRgb.g + newColRgb.b < darkestColorRgb.r + darkestColorRgb.g + darkestColorRgb.b) {

            //remove current color selection
            var selectedColor = document.querySelector('#colors-menu li.selected');
            if (selectedColor) selectedColor.classList.remove('selected');

            //set as current color
            newColorElement.classList.add('selected');
            darkestColor = newColor;
        }
    }

	//prepend # if not present
	if (!darkestColor.hex.includes('#')) darkestColor.hex = '#' + darkestColor.hex;

    //set as current color
    currentLayer.context.fillStyle = darkestColor.hex;
}

/** Creates the palette with the colours used in all the layers
 * 
 */
function createPaletteFromLayers() {
    let colors = {};

    for (let i=0; i<layers.length; i++) {
        if (layers[i].menuEntry != null) {
            let imageData = layers[i].context.getImageData(0, 0, layers[i].canvasSize[0], layers[i].canvasSize[1]).data;
            let dataLength = imageData.length;

            for (let j=0; j<dataLength; j += 4) {
                if (!isPixelEmpty(imageData[j])) {
                    let color = imageData[j]+','+imageData[j + 1]+','+imageData[j + 2];

                    if (!colors[color]) {
                        colors[color] = new Color("rgb", imageData[j], imageData[j + 1], imageData[j + 2]).rgb;

                        //don't allow more than 256 colors to be added
                        if (Object.keys(colors).length >= settings.maxColorsOnImportedImage) {
                            alert('The image loaded seems to have more than '+settings.maxColorsOnImportedImage+' colors.');
                            break;
                        }
                    }
                }
            }
        }
    }

    //create array out of colors object
    let colorPaletteArray = [];
    for (let color in colors) {
        if (colors.hasOwnProperty(color)) {
            colorPaletteArray.push('#'+Color.rgbToHex(colors[color]));
        }
    }

    //create palette from colors array
    createColorPalette(colorPaletteArray, true);
}