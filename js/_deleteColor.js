

//called when the delete button is pressed on color picker
//input color button or hex string
function deleteColor (color) {
    const logStyle = 'background: #913939; color: white; padding: 5px;';

    //console.log('%c'+'deleting color', logStyle);

    //if color is a string, then find the corresponding button
    if (typeof color === 'string') {
        console.log('trying to find ',color);
        //get all colors in palette
        colors = document.getElementsByClassName('color-button');

        //loop through colors
        for (var i = 0; i < colors.length; i++) {
            console.log(color,'=',colors[i].jscolor.toString());

            if (color == colors[i].jscolor.toString()) {
                console.log('match');
                //set color to the color button
                color = colors[i];
                console.log('found color', color);

                //exit loop 
                break;
            }
        }

        //if the color wasn't found
        if (typeof color === 'string') {
            console.log('color not found');
            //exit function
            return;
        }

    }

    //hide color picker
    color.jscolor.hide();


    //find lightest color in palette
    var colors = document.getElementsByClassName('color-button');
    var lightestColor = [0,null];
    for (var i = 0; i < colors.length; i++) {

        //get colors lightness
        var lightness = rgbToHsl(colors[i].jscolor.toRgb()).l;
        //console.log('%c'+lightness, logStyle)

        //if not the color we're deleting
        if (colors[i] != color) {

            //if lighter than the current lightest, set as the new lightest 
            if (lightness > lightestColor[0]) {
                lightestColor[0] = lightness;
                lightestColor[1] = colors[i];
            }
        }
    }

    //console.log('%c'+'replacing with lightest color: '+lightestColor[1].jscolor.toString(), logStyle)

    //replace deleted color with lightest color
    replaceAllOfColor(color.jscolor.toString(),lightestColor[1].jscolor.toString());


    //if the color you are deleting is the currently selected color
    if (color.parentElement.classList.contains('selected')) {
        //console.log('%c'+'deleted color is currently selected', logStyle);

        //set current color TO LIGHTEST COLOR
        lightestColor[1].parentElement.classList.add('selected');
        currentLayer.context.fillStyle = '#'+lightestColor[1].jscolor.toString();
    }

    //delete the element
    colorsMenu.removeChild(color.parentElement);



}
