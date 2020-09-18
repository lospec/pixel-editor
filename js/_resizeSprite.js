let resizeSpriteInitialized = false;

// Function to show dialogue
    // New size
    // Percentage change
    // Keep ratio checkbox
    // Choose resize algorithm
    // Confirm

    function openResizeSpriteWindow() {
        if (!resizeSpriteInitialized) {
            resizeSpriteInitialized = true;
            initResizeSpriteInputs();
        }
        showDialogue('resize-sprite');
    }
    
    function initResizeSpriteInputs() {
    /*
        document.getElementById("rc-width").value = layers[0].canvasSize[0];
        document.getElementById("rc-height").value = layers[0].canvasSize[1];
    
        document.getElementById("rc-border-left").addEventListener("change", changedBorder);
        document.getElementById("rc-border-right").addEventListener("change", changedBorder);
        document.getElementById("rc-border-top").addEventListener("change", changedBorder);
        document.getElementById("rc-border-bottom").addEventListener("change", changedBorder);
    
        document.getElementById("rc-width").addEventListener("change", changedSize);
        document.getElementById("rc-height").addEventListener("change", changedSize);
    
        document.getElementById("resize-canvas-confirm").addEventListener("click", resizeCanvas);
        console.log("Pivot selezionato: " + currentPivotObject);
        */
    }