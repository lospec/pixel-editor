/** TODO LIST FOR LAYERS
    
    GENERAL REQUIREMENTS:
    - The user shouldn't be able to draw on a hidden or locked layer
    - Must delete the selected layer when right clicking on a layer and selecting that option
        * We should think about selecting more than one layer at once.
        * Rename layer
        * Merge with bottom layer option
        * Flatten visible option
        * Flatten everything option
    - Must move a layer when dragging it in the layer list (https://codepen.io/retrofuturistic/pen/tlbHE)
    - When saving an artwork, the layers must be flattened to a temporary layer, which is then exported and deleted
    - Saving the state of an artwork to a .lospec file so that people can work on it later keeping 
      the layers they created? That'd be cool, even for the app users, that could just double click on a lospec
      file for it to be opened right in the pixel editor

    OPTIONAL:

    1 - Fix issues 
    2 - Add a Replace feature so that people can replace a colour without editing the one in the palette
        (right click->replace colour in layers? in that case we'd have to implement multiple layers selection)

    KNOWN BUGS:

    1 - Must delete existing layers when creating a new pixel

    THINGS TO TEST:

    1 - Undo / redo
    2 - Copy / cut / paste selection
    3 - Colour picking from underlying layer
    4 - File export
*/

/*
    MORE TODO LIST:

    - Resize canvas (must make a simple editor to preview the changes)
    - Resize sprite
*/

// Instead of saving the whole entry, just save their IDs and swap the elements at the end of the drop
// TODO: add id management. IDs are assigned incrementally, when a layer is deleted its id should be 
// claimable by the new layers: add a queue to push the ids of the deleted layers to


let layerList;
let layerListEntry;

let layerDragSource = null;

let layerCount = 1;
let maxZIndex = 3;

on('click',"add-layer-button", function(){
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
    layers.splice(layers.length - 3, 0, newLayer);
    
    // Insert it before the Add layer button
    layerList.insertBefore(toAppend, layerList.childNodes[0]);
}, false);

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

        if (menuEntry != null) {
            console.log("Aggiungo eventi");
            menuEntry.onclick = () => this.select();
            menuEntry.getElementsByTagName("button")[0].onclick = () => this.toggleLock();
            menuEntry.getElementsByTagName("button")[1].onclick = () => this.toggleVisibility();

            menuEntry.addEventListener("dragstart", this.layerDragStart, false);
            menuEntry.addEventListener("drop", this.layerDragDrop, false);
            menuEntry.addEventListener("dragover", this.layerDragOver, false);
            menuEntry.addEventListener("dragleave", this.layerDragLeave, false);
            menuEntry.addEventListener("dragend", this.layerDragEnd, false);
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

    layerDragStart(element) {
        console.log("Elemento: " + element.dataTransfer.getData('text/html'));
        console.log("UELA");

        layerDragSource = this;
        element.dataTransfer.effectAllowed = 'move';
        element.dataTransfer.setData('text/html', this.outerHTML);

        this.classList.add('dragElem');
    }

    layerDragOver(element) {
        console.log("Elemento: " + element.dataTransfer.getData('text/html'));
        if (element.preventDefault) {
            element.preventDefault(); // Necessary. Allows us to drop.
        }
        this.classList.add('layerdragover');

        element.dataTransfer.dropEffect = 'move';

        return false;
    }

    layerDragLeave(element) {
        console.log("Elemento: " + element.dataTransfer.getData('text/html'));
        this.classList.remove('layerdragover');
    }

    layerDragDrop(element) {
        console.log("Elemento: " + element.dataTransfer.getData('text/html'));
        if (element.stopPropagation) {
            element.stopPropagation(); // Stops some browsers from redirecting.
        }

        // Don't do anything if dropping the same column we're dragging.
        if (layerDragSource != this) {
            // Set the source column's HTML to the HTML of the column we dropped on.
            this.parentNode.removeChild(layerDragSource);
            var dropHTML = element.dataTransfer.getData('text/html');
            this.insertAdjacentHTML('beforebegin',dropHTML);
            var dropElem = this.previousSibling;

            addDnDHandlers(dropElem);
        }

        this.classList.remove('layerdragover');

        return false;
    }

    layerDragEnd(element) {
        console.log("Elemento: " + element.dataTransfer.getData('text/html'));
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

    select() {
        // Deselecting the old layer
        currentLayer.deselect();

        // Selecting the current layer
        this.isSelected = true;
        this.menuEntry.classList.add("selected-layer");
        currentLayer = getLayerByName(this.menuEntry.getElementsByTagName("p")[0].innerHTML);
    }

    toggleLock() {
        if (this.isLocked) {
            console.log("unlocked");
            this.unlock();
        }
        else {
            console.log("locked");
            this.lock();
        }
    }

    toggleVisibility() {
        console.log(this);

        if (this.isVisible) {
            this.hide();
        }
        else {
            this.show();
        }
    }

    deselect() {
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