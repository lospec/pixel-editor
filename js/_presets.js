//prests
var presets = {
	'Gameboy Color': {
		width: 240,
		height: 203,
		palette: 'Gameboy Color'
	},
	'PICO-8': {
		width: 128,
		height: 128,
		palette: 'PICO-8',
	},
	'Commodore 64': {
		width: 40,
		height: 80,
		palette: 'Commodore 64'
	}
};

//populate preset list in new pixel menu
Object.keys(presets).forEach(function(presetName,index) {
    
    var presetsMenu = document.getElementById("preset-menu");

    //create button
    var button = document.createElement("button");
    button.appendChild(document.createTextNode(presetName));
   
	//insert new element
	presetsMenu.appendChild(button);
	
	//add click event listener
	on('click', button, function() {

		//change dimentions on new pixel form
		setValue('size-width', presets[presetName].width);
		setValue('size-height', presets[presetName].height);

		//set the text of the dropdown to the newly selected preset
		setText('palette-button', presets[presetName].palette);

		//hide the dropdown menu
		deselect('preset-menu');
		deselect('preset-button');

		//set the text of the dropdown to the newly selected preset
		setText('preset-button', presetName);
	});

});


on('click', 'preset-button', function (e){
	//open or close the preset menu
	toggle('preset-button');
	toggle('preset-menu');
	
	//close the palette menu
	deselect('palette-button');
	deselect('palette-menu');
	
	//stop the click from propogating to the parent element
	e.stopPropagation();
});
