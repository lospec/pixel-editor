# Lospec Pixel Editor

This is a browser based software for creating pixel art

The tool can be viewed online here: https://lospec.com/pixel-editor

## How to contribute

Please do not submit pull requests with new features or core changes. Instead, please file an issue first for discussion.

## What to Contribute

Any changes that fix bugs or add features are welcome.

The next version is mostly focused on adding missing essential features and porting to mobile.

Suggestions / Planned features:

- Documentation
- Possibility to hide and resize menus (layers, palette)
- Tiled mode
- Load palette from LPE file
- Symmetry options (currently being worked on)
- Make a palette grid instead of having a huge stack on the right when colours are too many
- Possibly add collaborate function

- Code refactoring
    - Find and fix inefficient sections (nested loops, useless / inefficient parts)
    - Refactor the ColorPicker IIFE

- Mobile
    - Touch equivalent for mouse clicks
    - Hide or scale ui
    - Maybe rearrange UI on portrait
    - Fix popups
	
- Polish:
    - CTRL+A to select everything / selection -> all, same for deselection
	- Warning windows for wrong inputs
	- Palette option remove unused colors
	- Move selection with arrows
	- Update borders by dragging the canvas' edges with the mouse when resizing canvas
	- Move the canvases so they're centered after resizing the canvas (maybe a .center() method in layer class)
    - Scale selection

## How to Contribute

### Requirements

You must have node.js and git installed.

You also need `npm` in version 7 (because of 2nd version of lockfile which was introduced there) which comes with Node.js 15 or newer. To simplify installation of proper versions you can make use of [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) and run `nvm install` – it will activate proper Node.js version in your current command prompt session.

### Contribution Workflow

1. Click **Fork** above. It will automatically create a copy of this repository and add it to your account.
2. Clone the repository to your computer.
3. Open the folder in command prompt and run **`npm install`**
4. Make any changes you would like to suggest.
5. In command prompt run **`npm run hot`** which will compile app to the `/build` folder, serve under [http://localhost:3000](http://localhost:3000), then open in your browser. Moreover, it restarts server every time you save your changes in a codebase. You can go even further by running `npm run hot:reload`, which will also trigger webpage reloads.
6. Add, Commit and Push your changes to your fork.
7. On the github page for your fork, click **New Pull Request** above the file list.
8. Change the **head repository** dropdown to your fork.
9. Add a title and description explaining your changes.
10. Click create pull request.

If you have any trouble, see this page: https://help.github.com/en/articles/creating-a-pull-request-from-a-fork

### Feature Toggles

Some feature might be hidden by default. Functions to enable/disable them are available inside global `featureToggles` and operate on a `window.localStorage`.

For example use `featureToggles.enableEllipseTool()` to make ellipse tool button visible. Then `featureToggles.disableEllipseTool()` to hide it.

## License

This software may not be resold, redistributed, rehosted or otherwise conveyed to a third party.
