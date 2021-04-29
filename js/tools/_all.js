new Tool('eraser', {
	cursor: 'crosshair',
	brushPreview: true,
});
new Tool('resizeeraser', {
	cursor: 'default',
});

new Tool('eyedropper', {
	imageCursor: 'eyedropper',
});

new Tool('fill', {
	imageCursor: 'fill',
});

new Tool('line', {
	cursor: 'crosshair',
	brushPreview: true,
});
new Tool('resizeline', {
	cursor: 'default',
});

new Tool('pan', {
	cursor: function () {
		if (dragging) return 'url(\'/pixel-editor/pan-held.png\'), auto';
		else return 'url(\'/pixel-editor/pan.png\'), auto';
	},
});

new Tool('pencil', {
	cursor: 'crosshair',
	brushPreview: true,
});
new Tool('resizebrush', {
	cursor: 'default',
});

new Tool('rectangle', {
	cursor: 'crosshair',
	brushPreview: true,
});
new Tool('ellipse', {
	cursor: 'crosshair',
	brushPreview: true,
});
new Tool('resizerectangle', {
	cursor: 'default',
});

new Tool('rectselect', {
	cursor: 'crosshair',
	brushPreview: true,
});


new Tool('moveselection', {
	cursor: 'crosshair',
});

new Tool('zoom', {
	imageCursor: 'zoom-in',
});

//set a default tool
var currentTool = tool.pencil;
var currentToolTemp = tool.pencil;