// REFACTOR: fill tool onMouseDown
function fill(cursorLocation) {

    //changes a pixels color
    function colorPixel(tempImage, pixelPos, fillColor) {
        //console.log('colorPixel:',pixelPos);
        tempImage.data[pixelPos] = fillColor.r;
        tempImage.data[pixelPos + 1] = fillColor.g;
        tempImage.data[pixelPos + 2] = fillColor.b;
        tempImage.data[pixelPos + 3] = 255;
    }

    //change x y to color value passed from the function and use that as the original color 
    function matchStartColor(tempImage, pixelPos, color) {
        //console.log('matchPixel:',x,y)

        var r = tempImage.data[pixelPos];
        var g = tempImage.data[pixelPos + 1];
        var b = tempImage.data[pixelPos + 2];
        var a = tempImage.data[pixelPos + 3];
        //console.log(r == color[0] && g == color[1] && b == color[2]);
        return (r == color[0] && g == color[1] && b == color[2] && a == color[3]);
    }

    //save history state
    new HistoryState().EditCanvas();
    //saveHistoryState({type: 'canvas', canvas: context.getImageData(0, 0, canvasSize[0], canvasSize[1])});
    //console.log('filling at '+ Math.floor(cursorLocation[0]/zoom) + ','+ Math.floor(cursorLocation[1]/zoom));

    //temporary image holds the data while we change it
    var tempImage = currentLayer.context.getImageData(0, 0, canvasSize[0], canvasSize[1]);

    //this is an array that holds all of the pixels at the top of the cluster
    var topmostPixelsArray = [[Math.floor(cursorLocation[0]/zoom), Math.floor(cursorLocation[1]/zoom)]];
    //console.log('topmostPixelsArray:',topmostPixelsArray)

    //the offset of the pixel in the temp image data to start with
    var startingPosition = (topmostPixelsArray[0][1] * canvasSize[0] + topmostPixelsArray[0][0]) * 4;

    //the color of the cluster that is being filled
    var clusterColor = [tempImage.data[startingPosition],tempImage.data[startingPosition+1],tempImage.data[startingPosition+2], tempImage.data[startingPosition+3]];

    //the new color to fill with
    var fillColor = Color.hexToRgb(currentLayer.context.fillStyle);
    
    //if you try to fill with the same color that's already there, exit the function
    if (clusterColor[0] == fillColor.r &&
        clusterColor[1] == fillColor.g &&
        clusterColor[2] == fillColor.b &&
        clusterColor[3] != 0) {
            console.log("Returned");
            return;
        }
        

    //loop until there are no more values left in this array
    while (topmostPixelsArray.length) {
        var reachLeft, reachRight;

        //move the most recent pixel from the array and set it as our current working pixels
        var currentPixel = topmostPixelsArray.pop();

        //set the values of this pixel to x/y variables just for readability
        var x = currentPixel[0];
        var y = currentPixel[1];

        //this variable holds the index of where the starting values for the current pixel are in the data array
        //we multiply the number of rows down (y) times the width of each row, then add x. at the end we multiply by 4 because
        //each pixel has 4 values, rgba
        var pixelPos = (y * canvasSize[0] + x) * 4;

        //move up in the image until you reach the top or the pixel you hit was not the right color
        while (y-- >= 0 && matchStartColor(tempImage, pixelPos, clusterColor)) {
            pixelPos -= canvasSize[0] * 4;
        }
        pixelPos += canvasSize[0] * 4;
        ++y;
        reachLeft = false;
        reachRight = false;
        while (y++ < canvasSize[1] - 1 && matchStartColor(tempImage, pixelPos, clusterColor)) {
            colorPixel(tempImage, pixelPos, fillColor);
            if (x > 0) {
                if (matchStartColor(tempImage, pixelPos - 4, clusterColor)) {
                    if (!reachLeft) {
                        topmostPixelsArray.push([x - 1, y]);
                        reachLeft = true;
                    }
                }
                else if (reachLeft) {
                    reachLeft = false;
                }
            }

            if (x < canvasSize[0] - 1) {
                if (matchStartColor(tempImage, pixelPos + 4, clusterColor)) {
                    if (!reachRight) {
                        topmostPixelsArray.push([x + 1, y]);
                        reachRight = true;
                    }
                }
                else if (reachRight) {
                    reachRight = false;
                }
            }

            pixelPos += canvasSize[0] * 4;
        }
    }
    currentLayer.context.putImageData(tempImage, 0, 0);
    //console.log('done filling')
}
