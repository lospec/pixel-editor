/** ColorModule holds the functions used to implement the basic-mode palette.
 * 
 */
const ColorModule = (() => {
    // Array containing the colours of the current palette
    let currentPalette = [];
    // Reference to the HTML palette
    const coloursList = document.getElementById("palette-list");
    // Reference to the colours menu
    let colorsMenu = document.getElementById("colors-menu");
    // Square size
    const minSquareSize = 38;
    let squareSize = colorsMenu.children[0].getBoundingClientRect().width;
     
    // Binding events to callbacks
    document.getElementById('jscolor-hex-input').addEventListener('change',colorChanged, false);
    document.getElementById('jscolor-hex-input').addEventListener('input', colorChanged, false);
    document.getElementById('add-color-button').addEventListener('click', addColorButtonEvent, false);

    Events.on("wheel", "colors-menu", resizeSquares);
    Events.on("click", document.getElementById("cm-add"), addColorButtonEvent);
    Events.on("click", document.getElementById("cm-remove"), deleteColor, undefined);
    Events.on("click", document.getElementById("cm-zoomin"), resizeSquares, {altKey:true, deltaY: -1.0});
    Events.on("click", document.getElementById("cm-zoomout"), resizeSquares, {altKey:true, deltaY: 1.0});

    // Making the colours in the HTML menu sortable
    new Sortable(document.getElementById("colors-menu"), {
        animation:100,
        filter: ".noshrink",
        draggable: ".draggable-colour",
        onEnd: function() {Events.simulateMouseEvent(window, "mouseup");}
    });

    function resizeSquares(event) {
        if (!event.altKey)  return;

        squareSize = Math.max(minSquareSize, (squareSize - 3 * Math.sign(event.deltaY)));

        for (let i=0; i< colorsMenu.children.length; i++) {
            colorsMenu.children[i].style.width = squareSize + 'px';
            colorsMenu.children[i].style.height = squareSize + 'px';
        }
    }

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
        for (let i = 0; i < colors.length; i++) {
            //if generated color matches this color
            if (newColorHex == colors[i].jscolor.toString()) {
                //if the color isnt the one that has the picker currently open
                if (!colors[i].parentElement.classList.contains('jscolor-active')) {
                    //////console.log('%cColor is duplicate', colorCheckingStyle);

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
            updateCurrentColor('#' + Color.rgbToHex(newColor));
        }
    }

    /** Callback triggered when the user clicks on a colour in the palette menu on the right
     * 
     * @param {*} e The event that triggered the callback
     */
    function clickedColor (e) {
        //left clicked color
        if (e.which == 1) {
            // remove current color selection
            const currentSelectedColorButton = document.querySelector('#colors-menu li.selected .color-button');
            const selectedColor = currentSelectedColorButton.style.backgroundColor;
            const clickedColor = e.target.style.backgroundColor;
            document.querySelector('#colors-menu li.selected')?.classList.remove('selected');
    
            //set current color
            updateCurrentColor(Color.cssToHex(clickedColor));
    
            //make color selected
            e.target.parentElement.classList.add('selected');
    
            if(selectedColor === clickedColor) {
                if (EditorState.getCurrentMode() == "Basic") {
                    e.target.parentElement.lastChild.classList.add('hidden');
                    e.target.jscolor.show();
                }
                else {
                    Dialogue.showDialogue("palette-block");
                }
            }
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
        if (EditorState.getCurrentMode() == "Advanced") {
            Dialogue.showDialogue("palette-block");
            return;
        }

        //generate random color
        const newColor = new Color("hsv", Math.floor(Math.random()*360), Math.floor(Math.random()*100), Math.floor(Math.random()*100)).hex;

        //remove current color selection
        document.querySelector('#colors-menu li.selected')?.classList.remove('selected');

        //add new color and make it selected
        let addedColor = addColor(newColor);
        addedColor.classList.add('selected');
        addedColor.style.width = squareSize + "px";
        addedColor.style.height = squareSize + "px";
        updateCurrentColor(newColor);

        //add history state
        new HistoryState().AddColor(addedColor.firstElementChild.jscolor.toString());

        //show color picker
        addedColor.firstElementChild.jscolor.show();
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
                addColor(Color.cssToHex(col));
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
            if (EditorState.getCurrentMode() == 'Basic')
                event.target.parentElement.firstChild.jscolor.show();
            else
                Dialogue.showDialogue("palette-block", false);
        });

        colorsMenu.children[0].classList.add('selected');
        return listItem;
    }

    /** Deletes a color from the palette
     * 
     * @param {*} color A string in hex format or the HTML element corresponding to the color 
     *                  that should be removed.
     */
    function deleteColor (color) {
        if (!color) 
            color = getSelectedColor();

        const logStyle = 'background: #913939; color: white; padding: 5px;';

        //if color is a string, then find the corresponding button
        if (typeof color === 'string') {
            if (color[0] === '#')
                color = color.substr(1, color.length - 1);
            //get all colors in palette
            let colors = document.getElementsByClassName('color-button');
    
            //loop through colors
            for (var i = 0; i < colors.length; i++) {
    
                if (color == colors[i].jscolor.toString()) {
                    //set color to the color button
                    currentPalette.splice(i, 1);
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
        let colors = document.getElementsByClassName('color-button');
        let lightestColor = [0,null];
        for (let i = 0; i < colors.length; i++) {
    
            //get colors lightness
            let lightness = Color.rgbToHsl(colors[i].jscolor.toRgb()).l;
    
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
            updateCurrentColor('#'+lightestColor[1].jscolor.toString());
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
        var tempImage = currFile.currentLayer.context.getImageData(0, 0, currFile.canvasSize[0], currFile.canvasSize[1]);

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
        currFile.currentLayer.context.putImageData(tempImage,0,0);
    }

    function getCurrentPalette() {
        let ret = [...currentPalette];
        if(ret.length === 0) {
            ret = [...document.querySelectorAll(".color-button")].map(n=>n.style.backgroundColor);
        }
        return ret;
    }

    function resetPalette() {
        currentPalette = [];
    }
    
    /** Creates the colour palette when starting up the editor from _newPixel.js
     * 
     * @param {*} paletteColors The colours of the palette
     */
    function createColorPalette(paletteColors) {
        //remove current palette
        while (colorsMenu.childElementCount > 1)
            colorsMenu.children[0].remove();

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
                document.querySelector('#colors-menu li.selected')?.classList.remove('selected');

                //set as current color
                newColorElement.classList.add('selected');
                darkestColor = newColor;
            }
        }

        //prepend # if not present
        if (!darkestColor.hex.includes('#')) darkestColor.hex = '#' + darkestColor.hex;

        //set as current color
        updateCurrentColor(darkestColor.hex);

    }

    /** Creates the palette with the colours used in all the layers
     * 
     */
    function createPaletteFromLayers() {
        //create array out of colors object
        let colorPaletteArray = getLayerColors();

        //create palette from colors array
        createColorPalette(colorPaletteArray);
    }

    /**
     * Scan the layers for any colors that are not currently in the palette. If any colors
     * are found they should be added as new colors for the palette.
     */
    function updatePaletteFromLayers() {
        let layersPaletteArray = getLayerColors();

        for (let i = 0; i < layersPaletteArray.length; i++) {
            if (currentPalette.indexOf(layersPaletteArray[i]) !== -1) {
                continue;
            }

            addColor(layersPaletteArray[i]);
        }
    }

    /**
     * Iterates each layer and grab each unique color.
     * @returns Array of colors used within the current layers.
     */
    function getLayerColors() {
        let colors = {};
        let nColors = 0;
        //create array out of colors object
        let colorPaletteArray = [];

        for (let i = 0; i < currFile.layers.length; i++) {
            if (currFile.layers[i].hasCanvas()) {
                let imageData = currFile.layers[i].context.getImageData(0, 0, currFile.canvasSize[0], currFile.canvasSize[1]).data;
                let dataLength = imageData.length;

                for (let j=0; j < dataLength; j += 4) {
                    if (!Util.isPixelEmpty(imageData[j])) {
                        let color = imageData[j]+','+imageData[j + 1]+','+imageData[j + 2];
                        
                        if (!colors[color]) {
                            colorPaletteArray.push('#' + new Color("rgb", imageData[j], imageData[j + 1], imageData[j + 2]).hex);
                            colors[color] = new Color("rgb", imageData[j], imageData[j + 1], imageData[j + 2]).rgb;
                            nColors++;

                            //don't allow more than 256 colors to be added
                            if (nColors >= Settings.getCurrSettings().maxColorsOnImportedImage) {
                                alert('The image loaded seems to have more than '+Settings.getCurrSettings().maxColorsOnImportedImage+' colors.');
                                break;
                            }
                        }
                    }
                }
            }
        }

        //create palette from colors array
        createColorPalette(colorPaletteArray);

    }

    function updateCurrentColor(color, refLayer) {
        if (color[0] != '#')
            color = '#' + color;

        if (refLayer)
            color = refLayer.context.fillStyle;
        
        for (let i=0; i<currFile.layers.length; i++) {
            currFile.layers[i].context.fillStyle = color;
            currFile.layers[i].context.strokeStyle = color;
        }
    }

    function getSelectedColor() {
        const currentSelectedColorButton = document.querySelector('#colors-menu li.selected .color-button');
        return currentSelectedColorButton.jscolor.toString();
    }

    return {
        getCurrentPalette,
        addColor,
        deleteColor,
        replaceAllOfColor,
        addToSimplePalette,
        resetPalette,
        createColorPalette,
        createPaletteFromLayers,
        updatePaletteFromLayers,
        updateCurrentColor,
        getSelectedColor,
    }
})();