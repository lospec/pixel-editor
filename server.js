const path = require('path');
const express = require('express');
const reload = require('reload');
const app = express();

const BUILDDIR = process.argv[2] || './build';
const PORT = process.argv[3] || 3000;

//ROUTE - index.htm
app.get('/', (req, res) => { 
    res.sendFile(path.join(__dirname, BUILDDIR, 'index.htm'), {}, function (err) {
        if(err){
            console.log('error sending file', err);
        } else {
            console.log("Server: Successfully served index.html");
            setTimeout(()=>{
                console.log('closing server');
                res.app.server.close();
                process.exit();
            },1000*10);            
        }
    });
});

//ROUTE - other files
app.use(express.static(path.join(__dirname, BUILDDIR)));

reload(app).then(() => {
    //start server
    app.server = app.listen(PORT, function () {
        console.log('Web server listening on port ' + PORT)
    })
});
