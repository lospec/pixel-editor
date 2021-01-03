// CONSTS

// Degrees to radiants
let degreesToRad = Math.PI / 180;
// I'm pretty sure that precision is necessary
let referenceWhite = {x: 95.05, y: 100, z: 108.89999999999999};

/**********************SECTION: COLOUR CONVERSIONS****************************** */

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function cpHslToRgb(h, s, l){
    var r, g, b;
    
    h /= 360;
    s /= 100;
    l /= 100;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hsvToRgb(h, s, v) {
    var r, g, b;
  
    h /= 360;
    s /= 100;
    v /= 100;
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
  
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
  
    return [ r * 255, g * 255, b * 255 ];
}

function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = x => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl(col) {
    let r = col.r;
    let g = col.g;
    let b = col.b;

    r /= 255, g /= 255, b /= 255;
  
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let myH, myS, myL = (max + min) / 2;
  
    if (max == min) {
        myH = myS = 0; // achromatic
    } 
    else {
        let d = max - min;
        myS = myL > 0.5 ? d / (2 - max - min) : d / (max + min);
  
        switch (max) {
            case r: myH = (g - b) / d + (g < b ? 6 : 0); break;
            case g: myH = (b - r) / d + 2; break;
            case b: myH = (r - g) / d + 4; break;
        }
    
        myH /= 6;
    }
  
    return {h: myH, s: myS, l: myL };
}

  function rgbToHsv(col) {
    let r = col.r;
    let g = col.g; 
    let b = col.b;

    r /= 255, g /= 255, b /= 255;
  
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let myH, myS, myV = max;
  
    let d = max - min;
    myS = max == 0 ? 0 : d / max;
  
    if (max == min) {
      myH = 0; // achromatic
    } 
    else {
      switch (max) {
        case r: myH = (g - b) / d + (g < b ? 6 : 0); break;
        case g: myH = (b - r) / d + 2; break;
        case b: myH = (r - g) / d + 4; break;
      }
  
      myH /= 6;
    }
  
    return {h: myH, s: myS, v: myV};
  }

  function RGBtoCIELAB(rgbColour) {
    // Convert to XYZ first via matrix transformation
    let x = 0.412453 * rgbColour.r + 0.357580 * rgbColour.g + 0.180423 * rgbColour.b;
    let y = 0.212671 * rgbColour.r + 0.715160 * rgbColour.g + 0.072169 * rgbColour.b;
    let z = 0.019334 * rgbColour.r + 0.119193 * rgbColour.g + 0.950227 * rgbColour.b;

    let xFunc = CIELABconvF(x / referenceWhite.x);
    let yFunc = CIELABconvF(y / referenceWhite.y);
    let zFunc = CIELABconvF(z / referenceWhite.z);

    let myL = 116 * yFunc - 16;
    let myA = 500 * (xFunc - yFunc);
    let myB = 200 * (yFunc - zFunc);

    return {l: myL, a: myA, b: myB};

}
function CIELABconvF(value) {
    if (value > Math.pow(6/29, 3)) {
        return Math.cbrt(value);
    }

    return 1/3 * Math.pow(6/29, 2) * value + 4/29;
}