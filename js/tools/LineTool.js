class LineTool extends Tool {
    constructor(name, options, switchFunction) {
        super(name, options);

        Events.on('click', this.mainButton, switchFunction, this);
        Events.on('click', this.biggerButton, this.increaseSize.bind(this));
        Events.on('click', this.smallerButton, this.decreaseSize.bind(this));
    }

    onStart(mousePos) {
        super.onStart(mousePos);

        // Putting the tmp layer on top of everything
        TMPLayer.canvas.style.zIndex = parseInt(currentLayer.canvas.style.zIndex, 10) + 1;

        this.startMousePos[0] = Math.floor(mousePos[0]) + 0.5;
        this.startMousePos[1] = Math.floor(mousePos[1]) + 0.5;
	}

	onDrag(mousePos, cursorTarget) {
        super.onDrag(mousePos);

        // Drawing the line at the right position
        this.drawLine(mousePos);
	}

    /** Finishes drawing the rect, decides the end coordinates and moves the preview rectangle to the
     *  current layer
     * 
     * @param {*} mousePos The position of the mouse when the user stopped dragging
     */
	onEnd(mousePos) {
        super.onEnd(mousePos);

        const tmpContext = TMPLayer.context;
        const tmpCanvas = TMPLayer.canvas;
        // Setting the correct linewidth and colour
        currentLayer.context.lineWidth = this.currSize;

        // Drawing the line
		currentLayer.context.drawImage(tmpCanvas, 0, 0);

        // Update the layer preview
        currentLayer.updateLayerPreview();
        // Clearing the tmp canvas
        tmpContext.clearRect(0, 0, TMPLayer.canvas.width, TMPLayer.canvas.height);
	}

    onSelect() {
        super.onSelect();
    }

    onDeselect() {
        super.onDeselect();
    }

    drawLine(mousePos) {
        let x0 = Math.floor(this.startMousePos[0]/zoom);
        let y0 = Math.floor(this.startMousePos[1]/zoom);
        let x1 = Math.floor(mousePos[0]/zoom);
        let y1 = Math.floor(mousePos[1]/zoom);

        let dx = Math.abs(x1-x0);
        let dy = Math.abs(y1-y0);
        let sx = (x0 < x1 ? 1 : -1);
        let sy = (y0 < y1 ? 1 : -1);
        let err = dx-dy;
        
        const canvas = document.getElementById('tmp-canvas');
        const context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.zIndex = parseInt(currentLayer.canvas.style.zIndex, 10) + 1;

        while (true) {
            context.fillRect(x0-Math.floor(this.currSize/2), y0-Math.floor(this.currSize/2), this.currSize, this.currSize);

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