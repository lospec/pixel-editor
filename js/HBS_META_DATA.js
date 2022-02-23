const HBS_META_DATA = {
    "./views/colors-menu.hbs": {
        "fileStr": "<ul id=\"colors-menu\">\n\t<li class=\"noshrink\"><button title=\"Add Current Color To Palette\" id=\"add-color-button\">{{svg \"./plus.svg\" width=\"30\" height=\"30\"}}</button></li>\n</ul>\n\n<div class=\"jscolor-picker-bottom\">\n\t<span>#</span><input type=\"text\" id=\"jscolor-hex-input\" />\n\t<div id=\"duplicate-color-warning\" title=\"Color is a duplicate of another in palette\">{{svg \"warning.svg\" width=\"14\"\n\t\theight=\"12\" }}</div>\n\t<button class=\"delete-color-button\">{{svg \"trash.svg\" width=\"20\" height=\"20\" }}</button>\n</div>\n\n<div class=\"color-edit-button\">\n\t{{svg \"adjust.svg\" width=\"20\" height=\"20\" }}\n</div>",
        "filePath": "./views/colors-menu.hbs",
        "dblCurlsArr": [
            "svg \"./plus.svg\" width=\"30\" height=\"30\"",
            "svg \"warning.svg\" width=\"14\"\n\t\theight=\"12\" ",
            "svg \"trash.svg\" width=\"20\" height=\"20\" ",
            "svg \"adjust.svg\" width=\"20\" height=\"20\" "
        ],
        "partialArr": []
    },
    "./views/foobar.hbs": {
        "fileStr": "<!DOCTYPE html>\r\n<html>\r\n\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <title>{{title}}</title>\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n    <link href=\"https://fonts.googleapis.com/css?family=Open+Sans:300,400,400i,700,900\" rel=\"stylesheet\">\r\n    <link rel=\"stylesheet\" href=\"/pixel-editor.css\" />\r\n    <meta name=\"ROBOTS\" content=\"NOINDEX, NOFOLLOW\">\r\n</head>\r\n\r\n<body oncontextmenu=\"return false;\">\r\n\t{{> canvases}}\r\n   \r\n    <div id=\"pop-up-container\">\r\n    </div>\r\n\r\n    <script src=\"/pixel-editor.js\"></script>\r\n    {{#reload}}<script src=\"/reload/reload.js\"></script>{{/reload}}\r\n</body>\r\n</html>",
        "filePath": "./views/foobar.hbs",
        "dblCurlsArr": [
            "title",
            "> canvases",
            "#reload",
            "/reload"
        ],
        "partialArr": [
            "canvases"
        ]
    },
    "./views/index.hbs": {
        "fileStr": "<!DOCTYPE html>\n<html>\n\n<head>\n    <meta charset=\"UTF-8\">\n    <title>{{title}}</title>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link href=\"https://fonts.googleapis.com/css?family=Open+Sans:300,400,400i,700,900\" rel=\"stylesheet\">\n    <link rel=\"stylesheet\" href=\"/pixel-editor.css\" />\n    <meta name=\"ROBOTS\" content=\"NOINDEX, NOFOLLOW\">\n    {{{google-analytics}}}\n    {{{favicons}}}\n</head>\n\n<body oncontextmenu=\"return false;\">\n\t{{> compatibility-warning}}\n\t{{> preload}}\n\n\t{{> main-menu}}\n\t{{> tools-menu}}\n\t{{> colors-menu}}\n\t{{> layers-menu}}\n\n\t{{> tool-previews}}\n\t{{> canvases}}\n\t{{> holders}}\n   \n    <div id=\"pop-up-container\">\n\t\t{{> new-pixel}}\n\t\t{{> splash-page}}\n\t\t{{> sprite-resize}}\n\t\t{{> canvas-resize}}\n\t\t{{> palette}}\n\t\t{{> help}}\n\t\t{{> about}}\n\t\t{{> changelog}}\n\t\t{{> credits}}\n\t\t{{> settings}}\n\t\t{{> pixel-export}}\n\t\t{{> save-project}}\n    </div>\n\n    <script src=\"/pixel-editor.js\"></script>\n    {{#reload}}<script src=\"/reload/reload.js\"></script>{{/reload}}\n</body>\n</html>",
        "filePath": "./views/index.hbs",
        "dblCurlsArr": [
            "title",
            "{google-analytics",
            "{favicons",
            "> compatibility-warning",
            "> preload",
            "> main-menu",
            "> tools-menu",
            "> colors-menu",
            "> layers-menu",
            "> tool-previews",
            "> canvases",
            "> holders",
            "> new-pixel",
            "> splash-page",
            "> sprite-resize",
            "> canvas-resize",
            "> palette",
            "> help",
            "> about",
            "> changelog",
            "> credits",
            "> settings",
            "> pixel-export",
            "> save-project",
            "#reload",
            "/reload"
        ],
        "partialArr": [
            "compatibility-warning",
            "preload",
            "main-menu",
            "tools-menu",
            "colors-menu",
            "layers-menu",
            "tool-previews",
            "canvases",
            "holders",
            "new-pixel",
            "splash-page",
            "sprite-resize",
            "canvas-resize",
            "palette",
            "help",
            "about",
            "changelog",
            "credits",
            "settings",
            "pixel-export",
            "save-project"
        ]
    },
    "./views/layers-menu.hbs": {
        "fileStr": "<!-- LAYER MENU -->\n<ul id=\"layers-menu\">\n\t<li class = \"layers-menu-entry selected-layer\">\n\t\t<canvas class = \"preview-canvas\"></canvas>\n\t\t<ul class=\"layer-buttons\">\n\t\t\t<li class = \"layer-button\">\n\t\t\t\t<button title=\"Lock layer\" class=\"lock-layer-button\">\n\t\t\t\t\t{{svg \"unlockedpadlock.svg\" width=\"15\" height=\"15\" class = \"default-icon\"}}\n\t\t\t\t\t{{svg \"lockedpadlock.svg\" width=\"15\" height=\"15\" class = \"edited-icon\" display = \"none\"}}\n\t\t\t\t</button>\n\t\t\t</li>\n\t\t\t<li class = \"layer-button\">\n\t\t\t\t<button title=\"Show / hide layer\" class=\"hide-layer-button\">\n\t\t\t\t\t{{svg \"visible.svg\" width=\"15\" height=\"15\" class = \"default-icon\"}}\n\t\t\t\t\t{{svg \"invisible.svg\" width=\"15\" height=\"15\" class = \"edited-icon\" display = \"none\"}}\n\t\t\t\t</button>\n\t\t\t</li>\n\t\t</ul>\n\n\t\t<p>Layer 0<div class = \"gradient\"></div></p>\n\t</li>\n\n\t<li>\n\t\t<button id=\"add-layer-button\">\n\t\t\t{{svg \"plus.svg\" width=\"20\" height=\"20\"}} Add layer\n\t\t</button>\n\t</li>\n</ul>\n\n<ul id=\"layer-properties-menu\">\n\t<li>\n\t\t<button onclick = \"LayerList.renameLayer()\">Rename</button>\n\t</li>\n\t<li>\n\t\t<button onclick = \"LayerList.duplicateLayer()\">Duplicate</button>\n\t</li>\n\t<li>\n\t\t<button onclick = \"LayerList.deleteLayer()\">Delete</button>\n\t</li>\n\t<li>\n\t\t<button onclick = \"LayerList.merge()\">Merge below</button>\n\t</li>\n\t<li> \n\t\t<button onclick = \"LayerList.flatten(true)\">Flatten visible</button>\n\t</li>\n\t<li>\n\t\t<button onclick = \"LayerList.flatten(false)\">Flatten all</button>\n\t</li>\n</ul>",
        "filePath": "./views/layers-menu.hbs",
        "dblCurlsArr": [
            "svg \"unlockedpadlock.svg\" width=\"15\" height=\"15\" class = \"default-icon\"",
            "svg \"lockedpadlock.svg\" width=\"15\" height=\"15\" class = \"edited-icon\" display = \"none\"",
            "svg \"visible.svg\" width=\"15\" height=\"15\" class = \"default-icon\"",
            "svg \"invisible.svg\" width=\"15\" height=\"15\" class = \"edited-icon\" display = \"none\"",
            "svg \"plus.svg\" width=\"20\" height=\"20\""
        ],
        "partialArr": []
    },
    "./views/layout-contribute.hbs": {
        "fileStr": "<!doctype html>\n\n<html lang=\"en\">\n<head>\n    <meta charset=\"utf-8\">\n    {{#title}}<title>{{this}}</title>{{/title}}\n    {{#css}}<link rel=\"stylesheet\" href=\"{{this}}\">{{/css}}\n</head>\n\n<body>\n    <section class=\"wrapper\">\n        {{{body}}}\n    </section>\n    {{#js}}<script src=\"{{this}}\"></script>{{/js}}\n</body>\n</html>",
        "filePath": "./views/layout-contribute.hbs",
        "dblCurlsArr": [
            "#title",
            "this",
            "/title",
            "#css",
            "this",
            "/css",
            "{body",
            "#js",
            "this",
            "/js"
        ],
        "partialArr": []
    },
    "./views/main-menu.hbs": {
        "fileStr": "<ul id=\"main-menu\" class=\"editor-top-menu\">\n\t<li class=\"logo\">Lospec Pixel Editor</li>\n\t<li>\n\t\t<button>File</button>\n\t\t<ul>\n\t\t\t<li><button>New</button></li>\n\t\t\t<li><button>Save project</button></li>\n\t\t\t<li><button>Open</button></li>\n\t\t\t<li><button id=\"export-button\" class=\"disabled\">Export</button></li>\n\t\t\t<li><a href=\"https://lospec.com/pixel-editor\">Exit</a></li>\n\t\t</ul>\n\t</li>\n\t<li>\n\t\t<button>Edit</button>\n\t\t<ul>\n\t\t\t<li><button id=\"resize-canvas-button\" onclick = \"currFile.openResizeCanvasWindow()\">Resize canvas</button></li>\n\t\t\t<li><button id=\"resize-sprite-button\" onclick = \"currFile.openResizeSpriteWindow()\">Scale sprite</button></li>\n\t\t\t<li><button onclick = \"currFile.trimCanvas()\">Trim canvas</button></li>\n\t\t\t<li><button id=\"undo-button\" class=\"disabled\">Undo</button></li>\n\t\t\t<li><button id=\"redo-button\" class=\"disabled\">Redo</button></li>\n\t\t</ul>\n\t</li>\n\t<li>\n\t\t<button>View</button>\n\t\t<ul>\n\t\t\t<li><button id=\"toggle-pixelgrid-button\" onclick=\"currFile.pixelGrid.togglePixelGrid()\">Show pixel grid</button></li>\n\t\t</ul>\n\t</li>\n\t<li>\n\t\t<button id=\"layer-button\">Layer</button>\n\t\t<ul>\n\t\t\t<li><button onclick = \"LayerList.addLayer()\">New layer</button></li>\n\t\t\t<li><button onclick = \"LayerList.duplicateLayer()\">Duplicate</button></li>\n\t\t\t<li><button onclick = \"LayerList.renameLayer()\">Rename</button></li>\n\t\t\t<li><button onclick = \"LayerList.deleteLayer()\">Delete</button></li>\n\t\t\t<li><button onclick = \"LayerList.merge()\">Merge below</button></li>\n\t\t\t<li><button onclick = \"LayerList.flatten(false)\">Flatten all</button></li>\n\t\t\t<li><button onclick = \"LayerList.flatten(true)\">Flatten visible</button></li>\n\t\t\t\n\t\t</ul>\n\t</li>\n\t<li>\n\t\t<button>Selection</button>\n\t\t<ul>\n\t\t\t<li><button id=\"copy-button\">Copy</button></li>\n\t\t\t<li><button id=\"cut-button\">Cut</button></li>\n\t\t\t<li><button id=\"paste-button\">Paste</button></li>\n\t\t\t<li><button id=\"cancelSelection-button\">Cancel</button></li>\n\t\t</ul>\n\t</li>\n\t<li>\n\t\t<button>Editor</button>\n\t\t<ul>\n\t\t\t<li><button id=\"switch-mode-button\">Switch to basic mode</button></li>\n\t\t\t<li><button onclick=\"Dialogue.showDialogue('splash', false)\">Splash page</button></li>\n\t\t\t<li><button>Settings</button></li>\n\t\t</ul>\n\t</li>\n\n\t<li>\n\t\t<button>Help</button>\n\t\t<ul>\n\t\t\t<li><button>Help</button></li>\n\t\t\t<li><button>About</button></li>\n\t\t\t<li><button>Changelog</button></li>\n\t\t</ul>\n\t</li>\n\n\t<li id=\"editor-info\">\n\t\t<ul>\n\t\t\t<li><label>Tool size: <input type=\"number\"/></label></li>\n\t\t\t<li>{{> checkbox}}</li>\n\t\t</ul>\n\t</li>\n</ul>",
        "filePath": "./views/main-menu.hbs",
        "dblCurlsArr": [
            "> checkbox"
        ],
        "partialArr": [
            "checkbox"
        ]
    },
    "./views/tools-menu.hbs": {
        "fileStr": "<ul id=\"tools-menu\">\n\t<li class=\"selected expanded\">\n\t\t<button id=\"brush-button\">{{svg \"pencil.svg\" width=\"24\" height=\"24\"}}</button>\n\t\t<ul class=\"size-buttons\">\n\t\t\t<button title=\"Increase Brush Size\" id=\"brush-bigger-button\" class=\"tools-menu-sub-button\">{{svg \"plus.svg\" width=\"12\" height=\"12\"}}</button>\n\t\t\t<button title=\"Decrease Brush Size\" id=\"brush-smaller-button\" class=\"tools-menu-sub-button\">{{svg \"minus.svg\" width=\"12\" height=\"12\"}}</button>\n\t\t</ul>\n\t</li>\n\n\t<li class = \"expanded\">\n\t\t<button id=\"eraser-button\">{{svg \"eraser.svg\" width=\"24\" height=\"24\"}}</button>\n\t\t<ul class=\"size-buttons\">\n\t\t\t<button title=\"Increase Eraser Size\" id=\"eraser-bigger-button\" class=\"tools-menu-sub-button\">{{svg \"plus.svg\" width=\"12\" height=\"12\"}}</button>\n\t\t\t<button title=\"Decrease Eraser Size\" id=\"eraser-smaller-button\" class=\"tools-menu-sub-button\">{{svg \"minus.svg\" width=\"12\" height=\"12\"}}</button>\n\t\t</ul>\n\t</li>\n\n\t<li class=\"expanded\">\n\t\t<button id=\"rectangle-button\">{{svg \"rectangle.svg\" width=\"24\" height=\"24\" id=\"rectangle-empty-button-svg\"}}\n\t\t{{svg \"fullrect.svg\" width=\"24\" height=\"24\" id=\"rectangle-full-button-svg\" display = \"none\"}}</button>\n\t\t<ul class=\"size-buttons\">\n\t\t\t<button title=\"Increase Rectangle Size\" id=\"rectangle-bigger-button\" class=\"tools-menu-sub-button\">{{svg \"plus.svg\" width=\"12\" height=\"12\"}}</button>\n\t\t\t<button title=\"Decrease Rectangle Size\" id=\"rectangle-smaller-button\" class=\"tools-menu-sub-button\">{{svg \"minus.svg\" width=\"12\" height=\"12\"}}</button>\n\t\t</ul>\n\t</li>\n\n\t<li class=\"expanded\">\n\t\t<button id=\"ellipse-button\">\n\t\t\t{{svg \"ellipse.svg\" width=\"24\" height=\"24\" id=\"ellipse-empty-button-svg\"}}\n\t\t\t{{svg \"filledellipse.svg\" width=\"24\" height=\"24\" id=\"ellipse-full-button-svg\" display = \"none\"}}\n\t\t</button>\n\t\t<ul class=\"size-buttons\">\n\t\t\t<button title=\"Increase Ellipse Size\" id=\"ellipse-bigger-button\" class=\"tools-menu-sub-button\">{{svg \"plus.svg\" width=\"12\" height=\"12\"}}</button>\n\t\t\t<button title=\"Decrease Ellipse Size\" id=\"ellipse-smaller-button\" class=\"tools-menu-sub-button\">{{svg \"minus.svg\" width=\"12\" height=\"12\"}}</button>\n\t\t</ul>\n\t</li>\n\n\t<li class=\"expanded\">\n\t\t<button id=\"line-button\">{{svg \"line.svg\" width=\"24\" height=\"24\"}}</button>\n\t\t<ul class=\"size-buttons\">\n\t\t\t<button title=\"Increase Line Size\" id=\"line-bigger-button\" class=\"tools-menu-sub-button\">{{svg \"plus.svg\" width=\"12\" height=\"12\"}}</button>\n\t\t\t<button title=\"Decrease Line Size\" id=\"line-smaller-button\" class=\"tools-menu-sub-button\">{{svg \"minus.svg\" width=\"12\" height=\"12\"}}</button>\n\t\t</ul>\n\t</li>\n\n\t<li><button id=\"fill-button\">{{svg \"fill.svg\" width=\"24\" height=\"24\"}}</button></li>\n\n\t<li><button id=\"rectselect-button\">{{svg \"rectselect.svg\" width = \"24\" height = \"24\"}}</button><li>\n\n\t<li><button id=\"lassoselect-button\">{{svg \"lasso.svg\" width = \"26\" height = \"26\"}}</button></li>\n\n\t<li><button id=\"magicwand-button\">{{svg \"magicwand.svg\" width = \"26\" height = \"26\"}}</button></li>\n\n\t<li><button id=\"eyedropper-button\">{{svg \"eyedropper.svg\" width=\"24\" height=\"24\"}}</button></li>\n\n\t<li><button id=\"pan-button\">{{svg \"pan.svg\" width=\"24\" height=\"24\"}}</button></li>\n</ul>\n\n<div id=\"tool-tutorial\" class=\"fade-in\">\n\t<h3>Brush tool</h3>\n\t<ul>\n\t\t<li><span class=\"keyboard-key\">B</span> to select the tool</li>\n\t\t<li><span class=\"keyboard-key\">Left drag</span> to use the tool</li>\n\t\t<li><span class=\"keyboard-key\">Right drag</span> to change tool size</li>\n\t\t<li><span class=\"keyboard-key\">+</span> or <span class=\"keyboard-key\">-</span> to change tool size</li>\n\t</ul>\n\t<img src=\"brush-tutorial.gif\"/>\n</div>\"",
        "filePath": "./views/tools-menu.hbs",
        "dblCurlsArr": [
            "svg \"pencil.svg\" width=\"24\" height=\"24\"",
            "svg \"plus.svg\" width=\"12\" height=\"12\"",
            "svg \"minus.svg\" width=\"12\" height=\"12\"",
            "svg \"eraser.svg\" width=\"24\" height=\"24\"",
            "svg \"plus.svg\" width=\"12\" height=\"12\"",
            "svg \"minus.svg\" width=\"12\" height=\"12\"",
            "svg \"rectangle.svg\" width=\"24\" height=\"24\" id=\"rectangle-empty-button-svg\"",
            "svg \"fullrect.svg\" width=\"24\" height=\"24\" id=\"rectangle-full-button-svg\" display = \"none\"",
            "svg \"plus.svg\" width=\"12\" height=\"12\"",
            "svg \"minus.svg\" width=\"12\" height=\"12\"",
            "svg \"ellipse.svg\" width=\"24\" height=\"24\" id=\"ellipse-empty-button-svg\"",
            "svg \"filledellipse.svg\" width=\"24\" height=\"24\" id=\"ellipse-full-button-svg\" display = \"none\"",
            "svg \"plus.svg\" width=\"12\" height=\"12\"",
            "svg \"minus.svg\" width=\"12\" height=\"12\"",
            "svg \"line.svg\" width=\"24\" height=\"24\"",
            "svg \"plus.svg\" width=\"12\" height=\"12\"",
            "svg \"minus.svg\" width=\"12\" height=\"12\"",
            "svg \"fill.svg\" width=\"24\" height=\"24\"",
            "svg \"rectselect.svg\" width = \"24\" height = \"24\"",
            "svg \"lasso.svg\" width = \"26\" height = \"26\"",
            "svg \"magicwand.svg\" width = \"26\" height = \"26\"",
            "svg \"eyedropper.svg\" width=\"24\" height=\"24\"",
            "svg \"pan.svg\" width=\"24\" height=\"24\""
        ],
        "partialArr": []
    },
    "./views/components/checkbox.hbs": {
        "fileStr": "<div class=\"checkbox-holder\">\n    <div class=\"checkbox checked\">\n        <label>Snap to grid</label>\n        <input type=\"hidden\"/>\n        <div class=\"box\">{{svg \"check\"}}</div>\n    </div>\n</div>",
        "filePath": "./views/components/checkbox.hbs",
        "dblCurlsArr": [
            "svg \"check\""
        ],
        "partialArr": []
    },
    "./views/popups/about.hbs": {
        "fileStr": "<div id=\"about\">\n\t<button class=\"close-button\">{{svg \"x.svg\" width=\"20\" height=\"20\"}}</button>\n\t<h1>About Lospec Pixel Editor</h1>\n\t<div>version 1.1.0</div>\n\t<p>This is a web-based tool for creating and editing pixel art.</p>\n\t<p>The goal of this tool is to be an accessible and intuitive tool that's simple enough for a first time pixel artist while still being usable enough for a veteran. </p>\n\t<p>In the future I hope to add enough features to become a full fledged pixel art editor, with everything an artist could need.</p>\n\t<h1>About Lospec</h1>\n\t<p>Lospec is a website created to host tools for pixel artists. To see more of our tools, visit our <a href=\"/\">homepage</a>. To hear about any updates or new tools, follow us on <a href=\"http://twitter.com/lospecofficial\">Twitter</a>.</p>\n</div>",
        "filePath": "./views/popups/about.hbs",
        "dblCurlsArr": [
            "svg \"x.svg\" width=\"20\" height=\"20\""
        ],
        "partialArr": []
    },
    "./views/popups/canvas-resize.hbs": {
        "fileStr": "<!--CANVAS RESIZE-->\n<div class=\"update\" id=\"resize-canvas\">\n\t<button class=\"close-button\">{{svg \"x.svg\" width=\"20\" height=\"20\"}}</button>\n\t<h1>Resize canvas</h1>\n\n\t<!--PIVOTS-->\n\t<span id=\"pivot-menu\">\n\t\t<button class=\"pivot-button\" value=\"topleft\">{{svg \"arrows/topleft.svg\" width=\"20\" height=\"20\"}}</button>\n\t\t<button class=\"pivot-button\" value=\"top\">{{svg \"arrows/top.svg\" width=\"20\" height=\"20\"}}</button>\n\t\t<button class=\"pivot-button\" value=\"topright\">{{svg \"arrows/topright.svg\" width=\"20\" height=\"20\"}}</button>\n\t\t<button class=\"pivot-button\" value=\"left\">{{svg \"arrows/left.svg\" width=\"20\" height=\"20\"}}</button>\n\t\t<button class=\"pivot-button rc-selected-pivot\" value=\"middle\">{{svg \"arrows/middle.svg\" width=\"20\" height=\"20\"}}</button>\n\t\t<button class=\"pivot-button\" value=\"right\">{{svg \"arrows/right.svg\" width=\"20\" height=\"20\"}}</button>\n\t\t<button class=\"pivot-button\" value=\"bottomleft\">{{svg \"arrows/bottomleft.svg\" width=\"20\" height=\"20\"}}</button>\n\t\t<button class=\"pivot-button\" value=\"bottom\">{{svg \"arrows/bottom.svg\" width=\"20\" height=\"20\"}}</button>\n\t\t<button class=\"pivot-button\" value=\"bottomright\">{{svg \"arrows/bottomright.svg\" width=\"20\" height=\"20\"}}</button>\n\t</span>\n\t<!-- SIZE-->\n\t<span id=\"rc-size-menu\">\n\t\t<h2>Size</h2>\n\t\t<div>\n\t\t\t<span>\n\t\t\t\tWidth: <input id=\"rc-width\" type=\"number\" default=\"0\" step=\"1\" \n\t\t\t\tvalue=\"{{#if border}}{{border}}{{else}}0{{/if}}\" autocomplete=\"off\"/>\n\t\t\t</span>\n\t\t\t\n\t\t\t<span>\n\t\t\t\tHeight: <input id=\"rc-height\" default=\"0\" step=\"1\" type=\"number\" \n\t\t\t\tvalue=\"{{#if border}}{{border}}{{else}}0{{/if}}\" autocomplete=\"off\"/>\n\t\t\t</span>\n\t\t</div>\n\t</span>        \n\t<!--BORDERS-->\n\t<span id=\"borders-menu\">\n\t\t<h2>Borders offsets</h2>\n\t\t<div>\n\t\t\t<span>\n\t\t\t\tLeft: <input id=\"rc-border-left\" type=\"number\" default=\"0\" step=\"1\" \n\t\t\t\tvalue=\"{{#if border}}{{border}}{{else}}0{{/if}}\" autocomplete=\"off\"/>\n\t\t\t</span>\n\t\t\t\n\t\t\t<span>\n\t\t\t\tRight: <input id=\"rc-border-right\" type=\"number\" default=\"0\" step=\"1\" \n\t\t\t\tvalue=\"{{#if border}}{{border}}{{else}}0{{/if}}\" autocomplete=\"off\"/>\n\t\t\t</span>\n\t\t\t\n\t\t\t<span>\n\t\t\t\tTop: <input id=\"rc-border-top\" type=\"number\" default=\"0\" step=\"1\" \n\t\t\t\tvalue=\"{{#if border}}{{border}}{{else}}0{{/if}}\" autocomplete=\"off\"/>\n\t\t\t</span>\n\t\t\t\n\t\t\t<span>\n\t\t\t\tBottom: <input id=\"rc-border-bottom\" default=\"0\" step=\"1\" type=\"number\" \n\t\t\t\tvalue=\"{{#if border}}{{border}}{{else}}0{{/if}}\" autocomplete=\"off\"/>\n\t\t\t</span>\n\t\t</div>\n\t\t<button id=\"resize-canvas-confirm\">Resize canvas</button>\n\t</span>            \n</div>",
        "filePath": "./views/popups/canvas-resize.hbs",
        "dblCurlsArr": [
            "svg \"x.svg\" width=\"20\" height=\"20\"",
            "svg \"arrows/topleft.svg\" width=\"20\" height=\"20\"",
            "svg \"arrows/top.svg\" width=\"20\" height=\"20\"",
            "svg \"arrows/topright.svg\" width=\"20\" height=\"20\"",
            "svg \"arrows/left.svg\" width=\"20\" height=\"20\"",
            "svg \"arrows/middle.svg\" width=\"20\" height=\"20\"",
            "svg \"arrows/right.svg\" width=\"20\" height=\"20\"",
            "svg \"arrows/bottomleft.svg\" width=\"20\" height=\"20\"",
            "svg \"arrows/bottom.svg\" width=\"20\" height=\"20\"",
            "svg \"arrows/bottomright.svg\" width=\"20\" height=\"20\"",
            "#if border",
            "border",
            "else",
            "/if",
            "#if border",
            "border",
            "else",
            "/if",
            "#if border",
            "border",
            "else",
            "/if",
            "#if border",
            "border",
            "else",
            "/if",
            "#if border",
            "border",
            "else",
            "/if",
            "#if border",
            "border",
            "else",
            "/if"
        ],
        "partialArr": []
    },
    "./views/popups/changelog.hbs": {
        "fileStr": "<div id=\"changelog\">\n\t<button class=\"close-button\">{{svg \"x.svg\" width=\"20\" height=\"20\"}}</button>\n\n\t<h1>Changelog</h1>\n\t{{#each changelog}}\n\t\t<h2>Version {{@key}}</h2>\n\t\t<ul>{{#each this}}\n\t\t\t<li>{{change}} <span class=\"weak\">- {{author}}</span></li>\n\t\t{{/each}}</ul>\n\t{{/each}}\n</div>",
        "filePath": "./views/popups/changelog.hbs",
        "dblCurlsArr": [
            "svg \"x.svg\" width=\"20\" height=\"20\"",
            "#each changelog",
            "@key",
            "#each this",
            "change",
            "author",
            "/each",
            "/each"
        ],
        "partialArr": []
    },
    "./views/popups/credits.hbs": {
        "fileStr": "<div id=\"credits\">\n\t<button class=\"close-button\">{{svg \"x.svg\" width=\"20\" height=\"20\"}}</button>\n\t<h1>Credits</h1>\n\t<h2>Icons</h2>\n\t<ul>\n\t\t<li><div>Icons made by <a href=\"http://www.freepik.com\" title=\"Freepik\">Freepik</a> from <a href=\"http://www.flaticon.com\" title=\"Flaticon\">www.flaticon.com</a> is licensed by <a href=\"http://creativecommons.org/licenses/by/3.0/\" title=\"Creative Commons BY 3.0\" target=\"_blank\">CC 3.0 BY</a></div></li>\n\t\t<li><div>Font Awesome by Dave Gandy - <a href=\"http://fontawesome.io\">http://fontawesome.io</a></div></li>\n\t\t<li><div>Icons made by <a href=\"http://www.flaticon.com/authors/those-icons\" title=\"Those Icons\">Those Icons</a> from <a href=\"http://www.flaticon.com\" title=\"Flaticon\">www.flaticon.com</a> is licensed by <a href=\"http://creativecommons.org/licenses/by/3.0/\" title=\"Creative Commons BY 3.0\" target=\"_blank\">CC 3.0 BY</a></div></li>\n\t</ul>\n</div>",
        "filePath": "./views/popups/credits.hbs",
        "dblCurlsArr": [
            "svg \"x.svg\" width=\"20\" height=\"20\""
        ],
        "partialArr": []
    },
    "./views/popups/help.hbs": {
        "fileStr": "<div id=\"help\">\n\t<button class=\"close-button\">{{svg \"x.svg\" width=\"20\" height=\"20\"}}</button>\n\t<h1>Help</h1>\n\t<h2>Palette</h2>\n\t<ul>\n\t\t<li>Left Click - Choose Color</li>\n\t\t<li>Right Click - Edit Color</li>\n\t</ul>\n\t<h2>Hotkeys</h2>\n\t<ul>\n\t\t<li><strong>Pencil:</strong> <span class=\"keyboard-key\">B</span> or <span class=\"keyboard-key\">1</span></li>\n\t\t<li><strong>Eraser:</strong> <span class=\"keyboard-key\">R</span></li>\n\t\t<li><strong>Rectangle:</strong> <span class=\"keyboard-key\">U</span></li>\n\t\t<li><strong>Line:</strong> <span class=\"keyboard-key\">L</span></li>\n\t\t<li><strong>Fill:</strong> <span class=\"keyboard-key\">F</span> or <span class=\"keyboard-key\">2</span></li>\n\t\t<li><strong>Eyedropper:</strong> <span class=\"keyboard-key\">E</span> or <span class=\"keyboard-key\">3</span></li>\n\t\t<li><strong>Pan:</strong> <span class=\"keyboard-key\">P</span> or <span class=\"keyboard-key\">M</span> or <span class=\"keyboard-key\">4</span></li>\n\t\t<li><strong>Zoom:</strong> <span class=\"keyboard-key\">Z</span> or <span class=\"keyboard-key\">5</span></li>\n\t\t<li><strong>Undo:</strong> Ctrl + <span class=\"keyboard-key\">Z</span></li>\n\t\t<li><strong>Redo:</strong> Ctrl + <span class=\"keyboard-key\">Y</span> or Ctrl + Alt + <span class=\"keyboard-key\">Z</span></li>\n\t\t<li><strong>Rectangular selection:</strong> <span class=\"keyboard-key\">M</span></li>\n\t</ul>\n\t<h2>Mouse Shortcuts</h2>\n\t<ul>\n\t\t<li><strong>Eyedropper: </strong>Alt + Click</li>\n\t\t<li><strong>Pan: </strong>Space + Click</li>\n\t\t<li><strong>Zoom: </strong>Alt + Scroll Wheel</li>\n\t</ul>\n\t<h2>Layers</h2>\n\t<ul>\n\t\t<li>{{svg \"visible.svg\" width=\"15\" height=\"15\" class = \"default-icon\"}}: show / hide layer</li>\n\t\t<li>{{svg \"lockedpadlock.svg\" width=\"15\" height=\"15\" class = \"default-icon\"}}: lock / unlock layer, when a layer is locked it's not possible to draw on it</li>\n\t\t<li>Right click on a layer to open the <strong>menu</strong>:\n\t\t\t<ul>\n\t\t\t\t<li><strong>Rename:</strong> change the name of the layer</li>\n\t\t\t\t<li><strong>Duplicate:</strong> duplicate the layer</li>\n\t\t\t\t<li><strong>Delete:</strong> delete the layer (doesn't work if there's only one layer)</li>\n\t\t\t\t<li><strong>Merge below:</strong> merges the selected the layer with the one below it</li>\n\t\t\t\t<li><strong>Flatten visible:</strong> merges all the visible layers</li>\n\t\t\t\t<li></strong>Flatten all:</strong> merges all the layers</li>\n\t\t\t</ul>\n\t\t</li>\n\t</ul>\n</div>",
        "filePath": "./views/popups/help.hbs",
        "dblCurlsArr": [
            "svg \"x.svg\" width=\"20\" height=\"20\"",
            "svg \"visible.svg\" width=\"15\" height=\"15\" class = \"default-icon\"",
            "svg \"lockedpadlock.svg\" width=\"15\" height=\"15\" class = \"default-icon\""
        ],
        "partialArr": []
    },
    "./views/popups/new-pixel.hbs": {
        "fileStr": "<!-- NEW PIXEL -->\n<div id=\"new-pixel\" class=\"update\">\n\t<button class=\"close-button\">{{svg \"x.svg\" width=\"20\" height=\"20\"}}</button>\n\t<h1>New Pixel</h1>\n\n\t<!-- Preset-->\n\t<h2>Preset</h2>\n\t<button id=\"preset-button\" class=\"dropdown-button\">Choose a preset...</button>\n\t<div id=\"preset-menu\" class=\"dropdown-menu\"></div>\n\n\t<h2>Size</h2>\n\t<input id=\"size-width\" value=\"{{#if width}}{{width}}{{else}}64{{/if}}\" autocomplete=\"off\" />{{svg \"x.svg\" width=\"16\" height=\"16\" class=\"dimentions-x\"}}<input id=\"size-height\" value=\"{{#if height}}{{height}}{{else}}64{{/if}}\" autocomplete=\"off\" />\n\t<h2>Palette</h2>\n\t<button id=\"palette-button\" class=\"dropdown-button\">Choose a palette...</button>\n\t<div id=\"palette-menu\" class=\"dropdown-menu\"><button id=\"no-palette-button\">Empty Palette</button><button id=\"load-palette-button\">Load palette...</button></div>\n\n\t<div id=\"new-pixel-warning\">Creating a new pixel will discard your current one.</div>\n\t<div>\n\t\t<button id=\"create-button\" class=\"default\">Create</button>\n\t</div>\n</div>",
        "filePath": "./views/popups/new-pixel.hbs",
        "dblCurlsArr": [
            "svg \"x.svg\" width=\"20\" height=\"20\"",
            "#if width",
            "width",
            "else",
            "/if",
            "svg \"x.svg\" width=\"16\" height=\"16\" class=\"dimentions-x\"",
            "#if height",
            "height",
            "else",
            "/if"
        ],
        "partialArr": []
    },
    "./views/popups/palette.hbs": {
        "fileStr": "<!-- PALETTE -->\n<div id=\"palette-block\">\n\t<button class=\"close-button\">{{svg \"x.svg\" width=\"20\" height=\"20\"}}</button>\n\t\n\t<h1>Edit palette</h1>\n\t\n\t<div id=\"colour-picker\">\n\t\t<div id=\"cp-modes\">\n\t\t\t<button id=\"cp-rgb\" class=\"cp-selected-mode\">RGB</button>\n\t\t\t<button id=\"cp-hsv\">HSV</button>\n\t\t\t<button id=\"cp-hsl\">HSL</button>\n\t\t\t\n\t\t\t<div id=\"cp-colour-preview\" class=\"cp-colour-preview\"></div>\n\t\t\t<input id=\"cp-hex\" type=\"text\" value=\"#123456\"/>\n\t\t</div>\n\n\t\t<div id=\"sliders-container\">\n\t\t\t<div class = \"cp-slider-entry\">\n\t\t\t\t<label for = \"first-slider\">R</label>\n\t\t\t\t<input type=\"range\" min=\"0\" max=\"255\" class=\"colour-picker-slider\" id=\"first-slider\"/>\n\t\t\t\t<input type = \"text\" value = \"128\" id=\"cp-sliderText1\"/>\n\t\t\t</div>\n\n\t\t\t<div class = \"cp-slider-entry\">\n\t\t\t\t<label for = \"second-slider\">G</label>\n\t\t\t\t<input type=\"range\" min=\"0\" max =\"255\" class=\"colour-picker-slider\" id=\"second-slider\"/>\n\t\t\t\t<input type = \"text\" value = \"128\" id=\"cp-sliderText2\"/>\n\t\t\t</div>\n\n\t\t\t<div class = \"cp-slider-entry\">\n\t\t\t\t<label for = \"third-slider\">B</label>\n\t\t\t\t<input type=\"range\" min = \"0\" max = \"255\" class = \"colour-picker-slider\" id=\"third-slider\"/>\n\t\t\t\t<input type = \"text\" value = \"128\" id=\"cp-sliderText3\"/>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div id=\"cp-minipicker\">\n\t\t\t<input type = \"range\" min = \"0\" max = \"100\" id=\"cp-minipicker-slider\"/>\n\t\t\t<div id=\"cp-canvas-container\">\n\t\t\t\t<canvas id=\"cp-spectrum\"></canvas>\n\t\t\t\t<div id=\"cp-active-icon\" class=\"cp-picker-icon\"></div>\n\t\t\t</div>\n\n\t\t\t<div id=\"cp-colours-previews\">\n\t\t\t\t<div class = \"cp-colour-preview\">\n\t\t\t\t\t#123456\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div id=\"cp-colour-picking-modes\">\n\t\t\t\t<button id=\"cp-mono\" class=\"cp-selected-mode\">Mono</button>\n\t\t\t\t<button id=\"cp-analog\">Nlgs</button>\n\t\t\t\t<button id=\"cp-cmpt\">Cmpt</button>\n\t\t\t\t<button id=\"cp-tri\">Tri</button>\n\t\t\t\t<button id=\"cp-scmpt\">Scm</button>\n\t\t\t\t<button id=\"cp-tetra\">Tetra</button>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\n\t<div id=\"palette-container\">\n\t\t<ul id=\"palette-list\">\n\t\t\t<li style = \"background-color:rgb(255,0,0);width:40px;height:40px;\" onmousedown=\"PaletteBlock.startRampSelection(event)\"\n\t\t\tonmousemove=\"PaletteBlock.updateRampSelection(event)\" onmouseup=\"PaletteBlock.endRampSelection(event)\"></li>\n\t\t\t<li style = \"background-color:rgb(0,255,0);width:40px;height:40px;\"onmousedown=\"PaletteBlock.startRampSelection(event)\"\n\t\t\tonmousemove=\"PaletteBlock.updateRampSelection(event)\" onmouseup=\"PaletteBlock.endRampSelection(event)\"></li>\n\t\t</ul>\n\t</div>\n\n\t<div id=\"pb-options\">\n\t\t<button title=\"Add colours to palette\" id=\"pb-addcolours\">Add colours</button>\n\t\t<button title=\"Remove colours from palette\" id=\"pb-removecolours\">Remove colours</button>\n\t</div>\n</div>",
        "filePath": "./views/popups/palette.hbs",
        "dblCurlsArr": [
            "svg \"x.svg\" width=\"20\" height=\"20\""
        ],
        "partialArr": []
    },
    "./views/popups/pixel-export.hbs": {
        "fileStr": "<div id=\"export\" class=\"pixel-export\">\n\t<button class=\"close-button\">{{svg \"x.svg\" width=\"20\" height=\"20\"}}</button>\n\t\n\t<h1>Export File</h1>\n\n\t<div class=\"export-configuration\">\n\t\t<h2>File Name</h2>\n\t\t<input id=\"export-file-name\" autocomplete=\"off\"/>\n\t</div>\n\n\t<div class=\"popup-actions\">\n\t\t<button class=\"default\" id=\"export-confirm\">Export</button>\n\t</div>\n</div>",
        "filePath": "./views/popups/pixel-export.hbs",
        "dblCurlsArr": [
            "svg \"x.svg\" width=\"20\" height=\"20\""
        ],
        "partialArr": []
    },
    "./views/popups/save-project.hbs": {
        "fileStr": "<div id=\"save-project\" class=\"save-project\">\n\t<button class=\"close-button\">{{svg \"x.svg\" width=\"20\" height=\"20\"}}</button>\n\t\n\t<h1>Save Project</h1>\n\n\t<div class=\"save-project-configuration\">\n\t\t<h2>File Name</h2>\n\t\t<input id=\"lpe-file-name\" autocomplete=\"off\" />\n\t</div>\n\n\t<div class=\"popup-actions\">\n\t\t<button class=\"default\" id=\"save-project-confirm\">Save</button>\n\t</div>\n</div>",
        "filePath": "./views/popups/save-project.hbs",
        "dblCurlsArr": [
            "svg \"x.svg\" width=\"20\" height=\"20\""
        ],
        "partialArr": []
    },
    "./views/popups/settings.hbs": {
        "fileStr": "<div id=\"settings\">\n\t<button class=\"close-button\">{{svg \"x.svg\" width=\"20\" height=\"20\"}}</button>\n\t<h1>Settings</h1>\n\n\t<div id=\"settings-container\">\n\t\t<h2>History</h2>\n\t\t<div class = \"settings-entry\">\n\t\t\t<label for=\"setting-numberOfHistoryStates\">Number of History States</label> <input id=\"setting-numberOfHistoryStates\" value=\"200\" autocomplete=\"off\" />\n\t\t</div>\n\n\t\t<h2>Pixel grid</h2>\n\t\t<div class = \"settings-entry\">\n\t\t\t<label for=\"setting-pixelGridColour\">Colour of the pixel grid</label><input id=\"setting-pixelGridColour\" value = \"#0000FF\" autocomplete=\"off\"/>\n\t\t</div>\n\t</div>\n\n\t<p id=\"cookies-disabled-warning\">Your browsers cookies are disabled, settings will be lost upon closing this page.</p>\n\n\t<div>\n\t\t<button id=\"save-settings\" class=\"default\">Save</button>\n\t</div>\n</div>",
        "filePath": "./views/popups/settings.hbs",
        "dblCurlsArr": [
            "svg \"x.svg\" width=\"20\" height=\"20\""
        ],
        "partialArr": []
    },
    "./views/popups/splash-page.hbs": {
        "fileStr": "<!-- Splash page -->\n<div id=\"splash\">\n\t<div id=\"splash-news\">\n\t\t\t<div id=\"latest-update\">\n\t\t\t<h1>Latest updates</h1>\n\n\t\t\t{{> latestLog}}\n\t\t</div>\n\t</div>\n\n\t<div id=\"splash-input\">\n\t\t<div id=\"editor-logo\">\n\t\t\t<div id=\"black\">\n\t\t\t\t<div id=\"sp-coverdata\">\n\t\t\t\t\t<img src=\"https://cdn.lospec.com/static/brand/lospec_logo_3x.png\"/> pixel editor\n\t\t\t\t\t<p>Version 1.4.0</p>\n\t\t\t\t\t<a href=\"https://cdn.discordapp.com/attachments/506277390050131978/795660870221955082/final.png\">Art by Unsettled</a>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class=\"splash-menu\">\n\t\t\t<div id=\"sp-newpixel\">\n\t\t\t\t<h1>New Custom Pixel</h1>\n\n\t\t\t\t<h2>Size</h2>\n\t\t\t\t<div class=\"sp-np-entry\">\n\t\t\t\t\t<input id=\"size-width-splash\" value=\"{{#if width}}{{width}}{{else}}64{{/if}}\" autocomplete=\"off\" />{{svg \"x.svg\" width=\"16\" height=\"16\" class=\"dimentions-x\"}}<input id=\"size-height-splash\" value=\"{{#if height}}{{height}}{{else}}64{{/if}}\" autocomplete=\"off\" />\n\t\t\t\t</div>\n\t\t\t\t\n\t\t\t\t<h2>Palette</h2>\n\t\t\t\t<button id=\"palette-button-splash\" class=\"dropdown-button\">Choose a palette...</button>\n\t\t\t\t<div id=\"palette-menu-splash\" class=\"dropdown-menu\"><button id=\"load-palette-button-splash\">Load palette...</button></div>\n\n\t\t\t\t<div id=\"new-pixel-warning\">Creating a new pixel will discard your current one.</div>\n\t\t\t\t<div class=\"sp-np-entry\">\n\t\t\t\t\t<button id=\"create-button-splash\" class=\"default\">Create</button>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t\n\t\t\t<div id=\"sp-quickstart-container\">\n\t\t\t\t<div id=\"sp-quickstart-title\">\n\t\t\t\t\tQuickstart\n\t\t\t\t</div>\n\n\t\t\t\t<div id=\"sp-quickstart\">\n\t\t\t\t\t<div class=\"sp-template\" onclick=\"document.getElementById('open-image-browse-holder').click()\"><p>Load</p></div>\n\t\t\t\t\t<div class=\"sp-template\" onclick=\"Startup.newFromTemplate('Gameboy Color')\"><p><span>New</span> Gameboy</p></div>\n\t\t\t\t\t<div class=\"sp-template\" onclick=\"Startup.newFromTemplate('Commodore 64')\"><p><span>New</span> C64</p></div>\n\t\t\t\t\t<div class=\"sp-template\" onclick=\"Startup.newFromTemplate('PICO-8')\"><p><span>New</span> Pico8</p></div>\n\t\t\t\t\t<div class=\"sp-template\" onclick=\"Startup.newFromTemplate('',16,16)\"><p><span>New</span> 16x16</p></div>\n\t\t\t\t\t<div class=\"sp-template\" onclick=\"Startup.newFromTemplate('',32,32)\"><p><span>New</span> 32x32</p></div>\n\t\t\t\t\t<div class=\"sp-template\" onclick=\"Startup.newFromTemplate('',64,64)\"><p><span>New</span> 64x64</p></div>\n\t\t\t\t\t<div class=\"sp-template\" onclick=\"Startup.newFromTemplate('',128,128)\"><p><span>New</span> 128x128</p></div>\n\t\t\t\t\t<div class=\"sp-template\" onclick=\"Startup.newFromTemplate('',256,256)\"><p><span>New</span> 256x256</p></div>\n\t\t\t\t\t<div class=\"sp-template\" onclick=\"Startup.newFromTemplate('',512,512)\"><p><span>New</span> 512x512</p></div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"mode-switcher\">\n\t\t\t\t\t<span class=\"basic\">You are using Basic Mode.</span> \n\t\t\t\t\t<span class=\"advanced\">You are using Advanced Mode.</span> \n\t\t\t\t\t<a id=\"switch-editor-mode-splash\" href=\"#\">\n\t\t\t\t\t\t<span class=\"basic\">Switch to Advanced Mode.</span> \n\t\t\t\t\t\t<span class=\"advanced\">Switch to using Basic Mode.</span> \n\t\t\t\t\t\t»\n\t\t\t\t\t\t</a>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>",
        "filePath": "./views/popups/splash-page.hbs",
        "dblCurlsArr": [
            "> latestLog",
            "#if width",
            "width",
            "else",
            "/if",
            "svg \"x.svg\" width=\"16\" height=\"16\" class=\"dimentions-x\"",
            "#if height",
            "height",
            "else",
            "/if"
        ],
        "partialArr": [
            "latestLog"
        ]
    },
    "./views/popups/sprite-resize.hbs": {
        "fileStr": "<!--SPRITE RESIZE-->\n<div class=\"update\" id=\"resize-sprite\">\n\t<button class=\"close-button\">{{svg \"x.svg\" width=\"20\" height=\"20\"}}</button>\n\t<h1>Scale sprite</h1>\n\t<!-- SIZE-->\n\t<h2>New size</h2>\n\t<span id=\"rs-size-menu\">\n\t\t<div>\n\t\t\t<span>\n\t\t\t\tWidth: <input id=\"rs-width\" type=\"number\" default=\"0\" step=\"1\" \n\t\t\t\tvalue=\"{{#if border}}{{border}}{{else}}0{{/if}}\" autocomplete=\"off\"/>\n\t\t\t</span>\n\t\t\t\n\t\t\t<span>\n\t\t\t\tHeight: <input id=\"rs-height\" default=\"0\" step=\"1\" type=\"number\" \n\t\t\t\tvalue=\"{{#if border}}{{border}}{{else}}0{{/if}}\" autocomplete=\"off\"/>\n\t\t\t</span>\n\t\t</div>\n\t</span>        \n\t<!--BORDERS-->\n\t<h2>Resize percentages</h2>\n\t<span id=\"rs-percentage-menu\">\n\t\t<div>\n\t\t\t<span>\n\t\t\t\tWidth <input id=\"rs-width-percentage\" type=\"number\" default=\"0\" step=\"1\" \n\t\t\t\tvalue=\"{{#if border}}{{border}}{{else}}0{{/if}}\" autocomplete=\"off\"/> %\n\t\t\t</span>\n\t\t\t\n\t\t\t<span>\n\t\t\t\tHeight <input id=\"rs-height-percentage\" type=\"number\" default=\"0\" step=\"1\" \n\t\t\t\tvalue=\"{{#if border}}{{border}}{{else}}0{{/if}}\" autocomplete=\"off\"/> %\n\t\t\t</span>\n\t\t</div>\n\t\t<div id=\"rs-ratio-div\">\n\t\t\t<span>\n\t\t\t\tKeep current ratio <input type = \"checkbox\" id=\"rs-keep-ratio\"/>\n\t\t\t</span>\n\t\t\t<span>\n\t\t\t\tScaling algorithm:\n\t\t\t\t<select name = \"resize-algorithm\" id=\"resize-algorithm-combobox\">\n\t\t\t\t\t<option value = \"nearest-neighbor\">Nearest neighbour</option>\n\t\t\t\t\t<option value = \"bilinear-interpolation\">Bilinear</option>\n\t\t\t\t</select>\n\t\t\t</span>\n\t\t\t</br>\n\t\t\t<button id=\"resize-sprite-confirm\">Scale sprite</button>\n\t\t</div>\n\t</span>            \n</div>",
        "filePath": "./views/popups/sprite-resize.hbs",
        "dblCurlsArr": [
            "svg \"x.svg\" width=\"20\" height=\"20\"",
            "#if border",
            "border",
            "else",
            "/if",
            "#if border",
            "border",
            "else",
            "/if",
            "#if border",
            "border",
            "else",
            "/if",
            "#if border",
            "border",
            "else",
            "/if"
        ],
        "partialArr": []
    }
}