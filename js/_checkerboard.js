var currentColor = firstCheckerBoardColor;

/* TODO add check for canvas dimentions (right now negative values can be inserted and a canvas will be generated, it is just
    necessary to add a conversion from negative to positive values.
 */

function fillCheckerboard() {
    for (var i=0; i<canvasSize[0] / checkerBoardSquareSize; i++) {
        for (var j=0; j<canvasSize[1] / checkerBoardSquareSize; j++) {
            context.fillStyle = currentColor;
            context.fillRect(i * checkerBoardSquareSize, j * checkerBoardSquareSize, checkerBoardSquareSize, checkerBoardSquareSize);

            changeCheckerboardColor(false);
        }

        changeCheckerboardColor(false);
    }
}

function changeCheckerboardColor(rowEndReached) {
    if (!rowEndReached) {
        if (currentColor == firstCheckerBoardColor) {
            currentColor = secondCheckerBoardColor;
        } else if (currentColor == secondCheckerBoardColor) {
            currentColor = firstCheckerBoardColor;
        }
    }
}