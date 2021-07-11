/** Adds the given color to the palette
 * 
 * @param {*} newColor the colour to add
 * @return the list item containing the added colour
 */
const ColorModule = (() => {
    const currentPalette = [];
    const coloursList = document.getElementById("palette-list");
    
    console.info("Initialized Color Module..");
    document.getElementById('jscolor-hex-input').addEventListener('change',colorChanged, false);
    document.getElementById('jscolor-hex-input').addEventListener('input', colorChanged, false);
    document.getElementById('add-color-button').addEventListener('click', addColorButtonEvent, false);
    
    new Sortable(document.getElementById("colors-menu"), {
        animation:100,
        filter: ".noshrink",
        draggable: ".draggable-colour",
        onEnd: makeIsDraggingFalse
    });

    // Changes all of one color to another after being changed from color picker
    function colorChanged(colorHexElement) {
        console.log("Clicked:");
        console.log(colorHexElement);
        // Get old and new colors from the element
        const hexElement = colorHexElement.target;
        const hexElementValue = hexElement.value;
        const newColor = Color.hexToRgb(hexElementValue);
        const oldColor = hexElement.oldColor;

        //if the color is not a valid hex color, exit this function and do nothing
        const newColorHex = hexElementValue.toLowerCase();
        if (/^[0-9a-f]{6}$/i.test(newColorHex) == false) return

        currentPalette.splice(currentPalette.indexOf("#" + newColor), 1);
        newColor.a = 255;

        //save undo state
        new HistoryStateEditColor(hexElementValue.toLowerCase(), Color.rgbToHex(oldColor));

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

    function addColorButtonEvent() {
        //generate random color
        const newColor = new Color("hsl", Math.floor(Math.random()*255), 130+Math.floor(Math.random()*100), 70+Math.floor(Math.random()*100)).hex;

        //remove current color selection
        document.querySelector('#colors-menu li.selected').classList.remove('selected');

        //add new color and make it selected
        var addedColor = addColor(newColor);
        addedColor.classList.add('selected');
        currentLayer.context.fillStyle = '#' + newColor;

        //add history state
        //saveHistoryState({type: 'addcolor', colorValue: addedColor.firstElementChild.jscolor.toString()});
        new HistoryStateAddColor(addedColor.firstElementChild.jscolor.toString());

        //show color picker
        addedColor.firstElementChild.jscolor.show();
        console.log('showing picker');

        //hide edit button
        addedColor.lastChild.classList.add('hidden');
    }

    function AddToSimplePalette() {
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
    //formats a color button
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
        
        newEditButton.addEventListener('click', () => {
            //hide edit button
            newEditButton.parentElement.lastChild.classList.add('hidden');
    
            //show jscolor picker, if basic mode is enabled
            if (pixelEditorMode == 'Basic')
                newEditButton.parentElement.firstChild.jscolor.show();
            else
                showDialogue("palette-block", false);
        });

        return listItem;
    }

    function deleteColor (color) {
        const logStyle = 'background: #913939; color: white; padding: 5px;';

        //if color is a string, then find the corresponding button
        if (typeof color === 'string') {
            //console.log('trying to find ',color);
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
    
    //replaces all of a single color on the canvas with a different color
    //input two rgb color objects {r:0,g:0,b:0}
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

    return {
        currentPalette,
        addColor,
        deleteColor,
        replaceAllOfColor,
        AddToSimplePalette
    }
})();

console.log("Color module: " + ColorModule);