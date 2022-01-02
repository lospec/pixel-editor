// Acts as a public static class
class Util {

    /** Colors a pixel in an image data
     * 
     * @param {*} tempImage The imagedata to paint
     * @param {*} pixelPos Index of the pixel
     * @param {*} fillColor Color to use to paint
     */
    static colorPixel(tempImage, pixelPos, fillColor) {
        //console.log('colorPixel:',pixelPos);
        tempImage.data[pixelPos] = fillColor.r;
        tempImage.data[pixelPos + 1] = fillColor.g;
        tempImage.data[pixelPos + 2] = fillColor.b;
        tempImage.data[pixelPos + 3] = 255;
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
            console.log("Type not supported: " + typeof(elementOrElementId));
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
}