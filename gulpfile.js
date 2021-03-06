const cpPath = "/Users/foag/Library/Application Support/FoundryVTT/Data/systems"

const gulp = require('gulp');
const prefix = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const zip = require('gulp-zip');
const package = require('./package.json');
const del = require('del');
const bump = require('gulp-bump');

/* ----------------------------------------- */
/*  Compile Sass
/* ----------------------------------------- */

// Small error handler helper function.
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

const SYSTEM_SCSS = ["scss/**/*.scss"];
function compileScss() {
  // Configure options for sass output. For example, 'expanded' or 'nested'
  let options = {
    outputStyle: 'expanded'
  };
  return gulp.src(SYSTEM_SCSS)
    .pipe(
      sass(options)
        .on('error', handleError)
    )
    .pipe(prefix({
      cascade: false
    }))
    .pipe(gulp.dest("./css"))
}
const css = gulp.series(compileScss);

/* ----------------------------------------- */
/*  Watch Updates
/* ----------------------------------------- */

function watchUpdates() {
  gulp.watch(SYSTEM_SCSS, css);
}

/* ----------------------------------------- */
/*  Build dist-zip
/* ----------------------------------------- */

function deleteOldDist(){
  return del(`./dist/${package.name}.zip`)
}

function makeZip(){

  return gulp.src(['./**','!node_modules/','!node_modules/**'])
      .pipe(zip(`${package.name}.zip`))
      .pipe(gulp.dest('./dist'));
}

function bumpVersion(){
  return gulp.src(['./package.json','./system.json'])
    .pipe(bump({type:'appversion'}))
    .pipe(gulp.dest('./'));
}

/* ----------------------------------------- */
/*  Export Tasks
/* ----------------------------------------- */

exports.default = gulp.series(
  compileScss,
  watchUpdates
);
exports.css = css;

exports.dist = gulp.series(
  compileScss,
  deleteOldDist,
  makeZip,
  bumpVersion
);