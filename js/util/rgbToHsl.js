//put in red green blue values and get out hue saturation luminosity values

function rgbToHsl(argument0, g, b){
  var r;
  
  //if the first argument is an object
  if (typeof argument0 === 'object'){
    r = argument0.r;
    g = argument0.g;
    b = argument0.b;
  }
  else 
    r = argument0;
  
  
  
    r /= 255, g /= 255, b /= 255;
    
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var hue, saturation, luminosity = (max + min) / 2;

    if(max == min){
        hue = saturation = 0; // achromatic
    }else{
        var d = max - min;
        saturation = luminosity > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: hue = (g - b) / d + (g < b ? 6 : 0); break;
            case g: hue = (b - r) / d + 2; break;
            case b: hue = (r - g) / d + 4; break;
        }
        hue /= 6;
    }

    return {h:hue, s:saturation, l:luminosity};
}
