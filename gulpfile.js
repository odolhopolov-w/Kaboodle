'use strict';

var gulp = require('gulp'); 
var less = require('gulp-less'); 
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var minify = require('gulp-csso');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var webp = require('gulp-webp');
var del = require('del');
var browserSync = require('browser-sync').create();


function style() {
  return gulp
  .src("source/less/**/style.less") 
  .pipe(plumber())
  .pipe(less()) 
  .pipe(postcss([ 
    autoprefixer()
  ]))
  .pipe(gulp.dest("source/css"))
  .pipe(minify())
  .pipe(rename("style.min.css"))
  .pipe(gulp.dest("source/css"))
  .pipe(browserSync.stream());
}

function clean() {
  return del(['source/css/*'])
}

function images() {
  return gulp
  .src("source/img/**/*.{png,jpg,svg}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true}),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest("source/img"));
}

function webp() {
  return gulp
  .src("source/img//**/*.{png,jpg}")
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest("./img"));
}

gulp.task("style", style);
gulp.task("del", clean);
gulp.task("images", images);
// gulp.task("webp", webp);

gulp.task("watch", function () { 
  browserSync.init({
    server: {
      baseDir: "source/"
    }
  });

  gulp.watch("source/less/**/*.less", style).on('change', browserSync.reload);
  gulp.watch("source/*.html").on('change', browserSync.reload);
});
  gulp.task("build", gulp.series("del", "style"));
  gulp.task("start", gulp.series("build", "watch"));