var gulp = require( 'gulp' ),
    uglify  = require('gulp-uglify'),                   //js压缩
    rename = require('gulp-rename'),                    //重命名
    minifycss = require('gulp-minify-css'),             //css压缩
    concat  = require('gulp-concat'),                   //合并文件
    seajsCombo = require( 'gulp-seajs-combo' ),         //seajs模块合并
    replace = require('gulp-replace');

//dist  main.js  define + 'static/dist/main'
gulp.task( 'seajscombo-nav', function(){
    return gulp.src( 'static/src/nav.js' )
        .pipe( seajsCombo({}) )
        .pipe(replace("define('nav',", "define('../static/dist/nav',"))
        //.pipe(uglify())
        .pipe( gulp.dest('static/dist') );
});
gulp.task( 'seajscombo-upload', function(){
    return gulp.src( 'static/src/upload.js' )
        .pipe( seajsCombo({}) )
        .pipe(replace("define('upload',", "define('../static/dist/upload',"))
        .pipe(uglify())
        .pipe( gulp.dest('static/dist') );
});
gulp.task( 'seajscombo-person', function(){
    return gulp.src( 'static/src/person.js' )
        .pipe( seajsCombo({}) )
        .pipe(replace("define('person',", "define('../static/dist/person',"))
        .pipe(uglify())
        .pipe( gulp.dest('static/dist') );
});
gulp.task( 'seajscombo-publish', function(){
    return gulp.src( 'static/src/publish.js' )
        .pipe( seajsCombo({}) )
        .pipe(replace("define('publish',", "define('../static/dist/publish',"))
        //.pipe(uglify())
        .pipe( gulp.dest('static/dist') );
});
gulp.task( 'seajscombo-list', function(){
    return gulp.src( 'static/src/list.js' )
        .pipe( seajsCombo({}) )
        .pipe(replace("define('list',", "define('../static/dist/list',"))
        .pipe(uglify())
        .pipe( gulp.dest('static/dist') );
});
gulp.task( 'seajscombo-home', function(){
    return gulp.src( 'static/src/home.js' )
        .pipe( seajsCombo({}) )
        .pipe(replace("define('home',", "define('../static/dist/home',"))
        .pipe(uglify())
        .pipe( gulp.dest('static/dist') );
});
gulp.task( 'seajscombo', function(){
    gulp.start('seajscombo-person');
    gulp.start('seajscombo-publish');

});
////js压缩
//gulp.task('uglify', function() {
//    return gulp.src('static/dist/main.js')
//        .pipe(uglify())
//        // .pipe(concat('all.js'))
//        .pipe(rename({
//            // dirname: "main/text/ciao",
//            // basename: "aloha",
//            // prefix: "bonjour-",
//            suffix: ".min"
//            // extname: ".md"
//        }))
//        .pipe(gulp.dest('static/dist'));
//});

//压缩css
gulp.task('minify-css', function() {
    return gulp.src(['static/src/*.css','!static/src/general.css'])
        .pipe(minifycss({compatibility: 'ie8'}))
        .pipe(concat('module.css'))
        .pipe(rename({
            // dirname: "main/text/ciao",
            // basename: "aloha",
            // prefix: "bonjour-",
            suffix: ".min"
            // extname: ".md"
        }))
        .pipe(gulp.dest('static/dist'));
});
gulp.task('default', function() {
    // 将你的默认的任务代码放在这
    gulp.start('seajscombo');
    //gulp.start('uglify');
    gulp.start('minify-css');
    console.log("default");
});
gulp.task('js', function() {
    // 将你的默认的任务代码放在这
    gulp.start('seajscombo');
    //gulp.start('uglify');
    console.log("js");
});
gulp.task('css', function() {
    // 将你的默认的任务代码放在这
    gulp.start('minify-css');
    console.log("css");
});
gulp.watch('static/src/*.js', ['js']);
gulp.watch('static/src/*.css', ['css']);




//gulp.task('jquery', function() {
//    return gulp.src('sea-modules/jquery/jquery-debug.js')
//        .pipe(uglify())
//        // .pipe(concat('all.js'))
//        .pipe(rename({
//            // dirname: "main/text/ciao",
//            // basename: "aloha",
//            // prefix: "bonjour-",
//            suffix: ".min"
//            // extname: ".md"
//        }))
//        .pipe(gulp.dest('sea-modules/jquery'));
//});