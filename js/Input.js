const Input = (() => {
    let dragging = false;
    let currentMouseEvent = undefined;
    let spacePressed = false;
    let altPressed = false;
    let ctrlPressed = false;

    // Hotkeys when pressing a key
    Events.on("keydown", document, KeyPress);
    // Update held keys when releasing a key
    Events.on("keyup", window, function (e) {
        if (e.keyCode == 32) spacePressed = false;
        if (!e.altKey) altPressed = false;
        if (!e.ctrlKey) ctrlPressed = false;
    });

    // Update variables on mouse clicks
    Events.on("mousedown", window, onMouseDown);
    Events.on("mouseup", window, onMouseUp);

    function onMouseDown(event) {
        currentMouseEvent = event;
        dragging = true;

        if (!Util.isChildOfByClass(event.target, "editor-top-menu")) {
            TopMenuModule.closeMenu();
        }
    }

    function onMouseUp(event) {
        currentMouseEvent = event;
        dragging = false;
        
        if (currentLayer != null && !Util.isChildOfByClass(event.target, "layers-menu-entry")) {
            LayerList.closeOptionsMenu();	
        }
    }

    function getCursorPosition(e) {
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
    
        x -= currentLayer.canvas.offsetLeft;
        y -= currentLayer.canvas.offsetTop;
    
        return [Math.round(x), Math.round(y)];
    }

    /** Just listens to hotkeys and calls the linked functions
     * 
     * @param {*} e 
     */
    function KeyPress(e) {
        var keyboardEvent = window.event? event : e;
        altPressed = e.altKey;
        ctrlPressed = e.ctrlKey;

        //if the user is typing in an input field or renaming a layer, ignore these hotkeys, unless it's an enter key
        if (document.activeElement.tagName == 'INPUT' || LayerList.isRenamingLayer()) {
            if (e.keyCode == 13) {
                LayerList.closeOptionsMenu();
            }
            return;
        }

        //if no document has been created yet or there is a dialog box open ignore hotkeys
        if (!Startup.documentCreated() || Dialogue.isOpen()) return;

        //
        if (e.key === "Escape") {
            if (!selectionCanceled) {
                tool.pencil.switchTo();
            }
        }
        else {
            switch (keyboardEvent.keyCode) {
                //pencil tool - 1, b
                case 49: case 66:
                    Events.emit("tool-shortcut", "brush");
                    break;
                // copy tool c
                case 67: case 99:
                    if (keyboardEvent.ctrlKey) {
                        Events.emit("ctrl+c");
                    }
                    break;
                //fill tool - 2, f
                case 50: case 70:
                    Events.emit("tool-shortcut", "fill");
                    break;
                //eyedropper - 3, e
                case 51: case 69:
                    Events.emit("tool-shortcut", "eyedropper");
                    break;
                //pan - 4, p,
                case 52: case 80:
                    Events.emit("tool-shortcut", "pan");
                    break;
                // line - l
                case 76:
                    Events.emit("tool-shortcut", "line");
                    break;
                // eraser -6, r
                case 54: case 82:
                    Events.emit("tool-shortcut", "eraser");
                    break;
                // Rectangular selection m
                case 77: case 109:
                    Events.emit("tool-shortcut", "rectselect");
                    break;
                // TODO: [ELLIPSE] Decide on a shortcut to use. "s" was chosen without any in-team consultation.
                // ellipse tool, s
                case 83:
                    //Events.emit("tool-shortcut", "ellipse");
                    break;
                // rectangle tool, u
                case 85:
                    Events.emit("tool-shortcut", "rectangle");
                    break;
                // Paste tool
                case 86: case 118:
                    if (keyboardEvent.ctrlKey) {
                        Events.emit("ctrl+v");
                    }
                    break;
                case 88: case 120:
                    if (keyboardEvent.ctrlKey) {
                        Events.emit("ctrl+x");
                    }
                    break;
                //Z
                case 90: case 122:
                    //CTRL+ALT+Z redo
                    if (keyboardEvent.altKey && keyboardEvent.ctrlKey) {
                        History.redo();
                    }
                    //CTRL+Z undo
                    else if (keyboardEvent.ctrlKey) {
                        History.undo();
                    }
                    break;
                //redo - ctrl y
                case 89:
                    if (keyboardEvent.ctrlKey)
                        History.redo();
                    break;
                case 32:
                    spacePressed = true;
                    break;
            }
        }
    }
    
    function isDragging() {
        return dragging;
    }

    function getCurrMouseEvent() {
        return currentMouseEvent;
    }

    function isAltPressed() {
        return altPressed;
    }

    function isCtrlPressed() {
        return ctrlPressed;
    }

    function isSpacePressed() {
        return spacePressed;
    }

    return {
        isDragging,
        getCurrMouseEvent,
        getCursorPosition,
        isAltPressed,
        isCtrlPressed,
        isSpacePressed
    }
})();