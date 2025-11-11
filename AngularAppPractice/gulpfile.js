const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const ngAnnotate = require('gulp-ng-annotate');

gulp.task('scripts', function () {
    return gulp.src([
        'app.js',
        'controller/**/*.js',
        'component/**/**/*.js',
        'service/**/*.js'
    ])
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('bundle.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
    gulp.watch(['app.js',
        'controller/**/*.js',
        'component/**/**/*.js',
        'service/**/*.js'], gulp.series('scripts'));
});

gulp.task('default', gulp.series('scripts', 'watch'));
