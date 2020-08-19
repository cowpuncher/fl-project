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
        fonts: source_folder + '/fonts/*.ttf'
    },
    watch: {
        html: source_folder + '/**/*.html',
        css: source_folder + '/**/*.scss',
        js: source_folder + '/js/**/*/js',
        images: source_folder + '/images/**/*.{jpg, jpeg, png, svg, gif, ico, webp}'
    },
    clean: "./" + project_folder + "/"
}

let { src, dest } = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include'),
    del = require('del'),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    mediaqueries = require('gulp-group-css-media-queries'),
    cleancss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp'),
    webphtml = require('gulp-webp-html'),
    uglify = require('gulp-uglify-es').default,
    woff = require('gulp-ttf2woff'),
    woff2 = require('gulp-ttf2woff2');



const browserSync = params => {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false
    })
}

function sprite() {
    return gulp.src('./src/iconsprite/**/*')
        .pipe(svgstore({
            inlineSvg:true
        }))
        .pipe(rename({
            basename: 'icons',
        }))
        .pipe(gulp.dest('./build/images/svg'))
        .pipe(browsersync.stream());
}

const html = () => {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(webphtml())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

const images = () => {
    return src(path.src.images)
    .pipe(
        webp({
            quality: 70
        })
    )
    .pipe(dest(path.build.images))
    .pipe(src(path.src.images))
    .pipe(
        imagemin({
            progressive: true,
            svgPlugins: [{ removeViewBox: false }],
            interlaced: true,
            optimizationLevel: 3 // 0 to 7
        })
    )
    .pipe(sprite())
    .pipe(dest(path.build.images))
    .pipe(browsersync.stream())
}

const js = () => {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(
            rename({
                extname: '.min.js'
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

const css = () => {
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle: "expanded"
            })
        )
        .pipe(
            mediaqueries()
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 5 versions'],
                cascade: true
            })
        )
        .pipe(dest(path.build.css))
        .pipe(cleancss())
        .pipe(
            rename({
                extname: '.min.css'
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

const fonts = () => {
    src(path.src.fonts)
        .pipe(woff())
        .pipe(dest(path.build.fonts))
    return src(path.src.fonts)
        .pipe(woff2())
        .pipe(dest(path.build.fonts))
}

function startSprite(params) {
        return src([source_folder + '/iconsprite/*.svg'])
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: '../icons/icons.svg',
                    example: true
                }
            },
        }
        ))
}


const watchFile = params => {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.images], images);
}

const clean = params => {
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts))
let watch = gulp.parallel(build, watchFile, browserSync);

exports.fonts = fonts;
exports.js = js;
exports.css = css;
exports.html = html;
exports.images = images;
exports.build = build;
exports.watch = watch;
exports.default = watch;

