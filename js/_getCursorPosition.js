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

    return [x,y];
}

// TODO: apply the function below to every getCursorPosition call

// TODO: FIX THIS BELOW

//get cursor position relative to canvas
function getCursorPositionRelative(e, layer) {
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

    x -= layer.canvas.offsetLeft;
    y -= layer.canvas.offsetTop;

    return [x,y];
}
