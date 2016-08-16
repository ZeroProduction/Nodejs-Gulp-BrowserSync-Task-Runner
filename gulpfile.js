var gulp			= require('gulp');
var sass			= require('gulp-sass');
var concat			= require('gulp-concat');
var watch			= require('gulp-watch');
var uglify			= require('gulp-uglify');
var plumber			= require('gulp-plumber');
var minify_css		= require('gulp-clean-css');
var prefix			= require('gulp-autoprefixer');
var sourcemaps		= require('gulp-sourcemaps');
var imagemin		= require('gulp-imagemin');
var notify			= require('gulp-notify');
var jshint			= require('gulp-jshint');
var pngquant		= require('imagemin-pngquant');
var browserSync		= require('browser-sync');

/* --------------------------------------------- */

var src = {
	img:	'src/img/**/*',
	js:		'src/js/**/*.js',
	sass:	'src/sass/**/*.scss'
};
var output = {
	js:		'output/js/',
	css:	'output/css/',
	img:	'output/img/',
	html:	'output/**/*.html',
	min_css:'app.min.css',
	min_js:	'app.min.js'
};

// Sass task

var onError = function(err) {
	console.log(err);
	this.emit('end');
};

gulp.task('sass', function() {
	
	return gulp.src(src.sass)
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(sass())
		.pipe(prefix('last 2 versions'))
		.pipe(concat(output.min_css))
		.pipe(gulp.dest(output.css))
		.pipe(minify_css())
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(output.css))
		//.pipe(notify({message: 'Notify message'}))
		.pipe(browserSync.reload({stream: true}))
	;
});

// JS task

gulp.task('js', function() {
	
	return gulp.src(src.js)
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(uglify())
		.pipe(concat(output.min_js))
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(output.js))
		.pipe(browserSync.reload({stream: true}))
	;
});

// Images

gulp.task('img', function() {
	return gulp.src(src.img)
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest(output.img))
	;
});


// Watch

gulp.task('watch', function() {
	browserSync.init({
		//proxy: url.... (http or vhost)
		server: './output'
	});
	gulp.watch(src.js, ['js']);
	gulp.watch(src.img, ['img']);
	gulp.watch(src.sass, ['sass']);
	gulp.watch(output.html).on('change', browserSync.reload);
});

// Default

gulp.task('default', ['watch', 'sass', 'js', 'img']);
