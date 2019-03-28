var fs = require('fs-extra');
var hbs = require('handlebars');
var glob = require("glob");
var sass = require("sass");
var path = require("path");
var gulp = require('gulp');
var include = require('gulp-include');

const BUILDDIR = './build';
const SLUG = 'pixel-editor';

console.log('Building Pixel Editor');

hbs.registerHelper('svg', require('handlebars-helper-svg'));
require('hbs-register-helpers')(hbs,'./_ext/modules/hbs/helpers/**/*.js');
require('hbs-register-partials')(hbs,'./_ext/modules/hbs/_*.hbs');

//empty the build folder, or create it
fs.emptyDirSync(BUILDDIR);


//copy images
fs.copySync('./images','./build/'+SLUG);

//render js
gulp.src('./js/*.js')
  .pipe(include({includePaths: [
          '_ext/scripts',
          'js',
          '!js/_*.js',
          ]}))
    .on('error', console.log)
  .pipe(gulp.dest('build/'+SLUG));


//render css
var sassFiles = glob.sync('css/*.scss');

sassFiles.forEach((s) => {

    var f = sass.renderSync({file: s, outFile: 'test.css', includePaths: ['css', '_ext/sass', '_ext/modules/css']});

    console.log('compiling:',path.basename(f.stats.entry))
    fs.writeFileSync('build/'+SLUG+'/'+path.basename(f.stats.entry,'scss')+'css', f.css);
});


//compile page
var pageTemplate = hbs.compile(fs.readFileSync('./views/'+SLUG+'.hbs',{encoding: 'utf8'}));
var page = pageTemplate({
  projectSlug: SLUG,
  title: 'Lospec Pixel Editor',
  layout: false,
});

//save output
fs.writeFileSync('./build/index.htm',page);


//server
const express = require('express');
const app = express();


//ROUTE - index.htm
app.get('/', (req, res) => { 
  res.sendFile(path.join(__dirname+'/build/index.htm'), {}, function (err) {
    if (err) console.log('error sending file',err);
    else {
      setTimeout(()=>{
          console.log('closing server')
          server.close();
          process.exit();
      },1000*10);
    }
  });
});

//ROUTE - other files
app.use(express.static(path.join(__dirname, 'build')));

//start server
var server = app.listen(3000, () => {
  console.log('\nTemp server started at http://localhost:3000!');
  //console.log('press ctrl+c to stop ');

  var opn = require('opn');

  // opens the url in the default browser
  opn('http://localhost:3000');

  
});
