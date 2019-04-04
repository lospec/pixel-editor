function setCanvasOffset (canvas, offsetLeft, offsetTop) {
		//horizontal offset
		var minXOffset = -canvasSize[0]*zoom+ 164;
		var maxXOffset = window.innerWidth - 148;
		
		if 	(offsetLeft < minXOffset)
			canvas.style.left = minXOffset +'px';
		else if (offsetLeft > maxXOffset)
            canvas.style.left = maxXOffset +'px';
		else
            canvas.style.left = offsetLeft +'px';
		
		//vertical offset
		var minYOffset = -canvasSize[1]*zoom + 164;
		var maxYOffset = window.innerHeight-100;
		
		if 	(offsetTop < minYOffset)
            canvas.style.top = minYOffset +'px';
		else if (offsetTop > maxYOffset)
            canvas.style.top = maxYOffset +'px';
		else
            canvas.style.top = offsetTop +'px';
}