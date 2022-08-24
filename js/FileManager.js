const FileManager = (() => {

    // Binding the browse holder change event to file loading
    const browseHolder = document.getElementById('open-image-browse-holder');
    const browsePaletteHolder = document.getElementById('load-palette-browse-holder');

    Events.on('change', browseHolder, loadFile);
    Events.on('change', browsePaletteHolder, loadPalette);
    Events.on('click', 'export-confirm', exportProject);

    function openSaveProjectWindow() {
        //create name
        let selectedPalette = Util.getText('palette-button');

        if (selectedPalette != 'Choose a palette...'){
            var paletteAbbreviation = palettes[selectedPalette].abbreviation;
            var fileName = 'pixel-'+paletteAbbreviation+'-'+currFile.canvasSize[0]+'x'+currFile.canvasSize[1];
        } else {
            var fileName = 'pixel-'+currFile.canvasSize[0]+'x'+currFile.canvasSize[1];
            selectedPalette = 'none';
        }
    
        Util.setValue('lpe-file-name', fileName);
        Events.on("click", "save-project-confirm", saveProject);
        Dialogue.showDialogue('save-project', false);
    }

    function openPixelExportWindow() {
        let selectedPalette = Util.getText('palette-button');
    
        if (selectedPalette != 'Choose a palette...'){
            var paletteAbbreviation = palettes[selectedPalette].name;
            var fileName = 'pixel-'+paletteAbbreviation+'-'+canvasSize[0]+'x'+canvasSize[1]+'.png';
        } else {
            var fileName = 'pixel-'+currFile.canvasSize[0]+'x'+currFile.canvasSize[1]+'.png';
            selectedPalette = 'none';
        }
    
        Util.setValue('export-file-name', fileName);
        Dialogue.showDialogue('export', false);
    }

    function saveProject() {
        // Get name
        let fileName = Util.getValue("lpe-file-name") + ".lpe";
        let selectedPalette = Util.getText('palette-button');
        //set download link
        const linkHolder = document.getElementById('save-project-link-holder');
        // create file content
        const content = getProjectData();

        linkHolder.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
        linkHolder.download = fileName;
        linkHolder.click();

        if (typeof ga !== 'undefined')
            ga('send', 'event', 'Pixel Editor Save', selectedPalette, currFile.canvasSize[0]+'/'+currFile.canvasSize[1]); /*global ga*/
    }

    function exportProject() {
        if (EditorState.documentCreated()) {
            //create name
            let fileName = Util.getValue("export-file-name");
            //set download link
            let linkHolder = document.getElementById('save-image-link-holder');
            // Creating a tmp canvas to flatten everything
            let exportCanvas = document.createElement("canvas");
            let emptyCanvas = document.createElement("canvas");
            let layersCopy = currFile.layers.slice();

            exportCanvas.width = currFile.canvasSize[0];
            exportCanvas.height = currFile.canvasSize[1];

            emptyCanvas.width = currFile.canvasSize[0];
            emptyCanvas.height = currFile.canvasSize[1];

            // Sorting the layers by z index
            layersCopy.sort((a, b) => (a.canvas.style.zIndex > b.canvas.style.zIndex) ? 1 : -1);

            // Merging every layer on the export canvas
            for (let i=0; i<layersCopy.length; i++) {
                if (layersCopy[i].hasCanvas() && layersCopy[i].isVisible) {
                    LayerList.mergeLayers(exportCanvas.getContext('2d'), layersCopy[i].context);
                }
                // I'm not going to find out why the layer ordering screws up if you don't copy
                // a blank canvas when layers[i] is not set as visible, but if you have time to
                // spend, feel free to investigate (comment the else, create 3 layers: hide the 
                // middle one and export, the other 2 will be swapped in their order)
                else {
                    LayerList.mergeLayers(exportCanvas.getContext('2d'), emptyCanvas.getContext('2d'));
                }
            }

            linkHolder.href = exportCanvas.toDataURL();
            linkHolder.download = fileName;

            linkHolder.click();

            emptyCanvas.remove();
            exportCanvas.remove();

            //track google event
            if (typeof ga !== 'undefined')
                ga('send', 'event', 'Pixel Editor Export', selectedPalette, currFile.canvasSize[0]+'/'+currFile.canvasSize[1]); /*global ga*/
        }
    }

    function open() {
        //if a document exists
        if (EditorState.documentCreated()) {
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

        if (browseHolder.files && browseHolder.files[0]) {
            // Checking if the extension is supported
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

        browseHolder.value = null;
    }

    function openFile() {
        //load file
        var fileReader = new FileReader();

        fileReader.onload = function(e) {
            var img = new Image();

            img.onload = function() {
                //create a new pixel with the images dimentions
                Startup.newPixel(this.width, this.height);
                EditorState.switchMode('Advanced');

                //draw the image onto the canvas
                currFile.currentLayer.context.drawImage(img, 0, 0);
                ColorModule.createPaletteFromLayers();

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
            Startup.newPixel(dictionary['canvasWidth'], dictionary['canvasHeight'], dictionary);

            for (let i=0; dictionary['color' + i] != null; i++) {
                ColorModule.addColor(dictionary['color'+i]);
            }

            // Removing the default colours
            ColorModule.deleteColor(ColorModule.getCurrentPalette()[0]);
            ColorModule.deleteColor(ColorModule.getCurrentPalette()[0]);
        }
    }

    function getProjectData() {
        // use a dictionary
        let dictionary = {};
        // sorting layers by increasing z-index
        let layersCopy = currFile.layers.slice();
        layersCopy.sort((a, b) => (a.canvas.style.zIndex > b.canvas.style.zIndex) ? 1 : -1);
        // save canvas size
        dictionary['canvasWidth'] = currFile.canvasSize[0];
        dictionary['canvasHeight'] = currFile.canvasSize[1];
        // save editor mode
        dictionary['editorMode'] = EditorState.getCurrentMode();
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

    function loadPalette() {
        if (browsePaletteHolder.files && browsePaletteHolder.files[0]) {
            //make sure file is allowed filetype
            var fileContentType = browsePaletteHolder.files[0].type;
            if (fileContentType == 'image/png' || fileContentType == 'image/gif') {

                //load file
                var fileReader = new FileReader();
                fileReader.onload = function(e) {
                    var img = new Image();
                    img.onload = function() {
    
                        //draw image onto the temporary canvas
                        var loadPaletteCanvas = document.getElementById('load-palette-canvas-holder');
                        var loadPaletteContext = loadPaletteCanvas.getContext('2d');
    
                        loadPaletteCanvas.width = img.width;
                        loadPaletteCanvas.height = img.height;
    
                        loadPaletteContext.drawImage(img, 0, 0);
    
                        //create array to hold found colors
                        var colorPalette = [];
                        var imagePixelData = loadPaletteContext.getImageData(0,0,this.width, this.height).data;
    
                        //loop through pixels looking for colors to add to palette
                        for (var i = 0; i < imagePixelData.length; i += 4) {
                            const newColor = {r:imagePixelData[i],g:imagePixelData[i + 1],b:imagePixelData[i + 2]};
                            var color = '#' + Color.rgbToHex(newColor);
                            if (colorPalette.indexOf(color) == -1) {
                                colorPalette.push(color);
                            }
                        }
    
                        //add to palettes so that it can be loaded when they click okay
                        palettes['Loaded palette'] = {};
                        palettes['Loaded palette'].colors = colorPalette;
                        Util.setText('palette-button', 'Loaded palette');
                        Util.setText('palette-button-splash', 'Loaded palette');
                        Util.toggle('palette-menu-splash');
                    };
                    img.src = e.target.result;
                };
                fileReader.readAsDataURL(browsePaletteHolder.files[0]);
            }
            else alert('Only PNG and GIF files are supported at this time.');
        }

        browsePaletteHolder.value = null;
    }

    return {
        saveProject,
        exportProject,
        openPixelExportWindow,
        openSaveProjectWindow,
        open
    }
})();