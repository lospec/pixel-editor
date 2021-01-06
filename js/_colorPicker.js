let sliders = document.getElementsByClassName("cp-slider-entry");
let colourPreview = document.getElementById("cp-colour-preview");
let colourValue = document.getElementById("cp-hex");
let currentPickerMode = "rgb";
let currentPickingMode = "mono";
let styleElement = document.createElement("style");
let miniPickerCanvas = document.getElementById("cp-spectrum");
let miniPickerSlider = document.getElementById("cp-minipicker-slider");
let activePickerIcon = document.getElementById("cp-active-icon");
let pickerIcons = [activePickerIcon];
let hexContainers = [document.getElementById("cp-colours-previews").children[0],null,null,null];
let startPickerIconPos = [[0,0],[0,0],[0,0],[0,0]];
let currPickerIconPos = [[0,0], [0,0],[0,0],[0,0]];
let styles = ["",""];
let draggingCursor = false;

cpInit();

function cpInit() {
    // Appending the palette styles
    document.getElementsByTagName("head")[0].appendChild(styleElement);

    // Saving first icon position
    startPickerIconPos[0] = [miniPickerCanvas.getBoundingClientRect().left, miniPickerCanvas.getBoundingClientRect().top];
    // Set the correct size of the canvas
    miniPickerCanvas.height = miniPickerCanvas.getBoundingClientRect().height;
    miniPickerCanvas.width = miniPickerCanvas.getBoundingClientRect().width;

    // Update picker position
    updatePickerByHex(colourValue.value);   
    // Startup updating
    updateAllSliders();
    // Fill minislider
    updateMiniSlider(colourValue.value);
    // Fill minipicker
    updatePickerByHex(colourValue.value);  

    updateMiniPickerSpectrum();
}

function hexUpdated() {
    updatePickerByHex(colourValue.value);
    updateSlidersByHex(colourValue.value);
}

// Applies the styles saved in the style array to the style element in the head of the document
function updateStyles() {
    styleElement.innerHTML = styles[0] + styles[1];
}

/** Updates the background gradients of the sliders given their value
 *  Updates the hex colour and its preview
 *  Updates the minipicker according to the computed hex colour
 * 
 */
function updateSliderValue (sliderIndex, updateMini = true) {
    let toUpdate;
    let slider;
    let input;
    let hexColour;
    let sliderValues;

    toUpdate = sliders[sliderIndex - 1];
    
    slider = toUpdate.getElementsByTagName("input")[0];
    input = toUpdate.getElementsByTagName("input")[1];
    
    // Update label value
    input.value = slider.value;

    // Update preview colour
    // get slider values
    sliderValues = getSlidersValues();

    // Generate preview colour
    switch (currentPickerMode) {
        case 'rgb':
            hexColour = rgbToHex(sliderValues[0], sliderValues[1], sliderValues[2]);
            break;
        case 'hsv':
            let tmpRgb = hsvToRgb(sliderValues[0], sliderValues[1], sliderValues[2]);
            hexColour = rgbToHex(parseInt(tmpRgb[0]), parseInt(tmpRgb[1]), parseInt(tmpRgb[2]));
            break;
        case 'hsl':
            hexColour = hslToHex(sliderValues[0], sliderValues[1], sliderValues[2]);
            break;
        default:
            console.log("wtf select a decent picker mode");
            return;
    }
    // Update preview colour div
    colourPreview.style.backgroundColor = '#' + hexColour;
    colourValue.value = '#' + hexColour;

    // Update sliders background
    // there's no other way than creating a custom css file, appending it to the head and
    // specify the sliders' backgrounds here

    styles[0] = '';
    for (let i=0; i<sliders.length; i++) {
        styles[0] += getSliderCSS(i + 1, sliderValues);
    }

    updateStyles();

    if (updateMini) {
        updatePickerByHex(colourValue.value);
        updateMiniPickerSpectrum();
    }
}

// Calculates the css gradient for a slider
function getSliderCSS(index, sliderValues) {
    let ret = 'input[type=range]#';
    let sliderId;
    let gradientMin;
    let gradientMax;
    let hueGradient;
    let rgbColour;

    switch (index) {
        case 1:
            sliderId = 'first-slider';
            switch (currentPickerMode) {
                case 'rgb':
                    gradientMin = 'rgba(0,' + sliderValues[1] + ',' + sliderValues[2] + ',1)';
                    gradientMax = 'rgba(255,' + sliderValues[1] + ',' + sliderValues[2] + ',1)';
                    break;
                case 'hsv':
                    hueGradient = getHueGradientHSV(sliderValues);
                    break;
                case 'hsl':
                    // Hue gradient
                    hueGradient = getHueGradientHSL(sliderValues);
                    break;
            }
            break;
        case 2:
            sliderId = 'second-slider';
            switch (currentPickerMode) {
                case 'rgb':
                    gradientMin = 'rgba(' + sliderValues[0] + ',0,' + sliderValues[2] + ',1)';
                    gradientMax = 'rgba(' + sliderValues[0] + ',255,' + sliderValues[2] + ',1)';
                    break;
                case 'hsv':
                    rgbColour = hsvToRgb(sliderValues[0], 0, sliderValues[2]);
                    gradientMin = 'rgba(' + rgbColour[0] + ',' + rgbColour[1] + ',' + rgbColour[2] + ',1)';

                    rgbColour = hsvToRgb(sliderValues[0], 100, sliderValues[2]);
                    gradientMax = 'rgba(' + rgbColour[0] + ',' + rgbColour[1] + ',' + rgbColour[2] + ',1)';
                    break;
                case 'hsl':
                    rgbColour = cpHslToRgb(sliderValues[0], 0, sliderValues[2]);
                    gradientMin = 'rgba(' + rgbColour[0] + ',' + rgbColour[1] + ',' + rgbColour[2] + ',1)';

                    rgbColour = cpHslToRgb(sliderValues[0], 100, sliderValues[2]);
                    gradientMax = 'rgba(' + rgbColour[0] + ',' + rgbColour[1] + ',' + rgbColour[2] + ',1)';
                    break;
            }
            break;
        case 3:
            sliderId = 'third-slider';
            switch (currentPickerMode) {
                case 'rgb':
                    gradientMin = 'rgba(' + sliderValues[0] + ',' + sliderValues[1] + ',0,1)';
                    gradientMax = 'rgba(' + sliderValues[0] + ',' + sliderValues[1] + ',255,1)';
                    break;
                case 'hsv':
                    rgbColour = hsvToRgb(sliderValues[0], sliderValues[1], 0);
                    gradientMin = 'rgba(' + rgbColour[0] + ',' + rgbColour[1] + ',' + rgbColour[2] + ',1)';

                    rgbColour = hsvToRgb(sliderValues[0], sliderValues[1], 100);
                    gradientMax = 'rgba(' + rgbColour[0] + ',' + rgbColour[1] + ',' + rgbColour[2] + ',1)';
                    break;
                case 'hsl':
                    gradientMin = 'rgba(0,0,0,1)';
                    gradientMax = 'rgba(255,255,255,1)';
                    break;
            }

            break;
        default:
            return '';
    }

    ret += sliderId;
    ret += '::-webkit-slider-runnable-track  {';

    switch (currentPickerMode) {
        case 'rgb':
            ret += 'background: linear-gradient(90deg, rgba(2,0,36,1) 0%, ' +
                gradientMin + ' 0%, ' + gradientMax + '100%)';
            break;
        case 'hsv':
        case 'hsl':
            ret += 'background: ';
            if (index == 1) {
                ret += hueGradient;
            }
            else { 
                ret += 'linear-gradient(90deg, rgba(2,0,36,1) 0%, ' + gradientMin + ' 0%, ';
                // For hsl I also have to add a middle point
                if (currentPickerMode == 'hsl' && index == 3) {
                    let rgb = cpHslToRgb(sliderValues[0], sliderValues[1], 50);
                    ret += 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',1) 50%,';
                }
                
                ret += gradientMax + '100%);';
            }
            break;
    }

    ret += '}'

    ret += ret.replace('::-webkit-slider-runnable-track', '::-moz-range-track');

    return ret;
}

// Computes the hue gradient used for hsl
function getHueGradientHSL(sliderValues) {
    return 'linear-gradient(90deg, rgba(2,0,36,1) 0%, \
    hsl(0,' + sliderValues[1] + '%,' + sliderValues[2]+ '%) 0%, \
    hsl(60,' + sliderValues[1] + '%,' + sliderValues[2]+ '%) 16.6666%, \
    hsl(120,' + sliderValues[1] + '%,' + sliderValues[2]+ '%) 33.3333333333%, \
    hsl(180,'+ sliderValues[1] + '%,' + sliderValues[2]+ '%) 50%, \
    hsl(240,' + sliderValues[1] + '%,' + sliderValues[2]+ '%) 66.66666%, \
    hsl(300,'+ sliderValues[1] + '%,' + sliderValues[2]+ '%) 83.333333%, \
    hsl(360,'+ sliderValues[1] + '%,' + sliderValues[2]+ '%) 100%);';
}
// Computes the hue gradient used for hsv
function getHueGradientHSV(sliderValues) {
    let col = hsvToRgb(0, sliderValues[1], sliderValues[2]);
    let ret = 'linear-gradient(90deg, rgba(2,0,36,1) 0%, ';

    ret += 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',1) 0%,'

    col = hsvToRgb(60, sliderValues[1], sliderValues[2]);
    ret += 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',1) 16.6666%,';

    col = hsvToRgb(120, sliderValues[1], sliderValues[2]);
    ret += 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',1) 33.3333333333%,';

    col = hsvToRgb(180, sliderValues[1], sliderValues[2]);
    ret += 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',1) 50%,';

    col = hsvToRgb(240, sliderValues[1], sliderValues[2]);
    ret += 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',1) 66.66666%,';

    col = hsvToRgb(300, sliderValues[1], sliderValues[2]);
    ret += 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',1) 83.333333%,';

    col = hsvToRgb(360, sliderValues[1], sliderValues[2]);
    ret += 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',1) 100%);';

    return ret;
}

// Fired when the values in the labels are changed
function inputChanged(target, index) {
    let sliderIndex = index - 1;

    sliders[sliderIndex].getElementsByTagName("input")[0].value = target.value;
    updateSliderValue(index);
}

// Updates the colour model used to pick colours
function changePickerMode(target, newMode) {
    let maxRange;
    let colArray;
    let rgbTmp;
    let hexColour = colourValue.value.replace('#', '');

    currentPickerMode = newMode;
    document.getElementsByClassName("cp-selected-mode")[0].classList.remove("cp-selected-mode");
    target.classList.add("cp-selected-mode");

    switch (newMode)
    {
        case 'rgb':
            maxRange = [255,255,255];
            sliders[0].getElementsByTagName("label")[0].innerHTML = 'R';
            sliders[1].getElementsByTagName("label")[0].innerHTML = 'G';
            sliders[2].getElementsByTagName("label")[0].innerHTML = 'B';
            break;
        case 'hsv':
            maxRange = [360, 100, 100];
            sliders[0].getElementsByTagName("label")[0].innerHTML = 'H';
            sliders[1].getElementsByTagName("label")[0].innerHTML = 'S';
            sliders[2].getElementsByTagName("label")[0].innerHTML = 'V';
            break;
        case 'hsl':
            maxRange = [360, 100, 100];
            sliders[0].getElementsByTagName("label")[0].innerHTML = 'H';
            sliders[1].getElementsByTagName("label")[0].innerHTML = 'S';
            sliders[2].getElementsByTagName("label")[0].innerHTML = 'L';
            break;
        default:
            console.log("wtf select a decent picker mode");
            break;
    }

    for (let i=0; i<sliders.length; i++) {
        let slider = sliders[i].getElementsByTagName("input")[0];

        slider.setAttribute("max", maxRange[i]);
    }

    // Putting the current colour in the new slider
    switch(currentPickerMode) {
        case 'rgb':
            colArray = hexToRgb(hexColour);
            colArray = [colArray.r, colArray.g, colArray.b];
            break;
        case 'hsv':
            rgbTmp = hexToRgb(hexColour);
            colArray = rgbToHsv(rgbTmp);

            colArray.h *= 360;
            colArray.s *= 100;
            colArray.v *= 100;

            colArray = [colArray.h, colArray.s, colArray.v];

            break;
        case 'hsl':
            rgbTmp = hexToRgb(hexColour);
            colArray = rgbToHsl(rgbTmp);

            colArray.h *= 360;
            colArray.s *= 100;
            colArray.l *= 100;

            colArray = [colArray.h, colArray.s, colArray.l];

            break;
        default:
            break;
    }

    for (let i=0; i<3; i++) {
        sliders[i].getElementsByTagName("input")[0].value = colArray[i];
    }

    updateAllSliders();
}

// Returns an array containing the values of the sliders
function getSlidersValues() {
    return [parseInt(sliders[0].getElementsByTagName("input")[0].value), 
    parseInt(sliders[1].getElementsByTagName("input")[0].value), 
    parseInt(sliders[2].getElementsByTagName("input")[0].value)];
}

// Updates every slider
function updateAllSliders(updateMini=true) {
    for (let i=1; i<=3; i++) {
        updateSliderValue(i, updateMini);
    }
}
/******************SECTION: MINIPICKER******************/

// Moves the picker icon according to the mouse position on the canvas
function movePickerIcon(event) {
    event.preventDefault();

    if (event.which == 1 || draggingCursor) {
        let cursorPos = getCursorPosMinipicker(event);
        let canvasRect = miniPickerCanvas.getBoundingClientRect();

        let left = (cursorPos[0] - startPickerIconPos[0][0] - 8);
        let top = (cursorPos[1] - startPickerIconPos[0][1] - 8);

        if (left > -8 && top > -8 && left < canvasRect.width-8 && top < canvasRect.height-8){
            activePickerIcon.style["left"] = "" + left + "px";
            activePickerIcon.style["top"]= "" + top + "px";

            currPickerIconPos[0] = [left, top];
        }

        updateMiniPickerColour();
        updateOtherIcons();
    }
}

// Updates the main sliders given a hex value computed with the minipicker
function updateSlidersByHex(hex, updateMini = true) {
    let colour;
    let mySliders = [sliders[0].getElementsByTagName("input")[0], 
        sliders[1].getElementsByTagName("input")[0], 
        sliders[2].getElementsByTagName("input")[0]];

    switch (currentPickerMode) {
        case 'rgb':
            colour = hexToRgb(hex);

            mySliders[0].value = colour.r;
            mySliders[1].value = colour.g;
            mySliders[2].value = colour.b;

            break;
        case 'hsv':
            colour = rgbToHsv(hexToRgb(hex));

            mySliders[0].value = colour.h * 360;
            mySliders[1].value = colour.s * 100;
            mySliders[2].value = colour.v * 100;

            break;
        case 'hsl':
            colour = rgbToHsl(hexToRgb(hex));

            mySliders[0].value = colour.h * 360;
            mySliders[1].value = colour.s * 100;
            mySliders[2].value = colour.l * 100;

            break;
        default:
            break;
    }

    updateAllSliders(false);
}

// Gets the position of the picker cursor relative to the canvas
function getCursorPosMinipicker(e) {
    var x;
    var y;
    
    if (e.pageX != undefined && e.pageY != undefined) {
        x = e.pageX;
        y = e.pageY;
    }
    else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;			
    }

    x -= miniPickerCanvas.offsetLeft;
    y -= miniPickerCanvas.offsetTop;

    return [Math.round(x), Math.round(y)];
}

// Updates the minipicker given a hex computed by the main sliders
// Moves the cursor 
function updatePickerByHex(hex) {
    let hsv = rgbToHsv(hexToRgb(hex));
    let xPos = miniPickerCanvas.width * hsv.h - 8;
    let yPos = miniPickerCanvas.height * hsv.s + 8;

    miniPickerSlider.value = hsv.v * 100;

    currPickerIconPos[0][0] = xPos;
    currPickerIconPos[0][1] = miniPickerCanvas.height - yPos;

    if (currPickerIconPos[0][1] >= 92)
    {
        currPickerIconPos[0][1] = 91.999;
    }

    activePickerIcon.style.left = '' + xPos + 'px';
    activePickerIcon.style.top = '' + (miniPickerCanvas.height - yPos) + 'px';
    activePickerIcon.style.backgroundColor = '#' + getMiniPickerColour();
    
    updateOtherIcons();
    updateMiniSlider(hex);
}

// Fired when the value of the minislider changes: updates the spectrum gradient and the hex colour
function miniSliderInput(event) {
    let newHex;
    let newHsv = rgbToHsv(hexToRgb(getMiniPickerColour()));
    let rgb;

    // Adding slider value to value
    newHsv.v = parseInt(event.target.value);
    // Updating hex
    rgb = hsvToRgb(newHsv.h * 360, newHsv.s * 100, newHsv.v);
    newHex = rgbToHex(Math.round(rgb[0]), Math.round(rgb[1]), Math.round(rgb[2]));

    colourValue.value = newHex;

    updateMiniPickerSpectrum();
    updateMiniPickerColour();
}

// Updates the hex colour after having changed the minislider (MERGE)
function updateMiniPickerColour() {
    let hex = getMiniPickerColour();

    activePickerIcon.style.backgroundColor = '#' + hex;

    // Update hex and sliders based on hex
    colourValue.value = '#' + hex;
    colourPreview.style.backgroundColor = '#' + hex;

    updateSlidersByHex(hex);
    updateMiniSlider(hex);
    updateOtherIcons();
}

// Returns the current colour of the minipicker
function getMiniPickerColour() {
    let hex;
    let pickedColour;

     pickedColour = miniPickerCanvas.getContext('2d').getImageData(currPickerIconPos[0][0] + 8, 
        currPickerIconPos[0][1] + 8, 1, 1).data;

    hex = rgbToHex(pickedColour[0], pickedColour[1], pickedColour[2]);

    return hex;
}

// Update the background gradient of the slider in the minipicker
function updateMiniSlider(hex) {
    let rgb = hexToRgb(hex);

    styles[1] = "input[type=range]#cp-minipicker-slider::-webkit-slider-runnable-track { background: rgb(2,0,36);";
    styles[1] += "background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(0,0,0,1) 0%, " +
    "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",1) 100%);}";

    updateStyles();
}

// Updates the gradient of the spectrum canvas in the minipicker
function updateMiniPickerSpectrum() {
    let ctx = miniPickerCanvas.getContext('2d');
    let hsv = rgbToHsv(hexToRgb(colourValue.value));
    let tmp;
    let white = {h:hsv.h * 360, s:0, v: parseInt(miniPickerSlider.value)};

    white = hsvToRgb(white.h, white.s, white.v);

    ctx.clearRect(0, 0, miniPickerCanvas.width, miniPickerCanvas.height);

    // Drawing hues
    var hGrad = ctx.createLinearGradient(0, 0, miniPickerCanvas.width, 0);

    for (let i=0; i<7; i++) {
        tmp = hsvToRgb(60 * i, 100, hsv.v * 100);
        hGrad.addColorStop(i / 6, '#' + rgbToHex(Math.round(tmp[0]), Math.round(tmp[1]), Math.round(tmp[2])));
    }
    ctx.fillStyle = hGrad;
    ctx.fillRect(0, 0, miniPickerCanvas.width, miniPickerCanvas.height);

    // Drawing sat / lum
    var vGrad = ctx.createLinearGradient(0, 0, 0, miniPickerCanvas.height);
    vGrad.addColorStop(0, 'rgba(' + white[0] +',' + white[1] + ',' + white[2] + ',0)');
    /*
    vGrad.addColorStop(0.1, 'rgba(255,255,255,0)');
    vGrad.addColorStop(0.9, 'rgba(255,255,255,1)');
    */
    vGrad.addColorStop(1, 'rgba(' + white[0] +',' + white[1] + ',' + white[2] + ',1)');
    
    ctx.fillStyle = vGrad;
    ctx.fillRect(0, 0, miniPickerCanvas.width, miniPickerCanvas.height);
}

function toggleDraggingCursor() {
    draggingCursor = !draggingCursor;
}

function changePickingMode(event, newMode) {
    let nIcons = pickerIcons.length;
    let canvasContainer = document.getElementById("cp-canvas-container");
    // Number of hex containers to add
    let nHexContainers;

    // Remove selected class from previous mode
    document.getElementById("cp-colour-picking-modes").getElementsByClassName("cp-selected-mode")[0].classList.remove("cp-selected-mode");
    // Updating mode
    currentPickingMode = newMode;
    // Adding selected class to new mode
    event.target.classList.add("cp-selected-mode");
    
    for (let i=1; i<nIcons; i++) {
        // Deleting extra icons
        pickerIcons.pop();
        canvasContainer.removeChild(canvasContainer.children[2]);

        // Deleting extra hex containers
        hexContainers[0].parentElement.removeChild(hexContainers[0].parentElement.children[1]);
        hexContainers[i] = null;
    }

    // Resetting first hex container size
    hexContainers[0].style.width = '100%';

    switch (currentPickingMode)
    {
        case 'analog':
            createIcon();
            createIcon();

            nHexContainers = 2;
            break;
        case 'cmpt':
            // Easiest one, add 180 to the H value and move the icon
            createIcon();
            nHexContainers = 1;
            break;
        case 'tri':
            createIcon();
            createIcon();
            nHexContainers = 2;
            break
        case 'scmpt':
            createIcon();
            createIcon();
            nHexContainers = 2;
            break;
        case 'tetra':
            for (let i=0; i<3; i++) {
                createIcon();
            }
            nHexContainers = 3;
            break;
        default:
            console.log("How did you select the " + currentPickingMode + ", hackerman?");
            break;
    }

    // Editing the size of the first container
    hexContainers[0].style.width = '' + 100 / (nHexContainers + 1) + '%';
    // Adding hex preview containers
    for (let i=0; i<nHexContainers; i++) {
        let newContainer = document.createElement("div");
        newContainer.classList.add("cp-colour-preview");
        newContainer.style.width = "" + (100 / (nHexContainers + 1)) + "%";

        hexContainers[0].parentElement.appendChild(newContainer);
        hexContainers[i + 1] = newContainer;
    }

    function createIcon() {
        let newIcon = document.createElement("div");
        newIcon.classList.add("cp-picker-icon");
        pickerIcons.push(newIcon);

        canvasContainer.appendChild(newIcon);
    }

    updateOtherIcons();
}

function updateOtherIcons() {
    let currentColorHex = colourValue.value;
    let currentColourHsv = rgbToHsv(hexToRgb(currentColorHex));
    let newColourHsv = {h:currentColourHsv.h, s:currentColourHsv.s, v:currentColourHsv.v};
    let newColourHexes = ['', '', ''];
    let tmpRgb;

    // Salvo tutti i 

    switch (currentPickingMode)
    {
        case 'mono':
            break;
        case 'analog':
            // First colour
            newColourHsv.h = (((currentColourHsv.h*360 + 40) % 360) / 360);

            currPickerIconPos[1][0] = miniPickerCanvas.width * newColourHsv.h - 8;
            currPickerIconPos[1][1] = miniPickerCanvas.height - (miniPickerCanvas.height * newColourHsv.s + 8);

            tmpRgb = hsvToRgb(newColourHsv.h*360, newColourHsv.s*100, newColourHsv.v*100);            
            newColourHexes[0] = rgbToHex(Math.round(tmpRgb[0]), Math.round(tmpRgb[1]), Math.round(tmpRgb[2]));

            // Second colour
            newColourHsv.h = (((currentColourHsv.h*360 - 40) % 360) / 360);
            if (newColourHsv.h < 0) {
                newColourHsv.h += 1;
            }

            currPickerIconPos[2][0] = miniPickerCanvas.width * newColourHsv.h - 8;
            currPickerIconPos[2][1] = miniPickerCanvas.height - (miniPickerCanvas.height * newColourHsv.s + 8);

            tmpRgb = hsvToRgb(newColourHsv.h*360, newColourHsv.s*100, newColourHsv.v*100);            
            newColourHexes[1] = rgbToHex(Math.round(tmpRgb[0]), Math.round(tmpRgb[1]), Math.round(tmpRgb[2]));
            break;
        case 'cmpt':
            newColourHsv.h = (((currentColourHsv.h*360 + 180) % 360) / 360);

            currPickerIconPos[1][0] = miniPickerCanvas.width * newColourHsv.h - 8;
            currPickerIconPos[1][1] = miniPickerCanvas.height - (miniPickerCanvas.height * newColourHsv.s + 8);

            tmpRgb = hsvToRgb(newColourHsv.h*360, newColourHsv.s*100, newColourHsv.v*100);            
            newColourHexes[0] = rgbToHex(Math.round(tmpRgb[0]), Math.round(tmpRgb[1]), Math.round(tmpRgb[2]));
            break;
        case 'tri':
            for (let i=1; i< 3; i++) {
                newColourHsv.h = (((currentColourHsv.h*360 + 120*i) % 360) / 360);

                currPickerIconPos[i][0] = miniPickerCanvas.width * newColourHsv.h - 8;
                currPickerIconPos[i][1] = miniPickerCanvas.height - (miniPickerCanvas.height * newColourHsv.s + 8);

                tmpRgb = hsvToRgb(newColourHsv.h*360, newColourHsv.s*100, newColourHsv.v*100);            
                newColourHexes[i - 1] = rgbToHex(Math.round(tmpRgb[0]), Math.round(tmpRgb[1]), Math.round(tmpRgb[2]));
            }
            
            break
        case 'scmpt':
            // First colour
            newColourHsv.h = (((currentColourHsv.h*360 + 210) % 360) / 360);

            currPickerIconPos[1][0] = miniPickerCanvas.width * newColourHsv.h - 8;
            currPickerIconPos[1][1] = miniPickerCanvas.height - (miniPickerCanvas.height * newColourHsv.s + 8);

            tmpRgb = hsvToRgb(newColourHsv.h*360, newColourHsv.s*100, newColourHsv.v*100);            
            newColourHexes[0] = rgbToHex(Math.round(tmpRgb[0]), Math.round(tmpRgb[1]), Math.round(tmpRgb[2]));

            // Second colour
            newColourHsv.h = (((currentColourHsv.h*360 + 150) % 360) / 360);

            currPickerIconPos[2][0] = miniPickerCanvas.width * newColourHsv.h - 8;
            currPickerIconPos[2][1] = miniPickerCanvas.height - (miniPickerCanvas.height * newColourHsv.s + 8);

            tmpRgb = hsvToRgb(newColourHsv.h*360, newColourHsv.s*100, newColourHsv.v*100);            
            newColourHexes[1] = rgbToHex(Math.round(tmpRgb[0]), Math.round(tmpRgb[1]), Math.round(tmpRgb[2]));
            break;
        case 'tetra':
            for (let i=1; i< 4; i++) {
                newColourHsv.h = (((currentColourHsv.h*360 + 90*i) % 360) / 360);

                currPickerIconPos[i][0] = miniPickerCanvas.width * newColourHsv.h - 8;
                currPickerIconPos[i][1] = miniPickerCanvas.height - (miniPickerCanvas.height * newColourHsv.s + 8);

                tmpRgb = hsvToRgb(newColourHsv.h*360, newColourHsv.s*100, newColourHsv.v*100);            
                newColourHexes[i - 1] = rgbToHex(Math.round(tmpRgb[0]), Math.round(tmpRgb[1]), Math.round(tmpRgb[2]));
            }
            break;
        default:
            console.log("How did you select the " + currentPickingMode + ", hackerman?");
            break;
    }

    hexContainers[0].style.color = getHexPreviewColour(colourValue.value);

    for (let i=1; i<pickerIcons.length; i++) {
        pickerIcons[i].style.left = '' + currPickerIconPos[i][0] + 'px';
        pickerIcons[i].style.top = '' + currPickerIconPos[i][1] + 'px';

        pickerIcons[i].style.backgroundColor = '#' + newColourHexes[i - 1];
    }

    if (currentPickingMode != "analog") {
        hexContainers[0].style.backgroundColor = colourValue.value;
        hexContainers[0].innerHTML = colourValue.value;

        for (let i=0; i<pickerIcons.length - 1; i++) {
            hexContainers[i + 1].style.backgroundColor = '#' + newColourHexes[i];
            hexContainers[i + 1].innerHTML = '#' + newColourHexes[i];
            hexContainers[i + 1].style.color = getHexPreviewColour(newColourHexes[i]);
        }
    }
    // If I'm using analogous mode, I place the current colour in the middle
    else {
        hexContainers[1].style.backgroundColor = colourValue.value;
        hexContainers[1].innerHTML = colourValue.value;

        hexContainers[2].style.backgroundColor = '#' + newColourHexes[0];
        hexContainers[2].innerHTML = '#' + newColourHexes[0];

        hexContainers[0].style.backgroundColor = '#' + newColourHexes[1];
        hexContainers[0].innerHTML = '#' + newColourHexes[1];

        for (let i=1; i<3; i++) {
            hexContainers[i].style.color = getHexPreviewColour(newColourHexes[i - 1]);
        }
    }
}

function getSelectedColours() {
    let ret = [];

    for (let i=0; i<hexContainers.length; i++) {
        if (hexContainers[i] != null) {
            ret.push(hexContainers[i].innerHTML);
        }
    }

    return ret;
}

function getHexPreviewColour(hex) {

    //if brightness is over threshold, make the text dark
    if (colorBrightness(hex) > 110) {
        return '#332f35'
    }
    else {
        return '#c2bbc7';
    }

    //take in a color and return its brightness
    function colorBrightness (color) {
        var r = parseInt(color.slice(1, 3), 16);
        var g = parseInt(color.slice(3, 5), 16);
        var b = parseInt(color.slice(5, 7), 16);
        return Math.round(((parseInt(r) * 299) + (parseInt(g) * 587) + (parseInt(b) * 114)) / 1000);
    }
}