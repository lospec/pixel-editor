//init variables
var canvasSize;
var zoom = 7;
var dragging = false;
var lastMouseClickPos = [0,0];
var dialogueOpen = false;
var documentCreated = false;
var pixelEditorMode;

//common elements
var brushPreview = document.getElementById("brush-preview");
var eyedropperPreview = document.getElementById("eyedropper-preview");
var canvasView = document.getElementById("canvas-view");
var colors = document.getElementsByClassName("color-button");
var colorsMenu = document.getElementById("colors-menu");
var popUpContainer = document.getElementById("pop-up-container");

// main canvas
var canvas = document.getElementById('pixel-canvas');
var currentGlobalColor;

// Layers
var layers = [];
// Currently selected layer
var currentLayer;

// VFX layer used to draw previews of the selection and things like that
var VFXLayer;
// VFX canvas
var VFXCanvas = document.getElementById('vfx-canvas');

// TMP layer
var TMPLayer;
// TMP canvas
var TMPCanvas = document.getElementById('tmp-canvas');

// Pixel grid layer
var pixelGrid;
// Pixel grid canvas
var pixelGridCanvas;

// Index of the first layer the user can use in the layers array
var firstUserLayerIndex = 2;
// Number of layers that are only used by the editor
var nAppLayers = 3;