var gulp        = require('gulp');
var sass        = require('gulp-sass');
var sourceMaps  = require('gulp-sourcemaps');
var imagemin    = require('gulp-imagemin');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
var gulpSequence = require('gulp-sequence').use(gulp);
var plumber     = require('gulp-plumber');
var rename      = require('gulp-rename');
var del         = require('del');
var jsmin       = require('gulp-jsmin');

// USE only one! jade-php or jade for html output
//var jade        = require('gulp-jade-php');
var jade        = require('gulp-jade');

// BROWSERSYNC
gulp.task('browserSync', function() {
    browserSync({
        /*proxy: {
          target: 'localhost'*/
        server: {
            baseDir: "app/"
        },
        options: {
            reloadDelay: 250
        },
        notify: true
    });
});

// IMAGE Minify
gulp.task('images', function(tmp) {
    gulp.src(['app/img/*.+(jpg|jpeg|png)'])
        .pipe(plumber())
        .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
        .pipe(gulp.dest('app/img'));
});
// IMAGE Deploy
gulp.task('images-deploy', function() {
    gulp.src(['app/img/*'])
        .pipe(plumber())
        .pipe(gulp.dest('dist/img'));
});

// JAVASCRIPT Minify
gulp.task('js', function () {
    gulp.src('app/js/*.js')
        .pipe(plumber())
        .pipe(jsmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/js/min'))
        .pipe(browserSync.reload({stream: true}))
});
// JAVASCRIPT Minifyed Deploy
gulp.task('js-deploy', function() {
    gulp.src(['app/js/min/*'])
        .pipe(plumber())
        .pipe(gulp.dest('dist/js/min'));
});

// SASS Compiler
gulp.task('sass', function() {
    return gulp.src('app/sass/styles.sass')
                .pipe(plumber())
                .pipe(sourceMaps.init())
                .pipe(sass({
                      errLogToConsole: true,
                      includePaths: [
                          'app/sass'
                      ]
                }))
                .pipe(autoprefixer())
                .pipe(sourceMaps.write())
                .pipe(gulp.dest('app/css'))
                .pipe(browserSync.reload({stream: true}));
});
// CSS Deploy
gulp.task('css-deploy', function() {
    return gulp.src('app/sass/styles.sass')
                .pipe(plumber())
                .pipe(sass({
                      includePaths: [
                          'app/sass',
                      ]
                }))
                .pipe(autoprefixer())
                .pipe(gulp.dest('dist/css'));
});

// JADE Compiler
gulp.task('jade', function() {
  gulp.src('app/jade/*.jade')
    .pipe(plumber())
    .pipe(jade({
      pretty: true
      }))
    .pipe(gulp.dest('app/'))
    .pipe(browserSync.reload({stream: true}))
});

// PHP
gulp.task('html-php', function() {
    gulp.src(['app/php/**/*'])
        .pipe(plumber())
        .pipe(gulp.dest('dist/php'))
        .pipe(browserSync.reload({stream: true}))
});
// PHP DIR Deploy
gulp.task('php-deploy', function() {
    gulp.src(['app/php/**/*.+(html|php)'])
        .pipe(plumber())
        .pipe(gulp.dest('dist/php'));
});

// HTML/PHP Deploy
gulp.task('html-php-deploy', function() {
    gulp.src(['app/*.+(html|php)'])
        .pipe(plumber())
        .pipe(gulp.dest('dist'));
});

// WATCH PROJECT 'gulp' -command
gulp.task('default', ['browserSync'], function() {
    gulp.watch('app/js/*', ['js']);
    gulp.watch('app/sass/**', ['sass']);
    gulp.watch('app/img/**', ['images']);
    gulp.watch('app/jade/**', ['jade']);
    gulp.watch('app/php/**/*', ['html-php']);
    gulp.watch('app/*.+(html|php)', browserSync.reload);
});

// CLEAN DIST FOLDER Task
gulp.task('clean', function () {
  return del([
    'dist/**/*',
  ]);
});

// REBUILD DIST 'gulp deploy' -command
gulp.task('deploy', gulpSequence('clean', ['js-deploy', 'css-deploy', 'images-deploy'], 'html-php-deploy'));
