class EyedropperTool extends Tool {
    eyedropperPreview = document.getElementById("eyedropper-preview");
    selectedColor = {r:0, g:0, b:0};

    constructor(name, options, switchFunction) {
        super(name, options);

        Events.on('click', this.mainButton, switchFunction, this);
    }

    onStart(mousePos) {
        super.onStart(mousePos);

        this.eyedropperPreview.style.display = 'block';
        this.onDrag(mousePos);
	}

	onDrag(mousePos) {
        super.onDrag(mousePos);

        this.selectedColor = this.pickColor(mousePos);

        this.eyedropperPreview.style.borderColor = '#' + Color.rgbToHex(this.selectedColor);
        this.eyedropperPreview.style.left = mousePos[0] + currentLayer.canvas.offsetLeft - 30 + 'px';
        this.eyedropperPreview.style.top = mousePos[1] + currentLayer.canvas.offsetTop - 30 + 'px';

        const colorLightness = Math.max(this.selectedColor.r,this.selectedColor.g,this.selectedColor.b);

        //for the darkest 50% of colors, change the eyedropper preview to dark mode
        if (colorLightness>127) this.eyedropperPreview.classList.remove('dark');
        else this.eyedropperPreview.classList.add('dark');

        this.changeColor();
	}

	onEnd(mousePos) {
        super.onEnd(mousePos);
        this.eyedropperPreview.style.display = 'none';
	}

    changeColor() {
        let colorHex =  Color.rgbToHex(this.selectedColor);
		ColorModule.updateCurrentColor('#' +  Color.rgbToHex(this.selectedColor));
		
		let colors = document.getElementsByClassName('color-button');
	    for (let i = 0; i < colors.length; i++) {
            //if picked color matches this color
            if (colorHex == colors[i].jscolor.toString()) {
                //remove current color selection
                document.querySelector("#colors-menu li.selected")?.classList.remove("selected");

                //set current color
                for (let i=2; i<layers.length; i++) {
                    layers[i].context.fillStyle = '#' + colorHex;
                }

                //make color selected
                colors[i].parentElement.classList.add('selected');
            }
	    }
    }

    /** Gets the eyedropped colour (the colour of the pixel pointed by the cursor when the user is using the eyedropper).
     *  It takes the colour of the canvas with the biggest z-index, basically the one the user can see, since it doesn't
     *  make much sense to sample a colour which is hidden behind a different layer
     * 
     * @param {*} cursorLocation The position of the cursor
     */
    pickColor(cursorLocation) {
        // Making sure max will take some kind of value
        let max = -1;
        // Using tmpColour to sample the sprite
        let tmpColour;
        // Returned colour
        let selectedColor;

        for (let i=1; i<layers.length; i++) {
            // Getting the colour of the pixel in the cursorLocation
            tmpColour = layers[i].context.getImageData(Math.floor(cursorLocation[0]/zoom),Math.floor(cursorLocation[1]/zoom),1,1).data;

            // If it's not empty, I check if it's on the top of the previous colour
            if (layers[i].canvas.style.zIndex > max || Util.isPixelEmpty(selectedColor) || selectedColor === undefined) {
                max = layers[i].canvas.style.zIndex;

                if (!Util.isPixelEmpty(tmpColour)) {
                    selectedColor = tmpColour;
                }
            }
        }

        // If the final colour was empty, I return black
        if (Util.isPixelEmpty(tmpColour) && selectedColor === undefined) {
            selectedColor = [0, 0, 0];
        }

        return {r:selectedColor[0], g:selectedColor[1], b:selectedColor[2]};
    }


    onSelect() {
        super.onSelect();        
    }

    onDeselect() {
        super.onDeselect();
        this.eyedropperPreview.style.display = 'none';
    }
}