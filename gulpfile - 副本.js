//npm install gulp-htmlmin gulp-minify-css gulp-imagemin imagemin-pngquant gulp-jshint gulp-uglify gulp-rename gulp-concat gulp-clean --save-dev

var gulp = require('gulp'),					            //基础库
    //htmlmin = require('gulp-htmlmin'),		            //html压缩
    //minifycss = require('gulp-minify-css'),             //css压缩
    //imagemin = require('gulp-imagemin'),                //图片压缩
    //imageminPngquant = require('imagemin-pngquant'),
    //jshint = require('gulp-jshint'),                    //js检查
    //uglify  = require('gulp-uglify'),                   //js压缩
    //rename = require('gulp-rename'),                    //重命名
    //concat  = require('gulp-concat'),                   //合并文件
    //clean = require('gulp-clean'),                      //清空文件夹
    //browserSync = require('browser-sync');              //浏览器异步更新
    seajsCombo = require( 'gulp-seajs-combo' );
//seajs 模块压缩
gulp.task( 'seajscombo', function(){
    return gulp.src( 'src/*.js' )
        .pipe(seajsCombo())
        .pipe(gulp.task('build/js') );
});
//压缩html
gulp.task('htmlmin', function() {
	srcUrl='src/*.html';
	distUrl='dist';
    return gulp.src(srcUrl)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(distUrl));
});
//压缩css
gulp.task('minify-css', function() {
	srcUrl='src/css/*.css';
	distUrl='dist/css';
  	return gulp.src(srcUrl)
    .pipe(minifycss({compatibility: 'ie8'}))
    .pipe(rename({
        // dirname: "main/text/ciao",
        // basename: "aloha",
        // prefix: "bonjour-",
        suffix: ".min"
        // extname: ".md"
        }))
    .pipe(gulp.dest(distUrl));
});
//压缩图片
gulp.task('imagemin', function() {
	srcUrl='src/images/**/*';
	distUrl='dist/images';
    return gulp.src(srcUrl)
    .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [imageminPngquant({quality: '65-80', speed: 4}) ()]
        }))
    .pipe(gulp.dest(distUrl));
});
//js压缩
gulp.task('uglify', function() {
    srcUrl='src/js/*.js';
    distUrl='dist/js';
    return gulp.src(srcUrl)
        .pipe(uglify())
        // .pipe(concat('all.js'))
        .pipe(rename({
            // dirname: "main/text/ciao",
            // basename: "aloha",
            // prefix: "bonjour-",
            suffix: ".min"
            // extname: ".md"
        }))
        .pipe(gulp.dest(distUrl));
});
//jshint检查
//gulp.task('jshint', function() {
//    srcUrl='src/js/*.js';
//    return gulp.src(srcUrl)
//    .pipe(jshint())
//    .pipe(jshint.reporter('default'));
//});

gulp.task('rename', function() {
  srcUrl='src/images/';
  distUrl='dist/images';
    return gulp.src(srcUrl)
    .pipe(rename({
        // dirname: "main/text/ciao",
        // basename: "aloha",
        // prefix: "bonjour-",
        // suffix: ".min",
        // extname: ".md"
        }))
    .pipe(gulp.dest(distUrl));
});
//浏览器异步刷新
gulp.task('browser-sync', function () {
   var files = [
      'dist/*.html',
      'dist/css/**/*.css',
      'dist/images/**/*.png',
      'dist/js/**/*.js'
   ];

   browserSync.init(files, {
      server: {
         baseDir: 'dist'
      }
   });
});
//默认 gulp
gulp.task('default', function() {
    // 将你的默认的任务代码放在这
    gulp.start('seajscombo');
    gulp.start('seajscombo');
    console.log("start");
});

// gulp.task('minify', function() {
//   return gulp.src('src/*.html')
//     .pipe(htmlmin({collapseWhitespace: true}))
//     .pipe(gulp.dest('dist'))
// });