// Acts as a public static class
class Util {

    /** Pastes the source image data on the destination image data, keeping the pixels where the 
     *  source image data is transparent
     * 
     * @param {*} source 
     * @param {*} destination 
     */
    static pasteData(underlyingImageData, pasteData, finalContext) {
        for (let i=0; i<underlyingImageData.data.length; i+=4) {
            let currentMovePixel = [
                pasteData.data[i], pasteData.data[i+1], pasteData.data[i+2], pasteData.data[i+3]
            ];

            let currentUnderlyingPixel = [
                underlyingImageData.data[i], underlyingImageData.data[i+1], 
                underlyingImageData.data[i+2], underlyingImageData.data[i+3]
            ];

            // If the pixel of the clipboard is empty, but the one below it isn't, I use the pixel below
            if (Util.isPixelEmpty(currentMovePixel)) {
                if (!Util.isPixelEmpty(currentUnderlyingPixel)) {
                    pasteData.data[i] = currentUnderlyingPixel[0];
                    pasteData.data[i+1] = currentUnderlyingPixel[1];
                    pasteData.data[i+2] = currentUnderlyingPixel[2];
                    pasteData.data[i+3] = currentUnderlyingPixel[3];
                }
            }
        }

        finalContext.putImageData(pasteData, 0, 0);
    }

    /** Tells if a pixel is empty (has alpha = 0)
     * 
     * @param {*} pixel 
     */
    static isPixelEmpty(pixel) {
        if (pixel == null || pixel === undefined) {
            return false;
        }
        
        // If the alpha channel is 0, the current pixel is empty
        if (pixel[3] == 0) {
            return true;
        }
        
        return false;
    }

    /** Tells if element is a child of an element with class className
     * 
     * @param {*} element 
     * @param {*} className 
     */
    static isChildOfByClass(element, className) {
        // Getting the element with class className
        while (element != null && element.classList != null && !element.classList.contains(className)) {
            element = element.parentElement;
        }

        // If that element exists and its class is the correct one
        if (element != null && element.classList != null && element.classList.contains(className)) {
            // Then element is a chld of an element with class className
            return true;
        }

        return false;
    }

    /** Returns elementOrElementId if the argument is already an element, otherwise it finds
     *  the element by its ID (given by the argument) and returns it
     * 
     * @param {*} elementOrElementId The element to return, or the ID of the element to return
     * @returns The desired element
     */
    static getElement(elementOrElementId) {
        if (typeof(elementOrElementId) == "object") {
            return elementOrElementId;
        }
        else if (typeof(elementOrElementId) == "string") {
            return document.getElementById(elementOrElementId);
        }
        else {
            ////console.log("Type not supported: " + typeof(elementOrElementId));
        }
    }

    // Returns the text content of the element with ID elementId
    static getText(elementId) {
        return Util.getElement(elementId).textContent;
    }
    // Sets the text content of the element with ID elementId
    static setText(elementId, text) {
        Util.getElement(elementId).textContent = text;
    }

    // Gets the value of the element with ID elementId
    static getValue(elementId) {
        return Util.getElement(elementId).value;
    }
    // Sets the value of the element with ID elementId
    static setValue(elementId, value) {
        Util.getElement(elementId).value = value;
    }

    //add class .selected to specified element
    static select(elementId) {
        Util.getElement(elementId).classList.add('selected');
    }
    //remove .selected class from specified element
    static deselect(elementId) {
        Util.getElement(elementId).classList.remove('selected');
    }
    //toggle the status of the .selected class on the specified element
    static toggle(elementId) {
        Util.getElement(elementId).classList.toggle('selected');
    }

    static getPixelColor(data, x, y, dataWidth) {
        let pos = (y * dataWidth + x) * 4;
        return [data[pos], data[pos+1], data[pos+2], data[pos + 3]];
    }

    static isPixelTransparent(data, x, y, dataWidth) {
        return this.getPixelColor(data, x, y, dataWidth)[3] == 255;
    }

    static cursorInCanvas(canvasSize, mousePos) {
        return mousePos[0] >= 0 && mousePos[1] >= 0 && canvasSize[0] > mousePos[0] && canvasSize[1] > mousePos[1];
    }

    static getFileExtension(fileName) {
        return (fileName.substring(fileName.lastIndexOf('.')+1, fileName.length) || fileName).toLowerCase();
    }

    static getCanvasBorders() {

    }

    /**
     * Determines the x and y offset for drawing images at a specific point 'topleft', 'middle', etc.
     * 
     * @param {*} pivot A string representing the position of the pivot 'topleft', 'middle', etc.
     * @param {*} width Width of the bounds often represents the canvas width.
     * @param {*} height Height of the bounds often represents the canvas height.
     * @param {*} imageWidth Substracts the offset from calculated x position of the pivot. Defaults to 0.
     * @param {*} imageHeight Subtracts the offset from the calculated y position of the pivot. Defaults to 0.
     * 
     * @returns Object containing the x and y offset for the pivot.
     */
    static getPivotPosition(pivot, width, height, imageWidth = 0, imageHeight = 0) {
        let position = {
            x: 0,
            y: 0
        };

        let centerX = width / 2;
        let centerY = height / 2;

        switch (pivot)
        {
            case 'topleft':
                position.x = 0;
                position.y = 0;
                break;
            case 'top':
                position.x = centerX - (imageWidth / 2);
                position.y = 0;
                break;
            case 'topright':
                position.x = width - imageWidth;
                position.y = 0;
                break;
            case 'left':
                position.x = 0;
                position.y = centerY - (imageHeight / 2);
                break;
            case 'middle':
                position.x = centerX - (imageWidth / 2);
                position.y = centerY - (imageHeight / 2);
                break;
            case 'right':
                position.x = width - imageWidth;
                position.y = centerY - (imageHeight / 2);
                break;
            case 'bottomleft':
                position.x = 0;
                position.y = height - imageHeight;
                break;
            case 'bottom':
                position.x = centerX - (imageWidth / 2);
                position.y = height - imageHeight;
                break;
            case 'bottomright':
                position.x = width - imageWidth
                position.y = height - imageHeight;
                break;
            default:
                break;
        }

        return position;
    }

    /**
     * @param {*} any An input number validator
     */
    static numberValidator(param) {
        if (typeof param == 'string') {
            if (param.includes('.')) return false
        } else if (typeof param == 'number') {
            if (param.toString().includes('.')) return false
        }
        if (Number.isNaN(param)) return false
        const num = parseInt(param)
        if (param != num) return false
        if (num && num > 0 && num <= 5000) return true
        else return false
    }   

    /**
     * @param {*} param An simple warning injection
     * @param {*} kind A a string id to identify the warn element
     */
    static warnInjection(param, kind) {
        if (!param) return;
        const element = document.createElement('span')
        element.setAttribute('id', kind)
        element.textContent = param
        return element
    }   
}