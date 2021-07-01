// NEXTPULL: to remove when the new palette system is added


//formats a color button
function initColor (colorElement) {
    //console.log('initColor()');
    //console.log(document.getElementById('jscolor-hex-input'))


    //add jscolor picker for this color
    colorElement.jscolor = new jscolor(colorElement.parentElement, {	
        valueElement: null, //if you dont set this to null, it turns the button (colorElement) into text, we set it when you open the picker
        styleElement: colorElement,
        width:151, 
        position: 'left', 
        padding:0, 
        borderWidth:14, 
        borderColor: '#332f35',
        backgroundColor: '#332f35', 
        insetColor: 'transparent',
        value: colorElement.style.backgroundColor,
        deleteButton: true,
    });

}
