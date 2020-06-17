/** TODO LIST FOR LAYERS
    
    GENERAL REQUIREMENTS:
    
    - Must add a new layer (a new <li> element with class layer-menu-entry) when clicking on the "add" button
    - Must delete the selected layer when right clicking on a layer and selecting that option
        * We should think about selecting more than one layer at once.
        * Merge with bottom layer option
        * Flatten visible option
        * Flatten everything option
    - Must move a layer when dragging it in the layer list (https://codepen.io/retrofuturistic/pen/tlbHE)
    - When the user clicks on the eye icon, the layer becomes transparent
    - When the user clicks on the lock icon, the layer is locked
    - Lock and visibility options are only shown on mouse hover
    - When a layer is locked or not visible, the corresponding icons are always shown
    - When a layer is selected, its background colour becomes lighter
    - When saving an artwork, the layers must be flattened to a temporary layer, which is then exported and deleted
    - Saving the state of an artwork to a .lospec file so that people can work on it later keeping 
      the layers they created? That'd be cool, even for the app users, that could just double click on a lospec
      file for it to be opened right in the pixel editor
    
    ADDITIONAL LOGIC TO MAKE IT WORK WITH THE REST OF THE CODE:

    - move the tmp layer so that it's always right below the active layer
    - when the move tool is selected (to move a selection), the tmp layer must be put right above the 
        active layer to show a preview
    - mouse events will always have at least a canvas target, so evey time there's an event, we'll have to check
        the actual element type instead of the current layer and then apply the tool on the currentLayer, not on
        the first one in order of z-index   
    - when zooming in and out, all the layers should be scaled accordingly
    - when changing the stroke colour, it should change for all the layers: it should already be happening,
      just make sure it is

    OPTIONAL:

    1 - Fix issues 
    2 - Add a Replace feature so that people can replace a colour without editing the one in the palette
        (right click->replace colour in layers? in that case we'd have to implement multiple layers selection)

*/


/** Handler class for a single canvas (a single layer)
 *
 * @param width Canvas width
 * @param height Canvas height
 * @param canvas HTML canvas element
 */
function Layer(width, height, canvas) {
    this.canvasSize = [width, height];
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    // Initializes the canvas
    this.initialize = function() {
        var maxHorizontalZoom = Math.floor(window.innerWidth/this.canvasSize[0]*0.75);
        var maxVerticalZoom = Math.floor(window.innerHeight/this.canvasSize[1]*0.75);

        zoom = Math.min(maxHorizontalZoom,maxVerticalZoom);
        if (zoom < 1) zoom = 1;

        //resize canvas
        this.canvas.width = this.canvasSize[0];
        this.canvas.height = this.canvasSize[1];
        this.canvas.style.width = (this.canvas.width*zoom)+'px';
        this.canvas.style.height = (this.canvas.height*zoom)+'px';

        //unhide canvas
        this.canvas.style.display = 'block';

        //center canvas in window
        this.canvas.style.left = 64+canvasView.clientWidth/2-(this.canvasSize[0]*zoom/2)+'px';
        this.canvas.style.top = 48+canvasView.clientHeight/2-(this.canvasSize[1]*zoom/2)+'px';

        this.context.imageSmoothingEnabled = false;
        this.context.mozImageSmoothingEnabled = false;
    };
    // Resizes canvas
    this.resize = function() {
        let newWidth = (this.canvas.width * zoom) + 'px';
        let newHeight = (this.canvas.height *zoom)+ 'px';

        this.canvas.style.width = newWidth;
        this.canvas.style.height = newHeight;
    };
    // Copies the otherCanvas' position and size
    this.copyData = function(otherCanvas) {
        this.canvas.style.width = otherCanvas.canvas.style.width;
        this.canvas.style.height = otherCanvas.canvas.style.height;

        this.canvas.style.left = otherCanvas.canvas.style.left;
        this.canvas.style.top = otherCanvas.canvas.style.top;
    };
}
