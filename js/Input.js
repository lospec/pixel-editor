const Input = (() => {
    let spaceKeyPressed = false;
    let dragging = false;
    let currentMouseEvent = undefined;

    // Hotkeys when pressing a key
    Events.on("keydown", document, KeyPress);
    // Update held keys when releasing a key
    Events.on("keyup", window, function (e) {if (e.keyCode == 32) spaceKeyPressed = false;});

    // Update variables on mouse clicks
    Events.on("mousedown", window, onMouseDown);
    Events.on("mouseup", window, onMouseUp);

    function onMouseDown(event) {
        currentMouseEvent = event;
        dragging = true;
    }

    function onMouseUp(event) {
        currentMouseEvent = event;
        dragging = false;
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
        console.log("pressed key");

        //if the user is typing in an input field or renaming a layer, ignore these hotkeys, unless it's an enter key
        if (document.activeElement.tagName == 'INPUT' || LayerList.isRenamingLayer) {
            if (e.keyCode == 13) {
                console.log("here");
                LayerList.closeOptionsMenu();
            }
            return;
        }

        //if no document has been created yet,
        //orthere is a dialog box open
        //ignore hotkeys
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
                    tool.pencil.switchTo();
                    break;
                // copy tool c
                case 67: case 99:
                    if (keyboardEvent.ctrlKey && !dragging && currentTool.name == 'moveselection') {
                        copySelection();
                    }
                    break;
                //fill tool - 2, f
                case 50: case 70:
                    tool.fill.switchTo();
                    break;
                //eyedropper - 3, e
                case 51: case 69:
                    tool.eyedropper.switchTo();
                    break;
                //pan - 4, p,
                case 52: case 80:
                    tool.pan.switchTo();
                    break;
                case 76:
                    tool.line.switchTo();
                    break;
                //zoom - 5
                case 53:
                tool.zoom.switchTo();
                break;
                // eraser -6, r
                case 54: case 82:
                    tool.eraser.switchTo()
                    break;
                // Rectangular selection
                case 77: case 109:
                    tool.rectselect.switchTo()
                    break;
                // TODO: [ELLIPSE] Decide on a shortcut to use. "s" was chosen without any in-team consultation.
                // ellipse tool, s
                case 83:
                    tool.ellipse.switchTo()
                    break;
                // rectangle tool, u
                case 85:
                    tool.rectangle.switchTo()
                    break;
                // Paste tool
                case 86: case 118:
                    if (keyboardEvent.ctrlKey && !dragging) {
                        pasteSelection();
                    }
                    break;
                case 88: case 120:
                    if (keyboardEvent.ctrlKey && !dragging && currentTool.name == 'moveselection') {
                        cutSelectionTool();
                        tool.pencil.switchTo();
                    }
                    break;
                //Z
                case 90:
                    //CTRL+ALT+Z redo
                    if (keyboardEvent.altKey && keyboardEvent.ctrlKey) {
                        History.redo();
                        if (!selectionCanceled) {
                            tool.pencil.switchTo()
                        }
                    }
                    //CTRL+Z undo
                    else if (keyboardEvent.ctrlKey) {
                        History.undo();
                        if (!selectionCanceled) {
                            tool.pencil.switchTo()
                        }
                    }
                    //Z switch to zoom tool
                    else
                        tool.zoom.switchTo()
                    break;
                //redo - ctrl y
                case 89:
                    if (keyboardEvent.ctrlKey)
                        History.redo();
                    break;
                case 32:
                    spaceKeyPressed=true;
                    break;
            }
        }
    }

    function spacePressed() {
        return spaceKeyPressed;
    }

    function isDragging() {
        return dragging;
    }

    function getCurrMouseEvent() {
        return currentMouseEvent;
    }

    return {
        spacePressed,
        isDragging,
        getCurrMouseEvent,
        getCursorPosition
    }
})();