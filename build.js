const fs = require('fs-extra');
const hbs = require('handlebars');
const glob = require('glob');
const sass = require('sass');
const path = require('path');
const gulp = require('gulp');
const include = require('gulp-include');

const BUILDDIR = process.argv[2] || './build/';
const SLUG = 'pixel-editor';

console.log('Building Pixel Editor');

hbs.registerHelper('svg', require('handlebars-helper-svg'));
require('hbs-register-helpers')(hbs,'./_ext/modules/hbs/helpers/**/*.js');
require('hbs-register-partials')(hbs,'./_ext/modules/hbs/_*.hbs');

// empty the build folder, or create it
fs.emptyDirSync(BUILDDIR);


// copy images
fs.copySync('./images',path.join(BUILDDIR, SLUG));

// render js
gulp.src('./js/*.js')
    .pipe(include({includePaths: [
        '_ext/scripts',
        'js',
        '!js/_*.js',
    ]}))
    .on('error', console.log)
    .pipe(gulp.dest(path.join(BUILDDIR, SLUG)));


// render css
var sassFiles = glob.sync('css/*.scss');

sassFiles.forEach((s) => {

    var f = sass.renderSync({file: s, outFile: 'test.css', includePaths: ['css', '_ext/sass', '_ext/modules/css']});

    console.log('compiling:',path.basename(f.stats.entry));
    fs.writeFileSync(path.join(BUILDDIR, SLUG, path.basename(f.stats.entry,'scss') + 'css'), f.css);
});


// compile page
var pageTemplate = hbs.compile(fs.readFileSync(path.join('./views/', SLUG + '.hbs'),{encoding: 'utf8'}));
var page = pageTemplate({
    projectSlug: SLUG,
    title: 'Lospec Pixel Editor',
    layout: false,
});

// save output
fs.writeFileSync(path.join(BUILDDIR, 'index.htm'),page);
