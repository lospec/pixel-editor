class FillTool extends DrawingTool {
    constructor(name, options, switchFunction) {
        super(name, options);

        Events.on('click', this.mainButton, switchFunction, this);

        this.resetTutorial();
        this.addTutorialTitle("Fill tool");
        this.addTutorialKey("F", " to select the fill tool");
        this.addTutorialKey("Left click", " to fill a contiguous area");
        this.addTutorialImg("/images/ToolTutorials/fill-tutorial.gif");
    }

    onStart(mousePos, target) {
        super.onStart(mousePos);

        if (target.className != 'drawingCanvas')
            return;
        new HistoryState().EditCanvas();
        FillTool.fill(mousePos);
        currFile.currentLayer.updateLayerPreview();
	}

    
    static fill(cursorLocation, context) {
        //changes a pixels color
        function colorPixel(tempImage, pixelPos, fillColor) {
            //////console.log('colorPixel:',pixelPos);
            tempImage.data[pixelPos] = fillColor.r;
            tempImage.data[pixelPos + 1] = fillColor.g;
            tempImage.data[pixelPos + 2] = fillColor.b;
            tempImage.data[pixelPos + 3] = 255;
        }

        //change x y to color value passed from the function and use that as the original color 
        function matchStartColor(tempImage, pixelPos, color) {
            //////console.log('matchPixel:',x,y)

            let r = tempImage.data[pixelPos];
            let g = tempImage.data[pixelPos + 1];
            let b = tempImage.data[pixelPos + 2];
            let a = tempImage.data[pixelPos + 3];
            //////console.log(r == color[0] && g == color[1] && b == color[2]);
            return (r == color[0] && g == color[1] && b == color[2] && a == color[3]);
        }

        if (context == undefined)
            context = currFile.currentLayer.context;

        //temporary image holds the data while we change it
        let tempImage = context.getImageData(0, 0, currFile.canvasSize[0], currFile.canvasSize[1]);

        //this is an array that holds all of the pixels at the top of the cluster
        let topmostPixelsArray = [[Math.floor(cursorLocation[0]/currFile.zoom), Math.floor(cursorLocation[1]/currFile.zoom)]];
        //////console.log('topmostPixelsArray:',topmostPixelsArray)

        //the offset of the pixel in the temp image data to start with
        let startingPosition = (topmostPixelsArray[0][1] * currFile.canvasSize[0] + topmostPixelsArray[0][0]) * 4;

        //the color of the cluster that is being filled
        let clusterColor = [tempImage.data[startingPosition],tempImage.data[startingPosition+1],tempImage.data[startingPosition+2], tempImage.data[startingPosition+3]];

        //the color to fill with
        let fillColor = Color.hexToRgb(context.fillStyle);
        
        //if you try to fill with the same color that's already there, exit the function
        if (clusterColor[0] == fillColor.r &&
            clusterColor[1] == fillColor.g &&
            clusterColor[2] == fillColor.b &&
            clusterColor[3] != 0) {
                return;
            }
            

        //loop until there are no more values left in this array
        while (topmostPixelsArray.length) {
            let reachLeft, reachRight;

            //move the most recent pixel from the array and set it as our current working pixels
            let currentPixel = topmostPixelsArray.pop();

            //set the values of this pixel to x/y variables just for readability
            let x = currentPixel[0];
            let y = currentPixel[1];

            //this variable holds the index of where the starting values for the current pixel are in the data array
            //we multiply the number of rows down (y) times the width of each row, then add x. at the end we multiply by 4 because
            //each pixel has 4 values, rgba
            let pixelPos = (y * currFile.canvasSize[0] + x) * 4;

            //move up in the image until you reach the top or the pixel you hit was not the right color
            while (y-- >= 0 && matchStartColor(tempImage, pixelPos, clusterColor)) {
                pixelPos -= currFile.canvasSize[0] * 4;
            }
            pixelPos += currFile.canvasSize[0] * 4;
            ++y;
            reachLeft = false;
            reachRight = false;
            
            while (y++ < currFile.canvasSize[1] - 1 && matchStartColor(tempImage, pixelPos, clusterColor)) {
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

                if (x < currFile.canvasSize[0] - 1) {
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

                pixelPos += currFile.canvasSize[0] * 4;
            }
        }
        context.putImageData(tempImage, 0, 0);
    }

	onDrag(mousePos, cursorTarget) {
	}

	onEnd(mousePos) {
        super.onEnd(mousePos);
	}

    onSelect() {
        super.onSelect();
    }

    onDeselect() {
        super.onDeselect();
    }
}