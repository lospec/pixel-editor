const path = require('path');
const express = require('express');
const reload = require('reload');
const app = express();

const BUILDDIR = process.argv[2] || './build';
const PORT = process.argv[3] || 3000;


//ROUTE - other files
app.use('/pixel-editor', express.static(path.join(__dirname, BUILDDIR)));


// "reload" module allows us to trigger webpage reload automatically on file changes, but inside pixel editor it also
// makes browser steal focus from any other window in order to ask user about unsaved changes. It might be quite
// intrusive so we decided to give option to choose preferred workflow.
if (process.env.RELOAD === "yes") {
    reload(app).then(() => {
        //start server
        app.server = app.listen(PORT, () => {
            console.log(`Web server listening on port ${PORT} (with reload module)`);
        })
    });
} else {
    app.listen(PORT, () => {
        console.log(`Web server listening on port ${PORT}`);
    })
}

// Better to show landing page rather than 404 on editor page reload
app.get('/', (req, res) => {
    res.redirect('/pixel-editor');
})


//ROUTE - match / or any route with just numbers letters and dashes, and return index.htm (all other routes should have been handled already)
app.get(['/pixel-editor', /^\/pixel-editor\/[\/a-z0-9-]+$/gi ], (req, res) => {
    res.sendFile(path.join(__dirname, BUILDDIR, 'index.htm'), {}, function (err) {
        if (err) {
            console.log('error sending file', err);
        } else {
            console.log("Server: Successfully served index.html", req.originalUrl);
        }
    });
});

// Better to show landing page rather than 404 on editor page reload
app.get('/pixel-editor/app', (req, res) => {
    res.redirect('/');
})

