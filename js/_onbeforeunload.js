//prevent user from leaving page with unsaved data
window.onbeforeunload = function() {
    if (documentCreated)
        return 'You will lose your pixel if it\'s not saved!';

    else return;
};
