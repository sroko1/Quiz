/*
  This is an EXAMPLE gulpfile.js
  You'll want to change it to match your project.
  Find plugins at https://npmjs.org/browse/keyword/gulpplugin
*/
var gulp = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('scripts', function() {
    // Minify and copy all JavaScript (except vendor scripts)
    gulp.src(['client/js/**/*.js', '!client/js/vendor/**'])
        .pipe(uglify())
        .pipe(gulp.dest('build/js'));

    // Copy vendor files
    gulp.src('client/js/vendor/**')
        .pipe(gulp.dest('build/js/vendor'));
});

// Copy all static assets
gulp.task('copy', function() {
    gulp.src('client/img/**')
        .pipe(gulp.dest('build/img'));

    gulp.src('client/css/**')
        .pipe(gulp.dest('build/css'));

    gulp.src('client/*.html')
        .pipe(gulp.dest('build'));
});

// The default task (called when you run `gulp`)
gulp.task('default', function() {
    gulp.run('scripts', 'copy');

    // Watch files and run tasks if they change
    gulp.watch('client/js/**', function(event) {
        gulp.run('scripts');
    });

    gulp.watch([
        'client/img/**',
        'client/css/**',
        'client/*.html'
    ], function(event) {
        gulp.run('copy');
    });
});
taskFile.js
var uglifyJS = require('uglify-js');
var glob = require('glob-stream').create;
var watch = require('glob-watcher');
var through = require('through');
var fs = require('fs');
var path = require('path');

// uglify -.- wtf. make stream kind of.
// gulp-uglify should be like this instead!
function uglify() {
    var stream = through()

    // mikeal style pipe hack because uglify -.-
    stream.on('pipe', function (src) {
        var fileName = src.fileName
        fs.readFile(fileName, function (err, file) {
            if (err) {
                return stream.emit('error', err)
            }

            var payload

            try {
                payload = uglifyJS.minify(String(file), { fromString: true }).code
            } catch (err) {
                return stream.emit('error', err)
            }

            stream.end(payload)
        })
    })

    return stream
}

// gulp.src should be like this!
function src(patterns) {
    return glob(patterns)
        .pipe(through(function (file) {
            var stream = fs.createReadStream(file.path)
            stream.fileName = file.path
            return stream
        }))
}

// gulp.dest should be like this!
function dest(baseDir) {
    return through(function (fileStream) {
        fileStream.pipe(fs.createWriteStream(
            path.join(baseDir, path.filename(fileStream.fileName))
        ))
    })
}

// gulp.task is not needed, just use functions!
var tasks = {
    'scripts': function () {
        src(['client/js/**/*.js', '!client/js/vendor/**'])
            .pipe(through(function (fileStream) {
                return fileStream.pipe(uglify());
            }))
            .pipe(dest('build/js'))

        src('client/js/vendor/**')
            .pipe(dest('build/js/vendor'))
    },
    'copy': function () {
        src('client/img/**')
            .pipe(dest('build/img'))

        src('client/css/**')
            .pipe(dest('build/css'))

        src('client/*.html')
            .pipe(dest('build'))
    },
    'default': function () {
        tasks.scripts()
        tasks.copy()

        watch('client/js/**', tasks.scripts)

        watch([
            'client/img/**',
            'client/css/**',
            'client/*.html'
        ], tasks.copy)
    }
}

// you don't need a special gulp command
// just node taskFile.js scripts to run scripts.
// or `alias gulp = node taskFile.js`
var cmd = process.argv[3] || 'default';
tasks[cmd]();