const LayerList = (() => {

    let layerList = document.getElementById("layers-menu");
    let layerListEntry = layerList.firstElementChild;
    let dragStartLayer;

    // Binding the right click menu
    Events.on("mousedown", layerList, openOptionsMenu);
    // Binding the add layer button to the right function
    Events.on('click',"add-layer-button", addLayer, false);

    // Making the layers list sortable
    new Sortable(layerList, {
        animation: 100,
        filter: ".layer-button",
        draggable: ".layers-menu-entry",
        onStart: layerDragStart,
        onEnd: layerDragDrop
    });

    function addLayer(id, saveHistory = true) {
        // layers.length - 3
        let index = layers.length - 3;
        // Creating a new canvas
        let newCanvas = document.createElement("canvas");
        // Setting up the new canvas
        canvasView.append(newCanvas);
        Layer.maxZIndex+=2;
        newCanvas.style.zIndex = Layer.maxZIndex;
        newCanvas.classList.add("drawingCanvas");
    
        if (!layerListEntry) return console.warn('skipping adding layer because no document');
    
        // Clone the default layer
        let toAppend = layerListEntry.cloneNode(true);
        // Setting the default name for the layer
        toAppend.getElementsByTagName('p')[0].innerHTML = "Layer " + Layer.layerCount;
        // Removing the selected class
        toAppend.classList.remove("selected-layer");
        // Adding the layer to the list
        Layer.layerCount++;
    
        // Creating a layer object
        let newLayer = new Layer(currentLayer.canvasSize[0], currentLayer.canvasSize[1], newCanvas, toAppend);
        newLayer.context.fillStyle = currentLayer.context.fillStyle;
        newLayer.copyData(currentLayer);
    
        layers.splice(index, 0, newLayer);
        
        // Insert it before the Add layer button
        layerList.insertBefore(toAppend, layerList.childNodes[0]);
    
        if (id != null && typeof(id) == "string") {
            newLayer.setID(id);
        }
        // Basically "if I'm not adding a layer because redo() is telling meto do so", then I can save the history
        if (saveHistory) {
            new HistoryState().AddLayer(newLayer, index);
        }
    
        return newLayer;
    }

    /** Merges topLayer onto belowLayer
    * 
    * @param {*} belowLayer The layer on the bottom of the layer stack
    * @param {*} topLayer The layer on the top of the layer stack
    */
    function mergeLayers(belowLayer, topLayer) {
        // Copying the above content on the layerBelow
        let belowImageData = belowLayer.getImageData(0, 0, currentLayer.canvas.width, currentLayer.canvas.height);
        let toMergeImageData = topLayer.getImageData(0, 0, currentLayer.canvas.width, currentLayer.canvas.height);

        for (let i=0; i<belowImageData.data.length; i+=4) {
            let currentMovePixel = [
                toMergeImageData.data[i], toMergeImageData.data[i+1], 
                toMergeImageData.data[i+2], toMergeImageData.data[i+3]
            ];

            let currentUnderlyingPixel = [
                belowImageData.data[i], belowImageData.data[i+1], 
                belowImageData.data[i+2], belowImageData.data[i+3]
            ];

            if (isPixelEmpty(currentMovePixel)) {
                if (!isPixelEmpty(belowImageData)) {
                    toMergeImageData.data[i] = currentUnderlyingPixel[0];
                    toMergeImageData.data[i+1] = currentUnderlyingPixel[1];
                    toMergeImageData.data[i+2] = currentUnderlyingPixel[2];
                    toMergeImageData.data[i+3] = currentUnderlyingPixel[3];
                }
            }
        }

        // Putting the top data into the belowdata
        belowLayer.putImageData(toMergeImageData, 0, 0);
    }

    /** Sets the z indexes of the layers when the user drops the layer in the menu
     * 
     * @param {*} event 
     */
    function layerDragDrop(event) {
        let oldIndex = event.oldDraggableIndex;
        let newIndex = event.newDraggableIndex;

        let movedZIndex = dragStartLayer.canvas.style.zIndex;

        if (oldIndex > newIndex)
        {
            for (let i=newIndex; i<oldIndex; i++) {
                getLayerByID(layerList.children[i].id).canvas.style.zIndex = getLayerByID(layerList.children[i + 1].id).canvas.style.zIndex;
            }
        }
        else
        {
            for (let i=newIndex; i>oldIndex; i--) {
                getLayerByID(layerList.children[i].id).canvas.style.zIndex = getLayerByID(layerList.children[i - 1].id).canvas.style.zIndex;
            }
        }

        getLayerByID(layerList.children[oldIndex].id).canvas.style.zIndex = movedZIndex;
        Events.simulateMouseEvent(window, "mouseup");
    }

    /** Saves the layer that is being moved when the dragging starts
     * 
     * @param {*} event 
     */
    function layerDragStart(event) {
        dragStartLayer = getLayerByID(layerList.children[event.oldIndex].id);
    }

    // Finds a layer given its id
    function getLayerByID(id) {
        for (let i=0; i<layers.length; i++) {
            if (layers[i].menuEntry != null) {
                if (layers[i].menuEntry.id == id) {
                    return layers[i];
                }
            }
        }

        return null;
    }

    // Finds a layer given its name
    function getLayerByName(name) {
        for (let i=0; i<layers.length; i++) {
            if (layers[i].menuEntry != null) {
                if (layers[i].menuEntry.getElementsByTagName("p")[0].innerHTML == name) {
                    return layers[i];
                }
            }
        }

        return null;
    }

    function renameLayer(event) {
        let p = currentLayer.menuEntry.getElementsByTagName("p")[0];
    
        oldLayerName = p.innerHTML;
    
        p.setAttribute("contenteditable", true);
        p.classList.add("layer-name-editable");
        p.focus();
    
        Events.simulateInput(65, true, false, false);
    
        isRenamingLayer = true;
    }

    function duplicateLayer(event, saveHistory = true) {
        function getMenuEntryIndex(list, entry) {
            for (let i=0; i<list.length; i++) {
                if (list[i] === entry) {
                    return i;
                }
            }
        
            return -1;
        }
    
        let layerIndex = layers.indexOf(currentLayer);
        let toDuplicate = currentLayer;
        let menuEntries = layerList.children;
    
        // Increasing z-indexes of the layers above
        for (let i=getMenuEntryIndex(menuEntries, toDuplicate.menuEntry) - 1; i>=0; i--) {
            LayerList.getLayerByID(menuEntries[i].id).canvas.style.zIndex++;
        }
        Layer.maxZIndex+=2;
    
        // Creating a new canvas
        let newCanvas = document.createElement("canvas");
        // Setting up the new canvas
        canvasView.append(newCanvas);
        newCanvas.style.zIndex = parseInt(currentLayer.canvas.style.zIndex) + 2;
        newCanvas.classList.add("drawingCanvas");
    
        if (!layerListEntry) return console.warn('skipping adding layer because no document');
    
        // Clone the default layer
        let toAppend = currentLayer.menuEntry.cloneNode(true);
        // Setting the default name for the layer
        toAppend.getElementsByTagName('p')[0].innerHTML += " copy";
        // Removing the selected class
        toAppend.classList.remove("selected-layer");
        // Adding the layer to the list
        Layer.layerCount++;
    
        // Creating a layer object
        let newLayer = new Layer(currentLayer.canvasSize[0], currentLayer.canvasSize[1], newCanvas, toAppend);
        newLayer.context.fillStyle = currentLayer.context.fillStyle;
        newLayer.copyData(currentLayer);
    
        layers.splice(layerIndex, 0, newLayer);
        
        // Insert it before the Add layer button
        layerList.insertBefore(toAppend, currentLayer.menuEntry);
    
        // Copy the layer content
        newLayer.context.putImageData(currentLayer.context.getImageData(
            0, 0, currentLayer.canvasSize[0], currentLayer.canvasSize[1]), 0, 0);
        newLayer.updateLayerPreview();
        // Basically "if I'm not adding a layer because redo() is telling meto do so", then I can save the history
        if (saveHistory) {
            new HistoryState().DuplicateLayer(newLayer, currentLayer);
        }
    }

    function deleteLayer(saveHistory = true) {
        // Cannot delete all the layers
        if (layers.length != 4) {
            let layerIndex = layers.indexOf(currentLayer);
            let toDelete = layers[layerIndex];
            let previousSibling = toDelete.menuEntry.previousElementSibling;
            // Adding the ids to the unused ones
            Layer.unusedIDs.push(toDelete.id);
    
            // Selecting the next layer
            if (layerIndex != (layers.length - 4)) {
                layers[layerIndex + 1].selectLayer();
            }
            // or the previous one if the next one doesn't exist
            else {
                layers[layerIndex - 1].selectLayer();
            }
    
            // Deleting canvas and entry
            toDelete.canvas.remove();
            toDelete.menuEntry.remove();
    
            // Removing the layer from the list
            layers.splice(layerIndex, 1);
    
            if (saveHistory) {
                new HistoryState().DeleteLayer(toDelete, previousSibling, layerIndex);
            }
        }
    
        // Closing the menu
        closeOptionsMenu();
    }

    // TODO: Can't select the first layer

    function merge(saveHistory = true) {
        // Saving the layer that should be merged
        let toMerge = currentLayer;
        let toMergeIndex = layers.indexOf(toMerge);
        // Getting layer below
        let layerBelow = LayerList.getLayerByID(currentLayer.menuEntry.nextElementSibling.id);
    
        // If I have something to merge with
        if (layerBelow != null) {
            // Selecting that layer
            layerBelow.selectLayer();
    
            if (saveHistory) {
                new HistoryState().MergeLayer(toMergeIndex, toMerge,
                    layerBelow.context.getImageData(0, 0, layerBelow.canvasSize[0], layerBelow.canvasSize[1]),
                    layerBelow);
            }
    
            LayerList.mergeLayers(currentLayer.context, toMerge.context);
    
            // Deleting the above layer
            toMerge.canvas.remove();
            toMerge.menuEntry.remove();
            layers.splice(toMergeIndex, 1);
    
            // Updating the layer preview
            currentLayer.updateLayerPreview();
        }
    }

    function flatten(onlyVisible) {
        if (!onlyVisible) {
            // Selecting the first layer
            let firstLayer = layerList.firstElementChild;
            let nToFlatten = layerList.childElementCount - 1;
            LayerList.getLayerByID(firstLayer.id).selectLayer();
    
            for (let i = 0; i < nToFlatten; i++) {
                merge();
            }
    
            new HistoryState().FlattenAll(nToFlatten);
        }
        else {
            // Getting all the visible layers
            let visibleLayers = [];
            let nToFlatten = 0;
    
            for (let i=0; i<layers.length; i++) {
                if (layers[i].menuEntry != null && layers[i].isVisible) {
                    visibleLayers.push(layers[i]);
                }
            }
    
            // Sorting them by z-index
            visibleLayers.sort((a, b) => (a.canvas.style.zIndex > b.canvas.style.zIndex) ? -1 : 1);
            // Selecting the last visible layer (the only one that won't get deleted)
            visibleLayers[visibleLayers.length - 1].selectLayer();
    
            // Merging all the layer but the last one
            for (let i=0; i<visibleLayers.length - 1; i++) {
                nToFlatten++;
                console.log(visibleLayers[i].menuEntry.nextElementSibling);
                new HistoryState().FlattenTwoVisibles(
                    visibleLayers[i + 1].context.getImageData(0, 0, visibleLayers[i].canvasSize[0], visibleLayers[i].canvasSize[1]),
                    visibleLayers[i].menuEntry.nextElementSibling,
                    layers.indexOf(visibleLayers[i]),
                    visibleLayers[i], visibleLayers[i + 1]
                );
    
                LayerList.mergeLayers(visibleLayers[i + 1].context, visibleLayers[i].context);
    
                // Deleting the above layer
                visibleLayers[i].canvas.remove();
                visibleLayers[i].menuEntry.remove();
                layers.splice(layers.indexOf(visibleLayers[i]), 1);
            }
    
            new HistoryState().FlattenVisible(nToFlatten);
            // Updating the layer preview
            currentLayer.updateLayerPreview();
        }
    }

    function openOptionsMenu(event) {
        if (event.which == 3) {
            let selectedId;
            let target = event.target;

            while (target != null && target.classList != null && !target.classList.contains("layers-menu-entry")) {
                target = target.parentElement;
            }

            selectedId = target.id;

            Layer.layerOptions.style.visibility = "visible";
            Layer.layerOptions.style.top = "0";
            Layer.layerOptions.style.marginTop = "" + (event.clientY - 25) + "px";

            getLayerByID(selectedId).selectLayer();
        }
    }

    function closeOptionsMenu(event) {
        Layer.layerOptions.style.visibility = "hidden";
        currentLayer.menuEntry.getElementsByTagName("p")[0].setAttribute("contenteditable", false);
        isRenamingLayer = false;

        if (this.oldLayerName != null) {
            let name = this.menuEntry.getElementsByTagName("p")[0].innerHTML;
            this.name = name;

            new HistoryState().RenameLayer(this.oldLayerName, name, currentLayer);
            this.oldLayerName = null;
        }
    }

    function getLayerListEntries() {
        return layerList;
    }

    return {
        addLayer,
        mergeLayers,
        getLayerByID,
        getLayerByName,
        renameLayer,
        duplicateLayer,
        deleteLayer,
        merge,
        flatten,
        closeOptionsMenu,
        getLayerListEntries
    }
})();