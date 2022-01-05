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
        this.boundingBox = {minX: 9999999, maxX: -1, minY: 9999999, maxY: -1};
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

    isBorderOfBox(pixel) {
        return  pixel[0] == this.boundingBox.minX || pixel[0] == this.boundingBox.maxX || 
                pixel[1] == this.boundingBox.minY || pixel[1] == this.boundingBox.maxY;
    }

    visit(pixel, visited, data) {
        let toVisit = [pixel];
        let selected = [];
        let currVisited = {};

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
            
            // The include problem: https://stackoverflow.com/questions/19543514/check-whether-an-array-exists-in-an-array-of-arrays
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
        if (this.currentPixels.length <= 1){
            return;
        }

        for (let x=this.boundingBox.minX; x<=this.boundingBox.maxX; x++) {
            for (let y=this.boundingBox.minY; y<=this.boundingBox.maxY; y++) {
                if (visited[[x, y]] == undefined) {
                    let insidePixels = this.visit([x,y], visited, data);
                    
                    for (let i=0; i<insidePixels.length; i++) {
                        selected.push(insidePixels[i]);
                    }
                }
            }
        }

        for (let i=0; i<selected.length; i++) {
            currFile.VFXLayer.context.fillStyle = "red";
            currFile.VFXLayer.context.fillRect(selected[i][0], selected[i][1], 1, 1);
        }
    }
}