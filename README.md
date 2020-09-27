# Lospec Pixel Editor

This is a browser based software for creating pixel art

The tool can be viewed online here: https://lospec.com/pixel-editor

## What to Contribute

Any changes that fix bugs or add features are welcome.

The next version is mostly focused on adding missing essential features and porting to mobile.

Suggestions / Planned features:

- Line tool
- Tiled mode
- Load palette from LPE file
- Move colours in (advanced) palette editor
- Symmetry options

- Custom color picker
    - custom code without dependencies
    - more features such as sliders / color modes

- Mobile
    - Touch equivalent for mouse clicks
    - Hide or scale ui
    - Maybe rearrange UI on portrait
    - Stack colors when too many
    - Fix popups
    
- Possibly add collaborate function
	
- Polish:
    - ctrl + a to select everything / selection -> all, same for deselection
	- Show colors which would need to be added to palette
	- Warning windows for wrong inputs
	- Palette option remove unused colors
	- Move selection with arrows
	- Update pivot buttons when resizing canvas
	- Update borders by dragging the canvas' edges with the mouse when resizing canvas
	- Move the canvases so they're centered after resizing the canvas (maybe a .center() method in layer class)
    - Trim canvas

## How to Contribute

Requirements: you must have node.js and git installed.

1. Click **Fork** above. It will automatically create a copy of this repository and add it to your account.
2. Clone the repository to your computer.
3. Open the folder in command prompt and run **npm install**
4. Make any changes you would like to suggest.
5. In command prompt run **node build.js** which will compile it to the */build* folder, where you can make sure it works
6. Add, Commit and Push your changes to your fork.
7. On the github page for your fork, click **New Pull Request** above the file list.
8. Change the **head repository** dropdown to your fork.
9. Add a title and description explaining your changes.
10. Click create pull request.

If you have any trouble, see this page: https://help.github.com/en/articles/creating-a-pull-request-from-a-fork

## License

This software may not be resold, redistributed, rehosted or otherwise conveyed to a third party.
