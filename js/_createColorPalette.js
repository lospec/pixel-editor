
function createColorPalette(selectedPalette, fillBackground) {
	//remove current palette
	colors = document.getElementsByClassName('color-button');
	while (colors.length > 0) {
		colors[0].parentElement.remove();
	}
	
	var lightestColor = '#000000';
	var darkestColor = '#ffffff';
	
	for (var i = 0; i < selectedPalette.length; i++) {
		var newColor = selectedPalette[i];
		var newColorElement = addColor(newColor);

		var newColorHex = hexToRgb(newColor);

		var lightestColorHex = hexToRgb(lightestColor);
		if (newColorHex.r + newColorHex.g + newColorHex.b > lightestColorHex.r + lightestColorHex.g + lightestColorHex.b)
			lightestColor = newColor;

		var darkestColorHex = hexToRgb(darkestColor);
		if (newColorHex.r + newColorHex.g + newColorHex.b < darkestColorHex.r + darkestColorHex.g + darkestColorHex.b) {
    	
    	//remove current color selection
      var selectedColor = document.querySelector("#colors-menu li.selected")
      if (selectedColor) selectedColor.classList.remove("selected");
      
    	//set as current color
    	newColorElement.classList.add('selected');
    	
    	darkestColor = newColor;
		}
			
	}
	
	//fill bg with lightest color
	if (fillBackground) {
		context.fillStyle = lightestColor;
		context.fillRect(0, 0, canvasSize[0], canvasSize[1]);
	}
	
	//set as current color
	context.fillStyle = darkestColor;
}