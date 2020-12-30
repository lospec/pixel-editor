var undoStates = [];
var redoStates = [];

const undoLogStyle = 'background: #87ff1c; color: black; padding: 5px;';

function HistoryStateResizeSprite(xRatio, yRatio, algo, oldData) {
    this.xRatio = xRatio;
    this.yRatio = yRatio;
    this.algo = algo;
    this.oldData = oldData;

    this.undo = function() {
        let layerIndex = 0;

        currentAlgo = algo;
        resizeSprite(null, [1 / this.xRatio, 1 / this.yRatio]);

        // Also putting the old data
        for (let i=0; i<layers.length; i++) {
            if (layers[i].menuEntry != null) {
                layers[i].context.putImageData(this.oldData[layerIndex], 0, 0);
                layerIndex++;
                layers[i].updateLayerPreview();
            }
        }

        redoStates.push(this);
    };

    this.redo = function() {
        currentAlgo = algo;
        resizeSprite(null, [this.xRatio, this.yRatio]);
        undoStates.push(this);
    };
    
    saveHistoryState(this);
}

function HistoryStateResizeCanvas(newSize, oldSize, imageDatas, trim) {
    this.oldSize = oldSize;
    this.newSize = newSize;
    this.imageDatas = imageDatas;
    this.trim = trim;

    this.undo = function() {
        let dataIndex = 0;
        console.log("breakpoint");
        // Resizing the canvas
        resizeCanvas(null, oldSize, null, false);
        // Putting the image datas
        for (let i=0; i<layers.length; i++) {
            if (layers[i].menuEntry != null) {
                layers[i].context.putImageData(this.imageDatas[dataIndex], 0, 0);
                dataIndex++;
            }
        }

        redoStates.push(this);
    };

    this.redo = function() {
        console.log("trim: " + this.trim);
        if (!this.trim) {
            resizeCanvas(null, newSize, null, false);
        }
        else {
            trimCanvas(null, false);
        }

        undoStates.push(this);
    };

    saveHistoryState(this);
}

function HistoryStateFlattenVisible(flattened) {
    this.nFlattened = flattened;

    this.undo = function() {
        for (let i=0; i<this.nFlattened; i++) {
            undo();
        }

        redoStates.push(this);
    };

    this.redo = function() {
        for (let i=0; i<this.nFlattened; i++) {
            redo();
        }

        undoStates.push(this);
    };

    saveHistoryState(this);
}

function HistoryStateFlattenTwoVisibles(belowImageData, afterAbove, layerIndex, aboveLayer, belowLayer) {
    this.aboveLayer = aboveLayer;
    this.belowLayer = belowLayer;
    this.belowImageData = belowImageData;

    this.undo = function() {
        console.log(afterAbove.menuEntry);
        canvasView.append(aboveLayer.canvas);
        layerList.insertBefore(aboveLayer.menuEntry, afterAbove);

        belowLayer.context.clearRect(0, 0, belowLayer.canvasSize[0], belowLayer.canvasSize[1]);
        belowLayer.context.putImageData(this.belowImageData, 0, 0);
        belowLayer.updateLayerPreview();

        layers.splice(layerIndex, 0, aboveLayer);

        redoStates.push(this);
    };

    this.redo = function() {
        mergeLayers(belowLayer.context, aboveLayer.context);

        // Deleting the above layer
        aboveLayer.canvas.remove();
        aboveLayer.menuEntry.remove();
        layers.splice(layers.indexOf(aboveLayer), 1);

        undoStates.push(this);
    };

    saveHistoryState(this);
}

function HistoryStateFlattenAll(nFlattened) {
    this.nFlattened = nFlattened;

    this.undo = function() {
        for (let i=0; i<this.nFlattened - nAppLayers; i++) {
            undo();
        }

        redoStates.push(this);
    };

    this.redo = function() {
        for (let i=0; i<this.nFlattened - nAppLayers; i++) {
            redo();
        }

        undoStates.push(this);
    };

    saveHistoryState(this);
}

function HistoryStateMergeLayer(aboveIndex, aboveLayer, belowData, belowLayer) {
    this.aboveIndex = aboveIndex;
    this.belowData = belowData;
    this.aboveLayer = aboveLayer;
    this.belowLayer = belowLayer;

    this.undo = function() {
        layerList.insertBefore(this.aboveLayer.menuEntry, this.belowLayer.menuEntry);
        canvasView.append(this.aboveLayer.canvas);

        belowLayer.context.clearRect(0, 0, this.belowLayer.canvasSize[0], this.belowLayer.canvasSize[1]);
        belowLayer.context.putImageData(this.belowData, 0, 0);
        belowLayer.updateLayerPreview();

        layers.splice(this.aboveIndex, 0, this.aboveLayer);

        redoStates.push(this);
    };

    this.redo = function() {
        aboveLayer.selectLayer();
        merge(false);

        undoStates.push(this);
    };

    saveHistoryState(this);
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

function HistoryStateDuplicateLayer(addedLayer, copiedLayer) {
    this.addedLayer = addedLayer;
    this.copiedLayer = copiedLayer;

    this.undo = function() {
        addedLayer.selectLayer();
        deleteLayer(false);

        redoStates.push(this);
    };

    this.redo = function() {
        copiedLayer.selectLayer();
        duplicateLayer(null, false);

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

function HistoryStateMoveTwoLayers(layer, oldIndex, newIndex) {
    this.layer = layer;
    this.oldIndex = oldIndex;
    this.newIndex = newIndex;

    this.undo = function() {
        layer.canvas.style.zIndex = oldIndex;
        redoStates.push(this);
    };

    this.redo = function() {
        layer.canvas.style.zIndex = newIndex;
        undoStates.push(this);
    };

    saveHistoryState(this);
}

function HistoryStateMoveLayer(afterToDrop, toDrop, staticc, nMoved) {
    this.beforeToDrop = afterToDrop;
    this.toDrop = toDrop;

    this.undo = function() {
        toDrop.menuEntry.remove();

        if (afterToDrop != null) {
            layerList.insertBefore(toDrop.menuEntry, afterToDrop)
        }
        else {
            layerList.append(toDrop.menuEntry);
        }

        for (let i=0; i<nMoved; i++) {
            undo();
        }

        redoStates.push(this);
    };

    this.redo = function() {
        moveLayers(toDrop.menuEntry.id, staticc.menuEntry.id, true);
        undoStates.push(this);
    };

    saveHistoryState(this);
}

function HistoryStateAddLayer(layerData, index) {
    this.added = layerData;
    this.index = index;

    this.undo = function() {
        console.log("uo");

        redoStates.push(this);
        if (layers.length - nAppLayers > this.index + 1) {
            layers[this.index + 1].selectLayer();
        }
        else {
            layers[this.index - 1].selectLayer();
        }
        

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
}

function undo () {
    //console.log('%cundo', undoLogStyle);

    //if there are any states saved to undo
    if (undoStates.length > 0) {
        document.getElementById('redo-button').classList.remove('disabled');

        //get state
        var undoState = undoStates[undoStates.length-1];
        //console.log(undoState);

        //remove from the undo list
        undoStates.splice(undoStates.length-1,1);

        //restore the state
        undoState.undo();

        //if theres none left to undo, disable the option
        if (undoStates.length == 0)
            document.getElementById('undo-button').classList.add('disabled');
    }
}

function redo () {
    //console.log('%credo', undoLogStyle);

    if (redoStates.length > 0) {

        //enable undo button
        document.getElementById('undo-button').classList.remove('disabled');

        //get state
        var redoState = redoStates[redoStates.length-1];

        //remove from redo array (do this before restoring the state, else the flatten state will break)
        redoStates.splice(redoStates.length-1,1);

        //restore the state
        redoState.redo();

        //if theres none left to redo, disable the option
        if (redoStates.length == 0)
            document.getElementById('redo-button').classList.add('disabled');
    }
    //console.log(undoStates);
    //console.log(redoStates);
}
