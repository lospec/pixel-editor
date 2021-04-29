const path = require('path');
const express = require('express');
const reload = require('reload');
const app = express();

const BUILDDIR = process.argv[2] || './build';
const PORT = process.argv[3] || 3000;

//ROUTE - index.htm
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, BUILDDIR, 'index.htm'), {}, function (err) {
        if (err) {
            console.log('error sending file', err);
        } else {
            console.log("Server: Successfully served index.html");

            /*setTimeout(()=>{
                console.log('closing server');
                res.app.server.close();
                process.exit();
            },1000*10);          */
        }
    });
});

// Better to show landing page rather than 404 on editor page reload
app.get('/pixel-editor/app', (req, res) => {
    res.redirect('/');
})

//ROUTE - other files
app.use(express.static(path.join(__dirname, BUILDDIR)));

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
