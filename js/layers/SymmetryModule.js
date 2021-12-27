/**
 * SymmetryModule holds the functions used to implement symmetry options.
 */
 const SymmetryModule = (() => {
    // Saving the canvas containing the horizontal symmetric line
    const hSymmetricCanvas = document.getElementById("horizontal-symmetric");
    // Saving the canvas containing the vertical symmetric line
    const vSymmetricCanvas = document.getElementById("vertical-symmetric");

    // Binding events to callbacks
    document.getElementById('toggle-horizontal-simmetry-button').addEventListener('click', toggleHorizontalSymmetry, false);
    document.getElementById('toggle-vertical-simmetry-button').addEventListener('click', toggleVerticalSymmetry, false);

    // Symmetric axes properties
    // The horizontal simmetry is not visible by default
    let horizontalSimmetryVisible = false;
    // The vertical simmetry is not visible by default
    let verticalSimmetryVisible = false;

    const hAxisColor = "#FF0000";
    const vAxisColor = "#00FF00";

    // dragging vars
    var axisOriginX; // for the vertical axis
    var axisOriginY; // for the horizontal axis

    function initSymmetricCanvas() {
        hSymmetricCanvas.style.display = "none";
        vSymmetricCanvas.style.display = "none";
    }

    const ShapeType = {
        RECT: "rect",
        ELLIPSE: "ellipse",
    }

    // getters for internal state
    function getHorizontalSymmetryVisible() {
        return horizontalSimmetryVisible;
    }

    function getVerticalSymmetryVisible() {
        return verticalSimmetryVisible;
    }

    // !
    // * Some important notes about the symmetric axes
    // * h/vDrawAxis function takes levelY/X in input, because you can choose
    // * the origin y/x of the axis. In order to do that the level is multiplied
    // * by the lineDistance. That's a good thing because the symmetric axis
    // * dynamically changes when the lineDistance declared in _pixelGrid.js changes
    // !

    /**
     * It draws the horizontal symmetric axis
     * @param {*} levelY indicates at which y the line will be positionated
     * @param {String} axisColor axis stroke color as string (i.e: 'red')
     * @param {*} axisLineWidth axis stroke width
     */
    function hDrawAxis(levelY, axisColor, axisLineWidth) {

        axisOriginY = levelY;

        console.log(axisOriginY);

        // pre-conditions
        // if it is not possible to retrieve the context, return
        if (!hSymmetricCanvas.getContext) { return; }

        const hCtx = hSymmetricCanvas.getContext("2d");
        let originalSize = currFile.layers[5].canvas;

        if (levelY > originalSize.height) { return; }

        // ? The hSymmetricCanvas is lineDistance times bigger so that the lines don't take 1 canvas pixel 
        // ? but they take 1/lineDistance canvas pixels
        hSymmetricCanvas.width = originalSize.width * lineDistance;
        hSymmetricCanvas.height = originalSize.height * lineDistance;

        // set the stroke line
        hCtx.strokeStyle = axisColor;
        hCtx.lineWidth = axisLineWidth;

        hCtx.beginPath();

        hCtx.rect(0, levelY * lineDistance, originalSize.width * lineDistance, 0);

        hCtx.stroke();
        hCtx.closePath();

        
    }

    /**
     * It draws the vertical symmetric axis
     * @param {*} levelX indicates at which x the line will be positionated
     * @param {String} axisColor axis stroke color as string (i.e: 'red')
     * @param {*} axisLineWidth axis stroke width
     */
    function vDrawAxis(levelX, axisColor, axisLineWidth) {

        axisOriginX = levelX;

        // if it is not possible to retrieve the context, return
        if (!vSymmetricCanvas.getContext) {
            return;
        }

        const vCtx = vSymmetricCanvas.getContext("2d");
        let originalSize = currFile.layers[0].canvasSize;

        // ? The vSymmetricCanvas is lineDistance times bigger so that the lines don't take 1 canvas pixel 
        // ? but they take 1/lineDistance canvas pixels
        vSymmetricCanvas.width = originalSize[0] * lineDistance;
        vSymmetricCanvas.height = originalSize[1] * lineDistance;

        // set the stroke line
        vCtx.strokeStyle = axisColor;
        vCtx.lineWidth = axisLineWidth;

        vCtx.beginPath();

        vCtx.rect(levelX * lineDistance, 0, 0, originalSize[1] * lineDistance);

        vCtx.stroke();
        vCtx.closePath();

    }

    // ? For the moment both horizontal and vertical symmetry are centered only

    /**
     * It toggles the horizontal symmetry in the editor
     */
    function toggleHorizontalSymmetry() {
        console.log("toggling");
        // Getting the button to change its text
        let button = document.getElementById("toggle-horizontal-simmetry-button");
        let originalSize = currFile.layers[0].canvas;

        horizontalSimmetryVisible = !horizontalSimmetryVisible

        if (!horizontalSimmetryVisible) {

            // alert("Horizontal Simmetry OFF");
            button.innerHTML = "Horizontal Simmetry (Off)";
            hSymmetricCanvas.style.display = "none";

            return;
        }

        // alert("Horizontal Simmetry ON");
        button.innerHTML = "Horizontal Simmetry (On)";
        hSymmetricCanvas.style.display = "inline-block";

        // DONE: Show an horizontal line on the canvas
        hDrawAxis(originalSize.height / 4, 'blue', 1);
    }

    /**
     * It toggles the vertical symmetry in the editor
     */
    function toggleVerticalSymmetry() {
        // Getting the button to change its text
        let button = document.getElementById("toggle-vertical-simmetry-button");
        let originalSize = currFile.layers[0].canvasSize;

        verticalSimmetryVisible = !verticalSimmetryVisible

        if (!verticalSimmetryVisible) {

            button.innerHTML = "Vertical Simmetry (Off)";
            vSymmetricCanvas.style.display = "none";

            return;

        }

        // alert("Horizontal Simmetry ON");
        button.innerHTML = "Vertical Simmetry (On)";
        vSymmetricCanvas.style.display = "inline-block";

        // DONE: Show an horizontal line on the canvas
        vDrawAxis(originalSize[0] / 1.5, 'red', 1);
    }

    // !
    // * Important notes on specular drawing 
    // * Suppose that we want to draw specular based on vertical axis:
    // * the x of vertical line is by default layers[0].canvasSize[0]/2 
    // * (I'm going to call it as "axisOriginX").
    // * If we draw a pixel at (pixelX: 3, pixelY: 2) it specular pixel will be at
    // * (x: axisOriginX +- abs(axisOriginX - pixelX), y: pixelY)
    // !

    // ! At the moment the axis origin X/Y is layers[0].canvasSize[0/1]/2

    // TODO: Mirroring the line
    function drawLineSpecular(cursorPosition, toolBrushSize) {

        let originalSize = currFile.layers[0].canvasSize;

        var originPixelX = Math.floor(lastMouseClickPos[0] / zoom);
        var originPixelY = Math.floor(lastMouseClickPos[1] / zoom);
        var destinationPixelX = Math.floor(cursorPosition[0] / zoom);
        var destinationPixelY = Math.floor(cursorPosition[1] / zoom);

        var mirrorOriginY;
        var mirrorDestinationY;

        var mirrorOriginX;
        var mirrorDestinationX;

        if (horizontalSimmetryVisible) {
            // DONE: implement horizontal specular drawing

            var isUnderHorizontalAxis = (originPixelY >= (originalSize[1] / 2));

            if (!isUnderHorizontalAxis) {

                if (toolBrushSize % 2 == 0) {
                    mirrorOriginY = Math.floor(axisOriginY + Math.abs(axisOriginY - originPixelY));
                    mirrorDestinationY = Math.floor(axisOriginY + Math.abs(axisOriginY - destinationPixelY));
                } else {
                    // ? otherwise we have to substract a pixel, in order that the mirror pixel is adjacent to the line
                    mirrorOriginY = Math.floor(axisOriginY + Math.abs(axisOriginY - originPixelY) - 1);
                    mirrorDestinationY = Math.floor(axisOriginY + Math.abs(axisOriginY - destinationPixelY) - 1);
                }

            } else {

                if (toolBrushSize % 2 == 0) {
                    mirrorOriginY = Math.floor(axisOriginY - Math.abs(axisOriginY - originPixelY));
                    mirrorDestinationY = Math.floor(axisOriginY - Math.abs(axisOriginY - destinationPixelY));
                } else {
                    mirrorOriginY = Math.floor(axisOriginY - Math.abs(axisOriginY - originPixelY) - 1);
                    mirrorDestinationY = Math.floor(axisOriginY - Math.abs(axisOriginY - destinationPixelY) - 1);
                }

            }

            // User draw
            diagLine(
                originPixelX,
                originPixelY,
                destinationPixelX,
                destinationPixelY
            );

            diagLine(
                originPixelX,
                mirrorOriginY,
                destinationPixelX,
                mirrorDestinationY
            );
        }

        if (verticalSimmetryVisible) {
            // DONE: implement vertical specular drawing

            var isOverVerticalAxis = (originPixelX >= (originalSize[0] / 2));

            if (!isOverVerticalAxis) {

                if (tool.pencil.brushSize % 2 == 0) {
                    mirrorOriginX = Math.floor(axisOriginX + Math.abs(axisOriginX - originPixelX));
                    mirrorDestinationX = Math.floor(axisOriginX + Math.abs(axisOriginX - destinationPixelX));
                } else {
                    // ? otherwise we have to substract a pixel, in order that the mirror pixel is adjacent to the line
                    mirrorOriginX = Math.floor(axisOriginX + Math.abs(axisOriginX - originPixelX) - 1);
                    mirrorDestinationX = Math.floor(axisOriginX + Math.abs(axisOriginX - destinationPixelX) - 1);
                }

            } else {

                if (tool.pencil.brushSize % 2 == 0) {
                    mirrorOriginX = Math.floor(axisOriginX - Math.abs(axisOriginX - originPixelX));
                    mirrorDestinationX = Math.floor(axisOriginX - Math.abs(axisOriginX - destinationPixelX));
                } else {
                    mirrorOriginX = Math.floor(axisOriginX - Math.abs(axisOriginX - originPixelX) - 1);
                    mirrorDestinationX = Math.floor(axisOriginX - Math.abs(axisOriginX - destinationPixelX) - 1);
                }

            }

            // User draw
            diagLine(
                originPixelX,
                originPixelY,
                destinationPixelX,
                destinationPixelY
            );

            // Mirror draw
            diagLine(
                mirrorOriginX,
                originPixelY,
                mirrorDestinationX,
                destinationPixelY
            );

            if (horizontalSimmetryVisible) {
                // * I do not need to re-compute the mirror coordinates
                // * It is basically a combination of vertical and horizontal projection

                // Mirror draw
                diagLine(
                    mirrorOriginX,
                    mirrorOriginY,
                    mirrorDestinationX,
                    mirrorDestinationY
                );
            }
        }
    }

    /**
     * It draws the same content that the user draws, but in the opposite side
     * based on where the symmetric axes are positionated in the editor. Like a mirror
     * @param {*} cursorPosition current cursor position
     */
    function drawBrushSpecular(cursorPosition, toolBrushSize) {

        let originalSize = currFile.layers[0].canvasSize;

        var originPixelX = Math.floor(lastMouseClickPos[0] / zoom);
        var originPixelY = Math.floor(lastMouseClickPos[1] / zoom);
        var destinationPixelX = Math.floor(cursorPosition[0] / zoom);
        var destinationPixelY = Math.floor(cursorPosition[1] / zoom);

        var mirrorOriginY;
        var mirrorDestinationY;

        var mirrorOriginX;
        var mirrorDestinationX;

        if (horizontalSimmetryVisible) {
            // DONE: implement horizontal specular drawing

            var isUnderHorizontalAxis = (originPixelY >= axisOriginY);

            if (!isUnderHorizontalAxis) {

                if (toolBrushSize % 2 == 0) {
                    mirrorOriginY = Math.floor(axisOriginY + Math.abs(axisOriginY - originPixelY));
                    mirrorDestinationY = Math.floor(axisOriginY + Math.abs(axisOriginY - destinationPixelY));
                } else {
                    // ? otherwise we have to substract a pixel, in order that the mirror pixel is adjacent to the line
                    mirrorOriginY = Math.floor(axisOriginY + Math.abs(axisOriginY - originPixelY) - 1);
                    mirrorDestinationY = Math.floor(axisOriginY + Math.abs(axisOriginY - destinationPixelY) - 1);
                }

            } else {

                if (toolBrushSize % 2 == 0) {
                    mirrorOriginY = Math.floor(axisOriginY - Math.abs(axisOriginY - originPixelY));
                    mirrorDestinationY = Math.floor(axisOriginY - Math.abs(axisOriginY - destinationPixelY));
                } else {
                    mirrorOriginY = Math.floor(axisOriginY - Math.abs(axisOriginY - originPixelY) - 1);
                    mirrorDestinationY = Math.floor(axisOriginY - Math.abs(axisOriginY - destinationPixelY) - 1);
                }

            }

            // User draw
            line(
                originPixelX,
                originPixelY,
                destinationPixelX,
                destinationPixelY,
                toolBrushSize
                // tool.pencil.brushSize
            );

            // Mirror draw
            line(
                originPixelX,
                mirrorOriginY,
                destinationPixelX,
                mirrorDestinationY,
                toolBrushSize
                // tool.pencil.brushSize
            );
        }

        if (verticalSimmetryVisible) {
            // DONE: implement vertical specular drawing

            var isOverVerticalAxis = (originPixelX >= (axisOriginX));

            if (!isOverVerticalAxis) {

                if (tool.pencil.brushSize % 2 == 0) {
                    mirrorOriginX = Math.floor(axisOriginX + Math.abs(axisOriginX - originPixelX));
                    mirrorDestinationX = Math.floor(axisOriginX + Math.abs(axisOriginX - destinationPixelX));
                } else {
                    // ? otherwise we have to substract a pixel, in order that the mirror pixel is adjacent to the line
                    mirrorOriginX = Math.floor(axisOriginX + Math.abs(axisOriginX - originPixelX) - 1);
                    mirrorDestinationX = Math.floor(axisOriginX + Math.abs(axisOriginX - destinationPixelX) - 1);
                }

            } else {

                if (tool.pencil.brushSize % 2 == 0) {
                    mirrorOriginX = Math.floor(axisOriginX - Math.abs(axisOriginX - originPixelX));
                    mirrorDestinationX = Math.floor(axisOriginX - Math.abs(axisOriginX - destinationPixelX));
                } else {
                    mirrorOriginX = Math.floor(axisOriginX - Math.abs(axisOriginX - originPixelX) - 1);
                    mirrorDestinationX = Math.floor(axisOriginX - Math.abs(axisOriginX - destinationPixelX) - 1);
                }

            }

            // User draw
            line(
                originPixelX,
                originPixelY,
                destinationPixelX,
                destinationPixelY,
                tool.pencil.brushSize
            );

            // Mirror draw
            line(
                mirrorOriginX,
                originPixelY,
                mirrorDestinationX,
                destinationPixelY,
                tool.pencil.brushSize
            );

            if (horizontalSimmetryVisible) {
                // * I do not need to re-compute the mirror coordinates
                // * It is basically a combination of vertical and horizontal projection

                // Mirror draw
                line(
                    mirrorOriginX,
                    mirrorOriginY,
                    mirrorDestinationX,
                    mirrorDestinationY,
                    tool.pencil.brushSize
                );
            }
        }

    }

    // TODO: Implement vertical symmetry

    // * Shape Mirroring
    function startShapeDrawingSpecular(startX, startY, shapeType) {

        console.clear();
        console.log("START\n");

        // normal drawing
        console.log("normal start rect");
        startRectDrawing(startX, startY, 0);

        let originalSize = currFile.layers[0].canvasSize;

        if (horizontalSimmetryVisible) {
            var isUnderHorizontalAxis = (startY >= axisOriginY);

            // startMirrorRectX is the same as startX, only startMirrorRectY changes
            startMirrorRectX = startX;

            if (!isUnderHorizontalAxis) {

                // case when the user draws onto the top of the horizontal axis
                // console.log("starting point on the top");

                if (tool.rectangle.brushSize % 2 == 0) {
                    startMirrorRectY = Math.floor(axisOriginY + Math.abs(axisOriginY - startY) + 1) + 0.5;
                } else {
                    startMirrorRectY = Math.floor(axisOriginY + Math.abs(axisOriginY - startY)) + 0.5;
                }

            } else {

                // case when the user draws onto the bottom of the horizontal axis
                // console.log("starting point on the bottom");

                if (tool.rectangle.brushSize % 2 == 0) {
                    startMirrorRectY = Math.floor(axisOriginY - Math.abs(axisOriginY - startY) + 1) + 0.5;
                } else {
                    startMirrorRectY = Math.floor(axisOriginY - Math.abs(axisOriginY - startY)) + 0.5;
                }


            }

            /* console.log("drawing rect in terms of cells at (" + startX + ", " + startY + ")");
            console.log("drawing mirror in terms of cells at (" + startMirrorRectX + ", " + startMirrorRectY + ")"); */

            switch (shapeType) {
                case ShapeType.RECT:

                    // mirror drawing
                    console.log("horizontal start rect");
                    startRectDrawing(startMirrorRectX, startMirrorRectY, 1);
                    break;

                default:
                    break;
            }
        }

        if (verticalSimmetryVisible) {
            var isOverVerticalAxis = (startX >= axisOriginX);

            // startMirrorRectY is the same as startY, only startMirrorRectX changes
            _startMirrorRectY = startY;

            if (!isOverVerticalAxis) {

                // case when the user draws onto the left of the vertical axis
                if (tool.rectangle.brushSize % 2 == 0) {
                    _startMirrorRectX = Math.floor(axisOriginX + Math.abs(axisOriginX - startX) + 1) + 0.5;
                } else {
                    _startMirrorRectX = Math.floor(axisOriginX + Math.abs(axisOriginX - startX)) + 0.5;
                }

            } else {

                // case when the user draws onto the right of the vertical axis
                if (tool.rectangle.brushSize % 2 == 0) {
                    _startMirrorRectX = Math.floor(axisOriginX - Math.abs(axisOriginX - startX) + 1) + 0.5;
                } else {
                    _startMirrorRectX = Math.floor(axisOriginX - Math.abs(axisOriginX - startX)) + 0.5;
                }

            }

            switch (shapeType) {
                case ShapeType.RECT:

                    // mirror drawing
                    console.log("vertical start rect");
                    startRectDrawing(_startMirrorRectX, _startMirrorRectY, 2);

                    if (horizontalSimmetryVisible) {
                        // I have to draw the shape into the fourth quadrant
                        __startMirrorRectX = _startMirrorRectX;
                        __startMirrorRectY = startMirrorRectY;
                        startRectDrawing(_startMirrorRectX, startMirrorRectY, 3);
                    }
                    break;

                default:
                    break;
            }


        }

    }

    // * Metrics are right
    // TODO: Fix the mirror preview
    function updateShapeDrawingSpecular(x, y, shapeType) {

        switch (shapeType) {
            case ShapeType.RECT:
                // normal drawing
                updateRectDrawing(x, y, 0);

                // mirror drawing
                // updateRectDrawing(x, mirrorY, true);
                break;

            default:
                break;
        }

    }

    function endShapeDrawingSpecular(x, y, shapeType) {

        //console.clear();
        console.log("END\n");

        let originalSize = currFile.layers[0].canvasSize;

        // in terms of px
        let mirrorY;
        let mirrorX;

        // in terms of cells
        let originPixelX = Math.floor(x / zoom);
        let originPixelY = Math.floor(y / zoom);

        // normal drawing
        endRectDrawing(x, y, 0);

        if (horizontalSimmetryVisible) {

            var isUnderHorizontalAxis = (originPixelY >= axisOriginY);

            if (!isUnderHorizontalAxis) {

                if (tool.rectangle.brushSize % 2 == 0) {
                    mirrorY = Math.floor(axisOriginY + Math.abs(axisOriginY - originPixelY));
                } else {
                    mirrorY = Math.floor(axisOriginY + Math.abs(axisOriginY - originPixelY) - 1);
                }

            } else {
                /* console.log("axis origin Y = " + axisOriginY);
                console.log("originPixelY  = " + originPixelY); */
                if (tool.rectangle.brushSize % 2 == 0) {
                    mirrorY = Math.floor(axisOriginY - Math.abs(axisOriginY - originPixelY));
                } else {
                    mirrorY = Math.floor(axisOriginY - Math.abs(axisOriginY - originPixelY)) - 1;
                }

            }

            endMirrorRectX = originPixelX;
            endMirrorRectY = mirrorY;

            console.log("end rect in terms of cells at (" + originPixelX + ", " + originPixelY + ")");
            console.log("end mirror in terms of cells at (" + originPixelX + ", " + mirrorY + ")");

            switch (shapeType) {
                case ShapeType.RECT:

                    // mirror drawing
                    console.log("horizontal end rect");
                    endRectDrawing(x, mirrorY, 1);
                    break;

                default:
                    break;
            }

        }

        if (verticalSimmetryVisible) {
            var isOverVerticalAxis = (originPixelX >= axisOriginX);

            if (!isOverVerticalAxis) {

                if (tool.rectangle.brushSize % 2 == 0) {
                    mirrorX = Math.floor(axisOriginX + Math.abs(axisOriginX - originPixelX));
                } else {
                    mirrorX = Math.floor(axisOriginX + Math.abs(axisOriginX - originPixelX) - 1);
                }

            } else {
                /* console.log("axis origin Y = " + axisOriginY);
                console.log("originPixelY  = " + originPixelY); */
                if (tool.rectangle.brushSize % 2 == 0) {
                    mirrorX = Math.floor(axisOriginX - Math.abs(axisOriginX - originPixelX));
                } else {
                    mirrorX = Math.floor(axisOriginX - Math.abs(axisOriginX - originPixelX)) - 1;
                }

            }

            // console.log("assigning _ends");
            _endMirrorRectX = mirrorX;
            _endMirrorRectY = originPixelY;

            switch (shapeType) {
                case ShapeType.RECT:

                    // mirror drawing
                    console.log("vertical end rect");
                    endRectDrawing(mirrorX, y, 2);

                    if (horizontalSimmetryVisible) {
                        // I have to draw the shape into the fourth quadrant
                        __endMirrorRectX = _endMirrorRectX;
                        __endMirrorRectY = endMirrorRectY;
                        endRectDrawing(mirrorX, __endMirrorRectY);
                    }
                    break;

                default:
                    break;
            }
        }

    }

    return {
        hSymmetricCanvas,
        vSymmetricCanvas,
        initSymmetricCanvas,
        getHorizontalSymmetryVisible,
        getVerticalSymmetryVisible,
        ShapeType,
        startShapeDrawingSpecular,
        updateShapeDrawingSpecular,
        endShapeDrawingSpecular,
        drawBrushSpecular
    }

})();