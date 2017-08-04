var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var util = require('gulp-util');
var browserify = require('gulp-browserify');
var connect = require('gulp-connect');
var minifyHTML = require('gulp-minify-html');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var imageMin = require('gulp-imagemin');

var jsSources = ['app/development/js/*.js'];

var sassSources = ['app/development/css/*.scss'];

var htmlSources = ['app/development/*.html'];

gulp.task('js', function() {
    gulp.src(jsSources)
        .pipe(concat('script.js'))
        .pipe(browserify())
        .pipe(uglify())
        .pipe(gulp.dest('app/production/js'))
        .pipe(connect.reload())
});

gulp.task('css', function() {
    gulp.src('app/development/css/main.scss')
        .pipe(sass())
        .on('error', util.log)
        .pipe(gulp.dest('app/development/css/final'))
        .pipe(connect.reload())
});

gulp.task('html', function() {
    gulp.src(htmlSources)
        .pipe(connect.reload())
});

gulp.task('minifyHTML', function() {
    gulp.src(htmlSources)
        .pipe(minifyHTML())
        .pipe(gulp.dest('app/production/'))
})

gulp.task('watch', function() {
    gulp.watch(sassSources, ['css']);
    gulp.watch(jsSources, ['js']);
    gulp.watch(htmlSources, ['html']);
});

gulp.task('connect', function() {
    connect.server({
        root: 'app/development/',
        livereload: true
    })
});

gulp.task('minifyCss', function() {
    gulp.src('app/development/css/final/main.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('app/production/css/final/'));
});

gulp.task('minifyIMG', function() {
    gulp.src('app/development/images/**/*.*')
        .pipe(imageMin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5,
            svgoPlugins: [{ removeViewBox: true }]
        }))
        .pipe(gulp.dest('app/production/images/'));
});

gulp.task('default', ['connect', 'watch']);

gulp.task('dist', ['minifyHTML', 'minifyCss', 'minifyIMG']);