//init variables
var canvasSize,zoom;
var dragging = false;
var lastPos = [0,0];
var currentTool = 'pencil';
var currentToolTemp = 'pencil';
var brushSize = 1;
var eraserSize = 1;
var prevBrushSize = 1;
var prevEraserSize = 1;
var dialogueOpen = false;
var documentCreated = false;

// Checkerboard management
// Checkerboard color 1
var firstCheckerBoardColor = 'rgba(139, 139, 139, 1)';
// Checkerboard color 2
var secondCheckerBoardColor = 'rgba(105, 105, 105, 1)';
// Square size for the checkerboard
var checkerBoardSquareSize = 16;
// Checkerboard canvas
var checkerBoardCanvas = document.getElementById("checkerboard");

//common elements
var brushPreview = document.getElementById("brush-preview");
var eyedropperPreview = document.getElementById("eyedropper-preview");
var canvasView = document.getElementById("canvas-view");
var colors = document.getElementsByClassName("color-button");
var colorsMenu = document.getElementById("colors-menu");
var popUpContainer = document.getElementById("pop-up-container");

// main canvas
var canvas = document.getElementById("pixel-canvas");
var context = canvas.getContext("2d");

// Layers
var layers = [];
// Currently selected layer
var currentLayer;

