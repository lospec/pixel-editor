new Tool('resizeline', {
	cursor: 'default',
});

new Tool('pan', {
	cursor: function () {
		if (Input.isDragging()) return 'url(\'/pixel-editor/pan-held.png\'), auto';
		else return 'url(\'/pixel-editor/pan.png\'), auto';
	},
});


new Tool('ellipse', {
	cursor: 'none',
	brushPreview: true,
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