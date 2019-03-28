# Lospec Pixel Editor

This is a browser based software for creating pixel art

The tool can be viewed online here: https://lospec.com/pixel-editor

## What to Contribute

Any changes that fix bugs or add features are welcome.

The next version is mostly focused on adding missing essential features and porting to mobile.

Suggestions / Planned features:

- Mobile 
    - Touch equivalent for mouse clicks 
    - Hide or scale ui 
    - Maybe rearrange UI on portrait 
    - Stack colors when too many 
    - Fix popups 

- Selections 
    - New selection tool 
    - New canvas layer above the drawing layer 
    - Move when click and drag 
    - Merge with canvas when click outside 

- Copy/paste 
    - Add as selection 
    - Show colors which would need to be added to palette 

- Transparency 
    - New layer with checkerboard behind drawing
    - Add eraser tool 

- Palette option remove unused colors 
- Pixel Grid 
    - Another canvas 
    - Must be rescaled each zoom 

- Possibly add collaborate function using together.js 
- Bug fix 
    - Alt + scroll broken 
    - Add edge support?

## How to Contribute

Requirements: you must have node.js and git installed.

1. Click **Fork** above. It will automatically create a copy of this repository and add it to your account.
2. Clone the repository to your computer.
3. Open the folder in command prompt and run **npm install**
4. Make any changes you would like to suggest.
5. In command prompt run **node build.js** which will compile it to the */build* folder, where you can make sure it works
6. Add, Commit and Push your changes to your fork.
7. On this page, click **New Pull Request** above the file list.
8. Change the **head repository** dropdown to your fork.
9. Add a title and description explaining your changes.
10. Click create pull request.

If you have any trouble, see this page: https://help.github.com/en/articles/creating-a-pull-request-from-a-fork

## License

This software may not be resold, redistributed, rehosted or otherwise conveyed to a third party.
