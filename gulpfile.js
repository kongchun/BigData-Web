var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require("babelify");
var source = require("vinyl-source-stream");
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var less = require('gulp-less');
var concat = require('gulp-concat');

var server = require('gulp-express');


gulp.task('vendor-css', function() {
	gulp.src('node_modules/bootstrap/dist/fonts/*.*')
		.pipe(gulp.dest('public/fonts'));

	return gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
		.pipe(concat('vendor.css'))
		.pipe(gulp.dest('public/css'));

});


/*
 |--------------------------------------------------------------------------
 | Combine all JS libraries into a single file for fewer HTTP requests.
 |--------------------------------------------------------------------------
 */
gulp.task('vendor', ['vendor-css'], function() {
	return gulp.src([
			'node_modules/jquery/dist/jquery.js',
			'node_modules/bootstrap/dist/js/bootstrap.js'
		]).pipe(concat('vendor.js'))
		//.pipe(gulpif(production, uglify({mangle: false})))
		.pipe(gulp.dest('public/js'));
});

var dependencies = [
	'alt',
	'react',
	'react-router'
];

/*
 |--------------------------------------------------------------------------
 | Compile third-party dependencies separately for faster performance.
 |--------------------------------------------------------------------------
 */

gulp.task('browserify-vendor', function() {
	return browserify()
		.require(dependencies)
		.bundle()
		.pipe(source('vendor.bundle.js'))
		//.pipe(gulpif(production, streamify(uglify({mangle: false}))))
		.pipe(gulp.dest('public/js'));
});

/*
 |--------------------------------------------------------------------------
 | Compile only project files, excluding all third-party dependencies.
 |--------------------------------------------------------------------------
 */

gulp.task('browserify', ['browserify-vendor'], function() {
	return browserify('app/main.js')
		.external(dependencies)
		.transform(babelify, {
			presets: ['es2015', 'react', 'stage-0']
		})
		.bundle()
		.pipe(source('bundle.js'))
		//.pipe(gulpif(production, streamify(uglify({mangle: false}))))
		.pipe(gulp.dest('public/js'));
});


gulp.task('styles', function() {
	return gulp.src('app/stylesheets/main.less')
		.pipe(plumber())
		.pipe(less())
		.pipe(autoprefixer())
		//.pipe(gulpif(production, cssmin()))
		.pipe(gulp.dest('public/css'));
});


gulp.task('build', ['styles', 'vendor', 'browserify']);


gulp.task('watch', ['build'], function() {
	gulp.watch('app/**/*.*', ['build']);
});


gulp.task('server', ['watch'], function() {
	// Start the server at the beginning of the task 
	server.run(['server.js']);
	gulp.watch('public/**/bundle.js', server.notify);
	gulp.watch('public/**/*.css', server.notify);
	gulp.watch(['server.js'], [server.run])
})