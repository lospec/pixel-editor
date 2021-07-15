const FileManager = (() => {

    // Binding the browse holder change event to file loading
    const browseHolder = document.getElementById('open-image-browse-holder');
    Input.on('change', browseHolder, loadFile);

    function saveProject() {
        //create name
        let fileName;
        let selectedPalette = Util.getText('palette-button');

        if (selectedPalette != 'Choose a palette...'){
            let paletteAbbreviation = palettes[selectedPalette].abbreviation;
            fileName = 'pixel-'+paletteAbbreviation+'-'+canvasSize[0]+'x'+canvasSize[1]+'.lpe';
        } else {
            fileName = 'pixel-'+canvasSize[0]+'x'+canvasSize[1]+'.lpe';
            selectedPalette = 'none';
        }

        //set download link
        const linkHolder = document.getElementById('save-project-link-holder');
        // create file content
        const content = getProjectData();

        linkHolder.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
        linkHolder.download = fileName;
        linkHolder.click();

        if (typeof ga !== 'undefined')
            ga('send', 'event', 'Pixel Editor Save', selectedPalette, canvasSize[0]+'/'+canvasSize[1]); /*global ga*/
    }

    function exportProject() {
        if (documentCreated) {
            //create name
            var selectedPalette = Util.getText('palette-button');
            if (selectedPalette != 'Choose a palette...'){
                var paletteAbbreviation = palettes[selectedPalette].abbreviation;
                var fileName = 'pixel-'+paletteAbbreviation+'-'+canvasSize[0]+'x'+canvasSize[1]+'.png';
            } else {
                var fileName = 'pixel-'+canvasSize[0]+'x'+canvasSize[1]+'.png';
                selectedPalette = 'none';
            }

            //set download link
            var linkHolder = document.getElementById('save-image-link-holder');
            // Creating a tmp canvas to flatten everything
            var exportCanvas = document.createElement("canvas");
            var emptyCanvas = document.createElement("canvas");
            var layersCopy = layers.slice();

            exportCanvas.width = canvasSize[0];
            exportCanvas.height = canvasSize[1];

            emptyCanvas.width = canvasSize[0];
            emptyCanvas.height = canvasSize[1];

            // Sorting the layers by z index
            layersCopy.sort((a, b) => (a.canvas.style.zIndex > b.canvas.style.zIndex) ? 1 : -1);

            // Merging every layer on the export canvas
            for (let i=0; i<layersCopy.length; i++) {
                if (layersCopy[i].menuEntry != null && layersCopy[i].isVisible) {
                    mergeLayers(exportCanvas.getContext('2d'), layersCopy[i].context);
                }
                // I'm not going to find out why the layer ordering screws up if you don't copy
                // a blank canvas when layers[i] is not set as visible, but if you have time to
                // spend, feel free to investigate (comment the else, create 3 layers: hide the 
                // middle one and export, the other 2 will be swapped in their order)
                else {
                    mergeLayers(exportCanvas.getContext('2d'), emptyCanvas.getContext('2d'));
                }
            }

            linkHolder.href = exportCanvas.toDataURL();
            linkHolder.download = fileName;

            linkHolder.click();

            emptyCanvas.remove();
            exportCanvas.remove();

            //track google event
            if (typeof ga !== 'undefined')
                ga('send', 'event', 'Pixel Editor Export', selectedPalette, canvasSize[0]+'/'+canvasSize[1]); /*global ga*/
        }
    }

    function open() {
        //if a document exists
        if (documentCreated) {
            //check if the user wants to overwrite
            if (confirm('Opening a pixel will discard your current one. Are you sure you want to do that?'))
                //open file selection dialog
                document.getElementById('open-image-browse-holder').click();
        }
        else
            //open file selection dialog
            document.getElementById('open-image-browse-holder').click();
    }

    function loadFile() {
        let fileName = document.getElementById("open-image-browse-holder").value;
        // Getting the extension
        let extension = (fileName.substring(fileName.lastIndexOf('.')+1, fileName.length) || fileName).toLowerCase();

        // I didn't write this check and I have no idea what it does
        if (browseHolder.files && browseHolder.files[0]) {
            // Btw, checking if the extension is supported
            if (extension == 'png' || extension == 'gif' || extension == 'lpe') {
                // If it's a Lospec Pixel Editor tm file, I load the project
                if (extension == 'lpe') {
                    openProject();
                }
                else {
                    openFile();
                }
            }
            else alert('Only .LPE project files, PNG and GIF files are allowed at this time.');
        }
    }

    function openFile() {
        //load file
        var fileReader = new FileReader();
        fileReader.onload = function(e) {
            var img = new Image();
            img.onload = function() {
                //create a new pixel with the images dimentions
                switchMode('Advanced');
                Startup.newPixel(this.width, this.height);

                //draw the image onto the canvas
                currentLayer.context.drawImage(img, 0, 0);
                createPaletteFromLayers();

                //track google event
                if (typeof ga !== 'undefined')
                    ga('send', 'event', 'Pixel Editor Load', colorPalette.length, this.width+'/'+this.height); /*global ga*/

            };
            img.src = e.target.result;
        };
        fileReader.readAsDataURL(browseHolder.files[0]);
    }

    function openProject() {
        let file = browseHolder.files[0];  
        let reader = new FileReader();

        // Getting all the data
        reader.readAsText(file, "UTF-8");
        // Converting the data to a json object and creating a new pixel (see _newPixel.js for more)
        reader.onload = function (e) {
            let dictionary = JSON.parse(e.target.result);
            let mode = dictionary['editorMode'];
            Startup.newPixel(dictionary['canvasWidth'], dictionary['canvasHeight'], dictionary);
        }
    }

    function getProjectData() {
        // use a dictionary
        let dictionary = {};
        // sorting layers by increasing z-index
        let layersCopy = layers.slice();
        layersCopy.sort((a, b) => (a.canvas.style.zIndex > b.canvas.style.zIndex) ? 1 : -1);
        // save canvas size
        dictionary['canvasWidth'] = currentLayer.canvasSize[0];
        dictionary['canvasHeight'] = currentLayer.canvasSize[1];
        // save editor mode
        dictionary['editorMode'] = pixelEditorMode;
        // save palette
        for (let i=0; i<ColorModule.getCurrentPalette().length; i++) {
            dictionary["color" + i] = ColorModule.getCurrentPalette()[i];
        }

        // save number of layers
        dictionary["nLayers"] = layersCopy.length;

        // save layers 
        for (let i=0; i<layersCopy.length; i++) {
            // Only saving the layers the user has access to (no vfx, tmp or checkerboard layers)
            if (layersCopy[i].menuEntry != null) {
                dictionary["layer" + i] = layersCopy[i];
                dictionary["layer" + i + "ImageData"] = layersCopy[i].canvas.toDataURL();
            }
        }
        
        return JSON.stringify(dictionary);
    }

    return {
        saveProject,
        exportProject,
        open
    }
})();