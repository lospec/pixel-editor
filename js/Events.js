class Events {
    /** Used to programmatically create an input event
     * 
     * @param {*} keyCode KeyCode of the key to press
     * @param {*} ctrl Is ctrl pressed?
     * @param {*} alt Is alt pressed?
     * @param {*} shift Is shift pressed?
     */
    static simulateInput(keyCode, ctrl, alt, shift) {
        // I just copy pasted this from stack overflow lol please have mercy
        let keyboardEvent = document.createEvent("KeyboardEvent");
        let initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";

        keyboardEvent[initMethod](
        "keydown", // event type: keydown, keyup, keypress
        true,      // bubbles
        true,      // cancelable
        window,    // view: should be window
        ctrl,     // ctrlKey
        alt,     // altKey
        shift,     // shiftKey
        false,     // metaKey
        keyCode,        // keyCode: unsigned long - the virtual key code, else 0
        keyCode       // charCode: unsigned long - the Unicode character associated with the depressed key, else 0
        );
        document.dispatchEvent(keyboardEvent);
    }
    
    static on(event, elementId, functionCallback, ...args) {
        //if element provided is string, get the actual element
        const element = Util.getElement(elementId);

        element.addEventListener(event,
        function (e) {
            functionCallback(...args, e);
        });
    }

    static onChildren(event, parentElement, functionCallback, ...args) {
        parentElement = Util.getElement(parentElement);
        const children = parentElement.children;
        
        //loop through children and add onClick listener
        for (var i = 0; i < children.length; i++) {
            on(event, children[i], functionCallback, ...args);
        }
    }
}