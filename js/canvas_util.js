function drawTinyNumber(ctx,str,x,y) {
    const CHARS = [
            `0111110111011111`,
            `0110111001101111`,
            `1111001111001111`,
            `1111011100111111`,
            `1001100111110011`,
            `1111110000111111`,
            `1100111110111111`,
            `1111001101100110`,
            `1110101111010111`,
            `1111101111110011`,
        ]
        .map(n=>n.split("").map(Number))
        ;
    str.split("").reduce((xo,n)=>{
        let bitArr = CHARS[n];
        let cw = bitArr.length / 4;
        bitArr.forEach((bit,i)=>{
            const _x = x + xo + (i%cw);
            const _y = y + Math.floor(i/cw);
            if(bit)ctx.fillRect(_x,_y,1,1);
        });
        xo+=cw+1;
        return xo;
    },0);
}
function drawTinyText( ctx, str, x = 0, y = 0, font = "Verdana", w = 16, h = 16, xo = 0, yo = 0 ) {
    for(let i = 0; i < 4;i++){
        drawTinyTextOne( ctx, str, x, y, font, w, h, xo+0, yo+i );
    }
}
function drawTinyTextOne( ctx, str, x = 0, y = 0, font = "Verdana", w = 16, h = 16, xo = 0, yo = 0 ) {
    const CHARS = generateCharsFromFont(font, w, h, 8, 8, undefined, undefined, xo, yo)
        .map(n=>n.split("").map(Number))
        ;
    ////console.log('CHARS === ',CHARS);
    str.split("").reduce((_xo,n)=>{
        const code = n.charCodeAt(0) - 33;
        // ////console.log('n,code === ',n,code);
        let charWidth = CHARS[code].length / w;
        CHARS[code].forEach((bit,i)=>{
            const _x = x + _xo + (i%charWidth);
            const _y = y + Math.floor(i/charWidth);

            // ////console.log('bit === ',bit);
            if(bit)ctx.fillRect(_x,_y,1,1);
        });
        _xo+=charWidth+1;
        return _xo;
    },0);
}
function generateCharsFromFont(font, charW = 7, charH = 7, sampleScale = 8, scale = 8, previewDiv, debugDiv, xo = 0, yo = 0) {
    return [...Array(94)].map((_,i)=>{
        const char = String.fromCharCode(i+33);
        const canvas = document.createElement('canvas');
        if(debugDiv)debugDiv.appendChild(canvas);
        const sz = sampleScale;
        const w = charW * sz;
        const h = charH * sz;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.font = `${h}px ` + font;
        ctx.shadowColor="black";
        ctx.shadowBlur=sz*2;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillStyle = "black";
        ctx.fillText(char,w/2,h);
        ctx.strokeStyle = "black";
        ctx.strokeText(char,w/2,h);
        const imageData = ctx.getImageData(0,0,w,h);
        // ////console.log('imageData === ',imageData);
        let ret = '';
        ctx.fillStyle = "red";
        const previewCanvas = document.createElement('canvas');
        previewCanvas.width = charW;
        previewCanvas.height = charH;
        const ctx2 = previewCanvas.getContext('2d');
        if(previewDiv)previewDiv.appendChild(previewCanvas);
        
        for(let y = scale/2; y < h;y+=scale) {
            for(let x = scale/2; x < w;x+=scale) {
                const _x = (x-(scale/2))/scale;
                const _y = (y-(scale/2))/scale;
                const _imageData = ctx.getImageData(x+xo,y+yo,1,1);
                let specResult = _imageData.data[3] > 128;
                ctx2.fillStyle = "black";
                if(specResult) {
                    ctx2.fillRect(_x,_y,1,1);
                    ret += "1";
                } else {
                    ret += "0";
                }
                ctx.fillStyle = specResult ? "#00ff00" : "#ff0000";
                ctx.fillRect(x,y,1,1);
            }
        }
        return ret;
    })
}
function pixelButtonMeta(x, y, img, options) {
    return Object.entries(options).reduce((r,n,i)=>{
        const [k,v] = n;

    })
}
function pixelButton(x,y,xo,yo,img,colors=["#112","#334","#556","#778","#99A","#BBC"]) {
    const canvas = document.createElement('canvas');
    const w = img.width+4;
    const h = img.height+5;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = colors[0];
    ctx.fillRect(x+0+xo,y+yo,img.width+4,img.height+5);
    ctx.fillStyle = colors[1];
    ctx.fillRect(x+0+xo,y+yo,img.width+4,img.height+4);
    ctx.fillStyle = colors[3];
    ctx.fillRect(x+1+xo,y+yo,img.width+2,img.height+4);
    ctx.fillStyle = colors[3];
    ctx.fillRect(x+0+xo,y+yo,img.width+4,img.height+2);
    ctx.fillStyle = colors[2];
    ctx.fillRect(x+1+xo,y+yo,img.width+2,img.height+2);
    ctx.drawImage(img,x+2,y+2);
    return canvas;
}
function scaleImageData(imageData, scale) {
    if (scale === 1) return imageData;
    var scaledImageData = document.createElement("canvas").getContext("2d").createImageData(imageData.width * scale, imageData.height * scale);
    for (var row = 0; row < imageData.height; row++) {
        for (var col = 0; col < imageData.width; col++) {
            var sourcePixel = [
                imageData.data[(row * imageData.width + col) * 4 + 0],
                imageData.data[(row * imageData.width + col) * 4 + 1],
                imageData.data[(row * imageData.width + col) * 4 + 2],
                imageData.data[(row * imageData.width + col) * 4 + 3]
            ];
            for (var y = 0; y < scale; y++) {
                var destRow = row * scale + y;
                for (var x = 0; x < scale; x++) {
                    var destCol = col * scale + x;
                    for (var i = 0; i < 4; i++) {
                        scaledImageData.data[(destRow * scaledImageData.width + destCol) * 4 + i] =
                            sourcePixel[i];
                    }
                }
            }
        }
    }
    return scaledImageData;
}

function imageChopper(img,tileHeight,tileWidth) {
    const c = document.createElement('canvas');
    const w = c.width = img.width;
    const h = c.height = img.height;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const arr = [];
    for (let y = 0; y < h; y += tileHeight) {
        for (let x = 0; x < w; x += tileWidth) {
            const imageData = ctx.getImageData(x, y, tileWidth, tileHeight);
            const tileCanvas = document.createElement('canvas');
            tileCanvas.width = tileWidth;
            tileCanvas.height = tileHeight;
            const tileCtx = tileCanvas.getContext('2d');
            tileCtx.putImageData(imageData,0,0);
            arr.push(tileCanvas);
        }
    }
    return arr;
}
function imageDataToCanvas(imageData, x = 0, y = 0) {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, x, y);
    return canvas;
}

function tilesToCanvas(arr,columns,tilesData) {
    const canvas = document.createElement('canvas');
    const rows = Math.floor(arr.length / columns);
    if(rows !== (arr.length / columns)){
        debugger;
        //console.error("wtf this should never happen...");
    }
    const w = tilesData[0].width * columns;
    const h = tilesData[0].height * rows;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    
    /* first draw the tiles... */
    arr.forEach((tileIdx,i) => {
        if(tileIdx >= 0) {
            const c = tilesData[tileIdx];
            const x = i%columns;
            const y = Math.floor(i/columns);
            document.body.appendChild(c);
            ctx.drawImage(c, x * c.width, y * c.width);
        }
    });

    /* then draw tile fringe? */ // TODO

    return canvas;
}