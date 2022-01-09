class MagicWandTool extends SelectionTool {
    constructor (name, options, switchFunc, moveTool) {
        super(name, options, switchFunc, moveTool);
        Events.on('click', this.mainButton, switchFunc, this);
    }

    onEnd(mousePos) {
        super.onStart(mousePos);
    }

    getSelection() {
        // this.currSelection should be filled

        this.drawSelectedArea();
    }
    
}