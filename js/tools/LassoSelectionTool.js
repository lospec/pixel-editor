class LassoSelectionTool extends SelectionTool {
    currentPixels = [];
    currSelection = {};
    boundingBox = {minX: 9999999, maxX: -1, minY: 9999999, maxY: -1};

    constructor (name, options, switchFunc, moveTool) {
        super(name, options, switchFunc, moveTool);
        Events.on('click', this.mainButton, switchFunc, this);
    }

    onStart(mousePos) {
        super.onStart(mousePos);

        // Putting the vfx layer on top of everything
        currFile.VFXLayer.canvas.style.zIndex = MAX_Z_INDEX;
        // clearSelection();
        this.currentPixels = [];
        this.drawSelection();
        this.currentPixels.push([mousePos[0] / currFile.zoom, mousePos[1] / currFile.zoom]);
    }

    onDrag(mousePos) {
        super.onDrag(mousePos);

        let mouseX = mousePos[0] / currFile.zoom;
        let mouseY = mousePos[1] / currFile.zoom;

        if (this.currentPixels[this.currentPixels.length - 1] != mousePos)
            this.currentPixels.push([mousePos[0] / currFile.zoom, mousePos[1] / currFile.zoom]);
        this.drawSelection();

        if (mouseX > this.boundingBox.maxX)
            this.boundingBox.maxX = Math.floor(mouseX);
        if (mouseX < this.boundingBox.minX)
            this.boundingBox.minX = Math.floor(mouseX);
        if (mouseY < this.boundingBox.minY)
            this.boundingBox.minY = Math.floor(mouseY);
        if (mouseY > this.boundingBox.maxY)
            this.boundingBox.maxY = Math.floor(mouseY);
    }

    onEnd(mousePos) {
        super.onEnd(mousePos);
        new HistoryState().EditCanvas();

        this.currentPixels.push([this.startMousePos[0] / currFile.zoom, this.startMousePos[1] / currFile.zoom]);
        this.getSelection();

        // Switch to the move tool so that the user can move the selection
        this.switchFunc(this.moveTool);
        this.moveTool.setSelectionData(null, this);
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
        let prevPoint = [];
        
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
                prevPoint = this.currentPixels[index- 1];
                currFile.VFXLayer.context.lineTo(point[0], point[1]);
                currFile.VFXLayer.drawLine(Math.floor(prevPoint[0]), Math.floor(prevPoint[1]), 
                    Math.floor(point[0]), Math.floor(point[1]), 1);
            }
        }
        
        currFile.VFXLayer.drawLine(Math.floor(prevPoint[0]), Math.floor(prevPoint[1]), 
                    Math.floor(this.startMousePos[0] / currFile.zoom), Math.floor(this.startMousePos[1] / currFile.zoom), 1);
        currFile.VFXLayer.context.lineTo(this.startMousePos[0] / currFile.zoom, this.startMousePos[1] / currFile.zoom);
        
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

        for (let x=this.boundingBox.minX; x<this.boundingBox.maxX; x++) {
            for (let y=this.boundingBox.minY; y<this.boundingBox.maxY; y++) {
                let toCheck = [x, y];
                let intersectionCount = 0;

                if (!this.currentPixels.includes(toCheck)) {
                    for (let index = 1; index < this.currentPixels.length; index ++){
                        let start = this.currentPixels[index - 1];
                        let end = this.currentPixels[index];
                        
                        let ray = {Start: toCheck, End: [9999, 0]}; 
                        let segment = {Start: start, End: end}; 
                        let rayDistance = {
                            x: ray.End[0] - ray.Start[0],
                            y: ray.End[1] - ray.Start[1]
                        };
                        let segDistance = {
                            x: segment.End[0] - segment.Start[0], 
                            y: segment.End[1] - segment.Start[1]
                        };
                        
                        let rayLength = Math.sqrt(Math.pow(rayDistance.x, 2) + Math.pow(rayDistance.y, 2));
                        let segLength = Math.sqrt(Math.pow(segDistance.x, 2) + Math.pow(segDistance.y, 2));
                        
                        if ((rayDistance.x / rayLength == segDistance.x / segLength) &&
                            (rayDistance.y / rayLength == segDistance.y / segLength))
                            continue;
                        
                        let T2 = (rayDistance.x * (segment.Start[1] - ray.Start[1]) + rayDistance.y * (ray.Start[0] - segment.Start[0])) / (segDistance.x * rayDistance.y - segDistance.y * rayDistance.x);
                        let T1 = (segment.Start[0] + segDistance.x * T2 - ray.Start[0]) / rayDistance.x;
                        
                        //Parametric check.
                        if (T1 < 0) {
                            continue;
                        }
                        if (T2 < 0 || T2 > 1) {
                            continue;
                        }
                        if (isNaN(T1)) {
                            continue;
                        }
                        
                        intersectionCount++; 
                    }
                    
                    if (intersectionCount & 1)
                        selected.push(toCheck);
                }
            }
        }

        for (let i=0; i<selected.length; i++) {
            currFile.VFXLayer.context.fillStyle = "red";
            currFile.VFXLayer.context.fillRect(selected[i][0], selected[i][1], 1, 1);
        }
    }
}