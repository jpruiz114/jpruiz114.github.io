'use strict';

let gulp = require('gulp');
let sass = require('gulp-sass');

gulp.task(
    'sass',
    function () {
        return gulp.src('./sass/*.scss').pipe(sass.sync().on('error', sass.logError)).pipe(gulp.dest('./css'));
    }
);
