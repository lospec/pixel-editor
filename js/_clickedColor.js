//color in palette has been clicked
function clickedColor (e){

    //left clicked color
    if (e.which == 1) {
        // remove current color selection
        var selectedColor = document.querySelector('#colors-menu li.selected');
        if (selectedColor) selectedColor.classList.remove('selected');

        //set current color
        for (let i=1; i<layers.length - nAppLayers; i++) {
            layers[i].context.fillStyle = this.style.backgroundColor;
        }

        currentGlobalColor = this.style.backgroundColor;
        //make color selected
        e.target.parentElement.classList.add('selected');

    } else if (e.which == 3) { //right clicked color
        console.log('right clicked color button');

        //hide edit color button (to prevent it from showing)
        e.target.parentElement.lastChild.classList.add('hidden');

        //show color picker
        e.target.jscolor.show();
    }
}

