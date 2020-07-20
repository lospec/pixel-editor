document.getElementById('open-image-browse-holder').addEventListener('change', function () {
    let fileName = document.getElementById("open-image-browse-holder").value;
    let extension = fileName.substring(fileName.lastIndexOf('.')+1, fileName.length) || fileName;

    if (this.files && this.files[0]) {
        if (extension == 'png' || extension == 'gif' || extension == 'lpe') {
            if (extension == 'lpe') {
                let file = this.files[0];  
                let reader = new FileReader();

                reader.readAsText(file, "UTF-8");
                reader.onload = function (e) {
                    let dictionary = JSON.parse(e.target.result);

                    newPixel(dictionary['canvasWidth'], dictionary['canvasHeight'], dictionary['editorMode'], dictionary);
                }
            }
            else {
                //load file
                var fileReader = new FileReader();
                fileReader.onload = function(e) {
                    var img = new Image();
                    img.onload = function() {
                        //create a new pixel with the images dimentions
                        newPixel(this.width, this.height, 'Advanced');

                        //draw the image onto the canvas
                        currentLayer.context.drawImage(img, 0, 0);
                        createPaletteFromLayers();

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