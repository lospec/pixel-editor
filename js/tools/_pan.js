
new Tool('pan', {
	cursor: function () {
		if (dragging) return 'url(\'/pixel-editor/pan-held.png\'), auto';
		else return 'url(\'/pixel-editor/pan.png\'), auto';
	},
});


/*global Tool, tool*/