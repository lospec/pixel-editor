const PaletteBlock = (() => {
    // HTML elements
    let coloursList = document.getElementById("palette-list");

    // PaletteBlock-specific data
    let currentSquareSize = coloursList.children[0].clientWidth;
    let blockData = {blockWidth: 300, blockHeight: 320, squareSize: 40};
    let currentSelection = {startIndex:0, endIndex:0, startCoords:[], endCoords: [], name: "", colour: "", label: null};

    
    // Making the palette list sortable
    new Sortable(document.getElementById("palette-list"), {
        animation: 100,
        onEnd: updateRampSelection
    });
    // Listening for the palette block resize
    new ResizeObserver(updateSizeData).observe(coloursList.parentElement);

    Events.on("click", "pb-addcolours", addColours);
    Events.on("click", "pb-removecolours", removeColours);
    
    /** Listens for the mouse wheel, used to change the size of the squares in the palette list
     * 
     */
     coloursList.parentElement.addEventListener("wheel", function (mouseEvent) {
        // Only resize when pressing alt, used to distinguish between scrolling through the palette and
        // resizing it
        if (mouseEvent.altKey) {
            resizeSquares(mouseEvent);
        }
    });
    
    
    // Initializes the palette block
    function init() {
        let simplePalette = document.getElementById("colors-menu");
        let childCount = coloursList.childElementCount;

        currentSquareSize = coloursList.children[0].clientWidth;
        coloursList = document.getElementById("palette-list");

        // Remove all the colours
        for (let i=0; i<childCount; i++) {
            coloursList.children[0].remove();
        }

        // Add all the colours from the simplepalette
        for (let i=0; i<simplePalette.childElementCount-1; i++) {
            addSingleColour(Color.cssToHex(simplePalette.children[i].children[0].style.backgroundColor));
        }
    }

    /** Tells whether a colour is in the palette or not
     * 
     * @param {*} colour The colour to add
     */ 
    function hasColour(colour) {
        for (let i=0; i<coloursList.childElementCount; i++) {
            let currentCol = coloursList.children[i].style.backgroundColor;
            let currentHex = Color.cssToHex(currentCol);

            if (currentHex == colour) {
                return true;
            }
        }
        return false;
    }

    /** Adds a single colour to the palette
     * 
     * @param {*} colour The colour to add
     */
    function addSingleColour(colour) {
        if (!hasColour(colour)) {
            let li = document.createElement("li");

            li.style.width = currentSquareSize + "px";
            li.style.height = currentSquareSize + "px";
            li.style.backgroundColor = colour;
            li.addEventListener("mousedown", startRampSelection.bind(this));
            li.addEventListener("mouseup", endRampSelection.bind(this));
            li.addEventListener("mousemove", updateRampSelection.bind(this));
            li.addEventListener("onclick", endRampSelection.bind(this));

            coloursList.appendChild(li);
        }
    }
    /** Adds all the colours currently selected in the colour picker
     * 
     */
    function addColours() {
        let colours = ColorPicker.getSelectedColours();
        
        for (let i=0; i<colours.length; i++) {
            addSingleColour(colours[i]);
        }
    }

    /** Removes all the currently selected colours from the palette
     * 
     */
    function removeColours() {
        let startIndex = currentSelection.startIndex;
        let endIndex = currentSelection.endIndex;

        if (startIndex > endIndex) {
            let tmp = startIndex;
            startIndex = endIndex;
            endIndex = tmp;
        }

        for (let i=startIndex; i<=endIndex; i++) {
            coloursList.removeChild(coloursList.children[startIndex]);
        }
        clearBorders();
    }

    /** Starts selecting a ramp. Saves the data needed to draw the outline.
     * 
     * @param {*} mouseEvent 
     */
    function startRampSelection(mouseEvent) {
        if (mouseEvent.which == 3) {
            let index = getElementIndex(mouseEvent.target);

            isRampSelecting = true;

            currentSelection.startIndex = index;
            currentSelection.endIndex = index;

            currentSelection.startCoords = getColourCoordinates(index);
            currentSelection.endCoords = getColourCoordinates(index);
        }
        else if (mouseEvent.which == 1) {
            endRampSelection(mouseEvent);
        }
    }

    /** Updates the outline for the current selection.
     * 
     * @param {*} mouseEvent 
     */
    function updateRampSelection(mouseEvent) {
        if (mouseEvent != null && mouseEvent.which == 3) {
            currentSelection.endIndex = getElementIndex(mouseEvent.target);
        }
        
        if (mouseEvent == null || mouseEvent.which == 3) {
            let startCoords = getColourCoordinates(currentSelection.startIndex);
            let endCoords = getColourCoordinates(currentSelection.endIndex);

            let startIndex = currentSelection.startIndex;
            let endIndex = currentSelection.endIndex;
            
            if (currentSelection.startIndex > endIndex) {
                let tmp = startIndex;
                startIndex = endIndex;
                endIndex = tmp;

                tmp = startCoords;
                startCoords = endCoords;
                endCoords = tmp;
            }

            clearBorders();

            for (let i=startIndex; i<=endIndex; i++) {
                let currentSquare = coloursList.children[i];
                let currentCoords = getColourCoordinates(i);
                let borderStyle = "3px solid white";
                let bordersToSet = [];        

                // Deciding which borders to use to make the outline
                if (i == 0 || i == startIndex) {
                    bordersToSet.push("border-left");
                }
                if (currentCoords[1] == startCoords[1] || ((currentCoords[1] == startCoords[1] + 1)) && currentCoords[0] < startCoords[0]) {
                    bordersToSet.push("border-top");
                }
                if (currentCoords[1] == endCoords[1] || ((currentCoords[1] == endCoords[1] - 1)) && currentCoords[0] > endCoords[0]) {
                    bordersToSet.push("border-bottom");
                }
                if ((i == coloursList.childElementCount - 1) || (currentCoords[0] == Math.floor(blockData.blockWidth / blockData.squareSize) - 1) 
                    || i == endIndex) {
                    bordersToSet.push("border-right");
                }
                if (bordersToSet != []) {
                    currentSquare.style["box-sizing"] = "border-box";

                    for (let i=0; i<bordersToSet.length; i++) {
                        currentSquare.style[bordersToSet[i]] = borderStyle;
                    }
                }
            }
        }
    }

    /** Removes all the borders from all the squares. The borders are cleared only for the
     *  current selection, so every border that is not white is kept.
     * 
     */
    function clearBorders() {
        for (let i=0; i<coloursList.childElementCount; i++) {
            coloursList.children[i].style["border-top"] = "none";
            coloursList.children[i].style["border-left"] = "none";  
            coloursList.children[i].style["border-right"] = "none";
            coloursList.children[i].style["border-bottom"] = "none";
        }
    }

    /** Ends the current selection, opens the ramp menu 
     * 
     * @param {*} mouseEvent 
     */
    function endRampSelection(mouseEvent) {
        let col;

        if (currentSelection.startCoords.length == 0) {
            currentSelection.endIndex = getElementIndex(mouseEvent.target);
            currentSelection.startIndex = currentSelection.endIndex;
            currentSelection.startCoords = getColourCoordinates(currentSelection.startIndex);
        }

        // I'm not selecting a ramp anymore
        isRampSelecting = false;
        // Setting the end coordinates
        currentSelection.endCoords = getColourCoordinates(getElementIndex(mouseEvent.target));

        // Setting the colour in the colour picker
        col = Color.cssToHex(coloursList.children[currentSelection.startIndex].style.backgroundColor);
        ColorPicker.updatePickerByHex(col);
        ColorPicker.updateSlidersByHex(col);
        ColorPicker.updateMiniPickerColour();

        updateRampSelection();

        currentSelection.startCoords = [];
    }

    /** Updates the current data about the size of the palette list (height, width and square size).
     *  It also updates the outline after doing so.
     * 
     */
    function updateSizeData() {
        blockData.blockHeight = coloursList.parentElement.clientHeight;
        blockData.blockWidth = coloursList.parentElement.clientWidth;
        blockData.squareSize = coloursList.children[0].clientWidth;

        updateRampSelection();
    }

    /** Gets the colour coordinates relative to the colour list seen as a matrix. Coordinates
     *  start from the top left angle.
     * 
     * @param {*} index The index of the colour in the list seen as a linear array
     */
    function getColourCoordinates(index) {
        let yIndex = Math.floor(index / Math.floor(blockData.blockWidth / blockData.squareSize));
        let xIndex = Math.floor(index % Math.floor(blockData.blockWidth / blockData.squareSize));

        return [xIndex, yIndex];
    }

    /** Returns the index of the element in the colour list
     * 
     * @param {*} element The element of which we need to get the index
     */
    function getElementIndex(element) {
        for (let i=0; i<coloursList.childElementCount; i++) {
            if (element == coloursList.children[i]) {
                return i;
            }
        }
    }

    /** Resizes the squares depending on the scroll amount (only resizes if the user is 
     *  also holding alt)
     * 
     * @param {*} mouseEvent 
     */
    function resizeSquares(mouseEvent) {
        let amount = mouseEvent.deltaY > 0 ? -5 : 5;
        currentSquareSize += amount;

        for (let i=0; i<coloursList.childElementCount; i++) {
            let currLi = coloursList.children[i];

            currLi.style["box-sizing"] = "content-box";
            currLi.style.width = currLi.clientWidth + amount + "px";
            currLi.style.height = currLi.clientHeight + amount + "px";
        }

        updateSizeData();
    }

    return {
        init
    }
})();