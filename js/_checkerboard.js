// This script contains all the functions used to manage the checkboard
// Checkerboard color 1
var firstCheckerBoardColor = 'rgba(179, 173, 182, 1)';
// Checkerboard color 2
var secondCheckerBoardColor = 'rgba(204, 200, 206, 1)';
// Square size for the checkerboard
var checkerBoardSquareSize = 16;
// Checkerboard canvas
var checkerBoardCanvas = document.getElementById('checkerboard');

// Setting current colour (each square has a different colour
var currentColor = firstCheckerBoardColor;
// Saving number of squares filled until now
var nSquaresFilled = 0;


function fillCheckerboard() {
    // Getting checkerboard context
    var context = checkerBoard.context;
    context.clearRect(0, 0, canvasSize[0], canvasSize[1]);

    // Cycling through the canvas (using it as a matrix)
    for (var i=0; i<canvasSize[0] / checkerBoardSquareSize; i++) {
        nSquaresFilled = 0;

        for (var j=0; j<canvasSize[1] / checkerBoardSquareSize; j++) {
            var rectX;
            var rectY;

            // Managing the not perfect squares (the ones at the sides if the canvas' sizes are not powers of checkerBoardSquareSize
            if (i * checkerBoardSquareSize < canvasSize[0]) {
                rectX = i * checkerBoardSquareSize;
            }
            else {
                rectX = canvasSize[0];
            }

            if (j * checkerBoardSquareSize < canvasSize[1]) {
                rectY = j * checkerBoardSquareSize;
            }
            else {
                rectY = canvasSize[1];
            }

            // Selecting the colour
            context.fillStyle = currentColor;
            context.fillRect(rectX, rectY, checkerBoardSquareSize, checkerBoardSquareSize);

            // Changing colour
            changeCheckerboardColor();

            nSquaresFilled++;
        }

        // If the number of filled squares was even, I change colour for the next column
        if ((nSquaresFilled % 2) == 0) {
            changeCheckerboardColor();
        }
    }
}

// Simply switches the checkerboard colour
function changeCheckerboardColor(isVertical) {
    if (currentColor == firstCheckerBoardColor) {
        currentColor = secondCheckerBoardColor;
    } else if (currentColor == secondCheckerBoardColor) {
        currentColor = firstCheckerBoardColor;
    }
}
