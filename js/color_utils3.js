// Min distance under which 2 colours are considered similar
let distanceThreshold = 10;

// Threshold used to consider a colour "dark"
let darkColoursThreshold = 50;
// Threshold used to tell if 2 dark colours are similar
let darkColoursSimilarityThreshold = 40;

// Threshold used to consider a colour "light"
let lightColoursThreshold = 190;
// Threshold used to tell if 2 light colours are similar
let lightColoursSimilarityThreshold = 30;

let referenceWhite = {
    x: 95.05,
    y: 100,
    z: 108.89999999999999
};
const example = {
    "red": [
        "#bf6f4a",
        "#e07438",
        "#c64524",
        "#ff5000"
    ],
    "green": [
        "#99e65f",
        "#5ac54f",
        "#33984b"
    ],
    "blue": [
        "#0069aa",
        "#0098dc",
        "#00cdf9"
    ],
    "cyan": [
        "#0069aa",
        "#0098dc",
        "#00cdf9",
        "#0cf1ff"
    ],
    "yellow": [
        "#ffa214",
        "#ffc825",
        "#ffeb57"
    ],
    "magenta": [
        "#db3ffd"
    ],
    "light": [
        "#ffffff",
        "#f9e6cf",
        "#fdd2ed"
    ],
    "dark": [
        "#131313",
        "#1b1b1b",
        "#272727",
        "#3d3d3d",
        "#5d5d5d"
    ],
    "brown": [
        "#e69c69",
        "#f6ca9f",
        "#f9e6cf",
        "#edab50",
        "#e07438",
        "#ed7614",
        "#ffa214",
        "#ffc825",
        "#ffeb57"
    ],
    "neon": [
        "#ff0040",
        "#ff5000",
        "#ed7614",
        "#ffa214",
        "#ffc825",
        "#0098dc",
        "#00cdf9",
        "#0cf1ff",
        "#7a09fa",
        "#3003d9"
    ]
};
const COLOR_META = {
    red:			{	color: "#ff0000", flux:{	h:25, v:40, s:40}	},
    green:			{	color: "#00ff00", flux:{	h:35}	},
    blue:			{	color: "#0077dd", flux:{	h:25, v:30, s:30}	},
    cyan:			{	color: "#00ffff", flux:{	h:25, v:40, s:40}	},
    yellow:			{	color: "#ffff00", flux:{	h:25, v:40, s:40}	},
    magenta:		{	color: "#ff00ff", flux:{	h:15, v:40, s:40}	},
    light:			{	color: "#ffffff", flux:{	v:10, s:30}	},
    dark:			{	color: "#000000", flux:{	v:30, v:40, s:20}	},
    brown:			{	color: "#ffaa00", flux:{	h:20}	},
    neon:			{	color: "#00ffff", flux:{	s:20, v:20}	},
};
Object.keys(COLOR_META).forEach(metaName=>{
    COLOR_META[metaName].colorMeta = colorMeta(COLOR_META[metaName].color);
});
function paletteMeta(colorArr) {
    const colorMetaArr = colorArr.map(colorMeta);
    //////console.log('colorMetaArr === ',colorMetaArr);

    const ret = {};
    Object.keys(COLOR_META).forEach(metaName=>{
        const {color,colorMeta,flux} = COLOR_META[metaName];

        const fluxKeys = Object.keys(flux);

        ret[metaName] = colorArr.filter((c,i)=>{
            const colorMeta2 = colorMetaArr[i];
            return fluxKeys.filter(k=>{
                return (colorMeta[k] + flux[k]) > colorMeta2[k]
                    &&
                    (colorMeta[k] - flux[k]) < colorMeta2[k]
                    ;
            }).length === fluxKeys.length;
        });

    });
    //////console.log(JSON.stringify(ret,null,4));
    return ret;
}
function colorMeta(colorStr) {
    const rgb = colorToRGB(colorStr);
    const hsv = rgb2hsv(rgb.r, rgb.g, rgb.b);
    const lab = rgb2lab(rgb.r, rgb.g, rgb.b);
    const cie = {c:lab.l,i:lab.a,e:lab.b};
    return {
        ...rgb,
        ...hsv,
        ...cie
    };
}
function rgb2hex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function rgb2hsv(r, g, b) {
    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs),
    diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => Math.round(num * 100) / 100;
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: percentRoundFn(s * 100),
        v: percentRoundFn(v * 100)
    };
}

function similarColors(rgb1, rgb2) {
    let ret = differenceCiede2000(rgb1, rgb2)
    //////console.log(ret);
    return (ret < distanceThreshold && lightColoursCheck(rgb1, rgb2)) || darkColoursCheck(rgb1, rgb2);
}
function lightColoursCheck(rgb1, rgb2) {
    let rDelta = Math.abs(rgb1.r - rgb2.r);
    let gDelta = Math.abs(rgb1.g - rgb2.g);
    let bDelta = Math.abs(rgb1.b - rgb2.b);

    // Checking only if the colours are dark enough
    if (rgb1.r > lightColoursThreshold && rgb1.g > lightColoursThreshold && rgb1.b > lightColoursThreshold &&
        rgb2.r > lightColoursThreshold && rgb2.g > lightColoursThreshold && rgb2.b > lightColoursThreshold) {
        return rDelta < lightColoursSimilarityThreshold && gDelta < lightColoursSimilarityThreshold &&
            bDelta < lightColoursSimilarityThreshold;
    }

    return true;
}
function darkColoursCheck(rgb1, rgb2) {
    let rDelta = Math.abs(rgb1.r - rgb2.r);
    let gDelta = Math.abs(rgb1.g - rgb2.g);
    let bDelta = Math.abs(rgb1.b - rgb2.b);

    // Checking only if the colours are dark enough
    if (rgb1.r < darkColoursThreshold && rgb1.g < darkColoursThreshold && rgb1.b < darkColoursThreshold &&
        rgb2.r < darkColoursThreshold && rgb2.g < darkColoursThreshold && rgb2.b < darkColoursThreshold) {
        return rDelta < darkColoursSimilarityThreshold && gDelta < darkColoursSimilarityThreshold &&
            bDelta < darkColoursSimilarityThreshold;
    }

    return false;
}
// Distance based on CIEDE2000 (https://en.wikipedia.org/wiki/Color_difference#CIEDE2000)
function differenceCiede2000(rgb1, rgb2) {
    var kL = 1,
        kC = 1,
        kH = 0.9;
    var LabStd = rgb2lab(rgb1);
    var LabSmp = rgb2lab(rgb2);

    var lStd = LabStd.l;
    var aStd = LabStd.a;
    var bStd = LabStd.b;
    var cStd = Math.sqrt(aStd * aStd + bStd * bStd);

    var lSmp = LabSmp.l;
    var aSmp = LabSmp.a;
    var bSmp = LabSmp.b;
    var cSmp = Math.sqrt(aSmp * aSmp + bSmp * bSmp);

    var cAvg = (cStd + cSmp) / 2;

    var G = 0.5 * (1 - Math.sqrt(Math.pow(cAvg, 7) / (Math.pow(cAvg, 7) + Math.pow(25, 7))));

    var apStd = aStd * (1 + G);
    var apSmp = aSmp * (1 + G);

    var cpStd = Math.sqrt(apStd * apStd + bStd * bStd);
    var cpSmp = Math.sqrt(apSmp * apSmp + bSmp * bSmp);

    var hpStd = Math.abs(apStd) + Math.abs(bStd) === 0 ? 0 : Math.atan2(bStd, apStd);
    hpStd += (hpStd < 0) * 2 * Math.PI;

    var hpSmp = Math.abs(apSmp) + Math.abs(bSmp) === 0 ? 0 : Math.atan2(bSmp, apSmp);
    hpSmp += (hpSmp < 0) * 2 * Math.PI;

    var dL = lSmp - lStd;
    var dC = cpSmp - cpStd;

    var dhp = cpStd * cpSmp === 0 ? 0 : hpSmp - hpStd;
    dhp -= (dhp > Math.PI) * 2 * Math.PI;
    dhp += (dhp < -Math.PI) * 2 * Math.PI;

    var dH = 2 * Math.sqrt(cpStd * cpSmp) * Math.sin(dhp / 2);

    var Lp = (lStd + lSmp) / 2;
    var Cp = (cpStd + cpSmp) / 2;

    var hp;
    if (cpStd * cpSmp === 0) {
        hp = hpStd + hpSmp;
    } else {
        hp = (hpStd + hpSmp) / 2;
        hp -= (Math.abs(hpStd - hpSmp) > Math.PI) * Math.PI;
        hp += (hp < 0) * 2 * Math.PI;
    }

    var Lpm50 = Math.pow(Lp - 50, 2);
    var T = 1 -
        0.17 * Math.cos(hp - Math.PI / 6) +
        0.24 * Math.cos(2 * hp) +
        0.32 * Math.cos(3 * hp + Math.PI / 30) -
        0.20 * Math.cos(4 * hp - 63 * Math.PI / 180);

    var Sl = 1 + (0.015 * Lpm50) / Math.sqrt(20 + Lpm50);
    var Sc = 1 + 0.045 * Cp;
    var Sh = 1 + 0.015 * Cp * T;

    var deltaTheta = 30 * Math.PI / 180 * Math.exp(-1 * Math.pow((180 / Math.PI * hp - 275) / 25, 2));
    var Rc = 2 * Math.sqrt(
        Math.pow(Cp, 7) / (Math.pow(Cp, 7) + Math.pow(25, 7))
    );

    var Rt = -1 * Math.sin(2 * deltaTheta) * Rc;

    return Math.sqrt(
        Math.pow(dL / (kL * Sl), 2) +
        Math.pow(dC / (kC * Sc), 2) +
        Math.pow(dH / (kH * Sh), 2) +
        Rt * dC / (kC * Sc) * dH / (kH * Sh)
    );
}
function rgb2lab(r, g, b) {
    // Convert to XYZ first via matrix transformation
    let x = 0.412453 * r + 0.357580 * g + 0.180423 * b;
    let y = 0.212671 * r + 0.715160 * g + 0.072169 * b;
    let z = 0.019334 * r + 0.119193 * g + 0.950227 * b;

    let xFunc = CIELABconvF(x / referenceWhite.x);
    let yFunc = CIELABconvF(y / referenceWhite.y);
    let zFunc = CIELABconvF(z / referenceWhite.z);

    let myL = 116 * yFunc - 16;
    let myA = 500 * (xFunc - yFunc);
    let myB = 200 * (yFunc - zFunc);

    return {
        l: myL,
        a: myA,
        b: myB
    };

}

function CIELABconvF(value) {
    if (value > Math.pow(6 / 29, 3)) {
        return Math.cbrt(value);
    }
    return 1 / 3 * Math.pow(6 / 29, 2) * value + 4 / 29;
}

function colorToRGB(color) {
    if(window.colorCache && window.colorCache[color]){
        return window.colorCache[color];
    }
    if (!window.cachedCtx) {
        window.cachedCtx = document.createElement("canvas").getContext("2d");
        window.colorCache = {};
    }
    let ctx = window.cachedCtx;
    ctx.fillStyle = color;
    return hexToRgb(ctx.fillStyle);

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        };
    }
}