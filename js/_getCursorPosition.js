//get cursor position relative to canvas
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

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    return [Math.round(x), Math.round(y)];
}