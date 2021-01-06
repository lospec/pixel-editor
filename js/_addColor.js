let currentPalette = [];

/** Adds the given color to the palette
 * 
 * @param {*} newColor the colour to add
 * @return the list item containing the added colour
 */
function addColor (newColor) {
    //add # at beginning if not present
    if (newColor.charAt(0) != '#')
        newColor = '#' + newColor;
    currentPalette.push(newColor);
    //create list item
    var listItem = document.createElement('li');   

    //create button
    var button = document.createElement('button');
    button.classList.add('color-button');
    button.style.backgroundColor = newColor;
    button.addEventListener('mouseup', clickedColor);
    listItem.appendChild(button);
    listItem.classList.add("draggable-colour")

    //insert new listItem element at the end of the colors menu (right before add button)
    colorsMenu.insertBefore(listItem, colorsMenu.children[colorsMenu.children.length-1]);

    //add jscolor functionality
    initColor(button);

    //add edit button
    var editButtonTemplate = document.getElementsByClassName('color-edit-button')[0];
    newEditButton = editButtonTemplate.cloneNode(true);
    listItem.appendChild(newEditButton);

    //when you click the edit button
    on('click', newEditButton, function (event, button) {

        //hide edit button
        button.parentElement.lastChild.classList.add('hidden');

        //show jscolor picker, if basic mode is enabled
        if (pixelEditorMode == 'Basic')
            button.parentElement.firstChild.jscolor.show();
        else
            showDialogue("palette-block", false);
    });

    return listItem;
}

new Sortable(document.getElementById("colors-menu"), {
    animation:100,
    filter: ".noshrink",
    draggable: ".draggable-colour",
    onEnd: makeIsDraggingFalse
});