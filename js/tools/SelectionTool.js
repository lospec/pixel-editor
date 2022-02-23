class SelectionTool extends Tool {
    switchFunc = undefined;
    moveTool = undefined;

    boundingBox = {minX: 9999999, maxX: -1, minY: 9999999, maxY: -1};
    currSelection = {};

    outlineData = undefined;
    previewData = undefined;
    selectedPixel = undefined;

    moveOffset = [0, 0];
    boundingBoxCenter = [0,0];
    reconstruct = {left:false, right:false, top:false, bottom:false};

    constructor(name, options, switchFunc, moveTool) {
        super(name, options);

        this.moveTool = moveTool;
        this.switchFunc = switchFunc;
    }

    onStart(mousePos, mouseTarget) {
        super.onStart(mousePos);

        if (mouseTarget == undefined || Util.isChildOfByClass(mouseTarget, "editor-top-menu") || 
            !Util.cursorInCanvas(currFile.canvasSize, [mousePos[0]/currFile.zoom, mousePos[1]/currFile.zoom]))
            return;

        // Putting the vfx layer on top of everything
        currFile.VFXLayer.canvas.style.zIndex = MAX_Z_INDEX;
        currFile.VFXLayer.context.fillStyle = "rgba(0,0,0,1)";

        this.startMousePos = [Math.floor(mousePos[0] / currFile.zoom),
                              Math.floor(mousePos[1] / currFile.zoom)];
        this.endMousePos = [this.startMousePos[0], this.startMousePos[1]];

        let mouseX = mousePos[0] / currFile.zoom;
        let mouseY = mousePos[1] / currFile.zoom;

        this.boundingBox = {minX: 9999999, maxX: -1, minY: 9999999, maxY: -1};
        this.reconstruct = {left:false, right:false, top:false, bottom:false};
        
        this.currSelection = {};
        this.moveOffset = [0, 0];

        this.updateBoundingBox(
            Math.min(Math.max(mouseX, 0), currFile.canvasSize[0]-1), 
            Math.min(Math.max(mouseY, 0), currFile.canvasSize[1]-1)
        );
    }

    onDrag(mousePos) {
        super.onDrag(mousePos);

        let mouseX = mousePos[0] / currFile.zoom;
        let mouseY = mousePos[1] / currFile.zoom;

        if (mouseX > currFile.canvasSize[0])
            this.reconstruct.right = true;
        else if (mouseX < 0) 
            this.reconstruct.left = true;

        if (mouseY > currFile.canvasSize[1])
            this.reconstruct.bottom = true;
        else if (mouseY < 0) 
            this.reconstruct.top = true;
        

        if (Util.cursorInCanvas(currFile.canvasSize, [mousePos[0]/currFile.zoom, mousePos[1]/currFile.zoom])) {
            this.updateBoundingBox(
                Math.min(Math.max(mouseX, 0), currFile.canvasSize[0]-1), 
                Math.min(Math.max(mouseY, 0), currFile.canvasSize[1]-1)
            );
        }
    }

    onEnd(mousePos, mouseTarget) {
        super.onEnd(mousePos);

        if (mouseTarget == undefined || Util.isChildOfByClass(mouseTarget, "editor-top-menu"))
            return;

        let mouseX = mousePos[0] / currFile.zoom;
        let mouseY = mousePos[1] / currFile.zoom;

        if (Util.cursorInCanvas(currFile.canvasSize, [mousePos[0]/currFile.zoom, mousePos[1]/currFile.zoom])) {
            this.updateBoundingBox(
                Math.min(Math.max(mouseX, 0), currFile.canvasSize[0]-1), 
                Math.min(Math.max(mouseY, 0), currFile.canvasSize[1]-1)
            );
        }

        this.boundingBoxCenter = [this.boundingBox.minX + (this.boundingBox.maxX - this.boundingBox.minX) / 2,
            this.boundingBox.minY + (this.boundingBox.maxY - this.boundingBox.minY) / 2];
    }

    cutSelection() {
        let currLayerData = currFile.currentLayer.context.getImageData(0, 0, currFile.canvasSize[0], currFile.canvasSize[1]).data;
        
        // Save the selected pixels so that they can be moved and pasted back in the right place
        for (const key in this.currSelection) {
            let x = parseInt(key.split(",")[0]);
            let y = parseInt(key.split(",")[1]);
            let index = (y * currFile.canvasSize[0] + x) * 4;

            for (let i=0; i<4; i++) {
                // Save the pixel
                this.previewData.data[index + i] = currLayerData[index + i];
                // Delete the data below
                currLayerData[index + i] = 0;
            }
        }

        currFile.currentLayer.context.putImageData(new ImageData(currLayerData, currFile.canvasSize[0]), 0, 0);
    }

    pasteSelection(){
        if (this.currSelection == undefined)
            return;
        
        // I have to save the underlying data, so that the transparent pixels in the clipboard 
        // don't override the coloured pixels in the canvas
        let underlyingImageData = currFile.currentLayer.context.getImageData(0, 0, currFile.canvasSize[0], currFile.canvasSize[1]);
        let pasteData = currFile.TMPLayer.context.getImageData(0, 0, currFile.canvasSize[0], currFile.canvasSize[1]);

        // Clearing the tmp (move preview) and vfx (ants) layers
        currFile.TMPLayer.context.clearRect(0, 0, currFile.canvasSize[0], currFile.canvasSize[1]);
        currFile.VFXLayer.context.clearRect(0, 0, currFile.canvasSize[0], currFile.canvasSize[1]);
        
        Util.pasteData(underlyingImageData, pasteData, currFile.currentLayer.context);
        currFile.currentLayer.updateLayerPreview();

        currFile.VFXLayer.canvas.style.zIndex = MIN_Z_INDEX;
    }
    
    cursorInSelectedArea(mousePos) {
        let floored = [Math.floor(mousePos[0] / currFile.zoom) - this.moveOffset[0], 
                       Math.floor(mousePos[1] / currFile.zoom) - this.moveOffset[1]];

        if (this.currSelection[floored] != undefined)
            return true;
        return false;
    }

    visit(pixel, visited, data) {
        let toVisit = [pixel];
        let selected = [];
        let currVisited = {};

        currFile.TMPLayer.context.clearRect(0, 0, 512, 512);

        while (toVisit.length > 0) {
            pixel = toVisit.pop();
            selected.push(pixel);
            
            visited[pixel] = true;
            currVisited[pixel] = true;

            let col = Util.getPixelColor(data, pixel[0], pixel[1], currFile.canvasSize[0]);
            if (col[3] == 255)
                continue;
            if (this.isBorderOfBox(pixel))
                return [];

            let top, bottom, left, right;
            if (pixel[1] > 0)
                top = [pixel[0], pixel[1] - 1];
            else
                top = undefined;

            if (pixel[0] > 0)
                left = [pixel[0] - 1, pixel[1]];
            else
                left = undefined;

            if (pixel[1] < currFile.canvasSize[1])
                bottom = [pixel[0], pixel[1] + 1];
            else
                bottom = undefined;

            if (pixel[0] < currFile.canvasSize[0])
                right = [pixel[0] + 1, pixel[1]];
            else
                right = undefined;
            
            if (right != undefined && currVisited[right] == undefined)
                toVisit.push(right);
            if (left != undefined && currVisited[left] == undefined)
                toVisit.push(left);
            if (top != undefined && currVisited[top] == undefined)
                toVisit.push(top);
            if (bottom != undefined && currVisited[bottom] == undefined)
                toVisit.push(bottom);
        }

        return selected;
    }

    getSelection() {
        let selected = [];
        let visited = {};
        let data = currFile.VFXLayer.context.getImageData(0, 0, currFile.canvasSize[0], currFile.canvasSize[1]).data;

        // BFS: a pixel that causes the algorithm to visit a pixel of the bounding box is outside the
        // selection. Otherwise, since the algorithm stops visiting when it reaches the outline,
        // the pixel is inside the selection (and so are all the ones that have been visited)
        for (let x=this.boundingBox.minX-1; x<=this.boundingBox.maxX+1; x++) {
            for (let y=this.boundingBox.minY-1; y<=this.boundingBox.maxY+1; y++) {
                if (visited[[x, y]] == undefined) {
                    let insidePixels = this.visit([x,y], visited, data);
                    
                    for (let i=0; i<insidePixels.length; i++) {
                        selected.push(insidePixels[i]);
                        this.currSelection[insidePixels[i]] = true;
                    }
                }
            }
        }
        ////console.log('this.currSelection === ',this.currSelection);

        // Save the selection outline
        this.outlineData = currFile.VFXLayer.context.getImageData(this.boundingBox.minX, 
            this.boundingBox.minY, this.boundingBox.maxX - this.boundingBox.minX, 
            this.boundingBox.maxY - this.boundingBox.minY);
        // Create the image data containing the selected pixels
        this.previewData = new ImageData(currFile.canvasSize[0], currFile.canvasSize[1]);

        // Cut the selection
        this.cutSelection();
        // Put it on the TMP layer
        currFile.TMPLayer.context.putImageData(this.previewData, 0, 0);
        // Draw the selected area and the bounding box
        this.drawSelectedArea();
        this.drawBoundingBox();

        return this.previewData;
    }

    drawSelectedArea() {
        for (const key in this.currSelection) {
            let x = parseInt(key.split(",")[0]);
            let y = parseInt(key.split(",")[1]);

            currFile.VFXLayer.context.fillStyle = "rgba(10, 0, 40, 0.3)";
            currFile.VFXLayer.context.fillRect(x + this.moveOffset[0], y + this.moveOffset[1], 1, 1);
        }
    }

    drawOutline() {
        currFile.VFXLayer.context.clearRect(0, 0, currFile.canvasSize[0], currFile.canvasSize[1]);
        currFile.VFXLayer.context.putImageData(this.outlineData, this.boundingBox.minX + this.moveOffset[0],
            this.boundingBox.minY + this.moveOffset[1]);
    }

    drawBoundingBox(xo = 0, yo = 0) {
        currFile.VFXLayer.context.fillStyle = "red";

        currFile.VFXLayer.context.fillRect(
            this.boundingBox.minX + this.moveOffset[0] - xo, 
            this.boundingBox.minY + this.moveOffset[1] - yo,
            1, 1);
        currFile.VFXLayer.context.fillRect(
            this.boundingBox.minX + this.moveOffset[0] - xo, 
            this.boundingBox.maxY + this.moveOffset[1] + yo,
            1, 1);
        currFile.VFXLayer.context.fillRect(
            this.boundingBox.maxX + this.moveOffset[0] + xo, 
            this.boundingBox.minY + this.moveOffset[1] - yo,
            1, 1);
        currFile.VFXLayer.context.fillRect(
            this.boundingBox.maxX + this.moveOffset[0] + xo, 
            this.boundingBox.maxY + this.moveOffset[1] + yo,
            1, 1);
    }

    isBorderOfBox(pixel) {
        return  pixel[0] == this.boundingBox.minX || pixel[0] == this.boundingBox.maxX || 
                pixel[1] == this.boundingBox.minY || pixel[1] == this.boundingBox.maxY;
    }

    updateBoundingBox(mouseX, mouseY) {
        if (mouseX > this.boundingBox.maxX)
            this.boundingBox.maxX = Math.floor(mouseX);
        if (mouseX < this.boundingBox.minX)
            this.boundingBox.minX = Math.floor(mouseX);
        if (mouseY < this.boundingBox.minY)
            this.boundingBox.minY = Math.floor(mouseY);
        if (mouseY > this.boundingBox.maxY)
            this.boundingBox.maxY = Math.floor(mouseY);
    }
}