// Acts as a public static class
class Util {
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
    static getText(elementId) {
        return Util.getElement(elementId).textContent;
    }

    static setText(elementId, text) {
        Util.getElement(elementId).textContent = text;
    }
    static getValue(elementId) {
        return Util.getElement(elementId).value;
    }
    
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