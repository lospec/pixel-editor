const TopMenuModule = (() => {

    const mainMenuItems = document.getElementById('main-menu').children;

    initMenu();

    function initMenu() {
        //for each button in main menu (starting at 1 to avoid logo)
        for (let i = 1; i < mainMenuItems.length; i++) {

            //get the button that's in the list item
            const menuItem = mainMenuItems[i];
            const menuButton = menuItem.children[0];

            //when you click a main menu items button
            Events.on('click', menuButton, function (e) {
                // Select the item
                Util.select(e.target.parentElement);
            });

            const subMenu = menuItem.children[1];
            const subMenuItems = subMenu.children;

            //when you click an item within a menu button
            for (var j = 0; j < subMenuItems.length; j++) {

                const currSubmenuItem = subMenuItems[j];
                const currSubmenuButton = currSubmenuItem.children[0];

                switch (currSubmenuButton.textContent) {
                    case 'New':
                        Events.on('click', currSubmenuButton, Dialogue.showDialogue, 'new-pixel');
                        break;
                    case 'Save project':
                        Events.on('click', currSubmenuButton, FileManager.openSaveProjectWindow);
                        break;
                    case 'Open':
                        Events.on('click', currSubmenuButton, FileManager.open);
                        break;
                    case 'Export':
                        Events.on('click', currSubmenuButton, FileManager.openPixelExportWindow);
                        break;
                    case 'Exit':
                        //if a document exists, make sure they want to delete it
                        if (Startup.documentCreated()) {
                            //ask user if they want to leave
                            if (confirm('Exiting will discard your current pixel. Are you sure you want to do that?'))
                                //skip onbeforeunload prompt
                                window.onbeforeunload = null;
                            else
                                e.preventDefault();
                        }
                        break;
                    // REFACTOR: move the binding to the Selection IIFE or something like that once it's done
                    case 'Paste':
                        Events.on('click', currSubmenuButton, pasteSelection);
                        break;
                    case 'Copy':
                        Events.on('click', currSubmenuButton, copySelection);
                        break;
                    case 'Cut':
                        Events.on('click', currSubmenuButton, cutSelectionTool);
                        break;
                    case 'Cancel':
                        //Events.on('click', currSubmenuButton, tool.pencil.switchTo);
                        break;
                        //Help Menu
                    case 'Settings':
                        //fill form with current settings values
                        //Util.setValue('setting-numberOfHistoryStates', settings.numberOfHistoryStates);
                        Events.on('click', currSubmenuButton, Dialogue.showDialogue, 'settings');
                        break;
                    case 'Help':
                        Events.on('click', currSubmenuButton, Dialogue.showDialogue, 'help');
                        break;
                    case 'About':
                        Events.on('click', currSubmenuButton, Dialogue.showDialogue, 'about');
                        break;
                    case 'Changelog':
                        Events.on('click', currSubmenuButton, Dialogue.showDialogue, 'changelog');
                        break;
                }
            }
        }
    }

    function closeMenu () {
        //remove .selected class from all menu buttons
        for (var i = 0; i < mainMenuItems.length; i++) {
            Util.deselect(mainMenuItems[i]);
        }
    }

    return {
        closeMenu
    }
})();