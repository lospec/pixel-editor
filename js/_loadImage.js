/** Loads a file (.png or .lpe)
 * 
 */
document.getElementById('open-image-browse-holder').addEventListener('change', function () {
    let fileName = document.getElementById("open-image-browse-holder").value;
    // Getting the extension
    let extension = fileName.substring(fileName.lastIndexOf('.')+1, fileName.length) || fileName;

    // I didn't write this check and I have no idea what it does
    if (this.files && this.files[0]) {
        // Btw, checking if the extension is supported
        if (extension == 'png' || extension == 'gif' || extension == 'lpe') {
            // If it's a Lospec Pixel Editor tm file, I load the project
            if (extension == 'lpe') {
                let file = this.files[0];  
                let reader = new FileReader();

                // Getting all the data
                reader.readAsText(file, "UTF-8");
                // Converting the data to a json object and creating a new pixel (see _newPixel.js for more)
                reader.onload = function (e) {
                    let dictionary = JSON.parse(e.target.result);
                    let mode = dictionary['editorMode'] == 'Advanced' ? 'Basic' : 'Advanced';
                    newPixel(dictionary['canvasWidth'], dictionary['canvasHeight'], mode, dictionary);
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