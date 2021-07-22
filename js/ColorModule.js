/** ColorModule holds the functions used to implement the basic-mode palette.
 * 
 */
const ColorModule = (() => {
    // Array containing the colours of the current palette
    let currentPalette = [];
    // Reference to the HTML palette
    const coloursList = document.getElementById("palette-list");
    
    // Binding events to callbacks
    console.info("Initialized Color Module..");
    document.getElementById('jscolor-hex-input').addEventListener('change',colorChanged, false);
    document.getElementById('jscolor-hex-input').addEventListener('input', colorChanged, false);
    document.getElementById('add-color-button').addEventListener('click', addColorButtonEvent, false);
    
    // Making the colours in the HTML menu sortable
    new Sortable(document.getElementById("colors-menu"), {
        animation:100,
        filter: ".noshrink",
        draggable: ".draggable-colour",
        // REFACTOR: Don't touch dragging, simulate a mouseup event instead
        onEnd: function() {Events.simulateMouseEvent(window, "mouseup");}
    });

    /** Changes all of one color to another after being changed from the color picker
     * 
     * @param {*} colorHexElement The element that has been changed
     * @returns 
     */
    function colorChanged(colorHexElement) {
        // Get old and new colors from the element
        const hexElement = colorHexElement.target;
        const hexElementValue = hexElement.value;
        const newColor = Color.hexToRgb(hexElementValue);
        const oldColor = hexElement.oldColor;

        //if the color is not a valid hex color, exit this function and do nothing
        const newColorHex = hexElementValue.toLowerCase();
        if (/^[0-9a-f]{6}$/i.test(newColorHex) == false) return;

        currentPalette.splice(currentPalette.indexOf("#" + newColor), 1);
        newColor.a = 255;

        //save undo state
        new HistoryState().EditColor(hexElementValue.toLowerCase(), Color.rgbToHex(oldColor));

        //get the currently selected color
        const currentlyEditedColor = document.getElementsByClassName('jscolor-active')[0];
        const duplicateColorWarning = document.getElementById('duplicate-color-warning');

        //check if selected color already matches another color 
        colors = document.getElementsByClassName('color-button');

        //loop through all colors in palette
        for (var i = 0; i < colors.length; i++) {
            //if generated color matches this color
            if (newColorHex == colors[i].jscolor.toString()) {
                //if the color isnt the one that has the picker currently open
                if (!colors[i].parentElement.classList.contains('jscolor-active')) {
                    //console.log('%cColor is duplicate', colorCheckingStyle);

                    //show the duplicate color warning
                    duplicateColorWarning.style.visibility = 'visible';

                    //shake warning icon
                    duplicateColorWarning.classList.remove('shake');
                    void duplicateColorWarning.offsetWidth;
                    duplicateColorWarning.classList.add('shake');

                    //exit function without updating color
                    return;
                }
            }
        }

        //if the color being edited has a duplicate color warning, remove it
        duplicateColorWarning.style.visibility = 'hidden';

        currentlyEditedColor.firstChild.jscolor.fromString(newColorHex);

        ColorModule.replaceAllOfColor(oldColor, newColor);

        //set new old color to changed color
        hexElement.oldColor = newColor;
        currentPalette.push('#' + newColorHex);

        //if this is the current color, update the drawing color
        if (hexElement.colorElement.parentElement.classList.contains('selected')) {
            for (let i=1; i<layers.length - nAppLayers; i++) {
                layers[i].context.fillStyle = '#'+ Color.rgbToHex(newColor);
            }
            currentGlobalColor = newColor;
        }
    }

    /** Callback triggered when the user clicks on a colour in the palette menu on the right
     * 
     * @param {*} e The event that triggered the callback
     */
    function clickedColor (e){
        //left clicked color
        if (e.which == 1) {
            // remove current color selection
            var selectedColor = document.querySelector('#colors-menu li.selected');
            if (selectedColor) selectedColor.classList.remove('selected');
    
            //set current color
            for (let i=1; i<layers.length - nAppLayers; i++) {
                layers[i].context.fillStyle = this.style.backgroundColor;
            }
    
            currentGlobalColor = this.style.backgroundColor;
            //make color selected
            e.target.parentElement.classList.add('selected');
    
        } 
        //right clicked color
        else if (e.which == 3) { 
            //hide edit color button (to prevent it from showing)
            e.target.parentElement.lastChild.classList.add('hidden');
            //show color picker
            e.target.jscolor.show();
        }
    }

    /** Called whenever the user presses the button used to add a new colour to the palette
     * 
     */
    function addColorButtonEvent() {
        //generate random color
        const newColor = new Color("hsv", Math.floor(Math.random()*360), Math.floor(Math.random()*100), Math.floor(Math.random()*100)).hex;

        //remove current color selection
        document.querySelector('#colors-menu li.selected').classList.remove('selected');

        //add new color and make it selected
        var addedColor = addColor(newColor);
        addedColor.classList.add('selected');
        currentLayer.context.fillStyle = '#' + newColor;

        //add history state
        new HistoryState().AddColor(addedColor.firstElementChild.jscolor.toString());

        //show color picker
        addedColor.firstElementChild.jscolor.show();
        console.log('showing picker');

        //hide edit button
        addedColor.lastChild.classList.add('hidden');
    }

    /** Adds the colors that have been added through the advanced-mode color picker to the 
     *  basic-mode palette.
     * 
     */
    function addToSimplePalette() {
        const simplePalette = document.getElementById("colors-menu");
        const childCount = simplePalette.childElementCount;
    
        // Removing all the colours
        for (let i=0; i<childCount-1; i++) {
            simplePalette.removeChild(simplePalette.children[0]);
        }
    
        // Adding the new ones
        for (let i=0; i<coloursList.childElementCount; i++) {
            const col = coloursList.children[i].style.backgroundColor;
            
            if (col.includes("rgb")) {
                addColor(cssToHex(col));
            }
            else  {
                addColor(col);
            }
        }
    }

    /** Initializes jscolor for the element passed as a parameter
     * 
     * @param {*} colorElement The element of which we need to setup jscolor
     */
    function initColor (colorElement) {
        //add jscolor picker for this color
        colorElement.jscolor = new jscolor(colorElement.parentElement, {	
            valueElement: null,
            styleElement: colorElement,
            width:151, 
            position: 'left', 
            padding:0, 
            borderWidth:14, 
            borderColor: '#332f35',
            backgroundColor: '#332f35', 
            insetColor: 'transparent',
            value: colorElement.style.backgroundColor,
            deleteButton: true,
        });

    }

    /** Adds a color to the palette
     * 
     * @param {*} newColor The color to add in hex format
     * @returns The HTML palette item that has been created
     */
    function addColor (newColor) {
        //add # at beginning if not present
        if (newColor.charAt(0) != '#')
            newColor = '#' + newColor;
        currentPalette.push(newColor);
        //create list item
        const listItem = document.createElement('li');   
    
        //create button
        const button = document.createElement('button');
        button.classList.add('color-button');
        button.style.backgroundColor = newColor;
        button.addEventListener('mouseup', clickedColor);
        listItem.appendChild(button);
        listItem.classList.add("draggable-colour")
    
        //insert new listItem element at the end of the colors menu (right before add button)
        colorsMenu.insertBefore(listItem, colorsMenu.children[colorsMenu.children.length-1]);
    
        //add jscolor functionality
        initColor(button);
    
        //add edit button
        const editButtonTemplate = document.getElementsByClassName('color-edit-button')[0];
        newEditButton = editButtonTemplate.cloneNode(true);
        listItem.appendChild(newEditButton);
        
        newEditButton.addEventListener('click', (event) => {
            //hide edit button
            event.target.parentElement.lastChild.classList.add('hidden');
    
            //show jscolor picker, if basic mode is enabled
            if (pixelEditorMode == 'Basic')
                event.target.parentElement.firstChild.jscolor.show();
            else
                Dialogue.showDialogue("palette-block", false);
        });

        return listItem;
    }

    /** Deletes a color from the palette
     * 
     * @param {*} color A string in hex format or the HTML element corresponding to the color 
     *                  that should be removed.
     */
    function deleteColor (color) {
        const logStyle = 'background: #913939; color: white; padding: 5px;';

        //if color is a string, then find the corresponding button
        if (typeof color === 'string') {
            //get all colors in palette
            colors = document.getElementsByClassName('color-button');
    
            //loop through colors
            for (var i = 0; i < colors.length; i++) {
                //console.log(color,'=',colors[i].jscolor.toString());
    
                if (color == colors[i].jscolor.toString()) {
                    //set color to the color button
                    color = colors[i];
                    break;
                }
            }
    
            //if the color wasn't found
            if (typeof color === 'string') {
                //exit function
                return;
            }
        }
    
        //hide color picker
        color.jscolor.hide();
    
        //find lightest color in palette
        var colors = document.getElementsByClassName('color-button');
        var lightestColor = [0,null];
        for (var i = 0; i < colors.length; i++) {
    
            //get colors lightness
            var lightness = Color.rgbToHsl(colors[i].jscolor.toRgb()).l;
    
            //if not the color we're deleting
            if (colors[i] != color) {
    
                //if lighter than the current lightest, set as the new lightest 
                if (lightness > lightestColor[0]) {
                    lightestColor[0] = lightness;
                    lightestColor[1] = colors[i];
                }
            }
        }

        //replace deleted color with lightest color
        ColorModule.replaceAllOfColor(color.jscolor.toString(),lightestColor[1].jscolor.toString());
    
        //if the color you are deleting is the currently selected color
        if (color.parentElement.classList.contains('selected')) {
            //set current color TO LIGHTEST COLOR
            lightestColor[1].parentElement.classList.add('selected');
            currentLayer.context.fillStyle = '#'+lightestColor[1].jscolor.toString();
        }
    
        //delete the element
        colorsMenu.removeChild(color.parentElement);
    }
    
    /** Replaces all of a single color on the canvas with a different color
     * 
     * @param {*} oldColor Old colour in {r,g,b} object format
     * @param {*} newColor New colour in {r,g,b} object format
     */
    function replaceAllOfColor (oldColor, newColor) {

        //convert strings to objects if nessesary 
        if (typeof oldColor === 'string') oldColor = Color.hexToRgb(oldColor);
        if (typeof newColor === 'string') newColor = Color.hexToRgb(newColor);

        //create temporary image from canvas to search through
        var tempImage = currentLayer.context.getImageData(0, 0, canvasSize[0], canvasSize[1]);

        //loop through all pixels
        for (var i=0;i<tempImage.data.length;i+=4) {
            //check if pixel matches old color
            if(tempImage.data[i]==oldColor.r && tempImage.data[i+1]==oldColor.g && tempImage.data[i+2]==oldColor.b){
                //change to new color
                tempImage.data[i]=newColor.r;
                tempImage.data[i+1]=newColor.g;
                tempImage.data[i+2]=newColor.b;
            }
        }

        //put temp image back onto canvas
        currentLayer.context.putImageData(tempImage,0,0);
    }

    function getCurrentPalette() {
        return currentPalette;
    }

    function resetPalette() {
        currentPalette = [];
    }
    
    /** Creates the colour palette when starting up the editor from _newPixel.js
     * 
     * @param {*} paletteColors The colours of the palette
     * @param {*} deletePreviousPalette Tells if the app should delete the previous palette or not 
     *                                  (used when opening a file, for example)
     */
    function createColorPalette(paletteColors) {
        //remove current palette
        while (colors.length > 0)
            colors[0].parentElement.remove();

        var lightestColor = new Color("hex", '#000000');
        var darkestColor = new Color("hex", '#ffffff');

        // Adding all the colours in the array
        for (var i = 0; i < paletteColors.length; i++) {
            var newColor = new Color("hex", paletteColors[i]);
            var newColorElement = ColorModule.addColor(newColor.hex);

            var newColRgb = newColor.rgb;

            var lightestColorRgb = lightestColor.rgb;
            if (newColRgb.r + newColRgb.g + newColRgb.b > lightestColorRgb.r + lightestColorRgb.g + lightestColorRgb.b)
                lightestColor = newColor;

            var darkestColorRgb = darkestColor.rgb;
            if (newColRgb.r + newColRgb.g + newColRgb.b < darkestColorRgb.r + darkestColorRgb.g + darkestColorRgb.b) {

                //remove current color selection
                var selectedColor = document.querySelector('#colors-menu li.selected');
                if (selectedColor) selectedColor.classList.remove('selected');

                //set as current color
                newColorElement.classList.add('selected');
                darkestColor = newColor;
            }
        }

        //prepend # if not present
        if (!darkestColor.hex.includes('#')) darkestColor.hex = '#' + darkestColor.hex;

        //set as current color
        currentLayer.context.fillStyle = darkestColor.hex;
    }

    /** Creates the palette with the colours used in all the layers
     * 
     */
    function createPaletteFromLayers() {
        let colors = {};

        for (let i=0; i<layers.length; i++) {
            if (layers[i].menuEntry != null) {
                let imageData = layers[i].context.getImageData(0, 0, layers[i].canvasSize[0], layers[i].canvasSize[1]).data;
                let dataLength = imageData.length;

                for (let j=0; j<dataLength; j += 4) {
                    if (!isPixelEmpty(imageData[j])) {
                        let color = imageData[j]+','+imageData[j + 1]+','+imageData[j + 2];

                        if (!colors[color]) {
                            colors[color] = new Color("rgb", imageData[j], imageData[j + 1], imageData[j + 2]).rgb;

                            //don't allow more than 256 colors to be added
                            if (Object.keys(colors).length >= settings.maxColorsOnImportedImage) {
                                alert('The image loaded seems to have more than '+settings.maxColorsOnImportedImage+' colors.');
                                break;
                            }
                        }
                    }
                }
            }
        }

        //create array out of colors object
        let colorPaletteArray = [];
        for (let color in colors) {
            if (colors.hasOwnProperty(color)) {
                colorPaletteArray.push('#'+Color.rgbToHex(colors[color]));
            }
        }

        //create palette from colors array
        createColorPalette(colorPaletteArray);
    }

    return {
        getCurrentPalette,
        addColor,
        deleteColor,
        replaceAllOfColor,
        addToSimplePalette,
        resetPalette,
        createColorPalette,
        createPaletteFromLayers
    }
})();