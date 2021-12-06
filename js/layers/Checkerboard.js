class Checkerboard extends Layer {
    // Checkerboard color 1
    firstCheckerBoardColor = 'rgba(179, 173, 182, 1)';
    // Checkerboard color 2
    secondCheckerBoardColor = 'rgba(204, 200, 206, 1)';
    // Square size for the checkerboard
    checkerBoardSquareSize = 16;
    
    // Setting current colour (each square has a different colour
    currentColor = undefined;
    // Saving number of squares filled until now
    nSquaresFilled = 0;

    constructor(width, height, canvas, menuEntry) {
        super(width, height, document.getElementById('checkerboard'), menuEntry);
        this.initialize();
    }

    initialize() {
        super.initialize();
        console.log("Square size: " + this.checkerBoardSquareSize);
        this.currentColor = this.firstCheckerBoardColor;
        this.fillCheckerboard();
    }

    /** Fills the checkerboard canvas with squares with alternating colours
     * 
     */
    fillCheckerboard() {
        this.context.clearRect(0, 0, currFile.canvasSize[0], currFile.canvasSize[1]);

        // Cycling through the canvas (using it as a matrix)
        for (let i=0; i<currFile.canvasSize[0] / this.checkerBoardSquareSize; i++) {
            this.nSquaresFilled = 0;

            for (let j=0; j<currFile.canvasSize[1] / this.checkerBoardSquareSize; j++) {
                let rectX;
                let rectY;

                // Managing the not perfect squares (the ones at the sides if the canvas' sizes are not powers of checkerBoardSquareSize
                if (i * this.checkerBoardSquareSize < currFile.canvasSize[0]) {
                    rectX = i * this.checkerBoardSquareSize;
                }
                else {
                    rectX = currFile.canvasSize[0];
                }

                if (j * this.checkerBoardSquareSize < currFile.canvasSize[1]) {
                    rectY = j * this.checkerBoardSquareSize;
                }
                else {
                    rectY = currFile.canvasSize[1];
                }

                // Selecting the colour
                this.context.fillStyle = this.currentColor;
                this.context.fillRect(rectX, rectY, this.checkerBoardSquareSize, this.checkerBoardSquareSize);

                // Changing colour
                this.changeCheckerboardColor();
                this.nSquaresFilled++;
            }

            // If the number of filled squares was even, I change colour for the next column
            if ((this.nSquaresFilled % 2) == 0) {
                this.changeCheckerboardColor();
            }
        }
    }


    // Simply switches the checkerboard colour
    changeCheckerboardColor() {
        if (this.currentColor == this.firstCheckerBoardColor) {
            this.currentColor = this.secondCheckerBoardColor;
        } else if (this.currentColor == this.secondCheckerBoardColor) {
            this.currentColor = this.firstCheckerBoardColor;
        }
    }

}