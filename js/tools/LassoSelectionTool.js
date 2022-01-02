class LassoSelectionTool extends SelectionTool {
    currentPixels = [];
    currSelection = {};
    boundingBox = {minX: 99999, maxX: -1, minY: 99999, maxY: -1};

    constructor (name, options, switchFunc, moveTool) {
        super(name, options, switchFunc, moveTool);
        Events.on('click', this.mainButton, switchFunc, this);
    }

    onStart(mousePos) {
        super.onStart(mousePos);

        let mouseX = Math.floor(mousePos[0] / currFile.zoom);
        let mouseY = Math.floor(mousePos[1] / currFile.zoom);

        // Putting the vfx layer on top of everything
        currFile.VFXLayer.canvas.style.zIndex = MAX_Z_INDEX;
        // clearSelection();
        this.currentPixels = [];
        this.drawSelection();
        this.currentPixels.push([mouseX, mouseY]);

        this.boundingBox = {minX: 99999, maxX: -1, minY: 99999, maxY: -1};
        this.checkBoundingBox(mouseX, mouseY);
    }

    onDrag(mousePos) {
        super.onDrag(mousePos);

        let mouseX = Math.floor(mousePos[0] / currFile.zoom);
        let mouseY = Math.floor(mousePos[1] / currFile.zoom);

        if (this.currentPixels[this.currentPixels.length - 1] != mousePos)
            this.currentPixels.push([mouseX, mouseY]);
        this.drawSelection();
        this.checkBoundingBox(mouseX, mouseY);
    }

    onEnd(mousePos) {
        super.onEnd(mousePos);
        new HistoryState().EditCanvas();

        let mouseX = Math.floor(mousePos[0] / currFile.zoom);
        let mouseY = Math.floor(mousePos[1] / currFile.zoom);

        this.currentPixels.push(this.currentPixels[0]);
        this.checkBoundingBox(mouseX, mouseY);
        this.getSelection();

        // Switch to the move tool so that the user can move the selection
        this.switchFunc(this.moveTool);
        this.moveTool.setSelectionData(null, this);
    }

    checkBoundingBox(mouseX, mouseY) {
        if (mouseX > this.boundingBox.maxX)
            this.boundingBox.maxX = mouseX;
        else if (mouseX < this.boundingBox.minX)
            this.boundingBox.minX = mouseX;

        if (mouseY < this.boundingBox.minY)
            this.boundingBox.minY = mouseY;
        else if (mouseY > this.boundingBox.maxY)
            this.boundingBox.maxY = mouseY;
    }

    onSelect() {
        super.onSelect();
    }

    onDeselect() {
        super.onDeselect();
    }

    drawSelection() {
        if (this.currentPixels.length <= 1)
            return;
        let point = [];
        
        currFile.VFXLayer.context.clearRect(0, 0, currFile.canvasSize[0], currFile.canvasSize[1]);
        currFile.VFXLayer.context.strokeStyle = 'rgba(0,0,0,1)';
        currFile.VFXLayer.context.fillStyle = 'rgba(0,0,0,1)';
        currFile.VFXLayer.context.lineWidth = 1;
        currFile.VFXLayer.context.beginPath();

        for (var index = 0; index < this.currentPixels.length; index ++) {
            point = this.currentPixels[index];
            
            if (index == 0)
                currFile.VFXLayer.context.moveTo(point[0], point[1]);
            else {
                currFile.VFXLayer.context.lineTo(point[0], point[1]);
            }
        }

        currFile.VFXLayer.context.filter = "url(#remove-alpha)"
        currFile.VFXLayer.context.lineTo(this.currentPixels[0][0], this.currentPixels[0][1]);
        currFile.VFXLayer.context.stroke();

        currFile.VFXLayer.context.filter = "none";
        currFile.VFXLayer.context.fillStyle = 'rgba(0,0,0,0.3)';
        currFile.VFXLayer.context.fill();
        currFile.VFXLayer.context.closePath();
    }

    cursorInSelectedArea(mousePos) {

    }

    getSelection() {
        let selected = [];
        if (this.currentPixels.length <= 1){
            return;
        }

        currFile.VFXLayer.context.fillStyle = "blue";
        currFile.VFXLayer.context.fillRect(this.boundingBox.minX, this.boundingBox.minY, 1, 1);
        currFile.VFXLayer.context.fillRect(this.boundingBox.minX, this.boundingBox.maxY, 1, 1);
        currFile.VFXLayer.context.fillRect(this.boundingBox.maxX, this.boundingBox.maxY, 1, 1);
        currFile.VFXLayer.context.fillRect(this.boundingBox.maxX, this.boundingBox.minY, 1, 1);

        let fillPoint = [];
        let found = false;
        // Find a point inside the selection
        while (!found) {
            let nIntersections = 0;
            let prevPoint = -1;
            fillPoint = [Math.round(Math.random() * (this.boundingBox.maxX - this.boundingBox.minX)),
                         Math.round(Math.random() * (this.boundingBox.maxY - this.boundingBox.minY))];
            
            currFile.VFXLayer.context.fillStyle = "green";
            currFile.VFXLayer.context.fillRect(fillPoint[0], fillPoint[1], 1, 1);
            // Count the number of intersections with the shape
            for (let i=0; i<this.currentPixels.length; i++) {
                if (fillPoint[0] == this.currentPixels[i][0] && this.currentPixels[i][1] != prevPoint)
                    nIntersections++;
                prevPoint = this.currentPixels[i][1];
            }

            if (nIntersections & 1) 
                found = true;
        }
        
        console.log("Point: ");
        console.log(fillPoint);
        

        /*for (let x=this.boundingBox.minX+1; x<this.boundingBox.maxX; x++) {
            for (let y=this.boundingBox.minY+1; y<this.boundingBox.maxY; y++) {
                let toCheck = [x, y];
                let intersectionCount = 0;

                if (currFile.VFXLayer.context.getImageData(toCheck[0], toCheck[1], 1, 1).data[3] != 255) {
                    // Start from the pixel to check
                    let currPos = [toCheck[0], toCheck[1]];
                    // Finish when you get the pixel to check
                    let endPos = [toCheck[0], this.boundingBox.maxX];
                    let prevColor = 0;

                    // Go down: if you meet a pixel of the border, increase the number of intersections
                    while (currPos[1] <= endPos[1]) {
                        let pixel = currFile.VFXLayer.context.getImageData(currPos[0],
                            currPos[1], 1, 1).data;
                        if (pixel[3] == 255 && prevColor != 255) {
                            // Check if there's a closing pixel below
                            intersectionCount++;
                        }
                        currPos[1]++;
                        prevColor = pixel[3];
                    }
                    
                    // If the number of intersections is even (0 or 2), then the pixel is outside the
                    // seleted region
                    if (intersectionCount & 1)
                        selected.push(toCheck);
                        
                }
            }
        }*/

        for (let i=0; i<selected.length; i++) {
            currFile.VFXLayer.context.fillStyle = "red";
            currFile.VFXLayer.context.fillRect(selected[i][0], selected[i][1], 1, 1);
        }
    }
}