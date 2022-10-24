// localStorage.setItem("lpe-cache",`{}`)
const FileManager = (() => {

    // Binding the browse holder change event to file loading
    const browseHolder = document.getElementById('open-image-browse-holder');
    const browsePaletteHolder = document.getElementById('load-palette-browse-holder');

    Events.on('change', browseHolder, loadFile);
    Events.on('change', browsePaletteHolder, loadPalette);
    Events.on("click", "save-project-confirm", saveProject);

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
        Events.on("click", "export-confirm", exportProject);
        Dialogue.showDialogue('export', false);
    }

    function saveProject() {
        // Get name
        // debugger;
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

        
        LayerList.closeOptionsMenu(); // is this the right place for this?
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

            exportCanvas.getContext("2d").willReadFrequently = true;
            emptyCanvas.getContext("2d").willReadFrequently = true;

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
    function localStorageCheck() {
        return !!localStorage.getItem("lpe-cache");
    }
    function localStorageSave() {
        const lpeStr = getProjectData();
        const lpe = JSON.parse(lpeStr);
        console.log('BEFORE JSON.stringify(lpe.colors,null,4) === ',JSON.stringify(lpe.colors,null,4));
        console.log([...ColorModule.getCurrentPalette()]);
        if(lpe.colors.length < 1)lpe.colors = [...ColorModule.getCurrentPalette()];
        if(lpe.colors.length < 1)lpe.colors.push("#000000");
        console.log('AFTER JSON.stringify(lpe.colors,null,4) === ',JSON.stringify(lpe.colors,null,4));
        if(!lpe.canvasWidth)lpe.canvasWidth = 16;
        if(!lpe.canvasHeight)lpe.canvasHeight = 16;
        console.log('LPE saved === ',lpe);
        localStorage.setItem("lpe-cache", JSON.stringify(lpe));
    }
    function localStorageReset() {
        localStorage.setItem("lpe-cache", JSON.stringify({
            "canvasWidth":16,
            "canvasHeight":16,
            "editorMode":"Advanced",
            "colors":["#000000","#0b6082","#1d8425","#cc1919"],
            "selectedLayer":0,
            "layers":[
                {"canvas":{},"context":{"mozImageSmoothingEnabled":false},"isSelected":true,"isVisible":true,"isLocked":false,"oldLayerName":null,"menuEntry":{},"id":"layer0","name":"Layer 0","src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAHZJREFUOE9jZKAQMFKon4EuBvxHcyWKpdhcgK4BpB+nS9ElYJqJ9hqyQpI1ozsNZABRNnMnNIEt+7qgjhGrBpgCWOCBFKJHN0gNTgOQFSPbhi5OlAHYEhpBL+DThO4tgoGGHB7YwgKvAbj8j+xCgi4glNkoNgAA3JApEbHObDkAAAAASUVORK5CYII="},
                {"canvas":{},"context":{"mozImageSmoothingEnabled":false},"isSelected":false,"isVisible":true,"isLocked":false,"oldLayerName":null,"menuEntry":{},"id":"layer1","name":"Layer 1","src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAGNJREFUOE9jZKAQMCLrl21R/Q/iP665jSKOzw7qGgCyCeQKsl0AM4AUb2D1KymuoJ0BxHoDZ3QRG6V445uYsCBoACGvEExxhFxBlAH4XEHQAEKpkygDkFMoumuINgCWI9HDBAChJjwRzAXQUwAAAABJRU5ErkJggg=="},
                {"canvas":{},"context":{"mozImageSmoothingEnabled":false},"isSelected":false,"isVisible":true,"isLocked":false,"oldLayerName":null,"menuEntry":{},"id":"layer2","name":"Layer 2","src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAGNJREFUOE9jZKAQMJKi/4yk5H+YepPnz8F68RqArAFdI4yP1QBsNuFyKYYBMM0wJxLyIlYDiNWMNQxALhimBuCKUoKBSChKcRpASCPOhESsRoIGEBuVKF4g1XaMhERqMgYZAACIaEgR0hnFxgAAAABJRU5ErkJggg=="}
            ]
        }));
    }
    function defaultLPE(w,h,colors) {
        return {
            "canvasWidth":w,
            "canvasHeight":h,
            "editorMode":"Advanced",
            colors,
            "selectedLayer":0,
            "layers":[
                {"canvas":{},"context":{"mozImageSmoothingEnabled":false},"isSelected":true,"isVisible":true,"isLocked":false,"oldLayerName":null,"menuEntry":{},"id":"layer0","name":"Layer 0","src":emptyCanvasSrc(w,h)}
            ]
        };

        function emptyCanvasSrc(w,h) {
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            return canvas.toDataURL();
        }
    }
    function localStorageLoad() {
        ////console.log("loading from localStorage");
        ////console.log('JSON.parse(localStorage.getItem("lpe-cache") ?? "{}") === ',JSON.parse(localStorage.getItem("lpe-cache") ?? "{}"));
        const lpe = JSON.parse(localStorage.getItem("lpe-cache") ?? "{}");
        //console.log('LPE loaded === ',lpe);
        return lpe;
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
                    // openFile();
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
                console.log('this === ',this);
                Startup.newPixel({
                    canvasWidth: this.width,
                    canvasHeight: this.height
                });
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
    function openProject(lpeData) {
        console.log('lpeData === ',lpeData);
        // Getting all the data
        if(lpeData){
            _parseLPE(lpeData);
        } else {
            let file = browseHolder.files[0];
            let reader = new FileReader();
            // Converting the data to a json object and creating a new pixel (see _newPixel.js for more)
            reader.onload = function (e) {
                console.log('this === ',this);
                console.log('e === ',e);
                let dictionary = JSON.parse(e.target.result);
                console.log('FileManager.js => openProject => loaded lpe dictionary === ',dictionary);
                _parseLPE(dictionary);
            }
            reader.readAsText(file, "UTF-8");
        }
        
        function _parseLPE(dictionary) {
            Startup.newPixel(dictionary);
        }
    }
    function loadFromLPE(dictionary) {
        ColorModule.resetPalette();

        //console.log('dictionary === ',dictionary);

        EditorState.switchMode(dictionary.editorMode ?? 'Advanced');

        if(dictionary.colors)ColorModule.createColorPalette(dictionary.colors);

        // Startup.newPixel(dictionary);
    }
    function getProjectData() {
        // use a dictionary
        let dictionary = {};
        // sorting layers by increasing z-index
        let layersCopy = currFile.layers.filter(n=>!!n.menuEntry).slice();
        dictionary['canvasWidth'] = currFile.canvasSize[0];
        dictionary['canvasHeight'] = currFile.canvasSize[1];
        dictionary['editorMode'] = EditorState.getCurrentMode();
        dictionary.colors = [
            ...ColorModule.getCurrentPalette()
        ];
        dictionary.layers = layersCopy
            .map((n,i)=>{
                //console.log('n.name === ',n.name);
                if(n.isSelected)dictionary.selectedLayer = i;
                return {
                    ...n,
                    src: n.canvas.toDataURL(),
                };
            });
        
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
    function upgradeLPE(dictionary) {
        console.log('dictionary === ',dictionary);
        if(dictionary.color0 && !dictionary.colors) {
            dictionary.colors = [];
            let colorIdx = 0;
            while(dictionary[`color${colorIdx}`]) {
                dictionary.colors.push(dictionary[`color${colorIdx}`]);
                delete dictionary[`color${colorIdx}`];
                colorIdx++;
            }
            console.log('Object.keys(dictionary) === ',Object.keys(dictionary));
            dictionary.layers = Object.keys(dictionary).reduce((r,k,i)=>{
                if(k.slice(0,5) === "layer" && dictionary[k]){
                    if(dictionary[k].isSelected){
                        dictionary.selectedLayer = r.length;
                    }
                    r.push({
                        ...dictionary[k],
                        src: dictionary[`${k}ImageData`]
                    });
                    
                    delete dictionary[k];
                    delete dictionary[`${k}ImageData`];
                }
                return r;
            },[]);
            console.log('dictionary.layers === ',dictionary.layers);
        }
        console.log('dictionary === ',dictionary);
        return dictionary;
    }
    function toggleCache(elm){
        console.log('elm === ',elm);
        FileManager.cacheEnabled = !FileManager.cacheEnabled;
        localStorage.setItem("lpe-cache-enabled",FileManager.cacheEnabled ? "1" : "0");
        elm.textContent = cacheBtnText(FileManager.cacheEnabled);
    }
    function cacheBtnText(cacheEnabled) {
        return `${cacheEnabled ? "Disable" : "Enable"} auto-cache`;
    }

    const cacheEnabled = !!Number(localStorage.getItem("lpe-cache-enabled"));
    document.getElementById("auto-cache-button").textContent = cacheBtnText(cacheEnabled);

    const ret = {
        cacheEnabled,
        loadFromLPE,
        toggleCache,
        getProjectData,
        localStorageReset,
        localStorageCheck,
        localStorageSave,
        localStorageLoad,
        upgradeLPE,
        defaultLPE,
        saveProject,
        openProject,
        exportProject,
        openPixelExportWindow,
        openSaveProjectWindow,
        open
    };
    Object.keys(ret).forEach(k=>{
        if(typeof ret[k] === "function"){
            const orig = ret[k];
            ret[k] = function() {
                DEBUG_ARR.push(`called FileManager -> ${k}`);
                return orig.call(this,...arguments);
            }
        }
    })
    return ret;
})();