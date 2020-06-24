var undoStates = [];
var redoStates = [];

const undoLogStyle = 'background: #87ff1c; color: black; padding: 5px;';

function HistoryStateFlattenVisible() {
    // undo the merge for the number of layers that have been flattened
}

function HistoryStateFlattenAll() {
    // undo the merge for the number of layers that have been flattened
}

function HistoryStateMergeLayer() {
    // todo
}

function HistoryStateRenameLayer(oldName, newName, layer) {
    this.edited = layer;
    this.oldName = oldName;
    this.newName = newName;

    this.undo = function() {
        layer.menuEntry.getElementsByTagName("p")[0].innerHTML = oldName;

        redoStates.push(this);
    };

    this.redo = function() {
        layer.menuEntry.getElementsByTagName("p")[0].innerHTML = newName;

        undoStates.push(this);
    };

    saveHistoryState(this);
}

function HistoryStateDeleteLayer(layerData, before, index) {
    this.deleted = layerData;
    this.before = before;
    this.index = index;

    this.undo = function() {
        canvasView.append(this.deleted.canvas);
        if (this.before != null) {
            layerList.insertBefore(this.deleted.menuEntry, this.before);
        }
        else {
            layerList.prepend(this.deleted.menuEntry);
        }
        layers.splice(this.index, 0, this.deleted);

        redoStates.push(this);
    };

    this.redo = function() {
        this.deleted.selectLayer();
        deleteLayer(false);

        undoStates.push(this);
    };

    saveHistoryState(this);
}

function HistoryStateMoveLayer(layer1, layer2) {
    this.layer1 = layer1;
    this.layer2 = layer2;

    this.undo = function() {
        swapLayerEntries(layer1, layer2, false);
        redoStates.push(this);
    };

    this.redo = function() {
        swapLayerEntries(layer1, layer2, false);
        undoStates.push(this);
    };

    saveHistoryState(this);
}

function HistoryStateAddLayer(layerData, index) {
    this.added = layerData;
    this.index = index;

    this.undo = function() {
        redoStates.push(this);

        this.added.canvas.remove();
        this.added.menuEntry.remove();
        layers.splice(index, 1);
    };

    this.redo = function() {
        undoStates.push(this);

        canvasView.append(this.added.canvas);
        layerList.prepend(this.added.menuEntry);
        layers.splice(this.index, 0, this.added);
    };

    saveHistoryState(this);
}

//prototype for undoing canvas changes
function HistoryStateEditCanvas () {
    this.canvasState = currentLayer.context.getImageData(0, 0, canvasSize[0], canvasSize[1]);
    this.layerID = currentLayer.id;

    this.undo = function () {
        console.log("CHE COSA STA SUCCEDENDOOOOOO STA CAMBIANDO IL MONDOOOOO");
        var stateLayer = getLayerByID(this.layerID);
        var currentCanvas = stateLayer.context.getImageData(0, 0, canvasSize[0], canvasSize[1]);
        stateLayer.context.putImageData(this.canvasState, 0, 0);

        this.canvasState = currentCanvas;
        redoStates.push(this);

        stateLayer.updateLayerPreview();
    };

    this.redo = function () {
        console.log("YEET");
        var stateLayer = getLayerByID(this.layerID);
        var currentCanvas = stateLayer.context.getImageData(0, 0, canvasSize[0], canvasSize[1]);

        stateLayer.context.putImageData(this.canvasState, 0, 0);

        this.canvasState = currentCanvas;
        undoStates.push(this);

        stateLayer.updateLayerPreview();
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
        console.log("UUUEEEEEEEEEEE");
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
