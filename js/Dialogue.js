/** Handles the pop up windows (NewPixel, ResizeCanvas ecc)
 * 
 */
const Dialogue = (() => {
    let currentOpenDialogue = "";
    let dialogueOpen = true;

    const popUpContainer = document.getElementById("pop-up-container");
    const cancelButtons = popUpContainer.getElementsByClassName('close-button');

    // Add click handlers for all cancel buttons
    for (var i = 0; i < cancelButtons.length; i++) {
        cancelButtons[i].addEventListener('click', function () {
            closeDialogue();
        });
    }

    /** Closes a dialogue window if the user clicks everywhere but in the current window
     * 
     */
     popUpContainer.addEventListener('click', function (e) {
        if (e.target == popUpContainer)
            closeDialogue();
    });

    /** Shows the dialogue window called dialogueName, which is a child of pop-up-container in pixel-editor.hbs
     * 
     * @param {*} dialogueName The name of the window to show
     * @param {*} trackEvent Should I track the GA event?
     */
    function showDialogue (dialogueName, trackEvent) {
        if (typeof trackEvent === 'undefined') trackEvent = true; 

        // Updating currently open dialogue
        currentOpenDialogue = dialogueName;
        // The pop up window is open
        dialogueOpen = true;
        // Showing the pop up container
        popUpContainer.style.display = 'block';

        // Showing the window
        document.getElementById(dialogueName).style.display = 'block';

        // If I'm opening the palette window, I initialize the colour picker
        if (dialogueName == 'palette-block' && documentCreated) {
            cpInit();
            pbInit();
        }

        //track google event
        if (trackEvent && typeof ga !== 'undefined')
            ga('send', 'event', 'Palette Editor Dialogue', dialogueName); /*global ga*/
    }

    /** Closes the current dialogue by hiding the window and the pop-up-container
     * 
     */
    function closeDialogue () {
        popUpContainer.style.display = 'none';
        var popups = popUpContainer.children;

        for (var i = 0; i < popups.length; i++) {
            popups[i].style.display = 'none';
        }

        dialogueOpen = false;

        if (currentOpenDialogue == "palette-block") {
            ColorModule.addToSimplePalette();
        }
    }

    function isOpen() {
        return dialogueOpen;
    }

    return {
        showDialogue,
        closeDialogue,
        isOpen
    }
})();

console.log("Dialog: " + Dialogue);