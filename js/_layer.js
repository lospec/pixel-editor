/** TODO LIST FOR LAYERS
    
    GENERAL REQUIREMENTS:
    - Saving the state of an artwork to a .lospec file so that people can work on it later keeping 
      the layers they created? That'd be cool, even for the app users, that could just double click on a lospec
      file for it to be opened right in the pixel editor

    HISTORY:
    - Save merge layers
    - Save flatten layers

    OPTIONAL:

    1 - Fix issues 
    2 - Add a Replace feature so that people can replace a colour without editing the one in the palette
        (right click->replace colour in layers? in that case we'd have to implement multiple layers selection)

    THINGS TO TEST:

    1 - Undo / redo
*/

/*
    MORE TODO LIST:

    - Resize canvas (must make a simple editor to preview the changes)
    - Resize sprite
    - Refactor the code so that every instance of "canvas" and "context" is replaced by currentLayer.canvas
      and currentLayer.context
*/

let layerList;
let layerListEntry;

let layerDragSource = null;

let layerCount = 1;
let maxZIndex = 3;

let unusedIDs = [];
let currentID = layerCount;
let idToDelete;
let layerOptions = document.getElementById("layer-properties-menu");

let isRenamingLayer = false;
let oldLayerName = null;

on('click',"add-layer-button", addLayer, false);

/** Handler class for a single canvas (a single layer)
 *
 * @param width Canvas width
 * @param height Canvas height
 * @param canvas HTML canvas element
 */
class Layer {
    constructor(width, height, canvas, menuEntry) {
        this.canvasSize = [width, height];
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.isSelected = false;
        this.isVisible = true;
        this.isLocked = false;
        this.menuEntry = menuEntry;

        let id = unusedIDs.pop();
        console.log("id creato: " + id);

        if (id == null) {
            id = currentID;
            currentID++;
        }

        this.id = "layer" + id;     

        if (menuEntry != null) {
            menuEntry.id = "layer" + id;
            menuEntry.onclick = () => this.selectLayer();
            menuEntry.getElementsByTagName("button")[0].onclick = () => this.toggleLock();
            menuEntry.getElementsByTagName("button")[1].onclick = () => this.toggleVisibility();

            menuEntry.addEventListener("mouseup", this.openOptionsMenu, false);
            menuEntry.addEventListener("dragstart", this.layerDragStart, false);
            menuEntry.addEventListener("drop", this.layerDragDrop, false);
            menuEntry.addEventListener("dragover", this.layerDragOver, false);
            menuEntry.addEventListener("dragleave", this.layerDragLeave, false);
            menuEntry.addEventListener("dragend", this.layerDragEnd, false);

            menuEntry.getElementsByTagName("canvas")[0].getContext('2d').imageSmoothingEnabled = false;
        }

        this.initialize();
    }

    // Initializes the canvas
    initialize() {
        var maxHorizontalZoom = Math.floor(window.innerWidth/this.canvasSize[0]*0.75);
        var maxVerticalZoom = Math.floor(window.innerHeight/this.canvasSize[1]*0.75);

        zoom = Math.min(maxHorizontalZoom,maxVerticalZoom);
        if (zoom < 1) zoom = 1;

        //resize canvas
        this.canvas.width = this.canvasSize[0];
        this.canvas.height = this.canvasSize[1];
        this.canvas.style.width = (this.canvas.width*zoom)+'px';
        this.canvas.style.height = (this.canvas.height*zoom)+'px';

        //unhide canvas
        this.canvas.style.display = 'block';

        //center canvas in window
        this.canvas.style.left = 64+canvasView.clientWidth/2-(this.canvasSize[0]*zoom/2)+'px';
        this.canvas.style.top = 48+canvasView.clientHeight/2-(this.canvasSize[1]*zoom/2)+'px';

        this.context.imageSmoothingEnabled = false;
        this.context.mozImageSmoothingEnabled = false;
    }

    setID(id) {
        this.id = id;
        if (this.menuEntry != null) {
            this.menuEntry.id = id;
        }
    }

    layerDragStart(element) {
        layerDragSource = this;
        element.dataTransfer.effectAllowed = 'move';
        element.dataTransfer.setData('text/html', this.id);

        this.classList.add('dragElem');
    }

    layerDragOver(element) {
        if (element.preventDefault) {
            element.preventDefault(); // Necessary. Allows us to drop.
        }
        this.classList.add('layerdragover');

        element.dataTransfer.dropEffect = 'move';

        return false;
    }

    layerDragLeave(element) {
        this.classList.remove('layerdragover');
    }

    layerDragDrop(element) {
        if (element.stopPropagation) {
            element.stopPropagation(); // Stops some browsers from redirecting.
        }

        // Don't do anything if dropping the same column we're dragging.
        if (layerDragSource != this) {
            let toDropID = element.dataTransfer.getData('text/html');
            let thisID = this.id;
            
            moveLayers(toDropID, thisID);
        }

        this.classList.remove('layerdragover');
        dragging = false;

        return false;
    }

    layerDragEnd(element) {
        this.classList.remove('layerdragover');
    }    

    // Resizes canvas
    resize() {
        let newWidth = (this.canvas.width * zoom) + 'px';
        let newHeight = (this.canvas.height *zoom)+ 'px';

        this.canvas.style.width = newWidth;
        this.canvas.style.height = newHeight;
    }
    // Copies the otherCanvas' position and size
    copyData(otherCanvas) {
        this.canvas.style.width = otherCanvas.canvas.style.width;
        this.canvas.style.height = otherCanvas.canvas.style.height;

        this.canvas.style.left = otherCanvas.canvas.style.left;
        this.canvas.style.top = otherCanvas.canvas.style.top;
    }

    openOptionsMenu(event) {
        if (event.which == 3) {
            let target = event.target;
            let offsets = getElementAbsolutePosition(this);

            while (target != null && target.classList != null && !target.classList.contains("layers-menu-entry")) {
                target = target.parentElement;
            }

            idToDelete = target.id;

            layerOptions.style.visibility = "visible";
            layerOptions.style.top = "0";
            layerOptions.style.marginTop = "" + (event.clientY - 25) + "px";

            getLayerByID(idToDelete).selectLayer();
        }
    }

    closeOptionsMenu(event) {
        layerOptions.style.visibility = "hidden";
        currentLayer.menuEntry.getElementsByTagName("p")[0].setAttribute("contenteditable", false);
        isRenamingLayer = false;

        if (oldLayerName != null) {
            new HistoryStateRenameLayer(oldLayerName, this.menuEntry.getElementsByTagName("p")[0].innerHTML, currentLayer);
            oldLayerName = null;
        }
    }

    selectLayer(layer) {
        if (layer == null) {
            // Deselecting the old layer
            currentLayer.deselectLayer();

            // Selecting the current layer
            this.isSelected = true;
            this.menuEntry.classList.add("selected-layer");
            currentLayer = getLayerByName(this.menuEntry.getElementsByTagName("p")[0].innerHTML);
        }
        else {
            currentLayer.deselectLayer();

            layer.isSelected = true;
            layer.menuEntry.classList.add("selected-layer");
            currentLayer = layer;
        }

        canvas = currentLayer.canvas;
        context = currentLayer.context;
    }

    toggleLock() {
        if (this.isLocked) {
            this.unlock();
        }
        else {
            this.lock();
        }
    }

    toggleVisibility() {
        if (this.isVisible) {
            this.hide();
        }
        else {
            this.show();
        }
    }

    deselectLayer() {
        this.isSelected = false;
        this.menuEntry.classList.remove("selected-layer");
    }

    lock() {
        this.isLocked = true;
        this.menuEntry.getElementsByClassName("layer-button")[0].style.visibility = "visible";

        this.menuEntry.getElementsByClassName("default-icon")[0].style.display = "none";
        this.menuEntry.getElementsByClassName("edited-icon")[0].style.display = "inline-block";
    }

    unlock() {
        this.isLocked = false;
        this.menuEntry.getElementsByClassName("layer-button")[0].style.visibility = "hidden";

        this.menuEntry.getElementsByClassName("default-icon")[0].style.display = "inline-block";
        this.menuEntry.getElementsByClassName("edited-icon")[0].style.display = "none";
    }

    show() {
        this.isVisible = true;
        this.canvas.style.visibility = "visible";
        this.menuEntry.getElementsByClassName("layer-button")[1].style.visibility = "hidden";

        // Changing icon
        this.menuEntry.getElementsByClassName("default-icon")[1].style.display = "inline-block";
        this.menuEntry.getElementsByClassName("edited-icon")[1].style.display = "none";
    }

    hide() {
        this.isVisible = false;
        this.canvas.style.visibility = "hidden";
        this.menuEntry.getElementsByClassName("layer-button")[1].style.visibility = "visible";

        // Changing icon
        this.menuEntry.getElementsByClassName("default-icon")[1].style.display = "none";
        this.menuEntry.getElementsByClassName("edited-icon")[1].style.display = "inline-block";
    }

    updateLayerPreview() {
        // Getting the canvas
        let destination = this.menuEntry.getElementsByTagName("canvas")[0];
        let widthRatio = this.canvasSize[0] / this.canvasSize[1];
        let heightRatio = this.canvasSize[1] / this.canvasSize[0];

        // Computing width and height for the preview image
        let previewWidth = destination.width;
        let previewHeight = destination.height;

        // If the sprite is rectangular, I apply the ratio to the preview as well
        if (widthRatio < 1) {
            previewWidth = destination.width * widthRatio;
        }
        else if (widthRatio > 1) {
            previewHeight = destination.height * heightRatio;
        }

        // La appiccico sulla preview
        destination.getContext('2d').clearRect(0, 0, destination.width, destination.height);
        destination.getContext('2d').drawImage(this.canvas, 
            // This is necessary to center the preview in the canvas
            (destination.width - previewWidth) / 2, (destination.height - previewHeight) / 2, 
            previewWidth, previewHeight);
    }
}

function flatten(onlyVisible) {
    if (!onlyVisible) {
        // Selecting the first layer
        let firstLayer = layerList.firstElementChild;
        let nToFlatten = layerList.childElementCount - 1;
        getLayerByID(firstLayer.id).selectLayer();

        for (let i = 0; i < nToFlatten; i++) {
            merge();
        }

        new HistoryStateFlattenAll(nToFlatten);
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
        visibleLayers.sort((a, b) => (a.canvas.zIndex > b.canvas.zIndex) ? -1 : 1);
        // Selecting the last visible layer (the only one that won't get deleted)
        visibleLayers[visibleLayers.length - 1].selectLayer();

        // Merging all the layer but the last one
        for (let i=0; i<visibleLayers.length - 1; i++) {
            nToFlatten++;
            new HistoryStateFlattenTwoVisibles(
                visibleLayers[i + 1].context.getImageData(0, 0, visibleLayers[i].canvasSize[0], visibleLayers[i].canvasSize[1]),
                visibleLayers[i].menuEntry.previousElementSibling,
                layers.indexOf(visibleLayers[i]),
                visibleLayers[i], visibleLayers[i + 1]
            );

            mergeLayers(visibleLayers[i + 1].context, visibleLayers[i].context);

            // Deleting the above layer
            visibleLayers[i].canvas.remove();
            visibleLayers[i].menuEntry.remove();
            layers.splice(layers.indexOf(visibleLayers[i]), 1);
        }

        new HistoryStateFlattenVisible(nToFlatten);
        // Updating the layer preview
        currentLayer.updateLayerPreview();
    }
}

function merge(saveHistory = true) {
    // Saving the layer that should be merged
    let toMerge = currentLayer;
    let toMergeIndex = layers.indexOf(toMerge);
    // Getting layer below
    let layerBelow = getLayerByID(currentLayer.menuEntry.nextElementSibling.id);
    
    // If I have something to merge with
    if (layerBelow != null) {
        // Selecting that layer
        layerBelow.selectLayer();

        if (saveHistory) {
            new HistoryStateMergeLayer(toMergeIndex, toMerge, 
                layerBelow.context.getImageData(0, 0, layerBelow.canvasSize[0], layerBelow.canvasSize[1]),
                layerBelow);
        }

        mergeLayers(currentLayer.context, toMerge.context);

        // Deleting the above layer
        toMerge.canvas.remove();
        toMerge.menuEntry.remove();
        layers.splice(toMergeIndex, 1);

        // Updating the layer preview
        currentLayer.updateLayerPreview();
    }
    
}

function deleteLayer(saveHistory = true) {
    // Cannot delete all the layers
    if (layers.length != 4) {
        let layerIndex = layers.indexOf(currentLayer);
        let toDelete = layers[layerIndex];
        let previousSibling = toDelete.menuEntry.previousElementSibling;
        // Adding the ids to the unused ones
        console.log("id cancellato: " + toDelete.id);
        unusedIDs.push(toDelete.id);

        // Selecting the next layer
        if (layerIndex != (layers.length - 3)) {
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
            new HistoryStateDeleteLayer(toDelete, previousSibling, layerIndex);
        }
    }

    // Closing the menu
    currentLayer.closeOptionsMenu();
}

function renameLayer(event) {
    let layerIndex = layers.indexOf(currentLayer);
    let toRename = currentLayer;
    let p = currentLayer.menuEntry.getElementsByTagName("p")[0];

    oldLayerName = p.innerHTML;

    p.setAttribute("contenteditable", true);
    p.classList.add("layer-name-editable");
    p.focus();

    simulateInput(65, true, false, false);

    isRenamingLayer = true;
}

// Swaps two layer entries in the layer menu
function moveLayers(toDropLayer, staticLayer, saveHistory = true) {
    let entry1 = document.getElementById(toDropLayer);
    let entry2 = document.getElementById(staticLayer);

    let toDrop = getLayerByID(toDropLayer);
    let static = getLayerByID(staticLayer);
    let layerCopy = layers;
    let tmpZIndex;

    let after2 = entry2.nextSibling;
    let parent = entry1.parentNode;

    layerCopy.sort((a, b) => (a.canvas.style.zIndex > b.canvas.style.zIndex) ? 1 : -1);
    console.log(layerCopy.map(a => a.canvas.style.zIndex));

    let toDropIndex = layerCopy.indexOf(toDrop);
    let staticIndex = layerCopy.indexOf(static);

    layerList.insertBefore(toDrop.menuEntry, static.menuEntry);

    if (toDropIndex < staticIndex) {
        console.log("UO");
        let tmp = toDrop.canvas.style.zIndex;
        let tmp2;

        for (let i=toDropIndex+1; i<=staticIndex; i++) {
            tmp2 = layerCopy[i].canvas.style.zIndex;
            layerCopy[i].canvas.style.zIndex = tmp;
            tmp = tmp2;
        }

        toDrop.canvas.style.zIndex = tmp;
    }
    else {
        // BUG QUI
        let tmp = toDrop.canvas.style.zIndex;
        let tmp2;

        for (let i=toDropIndex-1; i>staticIndex; i--) {
            tmp2 = layerCopy[i].canvas.style.zIndex;
            layerCopy[i].canvas.style.zIndex = tmp;
            tmp = tmp2;
        }

        toDrop.canvas.style.zIndex = tmp;
    }

    /*
    console.log("id1: " + toDrop + ", id2: " + static);

    tmpZIndex = layer1.canvas.style.zIndex;
    layer1.canvas.style.zIndex = layer2.canvas.style.zIndex;
    layer2.canvas.style.zIndex = tmpZIndex;

    parent.insertBefore(entry2, entry1);

    if (after2) {
        if (after2 == entry1) {
            parent.prepend(entry1);
        }
        else {
            parent.insertBefore(entry1, after2);
        }
    } else {
       parent.appendChild(entry1);
    }
    */
   if (saveHistory) { 
        new HistoryStateMoveLayer(toDrop, static);
    }
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

function addLayer(id, saveHistory = true) {
    let index = layers.length - 3;
    // Creating a new canvas
    let newCanvas = document.createElement("canvas");
    // Setting up the new canvas
    canvasView.append(newCanvas);
    maxZIndex++;
    newCanvas.style.zIndex = maxZIndex;
    newCanvas.classList.add("drawingCanvas");

    console.log("Tela creata: " + newCanvas);

    // Clone the default layer
    let toAppend = layerListEntry.cloneNode(true);
    // Setting the default name for the layer
    toAppend.getElementsByTagName('p')[0].innerHTML = "Layer " + layerCount;
    // Removing the selected class
    toAppend.classList.remove("selected-layer");
    // Adding the layer to the list
    layerCount++;

    // Creating a layer object
    let newLayer = new Layer(currentLayer.canvasSize[0], currentLayer.canvasSize[1], newCanvas, toAppend);
    newLayer.context.fillStyle = currentLayer.context.fillStyle;
    newLayer.copyData(currentLayer);
    layers.splice(index, 0, newLayer);
    
    // Insert it before the Add layer button
    layerList.insertBefore(toAppend, layerList.childNodes[0]);

    if (id != null && typeof(id) == "string") {
        console.log("imposto");
        newLayer.setID(id);
    }
    // Basically "if I'm not adding a layer because redo() is telling meto do so", then I can save the history
    if (saveHistory) {
        new HistoryStateAddLayer(newLayer, index);
    }
}