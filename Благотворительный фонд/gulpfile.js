let project_folder = "build";
let source_folder = "src";

let path = {
    build: {
        html: project_folder + '/',
        css: project_folder + '/css/',
        js: project_folder + '/js/',
        images: project_folder + '/images/',
        fonts: project_folder + '/fonts/'
    },
    src: {
        html: source_folder + '/*.html',
        css: source_folder + '/scss/style.scss',
        js: source_folder + '/js/script.js',
        images: source_folder + '/images/**/*.{jpg, jpeg, png, svg, gif, ico, webp}',
        fonts: source_folder + '/fonts/'
    },
    watch: {
        html: source_folder + '/**/*.html',
        css: source_folder + '/scss/**/*.scss',
        js: source_folder + '/js/**/*/js',
        images: source_folder + '/images/**/*.{jpg, jpeg, png, svg, gif, ico, webp}'
    },
    clean: "./" + project_folder + "/"
}

let { src, dest } = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include');


const browserSync = params => {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false
    })
}

const html = () => {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

let build = gulp.series(html)
let watch = gulp.parallel(build, browserSync);

exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;

