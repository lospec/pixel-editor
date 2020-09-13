//add color button
on('click', 'add-color-button', function(){
    if (!documentCreated) return;

    var colorCheckingStyle = `
    color: white;
    background: #3c4cc2;
  `;

    var colorIsUnique = true;
    do {
        //console.log('%cchecking for unique colors', colorCheckingStyle)
        //generate random color
        var hue = Math.floor(Math.random()*255);
        var sat = 130+Math.floor(Math.random()*100);
        var lit = 70+Math.floor(Math.random()*100);
        var newColorRgb = hslToRgb(hue,sat,lit);
        var newColor = rgbToHex(newColorRgb.r,newColorRgb.g,newColorRgb.b);

        var newColorHex = newColor;

        //check if color has been used before
        colors = document.getElementsByClassName('color-button');
        colorCheckingLoop: for (var i = 0; i < colors.length; i++) {
            //console.log('%c'+newColorHex +' '+ colors[i].jscolor.toString(), colorCheckingStyle)

            //if generated color matches this color
            if (newColorHex == colors[i].jscolor.toString()) {
                //console.log('%ccolor already exists', colorCheckingStyle)

                //start loop again
                colorIsUnique = false;

                //exit 
                break colorCheckingLoop;
            }
        }
    }
    while (colorIsUnique == false);

    //remove current color selection
    document.querySelector('#colors-menu li.selected').classList.remove('selected');

    //add new color and make it selected
    var addedColor = addColor(newColor);
    addedColor.classList.add('selected');
    currentLayer.context.fillStyle = '#' + newColor;

    //add history state
    //saveHistoryState({type: 'addcolor', colorValue: addedColor.firstElementChild.jscolor.toString()});
    new HistoryStateAddColor(addedColor.firstElementChild.jscolor.toString());

    //show color picker
    addedColor.firstElementChild.jscolor.show();
    console.log('showing picker');

    //hide edit button
    addedColor.lastChild.classList.add('hidden');
}, false);
