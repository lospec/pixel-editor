const path = require('path');
const express = require('express');

const app = express();

const BUILDDIR = process.argv[2] || './build';
const PORT = process.argv[3] || 3000;

//ROUTE - index.htm
app.get('/', (req, res) => { 
    res.sendFile(path.join(__dirname, BUILDDIR, 'index.htm'), {}, function (err) {
        if(err){
            console.log('error sending file',err);
        } else {
            setTimeout(()=>{
                console.log('closing server');
                server.close();
                process.exit();
            },1000*10);
        }
    });
});

//ROUTE - other files
app.use(express.static(path.join(__dirname, BUILDDIR)));

//start server
var server = app.listen(PORT, () => {
    console.log(`\nTemp server started at http://localhost:${PORT}!`);
    //console.log('press ctrl+c to stop ');

    var opn = require('open');

    // opens the url in the default browser
    opn(`http://localhost:${PORT}`);
});

