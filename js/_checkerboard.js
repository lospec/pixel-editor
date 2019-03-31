var currentColor = firstCheckerBoardColor;
var nSquaresFilled = 0;

/* TODO add check for canvas dimentions (right now negative values can be inserted and a canvas will be generated, it is just
    necessary to add a conversion from negative to positive values.
 */

function fillCheckerboard() {
    var context = checkerBoard.context;

    for (var i=0; i<canvasSize[0] / checkerBoardSquareSize; i++) {
        nSquaresFilled = 0;

        for (var j=0; j<canvasSize[1] / checkerBoardSquareSize; j++) {
            var rectX;
            var rectY;

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

            context.fillStyle = currentColor;
            context.fillRect(rectX, rectY, checkerBoardSquareSize, checkerBoardSquareSize);

            changeCheckerboardColor();

            nSquaresFilled++;
        }

        if ((nSquaresFilled % 2) == 0) {
            changeCheckerboardColor();
        }
    }
}

function changeCheckerboardColor(isVertical) {
    if (currentColor == firstCheckerBoardColor) {
        currentColor = secondCheckerBoardColor;
    } else if (currentColor == secondCheckerBoardColor) {
        currentColor = firstCheckerBoardColor;
    }
}