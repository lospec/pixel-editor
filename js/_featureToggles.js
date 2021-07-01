const featureToggles = (function featureTogglesModule() {

    const ellipseToolLocalStorageKey = 'feature_ellipseTool';

    return {
        onLoad: () => {
            updateEllipseToolVisibility()
        },
        enableEllipseTool,
        disableEllipseTool
    }

    ////////

    function updateEllipseToolVisibility() {
        // TODO: [ELLIPSE] Once ellipse is ready for release make it enabled by default
        const isEllipseToolEnabled = (window.localStorage.getItem(ellipseToolLocalStorageKey) === "yes") || false;
        const ellipseToolElement = document.getElementById("tools-menu--ellipse");
        ellipseToolElement.style.display = isEllipseToolEnabled ? 'block' : 'none';
    }

    function enableEllipseTool() {
        window.localStorage.setItem(ellipseToolLocalStorageKey, "yes");
        updateEllipseToolVisibility();
    }

    function disableEllipseTool() {
        window.localStorage.setItem(ellipseToolLocalStorageKey, "no");
        updateEllipseToolVisibility();
    }

})();

