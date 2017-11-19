var gulp = require('gulp');
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var paths = {
	pages: ['*.html'],
	stylesheets: ['css/*.css']
};

gulp.task("copy-css", function () {
	return gulp.src(paths.stylesheets)
		.pipe(gulp.dest("bundle"));
});

gulp.task("copy-html", function () {
	return gulp.src(paths.pages)
		.pipe(gulp.dest("bundle"));
});

gulp.task("default", ["copy-css", "copy-html"], function () {
	return browserify({
		basedir: '.',
		debug: true,
		entries: ['ts/main.ts'],
		cache: {},
		packageCache: {}
	})
	.plugin(tsify)
	.bundle()
	.pipe(source('bundle.js'))
	.pipe(gulp.dest("bundle"));
});
