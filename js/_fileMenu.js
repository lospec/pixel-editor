var mainMenuItems = document.getElementById("main-menu").children;

//for each button in main menu (starting at 1 to avoid logo)
for (var i = 1; i < mainMenuItems.length; i++) {

	//get the button that's in the list item
	var menuItem = mainMenuItems[i];
	var menuButton = menuItem.children[0];

	console.log(mainMenuItems)

    //when you click a main menu items button
    on('click', menuButton, function (e, button) {
        console.log('parent ', button.parentElement)
    		select(button.parentElement);
    });

    var subMenu = menuItem.children[1];
    var subMenuItems = subMenu.children;



    //when you click an item within a menu button
    for (var j = 0; j < subMenuItems.length; j++) {

    	var subMenuItem = subMenuItems[j];
    	var subMenuButton = subMenuItem.children[0];

		subMenuButton.addEventListener("click", function (e) {

			switch(this.textContent) {

			  //File Menu
				case 'New':
					showDialogue('new-pixel');
					break;
				case 'Open':


					//if a document exists
					if (documentCreated) {
					  //check if the user wants to overwrite
					  if (confirm('Opening a pixel will discard your current one. Are you sure you want to do that?'))
      				//open file selection dialog
      				document.getElementById("open-image-browse-holder").click();
					}
  				else
  					//open file selection dialog
  					document.getElementById("open-image-browse-holder").click();

					break;

				case 'Save as...':
					if (documentCreated) {

						//create name
						var selectedPalette = getText('palette-button');
						if (selectedPalette != 'Choose a palette...'){
							var paletteAbbreviation = palettes[selectedPalette].abbreviation;
							var fileName = 'pixel-'+paletteAbbreviation+'-'+canvasSize[0]+'x'+canvasSize[1]+'.png';
						} else {
							var fileName = 'pixel-'+canvasSize[0]+'x'+canvasSize[1]+'.png';
							selectedPalette = 'none';
						}

						//set download link
						var linkHolder = document.getElementById("save-image-link-holder");
		                linkHolder.href = canvas.toDataURL();
	    				linkHolder.download = fileName;

	    				linkHolder.click();

	    				//track google event
                        ga('send', 'event', 'Pixel Editor Save', selectedPalette, canvasSize[0]+'/'+canvasSize[1]); /*global ga*/
					}

					break;

				case 'Exit':

					console.log('exit')
					//if a document exists, make sure they want to delete it
					if (documentCreated) {

						//ask user if they want to leave
						if (confirm('Exiting will discard your current pixel. Are you sure you want to do that?'))
		    				//skip onbeforeunload prompt
		    				window.onbeforeunload = null;
						else
							e.preventDefault();
					}

				  break;
				//Edit Menu
				case 'Undo':
          undo();
					break;
				case 'Redo':
					redo();
					break;

				//Palette Menu
				case 'Add color':
        	addColor('#eeeeee');
					break;
				//Help Menu
				case 'Settings':

				  //fill form with current settings values
				  setValue('setting-numberOfHistoryStates', settings.numberOfHistoryStates);

					showDialogue('settings');
					break;
				//Help Menu
				case 'Help':
					showDialogue('help');
					break;
				case 'About':
					showDialogue('about');
					break;
				case 'Changelog':
					showDialogue('changelog');
					break;
			}

			closeMenu();
		});
	}
}

function closeMenu () {
	//remove .selected class from all menu buttons
	for (var i = 0; i < mainMenuItems.length; i++) {
	    deselect(mainMenuItems[i]);
	}
}