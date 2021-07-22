//init variables
var canvasSize; // REFACTOR: Canvas class / getCanvasSize method
var zoom = 7; // REFACTOR: EditorState class/IIFE?
var lastMouseClickPos = [0,0]; // REFACTOR: Input IIFE via getter? <- probably editor state as it is changed by tools
var documentCreated = false; // REFACTOR: EditorState

//common elements
// REFACTOR: put brush and eyedropper preview in the respective tool implementations
var brushPreview = document.getElementById("brush-preview");
var eyedropperPreview = document.getElementById("eyedropper-preview");

// REFACTOR: File class?
var canvasView = document.getElementById("canvas-view");

// main canvas
// REFACTOR: carefully check if it's possible to remove this one
var canvas = document.getElementById('pixel-canvas');
// REFACTOR: find some way to put these in ColorModule?
var currentGlobalColor;

// Layers
// REFACTOR: File class / IIFE?
var layers = [];
// REFACTOR: EditorState / File class?
var currentLayer;

// VFX layer used to draw previews of the selection and things like that
// REFACTOR: File class
var VFXLayer;
// VFX canvas
var VFXCanvas = document.getElementById('vfx-canvas');

// TMP layer
// REFACTOR: File class
var TMPLayer;
// TMP canvas
var TMPCanvas = document.getElementById('tmp-canvas');

// Pixel grid layer
// REFACTOR: File class
var pixelGrid;
// Pixel grid canvas
var pixelGridCanvas;

// REFACTOR: I was thinking that the special layers (pixel grid, checkerboard ecc) could be an extension
// or a variatin of the standard Layer class? I wonder if we can use inheritance or something to
// recycle stuff

// Index of the first layer the user can use in the layers array
// REFACTOR: Consts?
var firstUserLayerIndex = 2;
// Number of layers that are only used by the editor
// REFACTOR: Consts?
var nAppLayers = 3;