var undoStates = [];
var redoStates = [];

const undoLogStyle = 'background: #87ff1c; color: black; padding: 5px;';

//prototype for undoing canvas changes
function HistoryStateEditCanvas () {
    this.canvas = currentLayer.context.getImageData(0, 0, canvasSize[0], canvasSize[1]);

    this.undo = function () {
        var currentCanvas = currentLayer.context.getImageData(0, 0, canvasSize[0], canvasSize[1]);
        currentLayer.context.putImageData(this.canvas, 0, 0);

        this.canvas = currentCanvas;
        redoStates.push(this);

        currentLayer.updateLayerPreview();
    };

    this.redo = function () {
        var currentCanvas = currentLayer.context.getImageData(0, 0, canvasSize[0], canvasSize[1]);
        currentLayer.context.putImageData(this.canvas, 0, 0);

        this.canvas = currentCanvas;
        undoStates.push(this);

        currentLayer.updateLayerPreview();
    };

    //add self to undo array
    saveHistoryState(this);
}

//prototype for undoing added colors
function HistoryStateAddColor (colorValue) {
    this.colorValue = colorValue;

    this.undo = function () {
        redoStates.push(this);
        deleteColor(this.colorValue);
    };

    this.redo = function () {
        addColor(this.colorValue);
        undoStates.push(this);
    };

    //add self to undo array
    saveHistoryState(this);
}

//prototype for undoing deleted colors
function HistoryStateDeleteColor (colorValue) {
    this.colorValue = colorValue;
    this.canvas = currentLayer.context.getImageData(0, 0, canvasSize[0], canvasSize[1]);

    this.undo = function () {
        var currentCanvas = currentLayer.context.getImageData(0, 0, canvasSize[0], canvasSize[1]);
        currentLayer.context.putImageData(this.canvas, 0, 0);

        addColor(this.colorValue);

        this.canvas = currentCanvas;
        redoStates.push(this);
    };

    this.redo = function () {
        var currentCanvas = currentLayer.context.getImageData(0, 0, canvasSize[0], canvasSize[1]);
        currentLayer.context.putImageData(this.canvas, 0, 0);

        deleteColor(this.colorValue);

        this.canvas = currentCanvas;
        undoStates.push(this);
    };

    //add self to undo array
    saveHistoryState(this);
}

//prototype for undoing colors edits
function HistoryStateEditColor (newColorValue, oldColorValue) {
    this.newColorValue = newColorValue;
    this.oldColorValue = oldColorValue;
    this.canvas = currentLayer.context.getImageData(0, 0, canvasSize[0], canvasSize[1]);

    this.undo = function () {
        var currentCanvas = currentLayer.context.getImageData(0, 0, canvasSize[0], canvasSize[1]);
        currentLayer.context.putImageData(this.canvas, 0, 0);

        //find new color in palette and change it back to old color
        var colors = document.getElementsByClassName('color-button');
        for (var i = 0; i < colors.length; i++) {
            //console.log(newColorValue, '==', colors[i].jscolor.toString());
            if (newColorValue == colors[i].jscolor.toString()) {
                colors[i].jscolor.fromString(oldColorValue);
                break;
            }
        }

        this.canvas = currentCanvas;
        redoStates.push(this);
    };

    this.redo = function () {
        var currentCanvas = currentLayer.context.getImageData(0, 0, canvasSize[0], canvasSize[1]);
        currentLayer.context.putImageData(this.canvas, 0, 0);

        //find old color in palette and change it back to new color
        var colors = document.getElementsByClassName('color-button');
        for (var i = 0; i < colors.length; i++) {
            //console.log(oldColorValue, '==', colors[i].jscolor.toString());
            if (oldColorValue == colors[i].jscolor.toString()) {
                colors[i].jscolor.fromString(newColorValue);
                break;
            }
        }

        this.canvas = currentCanvas;
        undoStates.push(this);
    };

    //add self to undo array
    saveHistoryState(this);
}


//rename to add undo state
function saveHistoryState (state) {
    //console.log('%csaving history state', undoLogStyle);
    //console.log(state);

    //get current canvas data and save to undoStates array
    undoStates.push(state);

    //limit the number of states to settings.numberOfHistoryStates
    if (undoStates.length > settings.numberOfHistoryStates) {
        undoStates = undoStates.splice(-settings.numberOfHistoryStates, settings.numberOfHistoryStates);
    }

    //there is now definitely at least 1 undo state, so the button shouldnt be disabled
    document.getElementById('undo-button').classList.remove('disabled');

    //there should be no redoStates after an undoState is saved
    redoStates = [];

    //console.log(undoStates);
    //console.log(redoStates);
}

function undo () {
    //console.log('%cundo', undoLogStyle);

    //if there are any states saved to undo
    if (undoStates.length > 0) {

        document.getElementById('redo-button').classList.remove('disabled');

        //get state 
        var undoState = undoStates[undoStates.length-1];
        //console.log(undoState);

        //restore the state
        undoState.undo();

        //remove from the undo list
        undoStates.splice(undoStates.length-1,1);

        //if theres none left to undo, disable the option
        if (undoStates.length == 0) 
            document.getElementById('undo-button').classList.add('disabled');
    }

    //console.log(undoStates);
    //console.log(redoStates);
}

function redo () {
    //console.log('%credo', undoLogStyle);

    if (redoStates.length > 0) {

        //enable undo button
        document.getElementById('undo-button').classList.remove('disabled');

        //get state 
        var redoState = redoStates[redoStates.length-1];
        //console.log(redoState);

        //restore the state
        redoState.redo();

        //remove from redo array
        redoStates.splice(redoStates.length-1,1);

        //if theres none left to redo, disable the option
        if (redoStates.length == 0) 
            document.getElementById('redo-button').classList.add('disabled');
    }
    //console.log(undoStates);
    //console.log(redoStates);
}
