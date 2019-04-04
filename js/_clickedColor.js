//color in palette has been clicked
function clickedColor (e){

    //left clicked color
    if (e.which == 1) {
      
      //remove current color selection
      var selectedColor = document.querySelector("#colors-menu li.selected")
      if (selectedColor) selectedColor.classList.remove("selected");

    	//set current color
    	currentLayer.context.fillStyle = this.style.backgroundColor;
    	
    	//make color selected
    	e.target.parentElement.classList.add('selected');
    	
    //right clicked color
    } else if (e.which == 3) {
      console.log('right clicked color button')
      
      //hide edit color button (to prevent it from showing)
      e.target.parentElement.lastChild.classList.add('hidden');
      
    	//show color picker
      e.target.jscolor.show();
      
    }
}
	
