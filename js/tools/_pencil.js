
new Tool('pencil', {
	cursor: 'crosshair',
	brushPreview: true,
});


new Tool('resizebrush', {
	cursor: 'default',
});


//set as default tool
var currentTool = tool.pencil;
var currentToolTemp = tool.pencil;

/*global Tool, tool*/