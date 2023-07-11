const { dest, src, parallel, series } = require('gulp')
const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const concat = require('gulp-concat')
const browserSync = require('browser-sync').create()
const uglify = require('gulp-uglify-es').default
const autoPrefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const avif = require('gulp-avif')
const webp = require('gulp-webp')
const newer = require('gulp-newer')
const del = require('del')
const svgSprite = require('gulp-svg-sprite')
const fonter = require('gulp-fonter')
const ttf2woff2 = require('gulp-ttf2woff2')
const include = require('gulp-include')



function scripts() {
  return src([
    './node_modules/jquery/dist/jquery.js',
    './app/js/main.js'
  ])
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(dest('./app/js'))
  .pipe(browserSync.stream())
}

function cleanBuild() {
  return del('./build')
} 

function bSync() {
  browserSync.init({
    server: {
      baseDir: './app'
    }
  })
}

function pages() {
  return src('./app/pages/*.html')
  .pipe(include({includePaths: './app/components'}))
  .pipe(dest('./app'))
  .pipe(browserSync.stream())
}

function fonts() { 
  return src('./app/fonts/src/*.*')
  .pipe(fonter({formats: ['woff', 'ttf']}))
  .pipe(src('./app/fonts/*.ttf'))
  .pipe(ttf2woff2())
  .pipe(dest('./app/fonts'))
  .pipe(browserSync.stream())
}

function sprite() {
  return src('./app/images/*.svg')
  .pipe(svgSprite({
    mode:{
      stack: {
        sprite: '../sprite.svg',
        example: true
      }
    }
  })).on('error', (err) => console.log(err))
  .pipe(dest('./app/images'))
}

function minImages() {
  return src(['./app/images/src/*.*', '!./app/images/src/*.svg'])
  .pipe(newer('./app/images'))
  .pipe(avif({quality: 50}))

  .pipe(src('./app/images/src/*.*'))
  .pipe(newer('./app/images'))
  .pipe(webp())

  .pipe(src('./app/images/src/*.*'))
  .pipe(newer('./app/images/'))
  .pipe( imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.mozjpeg({quality: 75, progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({
      plugins: [
        {removeViewBox: true},
        {cleanupIDs: false}
      ]
    })
  ]))
  
  .pipe(dest('./app/images'))
}

function buildStyles() {
  return src('./app/scss/style.scss')
    .pipe(sass({
      outputStyle: 'compressed', 
    }).on('error', sass.logError))
    .pipe(concat('style.min.css'))
    .pipe(autoPrefixer({
      overrideBrowserslist: ['last 10 version'],
      grid: true
    }))
    .pipe(dest('./app/css'))
    .pipe(browserSync.stream())
};

function build() {
  return src([
    './app/css/style.min.css',
    './app/images/*.*',
    '!./app/images/*.svg',
    './app/images/sprite.svg',
    './app/js/main.min.js',
    './app/fonts/*.*',
    './app/*.html'
  ], {base: 'app'})
  .pipe(dest('./build'))
}

function watch() {
  gulp.watch(['./app/scss/**/*.scss'], buildStyles)
  gulp.watch(['./app/images/src/'], minImages)
  gulp.watch(['./app/pages/*', './app/components/*'], pages)
  gulp.watch(['./app/fonts/src/'], fonts)
  gulp.watch(['./app/js/*.js', '!./app/js/main.min.js'], scripts)
  gulp.watch(['./app/*.html']).on('change', browserSync.reload)
}

exports.buildStyles = buildStyles
exports.watch = watch
exports.bSync = bSync
exports.scripts = scripts
exports.minImages = minImages
exports.cleanBuild = cleanBuild
exports.sprite = sprite
exports.fonts = fonts
exports.pages = pages
exports.build = series(cleanBuild, minImages, sprite, fonts, build)
exports.default = parallel(buildStyles, scripts, bSync, fonts, pages, watch)