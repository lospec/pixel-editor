// Acts as a public static class
class Util {
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