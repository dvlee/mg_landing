let gulp 			= require("gulp"),
    sass 			= require("gulp-sass"),
    browserSync 	= require("browser-sync"),
    babel 			= require("gulp-babel"),
    plumber 		= require("gulp-plumber"),
    notify          = require("gulp-notify")
    sourcemaps 		= require("gulp-sourcemaps"),
    autoprefixer 	= require("gulp-autoprefixer"),
    uglify          = require("gulp-uglify"),
    del 			= require("del"),
    browserify 		= require("gulp-browserify"),
    nunjucks        = require("gulp-nunjucks-render"),
    rename          = require("gulp-rename"),
    cssmin          = require("gulp-cssmin");



gulp.task('clean', () => del('build'));

gulp.task('templates', () => 
    gulp.src(['src/templates/*.njk', 'src/templates/pages/**/*.njk'])
        .pipe(plumber({
            errorHandler: notify.onError("NUNJUCKS Error: <%= error.message %>")
        }))
        .pipe(nunjucks({
            path: ['src/templates/'] // String or Array
          }))
        .pipe(gulp.dest('build'))
);

gulp.task('sass', () => gulp.src('src/sass/*.scss')
        .pipe(plumber({
            errorHandler: notify.onError("SASS Error: <%= error.message %>")
        }))
        // .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        // .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/assets/css/'))
        .pipe(cssmin())
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('build/assets/css/'))
);

gulp.task('js', () => {
    return gulp.src("src/js/*.js")
        .pipe(plumber({
            errorHandler: notify.onError("JS Error: <%= error.message %>")
        }))
        .pipe(sourcemaps.init())
        .pipe(browserify())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("build/assets/js/"))
});

gulp.task('copy', () => gulp.src('src/resources/**/*.*').pipe(gulp.dest('build')))

gulp.task('build', gulp.series(['clean', 'templates', 'sass', 'js', 'copy']))

gulp.task('watch', () => {
    gulp.watch('src/templates/**/*.*', gulp.series('templates'));
    gulp.watch('src/sass/*.scss', gulp.series('sass'));
    gulp.watch('src/js/*.js', gulp.series('js'));
    gulp.watch('src/resources/**/*.*', gulp.series('copy'));
})

gulp.task('server', function () {
    browserSync.init({
        server: {
            baseDir: 'build'
        },
        files: ['build/**/*.*']
    })
});

gulp.task('default', gulp.parallel(['build', 'server', 'watch']));
