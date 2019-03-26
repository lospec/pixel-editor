//init variables
var canvasSize,zoom;
var dragging = false;
var lastPos = [0,0];
var canvasPosition;
var currentTool = 'pencil';
var currentToolTemp = 'pencil';
var brushSize = 1;
var prevBrushSize = 1;
var menuOpen = false;
var dialogueOpen = false;
var documentCreated = false;

//common elements
var brushPreview = document.getElementById("brush-preview");
var eyedropperPreview = document.getElementById("eyedropper-preview");
var canvasView = document.getElementById("canvas-view");
var colors = document.getElementsByClassName("color-button");
var colorsMenu = document.getElementById("colors-menu");
var popUpContainer = document.getElementById("pop-up-container");

//html canvas
var canvas = document.getElementById("pixel-canvas");
var context = canvas.getContext("2d");

