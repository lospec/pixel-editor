const ToolManager = (() => {
    tools = {};
    isPanning = false;

    tools["brush"] = new BrushTool("brush", {type: 'html'}, switchTool);
    tools["eraser"] = new EraserTool("eraser", {type: 'html'}, switchTool);
    tools["rectangle"] = new RectangleTool("rectangle", {type: 'html'}, switchTool);
    tools["line"] = new LineTool("line", {type: 'html'}, switchTool);
    tools["ellipse"] = new EllipseTool("ellipse", {type: 'html'}, switchTool);
    tools["fill"] = new FillTool("fill", {type: 'cursor', style: 'crosshair'}, switchTool);
    
    tools["eyedropper"] = new EyeDropperTool("eyedropper", {type: 'cursor', style: 'crosshair'}, switchTool);
    tools["pan"] = new PanTool("pan", {type: 'custom'}, switchTool);
    tools["zoom"] = new ZoomTool("zoom", {type:'custom'});

    tools["moveselection"] = new MoveSelectionTool("moveselection", 
        {type:'cursor', style:'crosshair'}, switchTool, tools["brush"]);
    tools["rectselect"] = new RectangularSelectionTool("rectselect", 
        {type: 'cursor', style:'crosshair'}, switchTool, tools["moveselection"]);
    tools["lassoselect"] = new LassoSelectionTool("lassoselect", 
        {type: 'cursor', style:'crosshair'}, switchTool, tools["moveselection"]);
    tools["magicwand"] = new MagicWandTool("magicwand", 
        {type: 'cursor', style:'crosshair'}, switchTool, tools["moveselection"]);
    
    currTool = tools["brush"];
    currTool.onSelect();
    currFile.canvasView.style.cursor = 'default';

    Events.on("mouseup", window, onMouseUp);
    Events.on("mousemove", window, onMouseMove);
    Events.on("mousedown", window, onMouseDown);
    Events.on("wheel", window, onMouseWheel);

    // Assign a selection tool to the move tool
    tools["moveselection"].selectionTool = tools["lassoselect"];

    // Bind tool shortcuts
    Events.onCustom("tool-shortcut", onShortcut);

    function onShortcut(tool) {
        if (!EditorState.documentCreated || Dialogue.isOpen())
            return;
        switchTool(tools[tool]);
    }

    function onMouseWheel(mouseEvent) {
        if (!EditorState.documentCreated || Dialogue.isOpen())
            return;

        let mousePos = Input.getCursorPosition(mouseEvent);
        tools["zoom"].onMouseWheel(mousePos, mouseEvent.deltaY < 0 ? 'in' : 'out');
    }

    function onMouseDown(mouseEvent) {
        if (!EditorState.documentCreated() || Dialogue.isOpen())
            return;

        let mousePos = Input.getCursorPosition(mouseEvent);

        if (!Input.isDragging()) {
            switch(mouseEvent.which) {
                case 1:
                    if (Input.isSpacePressed()) {
                        tools["pan"].onStart(mousePos, mouseEvent.target);
                    }
                    else if (Input.isAltPressed()) {
                        tools["eyedropper"].onStart(mousePos, mouseEvent.target);
                    }
                    else if (!currFile.currentLayer.isLocked || !((Object.getPrototypeOf(currTool) instanceof DrawingTool))) {
                        currTool.onStart(mousePos, mouseEvent.target);
                    }
                    break;
                case 2:
                    tools["pan"].onStart(mousePos, mouseEvent.target);
                    break;
                case 3:
                    currTool.onRightStart(mousePos, mouseEvent.target);
                    break;
                default:
                    break;
            }
        }        
    }

    function onMouseMove(mouseEvent) {
        if (!EditorState.documentCreated() || Dialogue.isOpen())
            return;
        let mousePos = Input.getCursorPosition(mouseEvent);
        // Call the hover event
        currTool.onHover(mousePos, mouseEvent.target);

        if (Input.isDragging()) {
            switch (mouseEvent.buttons) {
                case 1:
                    if (Input.isSpacePressed()) {
                        tools["pan"].onDrag(mousePos, mouseEvent.target);
                    }
                    else if (Input.isAltPressed()) {
                        tools["eyedropper"].onDrag(mousePos, mouseEvent.target);
                    }
                    else if (!currFile.currentLayer.isLocked || !((Object.getPrototypeOf(currTool) instanceof DrawingTool))){
                        currTool.onDrag(mousePos, mouseEvent.target);
                    }
                    break;
                case 4:
                    tools["pan"].onDrag(mousePos, mouseEvent.target);
                    break;
                case 2:
                    currTool.onRightDrag(mousePos, mouseEvent.target);
                    break;
                default:
                    console.log("wtf");
                    break;
            }
        }
    }

    function onMouseUp(mouseEvent) {
        if (!EditorState.documentCreated())
            return;
        let mousePos = Input.getCursorPosition(mouseEvent);

        if (Input.isDragging()) {
            switch(mouseEvent.which) {
                case 1:
                    if (Input.isSpacePressed()) {
                        tools["pan"].onEnd(mousePos, mouseEvent.target);
                    }
                    else if (Input.isAltPressed()) {
                        tools["eyedropper"].onEnd(mousePos, mouseEvent.target);
                    }
                    else if (!currFile.currentLayer.isLocked || !((Object.getPrototypeOf(currTool) instanceof DrawingTool))) {
                        currTool.onEnd(mousePos, mouseEvent.target);
                    }
                    break;
                case 2:
                    tools["pan"].onEnd(mousePos, mouseEvent.target);
                    break;
                case 3:
                    currTool.onRightEnd(mousePos, mouseEvent.target);
                    break;
                default:
                    break;
            }
        }
    }

    function currentTool() {
        return currTool;
    }

    function switchTool(newTool, event) {
        currTool.onDeselect();
        currTool = newTool;
        currTool.onSelect();

        if (event != undefined)
            event.stopPropagation();
    }

    return {
        currentTool
    }
})();