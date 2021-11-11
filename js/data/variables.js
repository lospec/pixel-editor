//init variables
var canvasSize; // REFACTOR: Canvas class / getCanvasSize method
var zoom = 7; // REFACTOR: EditorState class/IIFE? Leave this one for later
var lastMouseClickPos = [0,0]; // REFACTOR: Input IIFE via getter? <- probably editor state as it is changed by tools

// REFACTOR: File class?
var canvasView = document.getElementById("canvas-view");

// Layers
// REFACTOR: File class / IIFE?
var layers = [];
// REFACTOR: File class?
var currentLayer;

// VFX layer used to draw previews of the selection and things like that
// REFACTOR: File class
var VFXLayer;
// TMP layer
// REFACTOR: File class
var TMPLayer;

// Pixel grid layer
// REFACTOR: File class
let pixelGrid;

// REFACTOR: File class
let checkerBoard;