class Input {
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