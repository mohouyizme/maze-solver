const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const webpack = require('webpack-stream');
const rename = require('gulp-rename');

const webpackConfig = require('./webpack.config');

gulp.task('serve', ['views', 'styles', 'scripts', 'images'], () => {
  browserSync.init({
    server: 'dist'
  });
  gulp.watch('src/views/**/*.pug', ['views']);
  gulp.watch('src/scss/**/*.scss', ['styles']);
  gulp.watch('src/js/**/*.js', ['scripts']);
  gulp.watch('src/img/**/*', ['images']);
  gulp.watch('dist/*.html').on('change', browserSync.reload);
  gulp.watch('dist/js/*.js').on('change', browserSync.reload);
});

gulp.task('views', () =>
  gulp
    .src('src/views/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('dist'))
);

gulp.task('styles', () => {
  const postcssPlugins = [autoprefixer(), cssnano()];

  return gulp
    .src('src/scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(postcssPlugins))
    .pipe(
      rename({
        suffix: '.min'
      })
    )
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', () =>
  gulp
    .src('src/js/app.js')
    .pipe(webpack(webpackConfig))
    .on('error', function() {
      this.emit('end');
    })
    .pipe(gulp.dest('dist/js'))
);

gulp.task('images', () => gulp.src('src/img/*').pipe(gulp.dest('dist/img')));

gulp.task('server', ['serve']);

gulp.task('default', ['views', 'styles', 'scripts', 'images']);
