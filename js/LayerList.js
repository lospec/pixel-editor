const LayerList = (() => {
    let layerList = document.getElementById("layers-menu");
    // let layerListEntry = layerList.firstElementChild;
    let layerListEntry = document.getElementById("default-layer-list-item");
    let renamingLayer = false;
    let dragStartLayer;
    Events.on("mousedown", layerList, openOptionsMenu);
    Events.on('click',"add-layer-button", addLayerClick, false);
    Events.onCustom("switchedToAdvanced", showLayerList);
    Events.onCustom("switchedToBasic", hideLayerList);

    new Sortable(layerList, {
        animation: 100,
        filter: ".layer-button",
        draggable: ".layers-menu-entry",
        onStart: layerDragStart,
        onEnd: layerDragEnd
    });
    function showLayerList() {
        layerList.style.display = "inline-block";
        document.getElementById('layer-button').style.display = 'inline-block';
    }
    function hideLayerList() {
        if (EditorState.documentCreated()) {
            currFile.currentLayer.selectLayer();
            flatten(true);
        }
        layerList.style.display = "none";
        document.getElementById('layer-button').style.display = 'none';
    }
    function addLayerClick(id, saveHistory = true, layerName) {
        addLayer(...arguments);
        currFile.layers[currFile.layers.length-1].selectLayer();
    }
    function addLayer(id, saveHistory = true, layerName) {
        let index = currFile.layers.length;
        // Creating a new canvas
        let newCanvas = document.createElement("canvas");
        // Setting up the new canvas
        currFile.canvasView.append(newCanvas);
        newCanvas.classList.add("drawingCanvas");
    
        if (!layerListEntry) return //console.warn('skipping adding layer because no document');
    
        // Clone the default layer
        let toAppend = layerListEntry.cloneNode(true);
        toAppend.style.display = "flex";
        //console.log('toAppend === ',toAppend);
        // Setting the default name for the layer
        const _layerName = layerName ?? "Layer " + currFile.layers.length;
        //console.log('_layerName === ',_layerName);
        toAppend.getElementsByTagName('p')[0].innerHTML = _layerName;
        // Removing the selected class
        toAppend.classList.remove("selected-layer");
        // Adding the layer to the list
        Layer.layerCount++;
    
        // Creating a layer object
        let newLayer = new Layer(currFile.canvasSize[0], currFile.canvasSize[1], newCanvas, toAppend);
        newLayer.context.fillStyle = currFile.currentLayer.context.fillStyle;
        newLayer.copyData(currFile.currentLayer);
    
        // currFile.layers.splice(index, 0, newLayer);
        currFile.layers.push(newLayer);
        
        // Insert it before the Add layer button
        layerList.insertBefore(toAppend, document.getElementById("add-layer-li"));
    
        if (id != null && typeof(id) == "string") {
            newLayer.setID(id);
        }
        // Basically "if I'm not adding a layer because redo() is telling meto do so", then I can save the history
        if (saveHistory) {
            new HistoryState().AddLayer(newLayer, index);
            if(FileManager.cacheEnabled)FileManager.localStorageSave();
        }

        currFile.layers.forEach((layer, i) => {
            const _i = currFile.layers.length - i;
            layer.canvas.style.zIndex = (_i+1) * 10;
        })
    
        return newLayer;
    }
    /** Merges topLayer onto belowLayer
    * 
    * @param {*} belowLayer The layer on the bottom of the layer stack
    * @param {*} topLayer The layer on the top of the layer stack
    */
    function mergeLayers(belowLayer, topLayer) {
        // Copying the above content on the layerBelow
        let belowImageData = belowLayer.getImageData(0, 0, belowLayer.canvas.width, belowLayer.canvas.height);
        let toMergeImageData = topLayer.getImageData(0, 0, topLayer.canvas.width, topLayer.canvas.height);

        for (let i=0; i<belowImageData.data.length; i+=4) {
            let currentMovePixel = [
                toMergeImageData.data[i], toMergeImageData.data[i+1], 
                toMergeImageData.data[i+2], toMergeImageData.data[i+3]
            ];

            let currentUnderlyingPixel = [ //TODO: I'd be curious to know if this array slows this function down
                belowImageData.data[i], belowImageData.data[i+1], 
                belowImageData.data[i+2], belowImageData.data[i+3]
            ];

            if (Util.isPixelEmpty(currentMovePixel)) {
                if (!Util.isPixelEmpty(belowImageData)) {
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
    function layerDragEnd(event) {
        Events.simulateMouseEvent(window, "mouseup");
        
        const tempLayerCache = currFile.layers.reduce((r,n,i) => {
            r[n.id] = n;
            return r;
        },{});

        let selectedId;
        const idArr = [...document.querySelectorAll(".layers-menu-entry")].map(elm => {
            if([...elm.classList].includes("selected-layer")) {
                selectedId = elm.id;
            }
            return elm.id;
        });
        let selectedIdx = idArr.indexOf(selectedId);
        idArr.forEach((id,i)=>{
            currFile.layers[i] = tempLayerCache[id];
            currFile.layers[i].isSelected = i===selectedIdx;
        });

        currFile.layers.forEach((layer, i) => {
            const _i = currFile.layers.length - i;
            layer.canvas.style.zIndex = (_i+1) * 10;
        });
        if(FileManager.cacheEnabled)FileManager.localStorageSave();

    }
    /** Saves the layer that is being moved when the dragging starts
     * 
     * @param {*} event 
     */
    function layerDragStart(event) {
        dragStartLayer = getLayerByID(layerList.children[event.oldIndex].id);
    }
    function getLayerByID(id) {
        //console.log(`getLayerByID(${id})`);
        // for (let i=0; i<currFile.layers.length; i++) {
        //     if (currFile.layers[i].hasCanvas()) {
        //         if (currFile.layers[i].menuEntry.id == id) {
        //             return currFile.layers[i];
        //         }
        //     }
        // }
        let ret;
        for (let i=0; i<currFile.layers.length; i++) {
            if (currFile.layers[i].hasCanvas()) {
                if (currFile.layers[i].menuEntry.id == id) {
                    ret = currFile.layers[i];
                }
            }
        }
        //console.log('ret === ',ret);

        return ret ?? null;
    }
    function getLayerByName(name) {
        for (let i=0; i<currFile.layers.length; i++) {
            if (currFile.layers[i].hasCanvas()) {
                if (currFile.layers[i].menuEntry.getElementsByTagName("p")[0].innerHTML == name) {
                    return currFile.layers[i];
                }
            }
        }

        return null;
    }
    function startRenamingLayer(event) {
        let p = currFile.currentLayer.menuEntry.getElementsByTagName("p")[0];
    
        currFile.currentLayer.oldLayerName = p.innerHTML;
    
        p.setAttribute("contenteditable", true);
        p.classList.add("layer-name-editable");
        p.focus();
        Events.simulateInput(65, true, false, false);
    
        renamingLayer = true;
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
    
        let layerIndex = currFile.layers.indexOf(currFile.currentLayer);
        let toDuplicate = currFile.currentLayer;
        let menuEntries = layerList.children;
    
        // Increasing z-indexes of the layers above
        const menuItemSize = getMenuEntryIndex(menuEntries, toDuplicate.menuEntry);

        for (let i = 0; i < menuItemSize; i += 1) {
            LayerList.getLayerByID(menuEntries[i].id).canvas.style.zIndex = 2 * (menuItemSize - i);
        }
    
        // Creating a new canvas
        let newCanvas = document.createElement("canvas");
        // Setting up the new canvas
        currFile.canvasView.append(newCanvas);
        newCanvas.style.zIndex = parseInt(currFile.currentLayer.canvas.style.zIndex) + 2;
        newCanvas.classList.add("drawingCanvas");
    
        if (!layerListEntry) return //console.warn('skipping adding layer because no document');
    
        // Clone the default layer
        let toAppend = currFile.currentLayer.menuEntry.cloneNode(true);
        // Setting the default name for the layer
        toAppend.getElementsByTagName('p')[0].innerHTML += " copy";
        // Removing the selected class
        toAppend.classList.remove("selected-layer");
        // Adding the layer to the list
        Layer.layerCount++;
    
        // Creating a layer object
        let newLayer = new Layer(currFile.canvasSize[0], currFile.canvasSize[1], newCanvas, toAppend);
        newLayer.context.fillStyle = currFile.currentLayer.context.fillStyle;
        newLayer.copyData(currFile.currentLayer);
    
        currFile.layers.splice(layerIndex, 0, newLayer);
        
        // Insert it before the Add layer button
        layerList.insertBefore(toAppend, currFile.currentLayer.menuEntry);
    
        // Copy the layer content
        newLayer.context.putImageData(currFile.currentLayer.context.getImageData(
            0, 0, currFile.canvasSize[0], currFile.canvasSize[1]), 0, 0);
        newLayer.updateLayerPreview();
        // Basically "if I'm not adding a layer because redo() is telling meto do so", then I can save the history
        if (saveHistory) {
            new HistoryState().DuplicateLayer(newLayer, currFile.currentLayer);
        }
    }
    function clearLayers() {
        
        currFile.layers.forEach(()=>deleteLayer());
        //console.log('currFile.layers.length === ',currFile.layers.length);
        for(let i = 0; i < currFile.layers.length;i++){
            const layer = currFile.layers[i];
            //console.log('i === ', i);
            //console.log('layer === ',layer);
        }
    }
    function deleteLayer(saveHistory = true) {
        //console.log('deleting layer: ', currFile.currentLayer.name, currFile.currentLayer);
        //console.trace();
        deleteLayerDirectly(currFile.currentLayer, saveHistory);
    
        // Closing the menu
        closeOptionsMenu();
    }
    function deleteLayerDirectly(layer, saveHistory = true) {
        let layerIndex = currFile.layers.indexOf(layer);
        let toDelete = currFile.layers[layerIndex];
        let previousSibling = toDelete.menuEntry.previousElementSibling;
        // Adding the ids to the unused ones
        Layer.unusedIDs.push(toDelete.id);

        if(layer.isSelected) {
            // Selecting the nearest layer
            const nearestLayer = (currFile.layers[layerIndex + 1] ?? currFile.layers[layerIndex - 1]);
            if(nearestLayer){
                nearestLayer.selectLayer();
                //console.log('changing to nearest layer');
            }
        }

        // Deleting canvas and entry
        toDelete.canvas.remove();
        toDelete.menuEntry.remove();

        // Removing the layer from the list
        currFile.layers.splice(layerIndex, 1);

        if (saveHistory) {
            new HistoryState().DeleteLayer(toDelete, previousSibling, layerIndex);
        }
    }
    function merge(saveHistory = true) {
        // Saving the layer that should be merged
        let toMerge = currFile.currentLayer;
        let toMergeIndex = currFile.layers.indexOf(toMerge);
        // Getting layer below
        let layerBelow = LayerList.getLayerByID(currFile.currentLayer.menuEntry.nextElementSibling.id);
    
        // If I have something to merge with
        if (layerBelow != null) {
            // Selecting that layer
            layerBelow.selectLayer();
    
            if (saveHistory) {
                new HistoryState().MergeLayer(toMergeIndex, toMerge,
                    layerBelow.context.getImageData(0, 0, currFile.canvasSize[0], currFile.canvasSize[1]),
                    layerBelow);
            }
    
            LayerList.mergeLayers(currFile.currentLayer.context, toMerge.context);
    
            // Deleting the above layer
            toMerge.canvas.remove();
            toMerge.menuEntry.remove();
            currFile.layers.splice(toMergeIndex, 1);
    
            // Updating the layer preview
            currFile.currentLayer.updateLayerPreview();
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
    
            for (let i=0; i<currFile.layers.length; i++) {
                if (currFile.layers[i].hasCanvas() && currFile.layers[i].isVisible) {
                    visibleLayers.push(currFile.layers[i]);
                }
            }
    
            // Sorting them by z-index
            visibleLayers.sort((a, b) => (a.canvas.style.zIndex > b.canvas.style.zIndex) ? -1 : 1);
            // Selecting the last visible layer (the only one that won't get deleted)
            visibleLayers[visibleLayers.length - 1].selectLayer();
    
            // Merging all the layer but the last one
            for (let i=0; i<visibleLayers.length - 1; i++) {
                nToFlatten++;
                
                new HistoryState().FlattenTwoVisibles(
                    visibleLayers[i + 1].context.getImageData(0, 0, currFile.canvasSize[0], currFile.canvasSize[1]),
                    visibleLayers[i].menuEntry.nextElementSibling,
                    currFile.layers.indexOf(visibleLayers[i]),
                    visibleLayers[i], visibleLayers[i + 1]
                );
    
                LayerList.mergeLayers(visibleLayers[i + 1].context, visibleLayers[i].context);
    
                // Deleting the above layer
                visibleLayers[i].canvas.remove();
                visibleLayers[i].menuEntry.remove();
                currFile.layers.splice(currFile.layers.indexOf(visibleLayers[i]), 1);
            }
    
            new HistoryState().FlattenVisible(nToFlatten);
            // Updating the layer preview
            currFile.currentLayer.updateLayerPreview();
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

            getLayerByID(selectedId).selectLayer(false);
        }
    }
    function closeOptionsMenu(event) {
        Layer.layerOptions.style.visibility = "hidden";
        currFile.currentLayer.rename();
        renamingLayer = false;
    }
    function getLayerListEntries() {
        return layerList;
    }
    function isRenamingLayer() {
        return renamingLayer;
    }
    return {
        addLayer,
        mergeLayers,
        getLayerByID,
        getLayerByName,
        renameLayer: startRenamingLayer,
        duplicateLayer,
        clearLayers,
        deleteLayer,
        deleteLayerDirectly,
        merge,
        flatten,
        closeOptionsMenu,
        getLayerListEntries,
        isRenamingLayer
    }
})();