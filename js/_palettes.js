//populate palettes list in new pixel menu
Object.keys(palettes).forEach(function(paletteName,index) {
    
    var palettesMenu = document.getElementById("palette-menu");

    //create button
    var button = document.createElement("button");
    button.appendChild(document.createTextNode(paletteName));
   
	//insert new element
	palettesMenu.appendChild(button);
  
  //if the palette was specified by the user, change the dropdown to it
  if (palettes[paletteName].specified == true) {
    setText('palette-button', paletteName);
    //Show empty palette option
    document.getElementById('no-palette-button').style.display = 'block';
  }

	on('click', button, function() {

		//hide the dropdown menu
		deselect('palette-menu');
		deselect('palette-button');
    
    //show empty palette option
    document.getElementById('no-palette-button').style.display = 'block';
    
		//set the text of the dropdown to the newly selected preset
		setText('palette-button', paletteName);
	});
});

//select no palette
on('click', 'no-palette-button', function () {
  document.getElementById('no-palette-button').style.display = 'none';
  setText('palette-button', 'Choose a palette...');
});

//select load palette
on('click', 'load-palette-button', function () {
  document.getElementById("load-palette-browse-holder").click();
});




on('click', 'palette-button', function (e){
	toggle('palette-button');
	toggle('palette-menu');
	
	deselect('preset-button');
	deselect('preset-menu');
	e.stopPropagation();
});

on('click', 'new-pixel', function (){
	deselect('preset-button');
	deselect('preset-menu');
	deselect('palette-button');
	deselect('palette-menu');
});