class SelectionTool extends Tool {
    switchFunc = undefined;
    moveTool = undefined;

    constructor(name, options, switchFunc, moveTool) {
        super(name, options);

        this.moveTool = moveTool;
        this.switchFunc = switchFunc;
    }

    cutSelection() {}

    pasteSelection(){}

    copySelection(){}
    
    cursorInSelectedArea(){}
}