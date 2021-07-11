// OPTIMIZABLE: add a normalize function that returns the normalized colour in the current
// format.
class Color {
    constructor(fmt, v1, v2, v3, v4) {
        this.fmt = fmt;

        switch (fmt) {
            case 'hsv':
                this.hsv = {h: v1, s: v2, v: v3};
                this.rgb = Color.hsvToRgb(this.hsv);
                this.hsl = Color.rgbToHsl(this.rgb);
                this.hex = Color.rgbToHex(this.rgb);
                break;
            case 'hsl':
                this.hsl = {h: v1, s: v2, l: v3};
                this.rgb = Color.hslToRgb(this.hsl);
                this.hsv = Color.rgbToHsv(this.rgb);
                this.hex = Color.rgbToHex(this.rgb);
                break;
            case 'rgb':
                this.rgb = {r: v1, g: v2, b: v3};
                this.hsl = Color.rgbToHsl(this.rgb);
                this.hsv = Color.rgbToHsv(this.rgb);
                this.hex = Color.rgbToHex(this.rgb);
                break;
            case 'hex':
                this.hex = v1;
                this.rgb = Color.hexToRgb(this.hex);
                this.hsl = Color.rgbToHsl(this.rgb);
                this.hsv = Color.rgbToHsv(this.rgb);
                break;
            default:
                console.error("Unsupported color mode " + fmt);
                break;
        }
    }
    
    static hexToRgb(hex, divisor) {
        //if divisor isn't set, set it to one (so it has no effect)
        divisor = divisor || 1;
        //split given hex code into array of 3 values
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());

        return result ? {
            r: parseInt(result[1], 16)/divisor,
            g: parseInt(result[2], 16)/divisor,
            b: parseInt(result[3], 16)/divisor
        } : null;
    }
    static rgbToHex(rgb) {
        //convert a decimal number to 2-digit hex
        let hex = "";
        Object.values(rgb).forEach((color) => {
            let colorToString = color.toString(16);
            if (colorToString.length === 1) {
                colorToString = "0" + colorToString;
            }
            hex += colorToString;
        });
        return hex;
    }

    static hslToRgb(hsl) {
        let r, g, b;
        let h = hsl.h, s = hsl.s, l = hsl.l;

        h /= 255;
        s /= 255;
        l /= 255;        

        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            const hue2rgb = function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return {
            r:Math.round(r * 255), 
            g:Math.round(g * 255), 
            b:Math.round(b * 255)
        };
    }
    static rgbToHsl(rgb) {
        let r, g, b;
        r = rgb.r; g = rgb.g; b = rgb.b;

        r /= 255, g /= 255, b /= 255;
        
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let hue, saturation, luminosity = (max + min) / 2;

        if(max == min){
            hue = saturation = 0; // achromatic
        }else{
            const d = max - min;
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

    static hsvToRgb(hsv) {
        let r, g, b, h, s, v;
        h = hsv.h; s = hsv.s; v = hsv.v;
    
        h /= 360;
        s /= 100;
        v /= 100;

        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
    
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
    
        return {r: r * 255, g: g * 255, b: b * 255 };
    }
    static rgbToHsv(rgb) {
        let r = rgb.r, g = rgb.g, b = rgb.b;
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
    
        return {h: myH * 360, s: myS * 100, v: myV * 100};
    }
}