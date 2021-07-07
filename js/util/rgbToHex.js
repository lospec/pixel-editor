//convert rgb values to a hex string for html
function rgbToHex (argument0,g,b) {
  var r;
  
  //if the first argument is an object
  if (typeof argument0 === 'object'){
    r = argument0.r;
    g = argument0.g;
    b = argument0.b;
  }
  else 
    r = argument0;
  
  //console.log('converting rgb('+r+','+g+','+b+') to hex');
  
  //convert a decimal number to 2-digit hex
  function componentToHex (c) {
  	var hex = c.toString(16);
  	return hex.length == 1 ? "0" + hex : hex;
  }

	return componentToHex(r) + componentToHex(g) + componentToHex(b);
}
