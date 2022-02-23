const path = require('path');
const express = require('express');
const reload = require('reload');
const app = express();

const BUILDDIR = process.argv[2] || './build';
const PORT = process.argv[3] || 3000;
const FULLBUILDPATH = path.join(__dirname, BUILDDIR)

//LOGGING
app.use((req, res, next)=> {
	//console.log('REQUEST', req.method+' '+req.originalUrl, res.statusCode);
	next();
});


//apply to every request
app.use((req, res, next) => {
	//disable caching
	res.set("Cache-Control", "no-store");

	//enabled/disable reload module
	if (process.env.RELOAD === "yes") res.locals.reload = true;

	return next();
});

//ROUTE - other files
app.use('/', express.static(FULLBUILDPATH, {
	//custom function required for logging static files
	setHeaders: (res, filePath, fileStats) => {
        console.info('GET', '/'+path.relative(FULLBUILDPATH, filePath), res.statusCode);
    }
}));

//ROUTE - match / or any route with just numbers letters and dashes, and return index.htm (all other routes should have been handled already)
app.get('/', (req, res, next) => {
	//console.log('root')
    res.sendFile(path.join(__dirname, BUILDDIR, 'index.htm'), {}, function (err) {
		//console.log('sent file');
        return next();
    });
});
app.get('/pixel-editor', (req, res, next) => {
	//console.log('root')
    res.sendFile(path.join(__dirname, BUILDDIR, 'index.htm'), {}, function (err) {
		//console.log('sent file');
        return next();
    });
});
app.get('/pixel-editor/?:palette/?:resolution/?:patternWidth/?:patternBinStr', (req, res, next) => {
	//console.log('root')
    res.sendFile(path.join(__dirname, BUILDDIR, 'index.htm'), {}, function (err) {
		//console.log('sent file');
        return next();
    });
});

//HOT RELOADING
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

app.use(function(req, res, next) {
	res.status(404);
	res.type('txt').send('The requested resource does not exist. Did you spell it right? Did you remember to build the app? It\'s probably your fault somehow.');
	return next();
});

//LOGGING
app.use((req, res, next)=> {
	console.log(req.method+' '+req.originalUrl, res.statusCode);
});
