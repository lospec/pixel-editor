class Input {
    static on(event, elementId, functionCallback, ...args) {
        //if element provided is string, get the actual element
        const element = Util.getElement(elementId);

        element.addEventListener(event,
        function (e) {
            // e = event
            //this = element clicked
            functionCallback(e, ...args);
            //if you need to access the event or this variable, you need to add them
            //when you define the callback, but you cant use the word this, eg:
            //on('click', menuButton, function (e, button) {});
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