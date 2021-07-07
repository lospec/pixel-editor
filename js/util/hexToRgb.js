//put in a hex color code (f464b2 or #f464b2) string 
//and get an rgb color object {r:0,g:0,b:0}
//divisor is an optional argument, which makes it so you can get values other than 0-255

function hexToRgb(hex, divisor) {
    //if divisor isn't set, set it to one (so it has no effect)
    divisor = divisor || 1;
    
    //split given hex code into array of 3 values
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
    
    //console.log('hex: '+hex)
    //console.log([parseInt(result[1], 16)/divisor, parseInt(result[2], 16)/divisor, parseInt(result[3], 16)/divisor])
    //console.log(result)
    
    return result ? {
        r: parseInt(result[1], 16)/divisor,
        g: parseInt(result[2], 16)/divisor,
        b: parseInt(result[3], 16)/divisor
    } : null;
}