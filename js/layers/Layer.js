// TODO: add undo for layer drag n drop

/** Handler class for a single canvas (a single layer)
 *
 * @param width Canvas width
 * @param height Canvas height
 * @param canvas HTML canvas element or the ID of the canvas related to the layer
 */
class Layer {
    static layerCount = 1;
    static maxZIndex = 3;
    
    static unusedIDs = [];
    static currentID = 1;

    static layerOptions = document.getElementById("layer-properties-menu");

    // TODO: this is simply terrible. menuEntry can either be an HTML element, a string or undefined.
    // If it's an HTML element it is added, if it's a string nothing happens, if it's undefined the 
    // first menuEntry is used (the one that appears on load)
    constructor(width, height, canvas, menuEntry, id) {
        // REFACTOR: the canvas should actually be a Canvas instance
        this.canvas = Util.getElement(canvas);
        this.canvas.width = width;
        this.canvas.height = height;
        // REFACTOR: the context could be an attribute of the canvas class, but it's a bit easier
        // to just type layer.context, we should discuss this
        this.context = this.canvas.getContext('2d');
        this.isSelected = false;
        this.isVisible = true;
        this.isLocked = false;
        
        this.oldLayerName = null;

        if (typeof menuEntry == "string")
            this.menuEntry = document.getElementById("layers-menu").firstElementChild;
        else if (menuEntry !== undefined)
            this.menuEntry = menuEntry;

        let hadId = false;
        if(typeof id !== "undefined"){
            hadId = true;
        } else {
            id = Layer.unusedIDs.pop();
        }

        if (id == null) {
            id = Layer.currentID;
            Layer.currentID++;
        }

        this.id = hadId ? id : "layer" + id;

        // Binding the events
        if (this.menuEntry !== undefined) {
            this.name = this.menuEntry.getElementsByTagName("p")[0].innerHTML;

            this.menuEntry.id = "layer" + id;

            this.menuEntry.onmouseover = () => this.hover();
            this.menuEntry.onmouseout = () => this.unhover();
            this.menuEntry.onclick = () => this.selectLayer();
            this.menuEntry.getElementsByTagName("button")[0].onclick = () => this.toggleLock();
            this.menuEntry.getElementsByTagName("button")[1].onclick = () => this.toggleVisibility();

            this.menuEntry.addEventListener("mouseup", this.openOptionsMenu, false);
            this.menuEntry.addEventListener("dragstart", this.layerDragStart, false);
            this.menuEntry.addEventListener("drop", this.layerDragDrop, false);
            this.menuEntry.addEventListener("dragover", this.layerDragOver, false);
            this.menuEntry.addEventListener("dragleave", this.layerDragLeave, false);
            this.menuEntry.addEventListener("dragend", this.layerDragEnd, false);

            Events.onCustom("del", this.tryDelete.bind(this));

            this.menuEntry.getElementsByTagName("canvas")[0].getContext('2d').imageSmoothingEnabled = false;
        }

        if(hadId){
            this.menuEntry.classList.remove("layers-menu-entry");
        } else {
            if(this.menuEntry)this.menuEntry.classList.add("layers-menu-entry");
        }

        this.initialize();

    }

    hasCanvas() {
        return this.menuEntry != null;
    }

    delete(layerIndex) {
        //console.log('layerIndex === ',layerIndex);
        let toDelete = currFile.layers[layerIndex];
        let previousSibling;
        if(toDelete){
            //console.log('toDelete === ',toDelete);
            previousSibling = toDelete.menuEntry.previousElementSibling;
            //console.log('previousSibling === ',previousSibling);
            // Adding the ids to the unused ones
            // Deleting canvas and entry
            toDelete.canvas.remove();
            toDelete.menuEntry.remove();
        }

        Layer.unusedIDs.push(this.id);

        if(this.isSelected) {
            // Selecting the nearest layer
            const nearestLayer = (currFile.layers[layerIndex + 1] ?? currFile.layers[layerIndex - 1]);
            if(nearestLayer){
                nearestLayer.selectLayer();
                //console.log('changing to nearest layer');
            }
        }


        // Removing the layer from the list
        currFile.layers.splice(layerIndex, 1);

        if(toDelete){
            new HistoryState().DeleteLayer(toDelete, previousSibling, layerIndex);
        }
    }

    tryDelete() { //TODO: quote yoda
        if (Input.getLastTarget() != this.menuEntry && Input.getLastTarget().parentElement != this.menuEntry)
            return;

        LayerList.deleteLayer();
    }

    // Initializes the canvas
    initialize() {
        //resize canvas
        this.canvas.style.width = (this.canvas.width*currFile.zoom)+'px';
        this.canvas.style.height = (this.canvas.height*currFile.zoom)+'px';

        //show canvas
        this.canvas.style.display = 'block';

        //center canvas in window
        this.canvas.style.left = 64+currFile.canvasView.clientWidth/2-(currFile.canvasSize[0]*currFile.zoom/2)+'px';
        this.canvas.style.top = 48+currFile.canvasView.clientHeight/2-(currFile.canvasSize[1]*currFile.zoom/2)+'px';

        this.context.imageSmoothingEnabled = false;
        this.context.mozImageSmoothingEnabled = false;
    }

    rename() {
        this.menuEntry.getElementsByTagName("p")[0].setAttribute("contenteditable", false);

        if (this.oldLayerName != null) {
            let name = this.menuEntry.getElementsByTagName("p")[0].innerHTML;
            
            for (let i=0; i<currFile.layers.length; i++) {
                if (name === currFile.layers[i].name) {
                    name += ' (1)';
                    i = 0;
                }
            }
            this.name = name;
            this.menuEntry.getElementsByTagName("p")[0].innerHTML = name;

            new HistoryState().RenameLayer(this.oldLayerName, name, currFile.currentLayer);
            this.oldLayerName = null;
        }
    }

    hover() {
        // Hides all the layers but the current one
        for (let i=0; i<currFile.layers.length; i++) {
            if (currFile.layers[i] !== this) {
                currFile.layers[i].canvas.style.opacity = 0.3;
            }
        }
    }

    unhover() {
        // Shows all the layers again
        for (let i=0; i<currFile.layers.length; i++) {
            if (currFile.layers[i] !== this) {
                currFile.layers[i].canvas.style.opacity = 1;
            }
        }
    }

    setID(id) {
        this.id = id;
        if (this.menuEntry != null) {
            this.menuEntry.id = id;
        }
    }

    // Resizes canvas
    resize() {
        let newWidth = (this.canvas.width * currFile.zoom) + 'px';
        let newHeight = (this.canvas.height *currFile.zoom)+ 'px';

        this.canvas.style.width = newWidth;
        this.canvas.style.height = newHeight;
    }

    setCanvasOffset (offsetLeft, offsetTop) {
        //horizontal offset
        var minXOffset = -currFile.canvasSize[0] * currFile.zoom;
        var maxXOffset = window.innerWidth - 300;
    
        if 	(offsetLeft < minXOffset)
            this.canvas.style.left = minXOffset +'px';
        else if (offsetLeft > maxXOffset)
            this.canvas.style.left = maxXOffset +'px';
        else
            this.canvas.style.left = offsetLeft +'px';
    
        //vertical offset
        var minYOffset = -currFile.canvasSize[1] * currFile.zoom + 164;
        var maxYOffset = window.innerHeight - 100;
    
        if 	(offsetTop < minYOffset)
            this.canvas.style.top = minYOffset +'px';
        else if (offsetTop > maxYOffset)
            this.canvas.style.top = maxYOffset +'px';
        else
            this.canvas.style.top = offsetTop +'px';
    }

    // Copies the otherLayer's position and size
    copyData(otherLayer) {
        this.canvas.style.width = otherLayer.canvas.style.width;
        this.canvas.style.height = otherLayer.canvas.style.height;
        
        this.canvas.style.left = otherLayer.canvas.style.left;
        this.canvas.style.top = otherLayer.canvas.style.top;
    }

    selectLayer(hideOptions = true) {
        //console.log('called selectLayer');
        ////console.trace();
        if (hideOptions)
            LayerList.closeOptionsMenu();
        // Deselecting the old layer
        currFile.currentLayer.deselectLayer();

        // Selecting the current layer
        this.isSelected = true;
        this.menuEntry.classList.add("selected-layer");
        currFile.currentLayer = this;

        if(FileManager.cacheEnabled)FileManager.localStorageSave();
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
        let widthRatio = currFile.canvasSize[0] / currFile.canvasSize[1];
        let heightRatio = currFile.canvasSize[1] / currFile.canvasSize[0];

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

    drawLine(x0,y0,x1,y1, brushSize, clear=false) {
        var dx = Math.abs(x1-x0);
        var dy = Math.abs(y1-y0);
        var sx = (x0 < x1 ? 1 : -1);
        var sy = (y0 < y1 ? 1 : -1);
        var err = dx-dy;
    
        while (true) {
            //set pixel
            // If the current tool is the brush
            // REFACTOR: this is terrible
            if (!clear) {
                // I fill the rect
                this.context.fillRect(x0-Math.floor(brushSize/2), y0-Math.floor(brushSize/2), brushSize, brushSize);
            } else {
                // In case I'm using the eraser I must clear the rect
                this.context.clearRect(x0-Math.floor(brushSize/2), y0-Math.floor(brushSize/2), brushSize, brushSize);
            }
    
            //if we've reached the end goal, exit the loop
            if ((x0==x1) && (y0==y1)) break;
            var e2 = 2*err;
    
            if (e2 >-dy) {
                err -=dy; 
                x0+=sx;
            }
    
            if (e2 < dx) {
                err +=dx; 
                y0+=sy;
            }
        }
    }
}