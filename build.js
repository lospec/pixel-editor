const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const include = require('gulp-include');
const hb = require('gulp-hb');
const sass = require('gulp-sass');
const rename = require('gulp-rename');

const hb_svg = require('handlebars-helper-svg');

const BUILDDIR = process.argv[2] || './build/';
const SLUG = 'pixel-editor';

console.log('Building Pixel Editor');


function copy_images(){
    gulp.src('./images/*.png')
        .pipe(gulp.dest(path.join(BUILDDIR, SLUG)));
}

function render_js(){
    gulp.src('./js/*.js')
        .pipe(include({includePaths: [
            '_ext/scripts',
            'js',
            '!js/_*.js',
        ]}))
        .on('error', console.log)
        .pipe(gulp.dest(path.join(BUILDDIR, SLUG)));
}


function render_css(){
    gulp.src('css/*.scss')
        .pipe(sass({includePaths: ['css', '_ext/sass', '_ext/modules/css']}))
        .pipe(gulp.dest(path.join(BUILDDIR, SLUG)));
}

function compile_page(){
    gulp.src(path.join('./views/', SLUG + '.hbs'))
        .pipe(hb({encoding: 'utf8'})
            .partials('./_ext/modules/_*.hbs')
            .helpers({ svg: hb_svg })
            .helpers('./_ext/modules/hbs/helpers/**/*.js')
            .data({
                projectSlug: SLUG,
                title: 'Lospec Pixel Editor',
                layout: false,
            }))
        .pipe(rename('index.htm'))
        .pipe(gulp.dest(BUILDDIR));
}


// empty the build folder, or create it
fs.rmdirSync(BUILDDIR, { recursive: true });
fs.mkdirSync(BUILDDIR);
gulp.parallel(copy_images, render_js, render_css, compile_page)();
