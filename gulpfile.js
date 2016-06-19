var gulp = require('gulp');
var del = require('del');
var concat = require("gulp-concat");

// clean the contents of the distribution directory
gulp.task('clean', function () {
  return del('dist/**/*');
});

// TypeScript compile
gulp.task('compile', ['clean'], function () {
  return gulp
    .src('src/**/*.js')
    .pipe(concat('ion-google-autocomplete.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['compile']);
gulp.task('default', ['build']);