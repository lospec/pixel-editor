function Canvas(width, height, canvas) {
    this.canvasSize = [width, height],
    this.canvas = canvas,
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
    },
    this.resize = function() {
        let newWidth = (this.canvas.width*zoom)+'px';
        let newHeight = (this.canvas.height*zoom)+'px';

        this.canvas.style.width = newWidth;
        this.canvas.style.height = newHeight;

        this.width = newWidth;
        this.height = newHeight;
    }
}