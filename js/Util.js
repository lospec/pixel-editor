// Acts as a public static class
class Util {
    static getElement(elementOrElementId) {
        return typeof elementOrElementId
            ? document.getElementById(elementOrElementId)
            : elementOrElementId;
    }
    static getText(elementId) {
        return this.getElement(elementId).textContent;
    }

    static setText(elementId, text) {
        this.getElement(elementId).textContent = text;
    }
    static getValue(elementId) {
        return this.getElement(elementId).value;
    }
    
    static setValue(elementId, value) {
        this.getElement(elementId).value = value;
    }
    //add class .selected to specified element
    static select(elementId) {
        this.getElement(elementId).classList.add('selected');
    }
    
    //remove .selected class from specified element
    static deselect(elementId) {
        this.getElement(elementId).classList.remove('selected');
    }
    //toggle the status of the .selected class on the specified element
    static toggle(elementId) {
        this.getElement(elementId).classList.toggle('selected');
    }
}