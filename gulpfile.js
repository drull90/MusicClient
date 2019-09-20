var gulp        = require('gulp');
var ui5preload  = require('gulp-ui5-preload');
var uglify      = require('gulp-uglify-es').default;
var gulpif      = require('gulp-if');

gulp.task('build',function () {
    return gulp.src(
      [
        'src/main/webapp/**/**.+(js|xml)',
        '!Component-preload.js',
        '!gulpfile.js',
        '!model/metadata.xml'
      ])
      .pipe(gulpif('**/*.js', uglify()))
      .pipe(ui5preload({ base: '.', namespace: 'Music' }))
      .pipe(gulp.dest('src/main/webapp'));
  }
)