# -*DEPRECATED*- Lospec Pixel Editor

**⚠ The Lospec Pixel Editor is no longer in development and is no longer accepting contributions.**  
**It remains available at https://lospec.com/pixel-editor in it's current state, but may contain bugs.**

This is a browser based software for creating pixel art

## Before contributing

Before starting to work, please open an issue for discussion so that we can organize the work without creating too many conflicts. If your contribution is going to fix a bug, please
 make a fork and use the bug-fixes branch. If you want to work on a new feature, please use the new-feature branch instead.

## What to Contribute

Any changes that fix bugs or add features are welcome. Check out the issues if you don't know where to start: if 
you're new to the editor, we suggest you check out the Wiki first.

The next version is mostly focused on adding missing essential features and porting to mobile.

Suggestions / Planned features:

- Documentation
- Possibility to hide and resize menus (layers, palette)
- Tiled mode
- Load palette from LPE file
- Symmetry options (currently being worked on)
- Make a palette grid instead of having a huge stack on the right when colours are too many
- Possibly add collaborate function

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
    - Scale / rotate selection

## How to Contribute

### Requirements
No requirements if you want to use Github's Codespaces. If you prefer to setup your environment on desktop, you'll need to have node.js and git installed.

You also need `npm` in version 7 (because of 2nd version of lockfile which was introduced there) which comes with Node.js 15 or newer. To simplify installation of proper versions you can make use of [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) and run `nvm install` – it will activate proper Node.js version in your current command prompt session.

### Contribution Workflow

#### Github Codespaces
1. Click **Fork** above. It will automatically create a copy of this repository and add it to your account.
2. At the top of this page, select the branch you want to work on.
3. Click on "Code". Select the "Codespaces" submenu and click on "Create codespace on **branch name**".
4. Run `npm install`. Then run `npm run hot`: it will open a popup containing the editor, so make sure to disable your adblock if you're using one.

#### Desktop environment

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
