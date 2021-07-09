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
        // Get old and new colors from the element
        const hexElement = colorHexElement.target;
        const hexElementValue = hexElement.value;
        const newColor = hexToRgb(hexElementValue);
        const oldColor = hexElement.oldColor;

        //if the color is not a valid hex color, exit this function and do nothing
        const newColorHex = hexElementValue.toLowerCase();
        if (/^[0-9a-f]{6}$/i.test(newColorHex) == false) return

        currentPalette.splice(currentPalette.indexOf("#" + newColor), 1);
        newColor.a = 255;

        //save undo state
        new HistoryStateEditColor(hexElementValue.toLowerCase(), rgbToHex(oldColor));

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

        replaceAllOfColor(oldColor, newColor);

        //set new old color to changed color
        hexElement.oldColor = newColor;
        currentPalette.push('#' + newColorHex);

        //if this is the current color, update the drawing color
        if (hexElement.colorElement.parentElement.classList.contains('selected')) {
            for (let i=1; i<layers.length - nAppLayers; i++) {
                layers[i].context.fillStyle = '#'+ rgbToHex(newColor.r,newColor.g,newColor.b);
            }
            currentGlobalColor = newColor;
        }
    }

    function addColorButtonEvent() {
        //generate random color
        const hue = Math.floor(Math.random()*255);
        const sat = 130+Math.floor(Math.random()*100);
        const lit = 70+Math.floor(Math.random()*100);
        const newColorRgb = hslToRgb(hue,sat,lit);
        const newColor = rgbToHex(newColorRgb.r,newColorRgb.g,newColorRgb.b);

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
        
        newEditButton.addEventListener('click', (e,button) => {
            //hide edit button
            button.parentElement.lastChild.classList.add('hidden');
    
            //show jscolor picker, if basic mode is enabled
            if (pixelEditorMode == 'Basic')
                button.parentElement.firstChild.jscolor.show();
            else
                showDialogue("palette-block", false);
        });

        return listItem;
    }

    return {
        currentPalette,
        addColor,
        AddToSimplePalette
    }
})();

console.log("Color module: " + ColorModule);