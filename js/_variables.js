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

// Layers
// REFACTOR: File class / IIFE?
var layers = [];
// REFACTOR: EditorState / File class?
var currentLayer;

// VFX layer used to draw previews of the selection and things like that
// REFACTOR: File class
var VFXLayer;
// TMP layer
// REFACTOR: File class
var TMPLayer;

// Pixel grid layer
// REFACTOR: File class
var pixelGrid;
// Pixel grid canvas
var pixelGridCanvas;

// REFACTOR: I was thinking that the special layers (pixel grid, checkerboard ecc) could be an extension
// or a variatin of the standard Layer class? I wonder if we can use inheritance or something to
// recycle stuff