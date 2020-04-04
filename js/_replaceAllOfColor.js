//replaces all of a single color on the canvas with a different color
//input two rgb color objects {r:0,g:0,b:0}
function replaceAllOfColor (oldColor, newColor) {

    //convert strings to objects if nessesary 
    if (typeof oldColor === 'string') oldColor = hexToRgb(oldColor);
    if (typeof newColor === 'string') newColor = hexToRgb(newColor);

    //create temporary image from canvas to search through
    var tempImage = currentLayer.context.getImageData(0, 0, canvasSize[0], canvasSize[1]);

    //loop through all pixels
    for (var i=0;i<tempImage.data.length;i+=4) {
        //check if pixel matches old color
        if(tempImage.data[i]==oldColor.r && tempImage.data[i+1]==oldColor.g && tempImage.data[i+2]==oldColor.b){
            //change to new color
            tempImage.data[i]=newColor.r;
            tempImage.data[i+1]=newColor.g;
            tempImage.data[i+2]=newColor.b;
        }
    }

    //put temp image back onto canvas
    currentLayer.context.putImageData(tempImage,0,0);
}
