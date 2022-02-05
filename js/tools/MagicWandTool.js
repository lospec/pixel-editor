class MagicWandTool extends SelectionTool {

    constructor (name, options, switchFunc, moveTool) {
        super(name, options, switchFunc, moveTool);
        Events.on('click', this.mainButton, switchFunc, this);

        this.resetTutorial();
        this.addTutorialTitle("Magic wand tool");
        this.addTutorialKey("W", " to select the magic wand tool");
        this.addTutorialKey("Left click", " to select a contiguous area");
        this.addTutorialKey("Esc", " to cancel a selection");
        this.addTutorialKey("Click", " outside the selection to cancel it");
        this.addTutorialKey("CTRL+C", " to copy a selection");
        this.addTutorialKey("CTRL+V", " to paste a selection");
        this.addTutorialKey("CTRL+X", " to cut a selection");
        this.addTutorialImg("magicwand-tutorial.gif");
    }

    onEnd(mousePos, mouseTarget) {
        super.onStart(mousePos, mouseTarget);
        if (Util.isChildOfByClass(mouseTarget, "editor-top-menu") || 
            !Util.cursorInCanvas(currFile.canvasSize, [mousePos[0]/currFile.zoom, mousePos[1]/currFile.zoom]))
            return;
            

        this.switchFunc(this.moveTool);
        this.moveTool.setSelectionData(this.getSelection(), this);
    }

    getSelection() {
        let coords = [Math.floor(this.endMousePos[0]), Math.floor(this.endMousePos[1])];
        let data = currFile.currentLayer.context.getImageData(0, 0, currFile.canvasSize[0], currFile.canvasSize[1]).data;
        let index = (coords[1] * currFile.canvasSize[0] + coords[0]) * 4;
        let color = [data[index], data[index+1], data[index+2], data[index+3]];
        let selectedData = new ImageData(currFile.canvasSize[0], currFile.canvasSize[1]);

        this.visit([Math.floor(this.endMousePos[0]), Math.floor(this.endMousePos[1])],
            this.currSelection, data, color);
        
        for (const pixel in this.currSelection) {
            let coords = [parseInt(pixel.split(",")[0]), parseInt(pixel.split(",")[1])];
            let index = (currFile.canvasSize[0] * coords[1] + coords[0]) * 4;

            selectedData[index] = color[0];
            selectedData[index+1] = color[1];
            selectedData[index+2] = color[2];
            selectedData[index+3] = color[3];

            this.updateBoundingBox(coords[0], coords[1]);
        }

        this.outlineData = new ImageData(currFile.canvasSize[0], currFile.canvasSize[1]);
        this.previewData = selectedData;
        this.drawSelectedArea();
        this.boundingBoxCenter = [this.boundingBox.minX + (this.boundingBox.maxX - this.boundingBox.minX) / 2,
            this.boundingBox.minY + (this.boundingBox.maxY - this.boundingBox.minY) / 2];

        // Cut the selection
        this.cutSelection();
        // Put it on the TMP layer
        currFile.TMPLayer.context.putImageData(this.previewData, 0, 0);

        // Draw the bounding box
        this.drawBoundingBox();

        return selectedData;
    }

    visit(pixel, selected, data, color) {
        let toVisit = [pixel];
        let visited = [];

        while (toVisit.length > 0) {
            pixel = toVisit.pop();
            visited[pixel] = true;

            let col = Util.getPixelColor(data, pixel[0], pixel[1], currFile.canvasSize[0]);
            if (col[0] == color[0] && col[1] == color[1] && col[2] == color[2] && col[3] == color[3])
                selected[pixel] = true;
            else
                continue;

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
            
            if (right != undefined && visited[right] == undefined)
                toVisit.push(right);
            if (left != undefined && visited[left] == undefined)
                toVisit.push(left);
            if (top != undefined && visited[top] == undefined)
                toVisit.push(top);
            if (bottom != undefined && visited[bottom] == undefined)
                toVisit.push(bottom);
        }

        return selected;
    }
}