document.getElementById('open-image-browse-holder').addEventListener('change', function () {
    if (this.files && this.files[0]) {

        //make sure file is allowed filetype
        var fileContentType = this.files[0].type;
        console.log("File: " + fileContentType);

        if (fileContentType == 'image/png' || fileContentType == 'image/gif' || fileContentType == '.lpe') {
            if (fileContentType == '.lpe') {
                console.log("OK");
            }
            else {
                //load file
                var fileReader = new FileReader();
                fileReader.onload = function(e) {
                    var img = new Image();
                    img.onload = function() {

                        //create a new pixel with the images dimentions
                        newPixel(this.width, this.height, []);

                        //draw the image onto the canvas
                        currentLayer.context.drawImage(img, 0, 0);

                        var colorPalette = {};
                        var imagePixelData = currentLayer.context.getImageData(0,0,this.width, this.height).data;

                        var imagePixelDataLength = imagePixelData.length;

                        console.log(imagePixelData);
                        for (var i = 0; i < imagePixelDataLength; i += 4) {
                            var color = imagePixelData[i]+','+imagePixelData[i + 1]+','+imagePixelData[i + 2];
                            if (!colorPalette[color]) {
                                colorPalette[color] = {r:imagePixelData[i],g:imagePixelData[i + 1],b:imagePixelData[i + 2]};

                                //don't allow more than 256 colors to be added
                                if (Object.keys(colorPalette).length >= settings.maxColorsOnImportedImage) {
                                    alert('The image loaded seems to have more than '+settings.maxColorsOnImportedImage+' colors.');
                                    break;
                                }
                            }
                        }

                        //create array out of colors object
                        var colorPaletteArray = [];
                        for (var color in colorPalette) {
                            if( colorPalette.hasOwnProperty(color) ) {
                                colorPaletteArray.push('#'+rgbToHex(colorPalette[color]));
                            }
                        }
                        console.log('COLOR PALETTE ARRAY', colorPaletteArray);

                        //create palette form colors array
                        createColorPalette(colorPaletteArray, false);

                        //track google event
                        ga('send', 'event', 'Pixel Editor Load', colorPalette.length, this.width+'/'+this.height); /*global ga*/

                    };
                    img.src = e.target.result;
                };
                fileReader.readAsDataURL(this.files[0]);
            }
        }
        else alert('Only .lpe project files, PNG and GIF files are allowed at this time.');
    }
});
