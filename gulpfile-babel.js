const gulp = require( 'gulp' ),
    uglify  = require('gulp-uglify'),                   //js压缩
    rename = require('gulp-rename'),                    //重命名
    minifycss = require('gulp-minify-css'),             //css压缩
    babel = require('gulp-babel'),
    concat  = require('gulp-concat');                  //合并文件


//babel压缩
gulp.task('gulp-babel', function() {
    return gulp.src('babel/js/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('babel/dist'));
});
gulp.task('default', function() {
    // 将你的默认的任务代码放在这
    gulp.start('gulp-babel');
    console.log("start");
});
gulp.watch('babel/js/*.js', ['gulp-babel']);