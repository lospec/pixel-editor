const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const include = require('gulp-include');
const handlebars = require('gulp-hb');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');

//const hb_svg = require('handlebars-helper-svg');

const BUILDDIR = process.argv[2] || './build/';


console.log('Building Pixel Editor');


function copy_images(){
    // Icons
    gulp.src('./images/*.png').pipe(gulp.dest(BUILDDIR));
    // Splash images
    gulp.src('./images/Splash images/*.png').pipe(gulp.dest(BUILDDIR));
    // Logs images
    gulp.src('./images/Logs/*.gif').pipe(gulp.dest(BUILDDIR));
}

function copy_logs() {
    gulp.src('logs/*.html').pipe(gulp.dest(BUILDDIR));
}

function render_js(){
    gulp.src('./js/*.js')
        .pipe(include({includePaths: [
            'js',
            '!js/_*.js',
        ]}))
        .on('error', console.log)
        .pipe(gulp.dest(BUILDDIR));
}


function render_css(){
    gulp.src('css/*.scss')
        .pipe(sass({includePaths: ['css']}))
        .pipe(gulp.dest(BUILDDIR));
}

function compile_page(){
    gulp.src(path.join('./views/index.hbs'))
		.pipe(include({includePaths: ['/svg']}))

        .pipe(handlebars({encoding: 'utf8', debug: true, bustCache: true})
            .partials('./views/[!index]*.hbs')
            //.helpers({ svg: hb_svg })
            .helpers('./helpers/**/*.js')
            .data({
                projectSlug: 'pixel-editor',
                title: 'Lospec Pixel Editor',
                layout: false,
            }))
        .pipe(rename('index.htm'))
        .pipe(gulp.dest(BUILDDIR));
}


// empty the build folder, or create it
try {
fs.rmdirSync(BUILDDIR, { recursive: true });
fs.mkdirSync(BUILDDIR);
} catch (err) {console.log('failed to find build folder, but it\'s probably fine')}

gulp.parallel(copy_images, copy_logs, render_js, render_css, compile_page)();
