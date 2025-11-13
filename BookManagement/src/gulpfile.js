const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const ngAnnotate = require('gulp-ng-annotate');
const babel = require('gulp-babel');

gulp.task('scripts', function () {
  return gulp.src([
      'main.js',
      './app/**/*.js'
  ])
    .pipe(babel({
      presets: ['@babel/preset-env']
    })) 
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('bundle.min.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
  gulp.watch(['main.js', './app/**/*.js'], gulp.series('scripts'));
});

gulp.task('default', gulp.series('scripts', 'watch'));
