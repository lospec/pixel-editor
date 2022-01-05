/** TODO
 * - Once the selected pixels have been obtained, save the selection outline in an image data
 * - At the same time, create another image data and put the selected pixels in it
 * - The move tool will then move those image datas and they'll be pasted on the right layer
 *   at the end of the selection
 * 
 */

class SelectionTool extends Tool {
    switchFunc = undefined;
    moveTool = undefined;

    boundingBox = {minX: 9999999, maxX: -1, minY: 9999999, maxY: -1};
    currSelection = {};

    previewData = undefined;
    selectedPixel = undefined;

    constructor(name, options, switchFunc, moveTool) {
        super(name, options);

        this.moveTool = moveTool;
        this.switchFunc = switchFunc;
    }

    onStart(mousePos) {
        super.onStart(mousePos);

        let mouseX = mousePos[0] / currFile.zoom;
        let mouseY = mousePos[1] / currFile.zoom;

        this.boundingBox = {minX: 9999999, maxX: -1, minY: 9999999, maxY: -1};
        this.currSelection = {};

        this.updateBoundingBox(mouseX, mouseY);
    }

    onDrag(mousePos) {
        let mouseX = mousePos[0] / currFile.zoom;
        let mouseY = mousePos[1] / currFile.zoom;

        this.updateBoundingBox(mouseX, mouseY);
    }

    cutSelection() {}

    pasteSelection(){}

    copySelection(){}
    
    cursorInSelectedArea(mousePos) {
        let floored = [Math.floor(mousePos[0] / currFile.zoom), Math.floor(mousePos[1] / currFile.zoom)];

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

        /*
        currFile.VFXLayer.context.fillStyle = "red";
        currFile.VFXLayer.context.fillRect(this.boundingBox.minX, this.boundingBox.minY, 1, 1);
        currFile.VFXLayer.context.fillRect(this.boundingBox.maxX, this.boundingBox.minY, 1, 1);
        currFile.VFXLayer.context.fillRect(this.boundingBox.minX, this.boundingBox.maxY, 1, 1);
        currFile.VFXLayer.context.fillRect(this.boundingBox.maxX, this.boundingBox.maxY, 1, 1);
        */
        
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

        for (const key in this.currSelection) {
            currFile.VFXLayer.context.fillStyle = "blue";
            currFile.VFXLayer.context.fillRect(parseInt(key.split(",")[0]), parseInt(key.split(",")[1]), 1, 1);
        }
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