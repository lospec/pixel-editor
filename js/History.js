/** How the history works
 * - undoStates stores the states that can be undone
 * - redoStates stores the states that can be redone
 * - undo() undoes an action and adds it to the redoStates
 * - redo() redoes an action and adds it to the undoStates
 * - Each HistoryState must implement an undo() and redo() function 
 *      Those functions actually implement the undo and redo mechanism for that action,
 *      so you'll need to save the data you need as attributes in the constructor. For example,
 *      for the HistoryStateAddColour, the added colour is saved so that it can be removed in 
 *      undo() or added back in redo().
 * - Each HistoryState must call saveHistoryState(this) so that it gets added to the stack
 * 
 */
const History = (() => {

    const undoLogStyle = 'background: #87ff1c; color: black; padding: 5px;';
    let undoStates = [];
    let redoStates = [];
    
    Input.on('click', 'undo-button', undo);
    Input.on('click', 'redo-button', redo);

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
        undoOrRedo('undo');
    }

    function redo () {
        undoOrRedo('redo');
    }

    function undoOrRedo(mode) {
        if (redoStates.length <= 0 && mode == 'redo') return;
        if (undoStates.length <= 0 && mode == 'undo') return;

        // Enable button
        document.getElementById(mode + '-button').classList.remove('disabled');

        if (mode == 'undo') {
            const undoState = undoStates.pop();
            redoStates.push(undoState); 
            undoState.undo();
        }
        else {
            const redoState = redoStates.pop();
            undoStates.push(redoState); 
            redoState.redo();
        }


        // if theres none left, disable the option
        if (redoStates.length == 0) document.getElementById('redo-button').classList.add('disabled');
        if (undoStates.length == 0) document.getElementById('undo-button').classList.add('disabled');
    }

    return {
        redo,
        undo,
        saveHistoryState
    }
})();

class HistoryState {
    constructor() {
        History.saveHistoryState(this);
    }

    ResizeSprite (xRatio, yRatio, algo, oldData) {
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
        };

        this.redo = function() {
            currentAlgo = algo;
            resizeSprite(null, [this.xRatio, this.yRatio]);
        };
    }

    ResizeCanvas (newSize, oldSize, imageDatas, trim) {
        this.oldSize = oldSize;
        this.newSize = newSize;
        this.imageDatas = imageDatas;
        this.trim = trim;

        this.undo = function() {
            let dataIndex = 0;
            // Resizing the canvas
            resizeCanvas(null, oldSize, null, false);
            // Putting the image datas
            for (let i=0; i<layers.length; i++) {
                if (layers[i].menuEntry != null) {
                    layers[i].context.putImageData(this.imageDatas[dataIndex], 0, 0);
                    dataIndex++;
                }
            }
        };

        this.redo = function() {
            if (!this.trim) {
                resizeCanvas(null, newSize, null, false);
            }
            else {
                trimCanvas(null, false);
            }
        };
    }

    FlattenVisible(flattened) {
        this.nFlattened = flattened;

        this.undo = function() {
            for (let i=0; i<this.nFlattened; i++) {
                undo();
            }
        };

        this.redo = function() {
            for (let i=0; i<this.nFlattened; i++) {
                redo();
            }
        };
    }

    FlattenTwoVisibles(belowImageData, afterAbove, layerIndex, aboveLayer, belowLayer) {
        this.aboveLayer = aboveLayer;
        this.belowLayer = belowLayer;
        this.belowImageData = belowImageData;

        this.undo = function() {
            canvasView.append(aboveLayer.canvas);
            layerList.insertBefore(aboveLayer.menuEntry, afterAbove);

            belowLayer.context.clearRect(0, 0, belowLayer.canvasSize[0], belowLayer.canvasSize[1]);
            belowLayer.context.putImageData(this.belowImageData, 0, 0);
            belowLayer.updateLayerPreview();

            layers.splice(layerIndex, 0, aboveLayer);
        };

        this.redo = function() {
            mergeLayers(belowLayer.context, aboveLayer.context);

            // Deleting the above layer
            aboveLayer.canvas.remove();
            aboveLayer.menuEntry.remove();
            layers.splice(layers.indexOf(aboveLayer), 1);
        };
    }

    FlattenAll(nFlattened) {
        this.nFlattened = nFlattened;

        this.undo = function() {
            for (let i=0; i<this.nFlattened - nAppLayers; i++) {
                undo();
            }
        };

        this.redo = function() {
            for (let i=0; i<this.nFlattened - nAppLayers; i++) {
                redo();
            }
        };
    }

    MergeLayer(aboveIndex, aboveLayer, belowData, belowLayer) {
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
        };

        this.redo = function() {
            aboveLayer.selectLayer();
            merge(false);
        };
    }

    RenameLayer(oldName, newName, layer) {
        this.edited = layer;
        this.oldName = oldName;
        this.newName = newName;

        this.undo = function() {
            layer.menuEntry.getElementsByTagName("p")[0].innerHTML = oldName;
        };

        this.redo = function() {
            layer.menuEntry.getElementsByTagName("p")[0].innerHTML = newName;
        };
    }

    DuplicateLayer(addedLayer, copiedLayer) {
        this.addedLayer = addedLayer;
        this.copiedLayer = copiedLayer;

        this.undo = function() {
            addedLayer.selectLayer();
            deleteLayer(false);
        };

        this.redo = function() {
            copiedLayer.selectLayer();
            duplicateLayer(null, false);
        };
    }

    DeleteLayer(layerData, before, index) {
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
        };

        this.redo = function() {
            this.deleted.selectLayer();
            deleteLayer(false);
        };
    }

    MoveTwoLayers(layer, oldIndex, newIndex) {
        this.layer = layer;
        this.oldIndex = oldIndex;
        this.newIndex = newIndex;

        this.undo = function() {
            layer.canvas.style.zIndex = oldIndex;
        };

        this.redo = function() {
            layer.canvas.style.zIndex = newIndex;
        };
    }

    MoveLayer(afterToDrop, toDrop, staticc, nMoved) {
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
        };

        this.redo = function() {
            moveLayers(toDrop.menuEntry.id, staticc.menuEntry.id, true);
        };
    }

    AddLayer(layerData, index) {
        this.added = layerData;
        this.index = index;

        this.undo = function() {
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
            canvasView.append(this.added.canvas);
            layerList.prepend(this.added.menuEntry);
            layers.splice(this.index, 0, this.added);
        };
    }

    //prototype for undoing canvas changes
    EditCanvas() {
        this.canvasState = currentLayer.context.getImageData(0, 0, canvasSize[0], canvasSize[1]);
        this.layerID = currentLayer.id;

        this.undo = function () {
            var stateLayer = getLayerByID(this.layerID);
            var currentCanvas = stateLayer.context.getImageData(0, 0, canvasSize[0], canvasSize[1]);
            stateLayer.context.putImageData(this.canvasState, 0, 0);

            this.canvasState = currentCanvas;

            stateLayer.updateLayerPreview();
        };

        this.redo = function () {
            var stateLayer = getLayerByID(this.layerID);
            var currentCanvas = stateLayer.context.getImageData(0, 0, canvasSize[0], canvasSize[1]);

            stateLayer.context.putImageData(this.canvasState, 0, 0);

            this.canvasState = currentCanvas;

            stateLayer.updateLayerPreview();
        };
    }

    //prototype for undoing added colors
    AddColor(colorValue) {
        this.colorValue = colorValue;

        this.undo = function () {
            ColorModule.deleteColor(this.colorValue);
        };

        this.redo = function () {
            ColorModule.addColor(this.colorValue);
        };
    }

    //prototype for undoing deleted colors
    DeleteColor(colorValue) {
        this.colorValue = colorValue;
        this.canvas = currentLayer.context.getImageData(0, 0, canvasSize[0], canvasSize[1]);

        this.undo = function () {
            var currentCanvas = currentLayer.context.getImageData(0, 0, canvasSize[0], canvasSize[1]);
            currentLayer.context.putImageData(this.canvas, 0, 0);

            ColorModule.addColor(this.colorValue);

            this.canvas = currentCanvas;
        };

        this.redo = function () {
            var currentCanvas = currentLayer.context.getImageData(0, 0, canvasSize[0], canvasSize[1]);
            currentLayer.context.putImageData(this.canvas, 0, 0);

            ColorModule.deleteColor(this.colorValue);

            this.canvas = currentCanvas;
        };
    }

    //prototype for undoing colors edits
    EditColor(newColorValue, oldColorValue) {
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
        };
    }
}