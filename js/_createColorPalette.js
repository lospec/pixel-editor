
function createColorPalette(paletteColors, fillBackground, deletePreviousPalette = true) {
    //remove current palette
    if (deletePreviousPalette) {
        colors = document.getElementsByClassName('color-button');
        while (colors.length > 0) {
            colors[0].parentElement.remove();
        }
    }

    var lightestColor = '#000000';
    var darkestColor = '#ffffff';

    for (var i = 0; i < paletteColors.length; i++) {
        var newColor = paletteColors[i];
        var newColorElement = addColor(newColor);

        var newColorHex = hexToRgb(newColor);

        var lightestColorHex = hexToRgb(lightestColor);
        if (newColorHex.r + newColorHex.g + newColorHex.b > lightestColorHex.r + lightestColorHex.g + lightestColorHex.b)
            lightestColor = newColor;

        var darkestColorHex = hexToRgb(darkestColor);
        if (newColorHex.r + newColorHex.g + newColorHex.b < darkestColorHex.r + darkestColorHex.g + darkestColorHex.b) {

            //remove current color selection
            var selectedColor = document.querySelector('#colors-menu li.selected');
            if (selectedColor) selectedColor.classList.remove('selected');

            //set as current color
            newColorElement.classList.add('selected');

            darkestColor = newColor;
        }
    }

	//prepend # if not present
	if (!darkestColor.includes('#')) darkestColor = '#' + darkestColor;

    //set as current color
    currentLayer.context.fillStyle = darkestColor;
}

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
                        colors[color] = {r:imageData[j],g:imageData[j + 1],b:imageData[j + 2]};

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

    console.log(colors);

    //create array out of colors object
    let colorPaletteArray = [];
    for (let color in colors) {
        if (colors.hasOwnProperty(color)) {
            colorPaletteArray.push('#'+rgbToHex(colors[color]));
        }
    }
    console.log('COLOR PALETTE ARRAY', colorPaletteArray);

    //create palette form colors array
    createColorPalette(colorPaletteArray, false);
}